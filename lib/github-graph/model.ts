export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type MonthBlock = {
  key: string;
  label: string;
  weeks: (ContributionDay | null)[][];
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type RawDay = { date: string; count: number; level: number };

function asLevel(level: number): ContributionLevel {
  if (level === 1 || level === 2 || level === 3 || level === 4) return level;
  return 0;
}

function utcDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
}

function isoOf(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function normalizeDays(days: RawDay[]): ContributionDay[] {
  return days
    .map((day) => ({
      date: day.date,
      count: day.count,
      level: asLevel(day.level),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Sunday-start week columns, padded so the first and last week are full. */
export function toWeekColumns(
  days: ContributionDay[],
): (ContributionDay | null)[][] {
  if (days.length === 0) return [];

  const byDate = new Map(days.map((day) => [day.date, day]));
  const first = utcDate(days[0]?.date ?? "1970-01-01");
  const last = utcDate(days[days.length - 1]?.date ?? "1970-01-01");
  const start = new Date(first);
  start.setUTCDate(start.getUTCDate() - first.getUTCDay());
  const end = new Date(last);
  end.setUTCDate(end.getUTCDate() + (6 - last.getUTCDay()));

  const columns: (ContributionDay | null)[][] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= end.getTime()) {
    const week: (ContributionDay | null)[] = [];
    for (let row = 0; row < 7; row++) {
      week.push(byDate.get(isoOf(cursor)) ?? null);
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    columns.push(week);
  }
  return columns;
}

export function toMonthBlocks(days: ContributionDay[]): MonthBlock[] {
  const byMonth = new Map<string, ContributionDay[]>();
  for (const day of days) {
    const key = day.date.slice(0, 7);
    const list = byMonth.get(key);
    if (list) list.push(day);
    else byMonth.set(key, [day]);
  }

  const blocks: MonthBlock[] = [];
  for (const [key, list] of byMonth) {
    const [year, month] = key.split("-").map(Number);
    const byDate = new Map(list.map((day) => [day.date, day]));
    const lead = new Date(
      Date.UTC(year ?? 1970, (month ?? 1) - 1, 1),
    ).getUTCDay();
    const daysInMonth = new Date(
      Date.UTC(year ?? 1970, month ?? 1, 0),
    ).getUTCDate();
    const slots: (ContributionDay | null)[] = [];
    for (let i = 0; i < lead; i++) slots.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${key}-${String(day).padStart(2, "0")}`;
      slots.push(byDate.get(iso) ?? null);
    }
    while (slots.length % 7 !== 0) slots.push(null);

    const weeks: (ContributionDay | null)[][] = [];
    for (let i = 0; i < slots.length; i += 7) weeks.push(slots.slice(i, i + 7));

    const shortYear = String(year ?? "").slice(2);
    blocks.push({
      key,
      label: `${MONTHS[(month ?? 1) - 1] ?? key} ${shortYear}`,
      weeks,
    });
  }
  return blocks;
}

export function formatDay(iso: string): string {
  const [year, month, day] = iso.split("-");
  const label = MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${label} ${year}`;
}
