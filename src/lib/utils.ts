export function confirmDelete(e: MouseEvent) {
  if (!confirm('Are you sure you want to delete this?')) {
    e.preventDefault();
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function toNum(val: any, def: any): any {
  if (val != undefined && val != null && !isNaN(val)) {
    return Number(val)
  }
  return def
}

export function matchMetricsInString(s: string) {
  return s.match(/^[a-zA-Z0-9]*: [0-9]*$/gm) || []
}

export function parseMetricStrings(s: string[]) {
  return s.map(_s => {
    const splitString = _s.split(': ')
    return {
      name: splitString[0],
      value: splitString[1]
    }
  }
  )
}

export function getFirstDayOfTheWeek(d: Date) {
  d = new Date(d);
  const day = getDayWeekStartsMonday(d);
  d.setDate(d.getDate() - day)
  return d;
}

export function getLastDayOfTheWeek(d: Date) {
  d = new Date(d);
  const day = getDayWeekStartsMonday(d);
  d.setDate(d.getDate() + (6 - day))
  return d;
}

export function isDateInTheSameWeekAsToday(d: Date) {
  // Convert all to iso string to just compare the days
  const [t] = d.toISOString().split('T');
  const [f] = getFirstDayOfTheWeek(new Date()).toISOString().split('T');
  const [l] = getLastDayOfTheWeek(new Date()).toISOString().split('T');
  return t >= f && t <= l;

}

export function isDateInTheSameDayAsTodau(d: Date) {
  const [todayStr] = new Date().toISOString().split('T');
  const [dateStr] = d.toISOString().split('T');
  return todayStr == dateStr;
}

export function getDayWeekStartsMonday(d: Date) {
  const numberdayweek = [6, 0, 1, 2, 3, 4, 5];
  return numberdayweek[d.getDay()]
}

export function daysFromToday(i: number) {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
}
