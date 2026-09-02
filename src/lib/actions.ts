'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import googleMapsClient from './google-maps'
import { TravelMode } from '@googlemaps/google-maps-services-js'
import { createClient } from '@/utils/supabase/server'

const ParticipantSchema = z.object({
  nickname: z.string().min(1).max(30).trim(),
  sessionId: z.string().uuid(),
  roomId: z.string().cuid(),
})

const LocationSchema = z.object({
  sessionId: z.string().uuid(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

const DestinationSchema = z.object({
  roomId: z.string().cuid(),
  name: z.string().min(1).max(100),
  address: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeId: z.string().min(1),
})

export async function createRoom() {
  let roomId: string | undefined;
  try {
    const room = await prisma.room.create({
      data: {
        status: 'ACTIVE',
      },
    })
    roomId = room.id;
    
    // Register initial history if user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await prisma.roomHistory.create({
        data: {
          userId: user.id,
          roomId: room.id,
        }
      })
    }
  } catch (error) {
    console.error('Error creating room:', error)
    throw new Error('No se pudo crear la sala')
  }

  if (roomId) {
    redirect(`/room/${roomId}`)
  }
}

export async function joinRoom(roomId: string, nickname: string, sessionId: string) {
  try {
    const validated = ParticipantSchema.parse({ roomId, nickname, sessionId })
    
    // Check limit of 20 participants per room
    const count = await prisma.participant.count({
      where: { roomId: validated.roomId }
    })
    
    if (count >= 20) {
      const existing = await prisma.participant.findUnique({
        where: { sessionId: validated.sessionId }
      })
      if (!existing) throw new Error('La sala está llena (max 20 personas)')
    }

    // Check if nickname is taken by another participant in the room
    const nicknameTaken = await prisma.participant.findFirst({
      where: {
        roomId: validated.roomId,
        nickname: validated.nickname,
        NOT: { sessionId: validated.sessionId }
      }
    })

    if (nicknameTaken) {
      throw new Error('El apodo ya está en uso por otro participante en esta sala')
    }

    const participant = await prisma.participant.upsert({
      where: { sessionId: validated.sessionId },
      update: { 
        nickname: validated.nickname, 
        roomId: validated.roomId,
        updatedAt: new Date() 
      },
      create: {
        id: crypto.randomUUID(),
        roomId: validated.roomId,
        nickname: validated.nickname,
        sessionId: validated.sessionId
      }
    })
    
    // Record history
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await prisma.roomHistory.upsert({
      where: {
        userId_roomId: user ? { userId: user.id, roomId: validated.roomId } : undefined,
        sessionId_roomId: !user ? { sessionId: validated.sessionId, roomId: validated.roomId } : undefined,
      },
      update: { lastVisitedAt: new Date() },
      create: {
        userId: user?.id,
        sessionId: !user ? validated.sessionId : null,
        roomId: validated.roomId,
      }
    })
    
    revalidatePath(`/room/${roomId}`)
    return participant
  } catch (error: any) {
    if (error.message?.includes('apodo ya está en uso') || error.message?.includes('sala está llena')) {
      throw error
    }
    console.error('Error in joinRoom')
    throw new Error('No se pudo unir a la sala')
  }
}

export async function updateParticipantLocation(sessionId: string, lat: number, lng: number) {
  try {
    const validated = LocationSchema.parse({ sessionId, lat, lng })
    
    const participant = await prisma.participant.update({
      where: { sessionId: validated.sessionId },
      data: { 
        lat: validated.lat, 
        lng: validated.lng,
        updatedAt: new Date()
      }
    })
    
    revalidatePath(`/room/${participant.roomId}`)
    return participant
  } catch (error) {
    console.error('Error in updateParticipantLocation')
    throw new Error('No se pudo actualizar la ubicación')
  }
}

export async function getParticipants(roomId: string) {
  try {
    if (!z.string().cuid().safeParse(roomId).success) {
      throw new Error('ID de sala inválido')
    }
    
    return await prisma.participant.findMany({
      where: { roomId },
      select: {
        id: true,
        nickname: true,
        lat: true,
        lng: true,
        roomId: true,
        color: true,
        // Exclude sessionId for security
      }
    })
  } catch (error) {
    console.error('Error fetching participants')
    return []
  }
}

