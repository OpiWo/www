import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function VerifyPage() {
  const locale = await getLocale();
  redirect(`/${locale}/login`);
}
