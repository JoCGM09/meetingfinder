import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Destinos y Límites (UI y API)', () => {

  test('Límite de 5 destinos propuestos deshabilita el buscador', async ({ page }) => {
    page.on('console', msg => console.log(msg.text()));
    
    // Setup: Crear una sala directamente en la BD
    const room = await prisma.room.create({
      data: { status: 'ACTIVE' }
    });
    console.log('Room created with id:', room.id);

    // Agregar 5 destinos
    for (let i = 1; i <= 5; i++) {
      await prisma.proposedDestination.create({
        data: {
          roomId: room.id,
          name: `Destino ${i}`,
          address: `Dirección ${i}`,
          lat: -12.0 + i * 0.01,
          lng: -77.0 + i * 0.01,
          placeId: `place_${i}`
        }
      });
    }

    // Act: Visitar la sala
    const count = await prisma.proposedDestination.count({ where: { roomId: room.id } });
    console.log(`Destinations created in DB: ${count}`);
    await page.goto(`/room/${room.id}`);

    // Como necesitamos un participante para ver la sala, pasamos el form
    await expect(page.getByText(/^Hola$/i)).toBeVisible();
    await page.getByPlaceholder('Tu apodo (ej. Juan)').fill('User');
    await page.getByRole('button', { name: /Unirme a la reunión/i }).click();

    // Verificamos que entramos a la sala comprobando el participante en el header
    await expect(page.locator('header')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('header')).toContainText('User');
    await page.waitForTimeout(3000); // Wait for fetch
    const html = await page.content();
    console.log(html.includes('Ya se han propuesto 5 destinos'));
    console.log(html.includes('¿A dónde quieren ir?'));

    // Verify: El mensaje de advertencia está presente
    const warningMsg = page.getByText('Ya se han propuesto 5 destinos en esta sala');
    await expect(warningMsg).toBeVisible({ timeout: 15000 });

    // Verify: La barra de búsqueda debe estar deshabilitada
    const input = page.locator('input[disabled]');
    await expect(input).toBeVisible();

    // Limpieza
    await prisma.proposedDestination.deleteMany({ where: { roomId: room.id } });
    await prisma.room.delete({ where: { id: room.id } });
  });
});

