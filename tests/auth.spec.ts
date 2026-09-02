import { test, expect } from '@playwright/test';

test.describe('Perfiles y Gestión - Autenticación y Dashboard', () => {
  
  test('Dashboard redirige a login si el usuario no está autenticado', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Página de Login contiene opciones de Google y Magic Link, y cumple con diseño minimalista', async ({ page }) => {
    await page.goto('/login');
    
    // Verificar título
    await expect(page.getByRole('heading', { name: /Acceso/i })).toBeVisible();

    // Verificar botón de Google
    await expect(page.getByRole('button', { name: /Continuar con Google/i })).toBeVisible();

    // Verificar formulario de Magic Link
    const emailInput = page.getByPlaceholder(/Tu correo/i);
    await expect(emailInput).toBeVisible();

    const submitBtn = page.getByRole('button', { name: /Enviar enlace/i });
    await expect(submitBtn).toBeVisible();

    // Verify envío del form (UI state)
    // Se comenta el submit real para evitar llamadas innecesarias al servidor de Supabase en los tests.
    // await emailInput.fill('test@example.com');
    // await submitBtn.click();
    // await expect(page.getByText(/Revisa tu bandeja de entrada/i)).toBeVisible();
  });

  test('Las vistas no contienen emojis (Regla de UI/UX)', async ({ page }) => {
    await page.goto('/login');
    const content = await page.textContent('body');
    
    // Basic regex for emojis
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    
    expect(emojiRegex.test(content || '')).toBeFalsy();
  });
});
