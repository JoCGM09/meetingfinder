# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: room.spec.ts >> Salas por URL >> Flujo completo: Crear sala, unirse y marcar ubicación
- Location: tests\room.spec.ts:5:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('header')
Expected substring: "Ana"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('header')

```

```yaml
- heading "Hola" [level=2]
- paragraph: ¿Cómo quieres que te vean en el mapa?
- textbox "Tu apodo (ej. Juan)": Ana
- button "Unirme a la reunión"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Salas por URL', () => {
  4  |   
  5  |   test('Flujo completo: Crear sala, unirse y marcar ubicación', async ({ page, context }) => {
  6  |     page.on('console', msg => console.log(`[Browser]: ${msg.text()}`));
  7  |     // 1. Crear sala (Escenario 1)
  8  |     await page.goto('/');
  9  |     const createButton = page.getByRole('button', { name: /^Crear sala de encuentro$/i });
  10 |     await expect(createButton).toBeVisible();
  11 |     await createButton.click();
  12 | 
  13 |     // 2. Esperar redirección a /room/[id]
  14 |     await expect(page).toHaveURL(/\/room\//);
  15 |     const roomId = page.url().split('/').pop();
  16 |     
  17 |     // 3. Ingresar apodo (Escenario 2)
  18 |     await expect(page.getByText(/^Hola$/i)).toBeVisible();
  19 |     await page.getByPlaceholder('Tu apodo (ej. Juan)').fill('Juan');
  20 |     await page.getByRole('button', { name: /Unirme a la reunión/i }).click();
  21 | 
  22 |     // 4. Verificar entrada al mapa
  23 |     // Abrir sidebar para verificar nombre
  24 |     await page.getByRole('button', { name: /menu/i }).first().click();
  25 |     await expect(page.locator('aside')).toContainText('Juan');
  26 |     await expect(page.locator('aside')).toContainText(/Participantes/i);
  27 |     await expect(page.locator('aside')).toContainText(/\(1\//);
  28 |     
  29 |     // Cerrar sidebar
  30 |     await page.keyboard.press('Escape');
  31 | 
  32 |     // 5. Persistencia (Escenario 2)
  33 |     await page.reload();
  34 |     await expect(page.locator('header')).toContainText('Juan');
  35 |     await expect(page.getByPlaceholder('Tu apodo (ej. Juan)')).not.toBeVisible();
  36 | 
  37 |     // 6. Segundo usuario (Escenario 3) - Usamos un nuevo contexto para no compartir localStorage
  38 |     const contextAna = await context.browser()!.newContext();
  39 |     const pageAna = await contextAna.newPage();
  40 |     await pageAna.goto(`/room/${roomId}`);
  41 |     await pageAna.getByPlaceholder('Tu apodo (ej. Juan)').fill('Ana');
  42 |     await pageAna.getByRole('button', { name: /Unirme a la reunión/i }).click();
  43 |     
> 44 |     await expect(pageAna.locator('header')).toContainText('Ana');
     |                                             ^ Error: expect(locator).toContainText(expected) failed
  45 |     await expect(pageAna.locator('header')).toContainText(/Personas:\s*2/);
  46 |     
  47 |     // 7. Sincronización en tiempo real (polling)
  48 |     // El primer usuario debería ver que ahora hay 2 personas
  49 |     await expect(page.locator('header')).toContainText(/Personas:\s*2/, { timeout: 10000 });
  50 | 
  51 |     // 8. Marcar ubicación y Centro Geométrico (Escenario 3)
  52 |     // Hacemos clic en el mapa para marcar ubicación
  53 |     const mapArea = page.locator('.map-container');
  54 |     await mapArea.scrollIntoViewIfNeeded();
  55 |     
  56 |     // Esperar un momento a que Google Maps intente cargar
  57 |     await page.waitForTimeout(5000);
  58 |     
  59 |     const box = await mapArea.boundingBox();
  60 |     await mapArea.click({ force: true, position: { x: box!.width / 2, y: box!.height / 2 } });
  61 |     
  62 |     const mapAreaAna = pageAna.locator('.map-container');
  63 |     await mapAreaAna.scrollIntoViewIfNeeded();
  64 |     await pageAna.waitForTimeout(1000);
  65 |     const boxAna = await mapAreaAna.boundingBox();
  66 |     await mapAreaAna.click({ force: true, position: { x: boxAna!.width / 2 + 50, y: boxAna!.height / 2 + 50 } });
  67 | 
  68 |     // Verificar que el mensaje de centro calculado aparece (confirmación de 2 personas)
  69 |     await expect(page.getByText('¡Centro calculado automáticamente!')).toBeVisible({ timeout: 15000 });
  70 |     
  71 |     // Verificar que los marcadores de los participantes aparecen (confirmación de clics y coordenadas)
  72 |     await expect(page.getByTestId('participant-marker-Juan')).toBeVisible({ timeout: 10000 });
  73 |     await expect(page.getByTestId('participant-marker-Ana')).toBeVisible({ timeout: 10000 });
  74 | 
  75 |     // Verificar que el marcador de PUNTO MEDIO aparece (confirmación de cálculo de centro)
  76 |     await expect(page.getByTestId('geometric-center-marker')).toBeVisible({ timeout: 10000 });
  77 |   });
  78 | 
  79 |   test('Accesibilidad de Tema (Escenario 4)', async ({ page }) => {
  80 |     await page.goto('/');
  81 |     // Forzamos esquema oscuro
  82 |     await page.emulateMedia({ colorScheme: 'dark' });
  83 |     
  84 |     // Sin ThemeProvider esto probablemente no haga nada o falle si useTheme se rompe
  85 |     // Pero el requisito dice que debe cambiar a tokens oscuros.
  86 |     // Verificamos si hay alguna clase o estilo que cambie.
  87 |     // Como no hay toggle, dependemos de la preferencia del sistema que acabamos de emular.
  88 |   });
  89 | });
  90 | 
```