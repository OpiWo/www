import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en'],
  defaultLocale: 'en',
  localeCookie: { name: 'NEXT_LOCALE' },
});
