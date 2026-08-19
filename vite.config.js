import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SUPABASE_URL = 'https://*.supabase.co'

const CSP =
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${SUPABASE_URL}; media-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'strip-csp-in-dev',
      apply: 'serve',
      transformIndexHtml(html) {
        return html.replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/i, '')
      },
    },
  ],
  server: {
    headers: SECURITY_HEADERS,
  },
  preview: {
    headers: { ...SECURITY_HEADERS, 'Content-Security-Policy': CSP },
  },
})