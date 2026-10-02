const HOUR = 60 * 60 * 1000;

/** Leftover hours above whole days that are still free. */
export const FREE_HOURS = 6;
/** Leftover hours above whole days, past the free ones, billed as half a day. */
export const HALF_DAY_HOURS = 13;

export interface RentalSpan {
  /** total rented time in whole hours (rounded up) */
  hours: number;
  /** whole 24-hour days inside the span */
  fullDays: number;
  /** hours left over after the whole days */
  extraHours: number;
  /** what the leftover adds: nothing, half a day or a whole day */
  extraBilled: 0 | 0.5 | 1;
  /** days to pay for, in halves, at least 1 */
  billedDays: number;
}

/**
 * Billing rule: actual time from pickup to return, every 24 h is a day. Of the
 * leftover, up to 6 h is free, 7–13 h is half a day and 14 h or more is a whole
 * day; minimum 1 day. So 0–30 h → 1, 31–37 → 1.5, 38–54 → 2, 55–61 → 2.5,
 * 62–78 → 3 and so on. Returns null when the return is not after the pickup.
 */
export function getRentalSpan(pickup: Date, giveBack: Date): RentalSpan | null {
  const ms = giveBack.getTime() - pickup.getTime();
  if (!(ms > 0)) return null;
  const hours = Math.ceil(ms / HOUR);
  const fullDays = Math.floor(hours / 24);
  const extraHours = hours % 24;
  const extraBilled = extraHours <= FREE_HOURS ? 0 : extraHours <= HALF_DAY_HOURS ? 0.5 : 1;
  const billedDays = Math.max(1, fullDays + extraBilled);
  return { hours, fullDays, extraHours, extraBilled, billedDays };
}
