/**
 * Smoke: sign-in then visit admin routes; assert API calls to /api/v1/.
 * Requires web :3001 and server :3000.
 */
import { chromium } from 'playwright'

const BASE = process.env.WEB_URL ?? 'http://localhost:3001'
const USER = process.env.SMOKE_USER ?? 'admin'
const PASS = process.env.SMOKE_PASS ?? 'Admin@123'

const ADMIN_ROUTES = [
  { path: '/customer-management', expect: '/human-resources/customers' },
  { path: '/roles-management', expect: '/identity/roles' },
  { path: '/product-categories-management', expect: '/product-catalog/categories' },
  { path: '/products-management', expect: '/product-catalog/models' },
  { path: '/central-warehouse-management', expect: '/product-catalog/total-warehouses' },
  { path: '/purchase-locations-management', expect: '/purchase-channels/purchase-locations' },
  { path: '/asc-centers-management', expect: '/asc-center/asc-centers' },
  { path: '/accessories-management', expect: '/product-catalog/accessories' },
  { path: '/reference-documents-management', expect: '/document/documents' },
  { path: '/permissions-management', expect: '/identity/permissions' },
  { path: '/user-management', expect: '/identity/users' },
]

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const apiHits = []

  page.on('response', (res) => {
    const url = res.url()
    if (url.includes('/api/v1/') && res.request().method() === 'GET') {
      apiHits.push({ url, status: res.status() })
    }
  })

  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.getByRole('textbox', { name: 'Username' }).fill(USER)
  await page.getByRole('textbox', { name: 'Password' }).fill(PASS)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL((url) => !url.pathname.includes('sign-in'), { timeout: 30000 })

  const failures = []

  for (const { path, expect } of ADMIN_ROUTES) {
    apiHits.length = 0
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    try {
      await page.waitForResponse(
        (res) =>
          res.url().includes(expect) &&
          res.request().method() === 'GET' &&
          res.status() >= 200 &&
          res.status() < 400,
        { timeout: 20000 },
      )
      console.log(`OK ${path} -> ${expect}`)
    } catch {
      const fallback = apiHits.find(
        (h) => h.url.includes(expect) && h.status >= 200 && h.status < 400,
      )
      if (fallback) {
        console.log(`OK ${path} -> ${expect}`)
      } else {
        failures.push(`${path}: expected GET ${expect}`)
      }
    }
  }

  await browser.close()

  if (failures.length) {
    console.error('Failures:\n' + failures.join('\n'))
    process.exit(1)
  }
  console.log('All admin routes issued server API requests.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
