import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateShort(value: string | null | undefined): string {
  return value ? format(new Date(value), 'dd/MM/yyyy') : '—';
}

export function formatDateFull(value: string | null | undefined): string {
  return value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '—';
}

export function truncateId(id: string): string {
  return id.slice(0, 8) + '…';
}
