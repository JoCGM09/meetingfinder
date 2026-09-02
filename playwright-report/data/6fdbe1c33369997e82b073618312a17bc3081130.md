# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: destinations.spec.ts >> Destinos y Límites (UI y API) >> Límite de 5 destinos propuestos deshabilita el buscador
- Location: tests\destinations.spec.ts:8:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Ya se han propuesto 5 destinos en esta sala')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Ya se han propuesto 5 destinos en esta sala')
  - Test timeout of 30000ms exceeded.

```

```yaml
- img
- heading "This page couldn’t load" [level=1]
- paragraph: Reload to try again, or go back.
- button "Reload"
- button "Back"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { PrismaClient } from '@prisma/client';
  3  | 
  4  | const prisma = new PrismaClient();
  5  | 
  6  | test.describe('Destinos y Límites (UI y API)', () => {
  7  | 
  8  |   test('Límite de 5 destinos propuestos deshabilita el buscador', async ({ page }) => {
  9  |     page.on('console', msg => console.log(msg.text()));
  10 |     
  11 |     // Setup: Crear una sala directamente en la BD
  12 |     const room = await prisma.room.create({
  13 |       data: { status: 'ACTIVE' }
  14 |     });
  15 |     console.log('Room created with id:', room.id);
  16 | 
  17 |     // Agregar 5 destinos
  18 |     for (let i = 1; i <= 5; i++) {
  19 |       await prisma.proposedDestination.create({
  20 |         data: {
  21 |           roomId: room.id,
  22 |           name: `Destino ${i}`,
  23 |           address: `Dirección ${i}`,
  24 |           lat: -12.0 + i * 0.01,
  25 |           lng: -77.0 + i * 0.01,
  26 |           placeId: `place_${i}`
  27 |         }
  28 |       });
  29 |     }
  30 | 
  31 |     // Act: Visitar la sala
  32 |     const count = await prisma.proposedDestination.count({ where: { roomId: room.id } });
  33 |     console.log(`Destinations created in DB: ${count}`);
  34 |     await page.goto(`/room/${room.id}`);
  35 | 
  36 |     // Como necesitamos un participante para ver la sala, pasamos el form
  37 |     await expect(page.getByText(/^Hola$/i)).toBeVisible();
  38 |     await page.getByPlaceholder('Tu apodo (ej. Juan)').fill('User');
  39 |     await page.getByRole('button', { name: /Unirme a la reunión/i }).click();
  40 | 
  41 |     // Verificamos que entramos a la sala comprobando el participante en el header
  42 |     await expect(page.locator('header')).toBeVisible({ timeout: 10000 });
  43 |     await expect(page.locator('header')).toContainText('User');
  44 |     await page.waitForTimeout(3000); // Wait for fetch
  45 |     const html = await page.content();
  46 |     console.log(html.includes('Ya se han propuesto 5 destinos'));
  47 |     console.log(html.includes('¿A dónde quieren ir?'));
  48 | 
  49 |     // Verify: El mensaje de advertencia está presente
  50 |     const warningMsg = page.getByText('Ya se han propuesto 5 destinos en esta sala');
> 51 |     await expect(warningMsg).toBeVisible({ timeout: 15000 });
     |                              ^ Error: expect(locator).toBeVisible() failed
  52 | 
  53 |     // Verify: La barra de búsqueda debe estar deshabilitada
  54 |     const input = page.locator('input[disabled]');
  55 |     await expect(input).toBeVisible();
  56 | 
  57 |     // Limpieza
  58 |     await prisma.proposedDestination.deleteMany({ where: { roomId: room.id } });
  59 |     await prisma.room.delete({ where: { id: room.id } });
  60 |   });
  61 | });
  62 | 
  63 | 
```