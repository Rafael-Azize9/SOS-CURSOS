import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import sitemapPlugin from 'vite-plugin-sitemap';
import { COURSES } from './src/data.ts';

const SUPABASE_URL = 'https://*.supabase.co';

const CSP =
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${SUPABASE_URL}; media-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`;

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

function formatCourseSlug(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
}

const courseUrls = COURSES
  .filter(c => !c.kids)
  .map(course => ({
    url: `/curso/${formatCourseSlug(course.name)}`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0],
  }));

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'S.O.S Cursos',
        short_name: 'S.O.S Cursos',
        description: 'Mais de 100 cursos online com certificado válido em todo o Brasil',
        theme_color: '#e11d2e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
        ],
      },
    }),
    sitemapPlugin({
      hostname: 'https://soscursos.com.br',
      dynamicRoutes: courseUrls.map(u => u.url),
      exclude: ['/painel-sos'],
      robots: [
        {
          userAgent: '*',
          allow: ['/', '/catalogo', '/curso/', '/roleta', '/privacidade'],
          disallow: ['/painel-sos'],
        },
      ],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    {
      name: 'strip-csp-in-dev',
      apply: 'serve',
      transformIndexHtml(html) {
        return html.replace(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/i, '');
      },
    },
  ],
  server: {
    headers: SECURITY_HEADERS,
  },
  preview: {
    headers: { ...SECURITY_HEADERS, 'Content-Security-Policy': CSP },
  },
  build: {
    rolldownOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[hash].js',
      },
    },
  },
});