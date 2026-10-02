"use client";

import { LoadingImage } from "@/components/LoadingImage";
import { CalendarDays, Clock } from "lucide-react";
import { useState, useSyncExternalStore, type MouseEvent } from "react";
import { Reveal } from "@/components/Reveal";
import { getRentalSpan, type RentalSpan } from "@/lib/rentalDays";
import { typograph } from "@/lib/typograph";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n";

// Day bars get their own labels up to this many; longer rentals collapse into
// one bar so the timeline stays readable.
const MAX_DAY_BARS = 7;

const noopSubscribe = () => () => {};

/** Local "YYYY-MM-DD" for a date input. */
function toDateValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Today's date on the client, null during SSR so hydration matches. */
function useToday() {
  return useSyncExternalStore(
    noopSubscribe,
    () => toDateValue(new Date()),
    () => null,
  );
}

/** Default example, a weekend trip: the coming Saturday 08:00 → Sunday 18:00,
 *  34 hours, which shows the half-day rule (1,5 суток). */
function getDefaults(today: string) {
  const d = new Date(`${today}T00:00`);
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  const saturday = toDateValue(d);
  d.setDate(d.getDate() + 1);
  return { pickupDate: saturday, pickupTime: "08:00", returnDate: toDateValue(d), returnTime: "18:00" };
}


