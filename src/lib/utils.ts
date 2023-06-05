import 'fs';
export const huecoGrades: readonly [string, ...string[]] = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
export const fontGrades: readonly [string, ...string[]] = ['4', '5', '5+', '6A', '6A+', '6B', '6B+', '6C', '6C+', '7A', '7A+', '7B', '7B+', '7C', '7C+', '8A', '8A+', '8B', '8B+', '8C', '8C+', '9A', '9A+', '9B', '9B+'];
export const gradeSystems: readonly [string, ...string[]] = ['hueco', 'font'];

export function confirmDelete(e: MouseEvent) {
        e.stopPropagation();
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
        return s.match(/^(\w+):\s*(?:([0-9]*))\s*$/gm) || []
}

export function parseMetricStrings(s: string[]) {
        return s.reduce((result, _s) => {
                const splitString = _s.trim().replace(/\s/g, '').split(':')
                if (splitString[1] != '') {
                        result.push({
                                name: splitString[0],
                                value: splitString[1]
                        }
                        )
                }
                return result;
        }, [])
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

export function isDateInTheSameDayAsToday(d: Date) {
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

export function getSecretFromFile(path: string): string | undefined {
        fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                        console.error(err);
                        return undefined;
                }
                return data;
        });
}

export function assignDefined(target, ...sources) {
        for (const source of sources) {
                for (const key of Object.keys(source)) {
                        const val = source[key];
                        if (val !== undefined && val != null) {
                                target[key] = val;
                        }
                }
        }
        return target;
}

export function camelToTitle(source: string): string {
        const result = source.replace(/([A-Z])/g, ' $1');
        return result.charAt(0).toUpperCase() + result.slice(1);
}
