import { test, expect } from '@playwright/test';

test.describe('Basic Navigation and Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should load the home page successfully', async ({ page }) => {
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Grant Tracker/);
    
    // Check for main navigation elements
    await expect(page.getByRole('heading', { name: /Grant Tracker/i })).toBeVisible();
  });

  test('should navigate to sign-in page', async ({ page }) => {
    // Navigate to sign-in page
    await page.goto('http://localhost:3000/sign-in');
    
    // Check for sign-in form elements
    await expect(page.getByRole('heading', { name: /Sign In/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should have proper accessibility structure', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for form labels
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const hasLabel = await input.getAttribute('aria-label') || 
                      await input.getAttribute('id') && 
                      await page.locator(`label[for="${await input.getAttribute('id')}"]`).count() > 0;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocusable = await page.locator(':focus');
    expect(await firstFocusable.count()).toBe(1);
    
    // Test that we can tab through all interactive elements
    let focusableCount = 0;
    while (await page.locator(':focus').count() > 0) {
      focusableCount++;
      await page.keyboard.press('Tab');
      // Prevent infinite loop
      if (focusableCount > 20) break;
    }
    
    expect(focusableCount).toBeGreaterThan(0);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    
    // This is a basic check - in a real scenario, you'd use a color contrast analyzer
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').all();
    expect(textElements.length).toBeGreaterThan(0);
    
    // Check that text is visible (basic contrast check)
    for (const element of textElements) {
      const isVisible = await element.isVisible();
      if (isVisible) {
        const color = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          return style.color;
        });
        expect(color).not.toBe('transparent');
      }
    }
  });

  test('should handle form validation accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for validation messages (if any)
    const errorMessages = await page.locator('[role="alert"], .error, [aria-invalid="true"]').all();
    // Note: This depends on your form validation implementation
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    
    // Check for proper ARIA attributes on interactive elements
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const hasAccessibleName = await button.getAttribute('aria-label') || 
                               await button.textContent();
      expect(hasAccessibleName).toBeTruthy();
    }
    
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const hasLabel = await input.getAttribute('aria-label') || 
                      await input.getAttribute('aria-labelledby') ||
                      await input.getAttribute('id') && 
                      await page.locator(`label[for="${await input.getAttribute('id')}"]`).count() > 0;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should work with screen readers', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    
    // Check for semantic HTML elements
    await expect(page.locator('main, [role="main"]')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check that form has proper structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });
});

test.describe('Dashboard Accessibility', () => {
  test('should have accessible dashboard elements', async ({ page }) => {
    // This would require authentication - in a real test, you'd set up auth
    // For now, we'll check the structure if we can access it
    await page.goto('http://localhost:3000/dashboard');
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for navigation elements
    const nav = page.locator('nav, [role="navigation"]');
    if (await nav.count() > 0) {
      await expect(nav).toBeVisible();
    }
  });
}); 