function parseLocal(date: string, time: string) {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

type Field = "pickupDate" | "pickupTime" | "returnDate" | "returnTime";

/**
 * Pickup photo, timeline card and return photo. The date/time pickers sit on
 * solid panels over the photos; the card in the middle redraws the rental as
 * day bars plus the leftover hours and shows how many days are billed.
 */
export function RentalDaysCalculator() {
  const { t: dict } = useI18n();
  const t = dict.calc;
  const today = useToday();
  // null = untouched, fall back to the default example
  const [edits, setEdits] = useState<Partial<Record<Field, string>>>({});
  const defaults = today ? getDefaults(today) : null;
  const value = (f: Field) => edits[f] ?? defaults?.[f] ?? "";
  const set = (f: Field) => (v: string) => setEdits((e) => ({ ...e, [f]: v }));

  const pickup = parseLocal(value("pickupDate"), value("pickupTime"));
  const giveBack = parseLocal(value("returnDate"), value("returnTime"));
  const span = pickup && giveBack ? getRentalSpan(pickup, giveBack) : null;

  return (
    <div className="mt-[clamp(2.5rem,5vw,4.5rem)] grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12">
      <EndpointCard
        src="/images/jacket/chapter-bg.jpg"
        alt={t.pickupAlt}
        title={t.pickup}
        moment={pickup}
        date={value("pickupDate")}
        time={value("pickupTime")}
        onDate={set("pickupDate")}
        onTime={set("pickupTime")}
        className="lg:col-span-3"
      />

      <Reveal
        delay={1}
        theme="dark"
        className="order-last col-span-2 flex flex-col justify-between gap-10 rounded-2xl bg-charcoal p-[clamp(1.5rem,3vw,2.75rem)] text-cream lg:order-none lg:col-span-6"
      >
        <div>
          <p className="font-text text-sm uppercase tracking-[0.14em] text-cream/50">{t.eyebrow}</p>
          <p className="mt-3 max-w-[32rem] text-pretty font-display text-[clamp(1.25rem,1.8vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.01em]">
            {typograph(t.prompt)}
          </p>
        </div>

        <Timeline
          span={span}
          // no message before hydration, when the dates aren't filled in yet
          error={defaults || Object.keys(edits).length > 0 ? t.error : ""}
        />
      </Reveal>

      <EndpointCard
        src="/images/intro/tracking.jpg"
        alt={t.giveBackAlt}
        title={t.giveBack}
        moment={giveBack}
        date={value("returnDate")}
        time={value("returnTime")}
        min={value("pickupDate") || undefined}
        onDate={set("returnDate")}
        onTime={set("returnTime")}
        delay={2}
        className="lg:col-span-3"
      />
    </div>
  );
}

function explain(span: RentalSpan, t: Dictionary["calc"]) {
  if (span.fullDays === 0) return t.explain.underDay();
  if (span.extraHours === 0) return t.explain.exact(span.fullDays);
  if (span.extraBilled === 0) return t.explain.free(span.extraHours);
  if (span.extraBilled === 0.5) return t.explain.half(span.extraHours);
  return t.explain.full(span.extraHours);
}

/**
 * Keeps one fixed shape whatever the dates are, so editing them never makes
 * the card (and the photos stretched to its height) jump: every segment
 * reserves its note line, the explanation reserves its longest wrap, and an
 * invalid range shows an empty bar instead of collapsing.
 */
function Timeline({ span, error }: { span: RentalSpan | null; error: string }) {
  const t = useI18n().t.calc;
  if (!span) {
    return (
      <div>
        <div className="flex gap-1.5">
          <Segment grow={1} label={"\u00a0"} empty />
        </div>
        <Explanation text={error} />
        <Total value="—" />
      </div>
    );
  }

  const { fullDays, extraHours, extraBilled } = span;
  const dayBars = fullDays <= MAX_DAY_BARS ? fullDays : 0;

  return (
    <div>
      <div className="flex gap-1.5">
        {Array.from({ length: dayBars }, (_, i) => (
          <Segment key={i} grow={24} label={dayBars <= 3 ? t.nthDay(i + 1) : String(i + 1)} />
        ))}
        {fullDays > MAX_DAY_BARS && <Segment grow={24} label={`${fullDays} × 24 ${t.hoursShort}`} />}
        {extraHours > 0 && (
          <Segment
            // Under a day the leftover is the whole span; otherwise it is drawn
            // to scale against a 24-hour day bar, never thinner than its label.
            grow={fullDays > MAX_DAY_BARS ? 4 : extraHours}
            label={fullDays === 0 ? t.formatHours(extraHours) : `+${extraHours} ${t.hoursShort}`}
            note={fullDays === 0 ? t.minimum : t.extraNote[extraBilled]}
            free={fullDays > 0 && extraBilled === 0}
            half={fullDays > 0 && extraBilled === 0.5}
            tail
          />
        )}
      </div>
      <Explanation text={explain(span, t)} />
      <Total value={t.formatDays(span.billedDays)} />
    </div>
  );
}

function Explanation({ text }: { text: string }) {
  return (
    // Room for the longest message: 3 lines on phones, 2 from md up
    <p className="mt-6 min-h-[3lh] max-w-[34rem] text-pretty font-text text-[clamp(0.95rem,1.1vw,1.15rem)] text-cream/60 md:min-h-[2lh]">
      {typograph(text)}
    </p>
  );
}

function Total({ value }: { value: string }) {
  const t = useI18n().t.calc;
  return (
    <div className="mt-8 flex items-baseline justify-between gap-4 border-t border-cream/15 pt-6">
      <span className="font-text text-[clamp(0.95rem,1.1vw,1.15rem)] text-cream/60">{t.toPay}</span>
      <span
        aria-live="polite"
        className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-semibold leading-none tracking-[-0.02em]"
      >
        {value}
      </span>
    </div>
  );
}

interface SegmentProps {
  grow: number;
  label: string;
  note?: string;
  free?: boolean;
  /** billed as half a day */
  half?: boolean;
  /** the leftover-hours segment: keeps a minimum width for its label */
  tail?: boolean;
  /** placeholder bar for an invalid range */
  empty?: boolean;
}

function Segment({ grow, label, note, free, half, tail, empty }: SegmentProps) {
  return (
    // flex-grow is data-driven (hours), so it can't be a static class. Day
    // bars may shrink to nothing (their labels are short when there are many),
    // so up to 8 segments still fit a phone.
    <div style={{ flexGrow: grow }} className={cn("basis-0", tail ? "min-w-[3.5rem]" : "min-w-0")}>
      <div
        className={cn(
          "h-3 rounded-full",
          empty
            ? "bg-cream/15"
            : free
              ? "bg-[repeating-linear-gradient(-45deg,var(--color-cream)_0_2px,transparent_2px_6px)] opacity-60"
              : half
                ? "bg-[linear-gradient(90deg,var(--color-cream)_50%,rgb(245_244_239/0.3)_50%)]"
                : "bg-cream",
        )}
      />
      <p
        className={cn(
          "mt-3 whitespace-nowrap font-display text-[clamp(0.95rem,1.3vw,1.25rem)] font-semibold",
          free && "text-cream/60",
        )}
      >
        {label}
      </p>
      <p className="mt-1 whitespace-nowrap font-text text-xs text-cream/50 md:text-sm">{note ?? "\u00a0"}</p>
    </div>
  );
}

interface EndpointCardProps {
  src: string;
  alt: string;
  title: string;
  moment: Date | null;
  date: string;
  time: string;
  min?: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
  delay?: 1 | 2 | 3;
  className?: string;
}

// The text of native date/time inputs follows the browser's UI language (an
// English Chrome shows "07:00 PM" and "10/02/2026" even on a Russian page), so
// we draw the value ourselves ("02.10.2026", "19:00") and keep the native
// input invisible on top of it to open the browser's own picker.
const fieldClass =
  "relative flex w-full min-w-0 items-center justify-between gap-2 rounded-lg bg-charcoal/[0.07] px-2 py-2 font-text text-[14px] tabular-nums text-charcoal focus-within:ring-2 focus-within:ring-charcoal/40 md:px-2.5 md:text-[15px]";

/** Open the native picker on any click, not just on the browser's icon. */
function openPicker(e: MouseEvent<HTMLInputElement>) {
  try {
    e.currentTarget.showPicker();
  } catch {}
}

/** "2026-10-02" → "02.10.2026" */
function formatDateValue(value: string, placeholder: string) {
  const [y, m, d] = value.split("-");
  return y && m && d ? `${d}.${m}.${y}` : placeholder;
}

function EndpointCard({ src, alt, title, moment, date, time, min, onDate, onTime, delay, className }: EndpointCardProps) {
  const { t: dict } = useI18n();
  const t = dict.calc;
  const weekday = new Intl.DateTimeFormat(dict.intl, { weekday: "long" });
  return (
    // Mobile: photo on top, pickers below it on a plain panel (half-width
    // columns are too narrow to overlay). Desktop: the panel floats over the
    // bottom of the photo, which stretches to the height of the timeline card.
    <Reveal
      delay={delay}
      className={cn("flex flex-col overflow-hidden rounded-2xl bg-[#e9e7df] lg:relative lg:block", className)}
    >
      <div className="relative aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto">
        <LoadingImage src={src} alt={alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
      </div>
      <fieldset className="min-w-0 flex-1 p-2.5 text-charcoal md:p-3 lg:absolute lg:inset-x-3 lg:bottom-3 lg:rounded-xl lg:bg-cream lg:p-[clamp(0.75rem,1.4vw,1.1rem)] lg:shadow-lg">
        <legend className="sr-only">{title}</legend>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <p className="font-display text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold leading-none">{title}</p>
          <p className="min-h-[1lh] truncate font-text text-xs text-charcoal/50 md:text-sm">{moment ? weekday.format(moment) : ""}</p>
        </div>
        <div className="mt-2.5 grid grid-cols-1 gap-1.5 lg:mt-3 xl:grid-cols-[1fr_auto]">
          <label className={cn(fieldClass, "cursor-pointer")}>
            <span>{formatDateValue(date, t.datePlaceholder)}</span>
            <CalendarDays aria-hidden className="size-4 shrink-0 text-charcoal/50" />
            <input
              type="date"
              aria-label={`${title}: ${t.date}`}
              value={date}
              min={min}
              onChange={(e) => onDate(e.target.value)}
              onClick={openPicker}
              className="absolute inset-0 cursor-pointer opacity-0 [color-scheme:light]"
            />
          </label>
          <label className={cn(fieldClass, "cursor-pointer")}>
            <span>{time || "--:--"}</span>
            <Clock aria-hidden className="size-4 shrink-0 text-charcoal/50" />
            <input
              type="time"
              aria-label={`${title}: ${t.time}`}
              value={time}
              step={900}
              onChange={(e) => onTime(e.target.value)}
              onClick={openPicker}
              className="absolute inset-0 cursor-pointer opacity-0 [color-scheme:light]"
            />
          </label>
        </div>
      </fieldset>
    </Reveal>
  );
}