export async function proposeDestination(data: z.infer<typeof DestinationSchema>) {
  try {
    const validated = DestinationSchema.parse(data)
    
    const count = await prisma.proposedDestination.count({
      where: { roomId: validated.roomId }
    })
    
    if (count >= 5) {
      throw new Error('Límite de destinos alcanzado (max 5)')
    }
    
    const destination = await prisma.proposedDestination.create({
      data: validated
    })
    
    revalidatePath(`/room/${validated.roomId}`)
    return destination
  } catch (error: any) {
    if (error.message?.includes('Límite de destinos')) {
      throw error
    }
    throw new Error('No se pudo proponer el destino')
  }
}

export async function getDestinations(roomId: string) {
  try {
    if (!z.string().cuid().safeParse(roomId).success) {
      throw new Error('ID de sala inválido')
    }
    
    return await prisma.proposedDestination.findMany({
      where: { roomId }
    })
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return []
  }
}

export async function calculateBestDestination(roomId: string) {
  try {
    if (!z.string().cuid().safeParse(roomId).success) {
      throw new Error('ID de sala inválido');
    }

    // Rate limiting check using persistent Prisma Room record (15 seconds cooldown)
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { lastCalculatedAt: true }
    });

    if (room?.lastCalculatedAt) {
      const elapsed = Date.now() - new Date(room.lastCalculatedAt).getTime();
      if (elapsed < 15000) {
        const waitTime = Math.ceil((15000 - elapsed) / 1000);
        throw new Error(`Por favor espera ${waitTime} segundos antes de volver a calcular el destino.`);
      }
    }

    const [participants, destinations] = await Promise.all([
      prisma.participant.findMany({
        where: { roomId, lat: { not: null }, lng: { not: null } }
      }),
      prisma.proposedDestination.findMany({
        where: { roomId }
      })
    ])

    if (participants.length === 0 || destinations.length === 0) return null;

    // Record calculation time to enforce rate limit across serverless instances
    await prisma.room.update({
      where: { id: roomId },
      data: { lastCalculatedAt: new Date() }
    });

    const response = await googleMapsClient.distancematrix({
      params: {
        origins: participants.map(p => ({ lat: p.lat!, lng: p.lng! })),
        destinations: destinations.map(d => ({ lat: d.lat, lng: d.lng })),
        mode: TravelMode.driving,
        // Security: Use server-side only key if available, otherwise fallback
        key: process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
      }
    })

    const matrix = response.data.rows;
    const results = destinations.map((dest, destIdx) => {
      const durations = matrix.map((row, partIdx) => ({
        nickname: participants[partIdx].nickname,
        duration: row.elements[destIdx].duration,
        status: row.elements[destIdx].status
      }));
      
      const isReachable = durations.every(el => el.status === 'OK');
      if (!isReachable) return null;

      const durationValues = durations.map(el => el.duration.value);
      return {
        ...dest,
        individualDurations: durations.map(d => ({ nickname: d.nickname, text: d.duration.text, value: d.duration.value })),
        maxDuration: Math.max(...durationValues),
        avgDuration: durationValues.reduce((a, b) => a + b, 0) / durationValues.length
      };
    }).filter(d => d !== null);

    if (results.length === 0) return null;

    results.sort((a, b) => {
      if (a!.maxDuration !== b!.maxDuration) {
        return a!.maxDuration - b!.maxDuration;
      }
      return a!.avgDuration - b!.avgDuration;
    });

    return results[0];
  } catch (error) {
    console.error('Error calculating best destination:', error);
    return null;
  }
}

export async function transitionGuestToUser(sessionId: string) {
  try {
    const validatedSessionId = z.string().uuid().parse(sessionId);
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    // Update all room history associated with the sessionId to the new userId
    await prisma.roomHistory.updateMany({
      where: { sessionId: validatedSessionId },
      data: { 
        userId: user.id,
        sessionId: null 
      }
    })
  } catch (error) {
    console.error('Error in transitionGuestToUser')
  }
}
