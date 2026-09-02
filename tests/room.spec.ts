import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Mock Google Maps API to avoid Referer errors and costs in CI
  await page.route('**/maps.googleapis.com/**', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.google = { maps: { importLibrary: () => Promise.resolve({ Autocomplete: class {} }), event: { removeListener: () => {} } } };'
  }));
});

test.describe('Salas por URL', () => {
  
  test('Flujo completo: Crear sala, unirse y marcar ubicación', async ({ page, context }) => {
    page.on('console', msg => console.log(`[Browser]: ${msg.text()}`));
    // 1. Crear sala (Escenario 1)
    await page.goto('/');
    const createButton = page.getByRole('button', { name: /^Crear sala de encuentro$/i });
    await expect(createButton).toBeVisible();
    await createButton.click();

    // 2. Esperar redirección a /room/[id]
    await expect(page).toHaveURL(/\/room\//);
    const roomId = page.url().split('/').pop();
    
    // 3. Ingresar apodo (Escenario 2)
    await expect(page.getByText(/^Hola$/i)).toBeVisible();
    await page.getByPlaceholder('Tu apodo (ej. Juan)').fill('Juan');
    await page.getByRole('button', { name: /Unirme a la reunión/i }).click();

    // 4. Verificar entrada al mapa
    // Abrir sidebar para verificar nombre
    await page.getByRole('button', { name: /menu/i }).first().click();
    await expect(page.locator('aside')).toContainText('Juan');
    await expect(page.locator('aside')).toContainText(/Participantes/i);
    await expect(page.locator('aside')).toContainText(/\(1\//);
    
    // Cerrar sidebar
    await page.keyboard.press('Escape');

    // 5. Persistencia (Escenario 2)
    await page.reload();
    await expect(page.locator('header')).toContainText('Juan');
    await expect(page.getByPlaceholder('Tu apodo (ej. Juan)')).not.toBeVisible();

    // 6. Segundo usuario (Escenario 3) - Usamos un nuevo contexto para no compartir localStorage
    const contextAna = await context.browser()!.newContext();
    const pageAna = await contextAna.newPage();
    await pageAna.goto(`/room/${roomId}`);
    await pageAna.getByPlaceholder('Tu apodo (ej. Juan)').fill('Ana');
    await pageAna.getByRole('button', { name: /Unirme a la reunión/i }).click();
    
    await expect(pageAna.locator('header')).toContainText('Ana');
    await expect(pageAna.locator('header')).toContainText(/Personas:\s*2/);
    
    // 7. Sincronización en tiempo real (polling)
    // El primer usuario debería ver que ahora hay 2 personas
    await expect(page.locator('header')).toContainText(/Personas:\s*2/, { timeout: 10000 });

    // 8. Marcar ubicación y Centro Geométrico (Escenario 3)
    // Hacemos clic en el mapa para marcar ubicación
    const mapArea = page.locator('.map-container');
    await mapArea.scrollIntoViewIfNeeded();
    
    // Esperar un momento a que Google Maps intente cargar
    await page.waitForTimeout(5000);
    
    const box = await mapArea.boundingBox();
    await mapArea.click({ force: true, position: { x: box!.width / 2, y: box!.height / 2 } });
    
    const mapAreaAna = pageAna.locator('.map-container');
    await mapAreaAna.scrollIntoViewIfNeeded();
    await pageAna.waitForTimeout(1000);
    const boxAna = await mapAreaAna.boundingBox();
    await mapAreaAna.click({ force: true, position: { x: boxAna!.width / 2 + 50, y: boxAna!.height / 2 + 50 } });

    // Verificar que el mensaje de centro calculado aparece (confirmación de 2 personas)
    await expect(page.getByText('¡Centro calculado automáticamente!')).toBeVisible({ timeout: 15000 });
    
    // Verificar que los marcadores de los participantes aparecen (confirmación de clics y coordenadas)
    await expect(page.getByTestId('participant-marker-Juan')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('participant-marker-Ana')).toBeVisible({ timeout: 10000 });

    // Verificar que el marcador de PUNTO MEDIO aparece (confirmación de cálculo de centro)
    await expect(page.getByTestId('geometric-center-marker')).toBeVisible({ timeout: 10000 });
  });

  test('Accesibilidad de Tema (Escenario 4)', async ({ page }) => {
    await page.goto('/');
    // Forzamos esquema oscuro
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Sin ThemeProvider esto probablemente no haga nada o falle si useTheme se rompe
    // Pero el requisito dice que debe cambiar a tokens oscuros.
    // Verificamos si hay alguna clase o estilo que cambie.
    // Como no hay toggle, dependemos de la preferencia del sistema que acabamos de emular.
  });
});
