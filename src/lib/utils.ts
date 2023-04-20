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

export function getMonday(d: Date) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function getDayWeekStartsMonday(d: Date) {
  let day = d.getDay() - 1;
  if (day == 7) {
    day = 0;
  }
  return day;
}
