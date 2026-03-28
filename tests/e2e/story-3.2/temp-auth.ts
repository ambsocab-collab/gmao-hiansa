import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // Navigate to login
  await page.goto('http://localhost:3000/login')
  await page.waitForLoadState('networkidle')

  // Login as admin
  await page.fill('input[name="email"]', 'admin@hiansa.com')
  await page.fill('input[name="password"]', 'admin123')
  await page.click('button[type="submit"]')

  // Wait for dashboard
  await page.waitForURL('**/dashboard', { timeout: 5000 })
  
  // Save state
  await context.storageState({ path: 'playwright/.auth/admin.json' })
  console.log('✅ Admin auth saved')

  await browser.close()
}

main().catch(console.error)
