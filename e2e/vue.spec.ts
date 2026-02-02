import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/PodStream/)
  await expect(page.locator('h1')).toContainText('Tu Estudio')
  await expect(page.locator('h1')).toContainText('Nivel Dios')
})
