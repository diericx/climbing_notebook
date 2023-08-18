import { redirect } from '@sveltejs/kit';
import 'fs';
import type { Session } from 'lucia';
import { z } from 'zod';
export const huecoGrades: readonly [string, ...string[]] = [
  'V0',
  'V1',
  'V2',
  'V3',
  'V4',
  'V5',
  'V6',
  'V7',
  'V8',
  'V9',
  'V10',
  'V11',
  'V12',
  'V13',
  'V14',
  'V15',
  'V16',
  'V17',
];
export const fontGrades: readonly [string, ...string[]] = [
  '4',
  '5',
  '5+',
  '6A',
  '6A+',
  '6B',
  '6B+',
  '6C',
  '6C+',
  '7A',
  '7A+',
  '7B',
  '7B+',
  '7C',
  '7C+',
  '8A',
  '8A+',
  '8B',
  '8B+',
  '8C',
  '8C+',
  '9A',
  '9A+',
  '9B',
  '9B+',
];
export const gradeSystems: readonly [string, ...string[]] = ['hueco', 'font'];
export const muscles: readonly [string, ...string[]] = [
  'adductor magnus',
  'anterior deltoids',
  'biceps brachii',
  'biceps femoris',
  'brachialis',
  'gluteus maximus',
  'gluteus medius',
  'gluteus minimus',
  'infraspinatus',
  'latissimus dorsi',
  'obliques',
  'pectoralis major',
  'posterior deltoids',
  'quadriceps femoris',
  'rectus abdominis',
  'rhomboids',
  'soleus',
  'teres major',
  'triceps brachii',
  'brachioradialis',
  'erector spinae',
  'gastrocnemius',
  'lower trapezius',
  'medial deltoids',
  'serratus anterior',
  'subscapularis',
  'tibialis anterior',
  'upper trapezius',
];
export const muscleGroups: readonly [string, ...string[]] = [
  'abdominals',
  'adductors',
  'back',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'quadriceps',
  'shoulders',
  'trapezius',
  'triceps',
];
export const equipments: readonly [string, ...string[]] = [
  'ab wheel',
  'barbell',
  'battle ropes',
  'bodyweight',
  'cable',
  'dumbbell',
  'ez bar',
  'gymnastic rings',
  'kettlebell',
  'landmine',
  'medicine ball',
  'miniband',
  'parallette bars',
  'resistance band',
  'slam ball',
  'sliders',
  'stability ball',
  'superband',
  'suspension trainer',
  'weight plate',
];
export const postures: readonly [string, ...string[]] = [
  '90/90 seated',
  'bent over standing',
  'bridge',
  'half knee hover',
  'half kneeling',
  'hanging',
  'inverted',
  'knee hover quadruped',
  'knee over toes split stance standing',
  'kneeling',
  'l sit',
  'march',
  'prone',
  'quadruped',
  'seated',
  'seated floor',
  'shin box seated',
  'side lying',
  'side plank',
  'single leg bridge',
  'single leg standing',
  'single leg standing bent knee',
  'single leg supported',
  'split stance standing',
  'staggered stance standing',
  'standing',
  'supine',
  'tall kneeling',
  'toe balance standing',
  'v sit seated',
  'walking',
  'wall sit',
];
export const exerciseTypes: readonly [string, ...string[]] = [
  'climbing',
  'strength',
  'stretch',
  'cardio',
];
export const difficulties: readonly [string, ...string[]] = [
  'novice',
  'beginner',
  'intermediate',
  'advanced',
];
export const exerciseEventFieldsToShow: readonly [string, ...string[]] = [
  'sets',
  'reps',
  'weight',
  'minutes',
  'seconds',
];

export function confirmDelete(e: MouseEvent) {
  e.stopPropagation();
  if (!confirm('Are you sure you want to delete this?')) {
    e.preventDefault();
  }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function toNum(val: any, def: any): any {
  if (val != undefined && val != null && !isNaN(val)) {
    return Number(val);
  }
  return def;
}

export function matchMetricsInString(s: string) {
  return s.match(/^(\w+):\s*([+-]?(\d*\.)?\d+)\s*$/gm) || [];
}

export function parseMetricStrings(s: string[]) {
  return s.reduce((result, _s) => {
    const splitString = _s.trim().replace(/\s/g, '').split(':');
    if (splitString[1] != '') {
      result.push({
        name: splitString[0],
        value: splitString[1],
      });
    }
    return result;
  }, []);
}

export function getFirstDayOfTheWeek(d: Date) {
  d = new Date(d);
  const day = getDayWeekStartsMonday(d);
  d.setDate(d.getDate() - day);
  return d;
}

export function getLastDayOfTheWeek(d: Date) {
  d = new Date(d);
  const day = getDayWeekStartsMonday(d);
  d.setDate(d.getDate() + (6 - day));
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
  return numberdayweek[d.getDay()];
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

export function camelToTitle(source: string): string {
  const result = source.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function boldQuery(str: string, queries: string[]) {
  let result = str;
  for (const query of queries) {
    const n = result.toUpperCase();
    const q = query.toUpperCase();
    const x = n.indexOf(q);
    if (!q || x === -1) {
      continue;
    }
    const l = q.length;
    const newResult =
      result.substring(0, x) +
      '<b>' +
      result.substring(x, x + l) +
      '</b>' +
      result.substring(x + l);
    result = newResult;
  }
  return result;
}

// Attempts to get the session from locals, and if it can't it will redirect
// to login with a redirectTo value of the provided url or non if url is undefined
export async function getSessionOrRedirect({ locals, url }: { locals: App.Locals; url?: URL }) {
  const session = await locals.auth.validate();

  // If the session is null, attempt to redirect
  if (session === null) {
    if (url === undefined) {
      console.error('Cannot redirect because url was not provided.', new Error().stack);
      throw redirect(302, '/login');
    }
    throw redirect(302, '/login?redirectTo=' + url.pathname + url.search);
  }

  // The session definitely exists now, so return it
  return session;
}
