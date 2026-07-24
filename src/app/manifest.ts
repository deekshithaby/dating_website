import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ShowUp',
    short_name: 'ShowUp',
    description: 'Real matches. Show up or miss out.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131313',
    theme_color: '#131313',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
