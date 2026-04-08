import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysUntilTrip(): number {
  const tripDate = new Date('2026-04-14');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  tripDate.setHours(0, 0, 0, 0);
  const diff = tripDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getTripDay(): number {
  const tripStart = new Date('2026-04-14');
  const tripEnd = new Date('2026-04-27');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  tripStart.setHours(0, 0, 0, 0);
  tripEnd.setHours(0, 0, 0, 0);

  if (today < tripStart) return 0;
  if (today > tripEnd) return -1;
  return Math.floor((today.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
