import { test, expect } from '@playwright/test';

test.describe('Dashboard UI', () => {
  test('should display dashboard with project information', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for the dashboard to load
    await expect(page.locator('h4')).toContainText('Dashboard');
    
    // Check if project overview is displayed
    await expect(page.locator('text=Components')).toBeVisible();
    await expect(page.locator('text=API Endpoints')).toBeVisible();
    await expect(page.locator('text=Test Cases')).toBeVisible();
  });

  test('should navigate between different sections', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Navigate to Traceability Matrix
    await page.click('text=Traceability Matrix');
    await expect(page).toHaveURL(/.*traceability/);
    await expect(page.locator('h4')).toContainText('Traceability Matrix');
    
    // Navigate to Test Results
    await page.click('text=Test Results');
    await expect(page).toHaveURL(/.*test-results/);
    await expect(page.locator('h4')).toContainText('Test Results');
    
    // Navigate to API Documentation
    await page.click('text=API Documentation');
    await expect(page).toHaveURL(/.*api-docs/);
    await expect(page.locator('h4')).toContainText('API Documentation');
  });

  test('should display component health status', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for dashboard to load
    await page.waitForSelector('text=Component Health Status');
    
    // Check if the pie chart is rendered
    await expect(page.locator('text=Component Health Status')).toBeVisible();
    
    // Check if component details table is present
    await expect(page.locator('text=Component Details')).toBeVisible();
    await expect(page.locator('text=Endpoints')).toBeVisible();
    await expect(page.locator('text=Coverage')).toBeVisible();
  });

  test('should show test metrics', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for metrics to load
    await page.waitForSelector('text=Test Coverage Metrics');
    
    // Check if metrics are displayed
    await expect(page.locator('text=Test Coverage Metrics')).toBeVisible();
    await expect(page.locator('text=Passed Tests')).toBeVisible();
    await expect(page.locator('text=Failed Tests')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for activity section to load
    await page.waitForSelector('text=Recent Activity');
    
    // Check if recent activity is displayed
    await expect(page.locator('text=Recent Activity')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/dashboard');
    
    // Check if sidebar is properly handled on mobile
    await expect(page.locator('h4')).toContainText('Dashboard');
    
    // Check if content is still accessible
    await expect(page.locator('text=Components')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/dashboard');
    
    // Check if layout adapts to tablet size
    await expect(page.locator('h4')).toContainText('Dashboard');
    await expect(page.locator('text=Test Coverage Metrics')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should handle API errors gracefully', async ({ page, context }) => {
    // Intercept API calls and return errors
    await context.route('**/api/dashboard/overview', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Should display error message
    await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
  });

  test('should show loading state', async ({ page, context }) => {
    // Delay API response to test loading state
    await context.route('**/api/dashboard/overview', async route => {
      await page.waitForTimeout(1000);
      await route.continue();
    });
    
    await page.goto('http://localhost:3000/dashboard');
    
    // Should show loading indicator
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
  });
});
