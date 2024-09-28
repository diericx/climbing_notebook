import type { Prisma } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import 'fs';
import dayjs from './dayjs';

export const grades: { [key: string]: string[] } = {
  hueco: [
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
  ],
  font: [
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
  ],
  french: [
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
  ],
  yds: [
    '5.5',
    '5.6',
    '5.7',
    '5.8',
    '5.9',
    '5.10a',
    '5.10b',
    '5.10c',
    '5.10d',
    '5.11a',
    '5.11b',
    '5.11c',
    '5.11d',
    '5.12a',
    '5.12b',
    '5.12c',
    '5.12d',
    '5.13a',
    '5.13b',
    '5.13c',
    '5.13d',
    '5.14a',
    '5.14b',
    '5.14c',
    '5.14d',
    '5.15a',
    '5.15b',
    '5.15c',
  ],
};
export const gradeSystems: string[] = Object.keys(grades);
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
  'Climbing', // was climbing
  'Strength & Power', // was strength
  'Conditioning & Mobility', // was stretch
  'Endurance', // was cardio
  'Power Endurance',
  'Cross Training',
];
export const exerciseTypeColors: { [key: string]: string } = {
  Climbing: 'bg-sky-700',
  'Strength & Power': 'bg-red-500',
  'Conditioning & Mobility': 'bg-orange-400',
  Endurance: 'bg-teal-300',
  'Power Endurance': 'bg-teal-700',
  'Cross Training': 'bg-yellow-300',
};

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
  return s.reduce((result: { name: string; value: string }[], _s) => {
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

export function getDayWhenWeekStartsMonday(d: Date) {
  const numberdayweek = [6, 0, 1, 2, 3, 4, 5];
  return numberdayweek[d.getDay()];
}

// returns the first day of the week that the given date is in with
// time zeroed
export function getFirstDayOfTheWeek(d: Date) {
  d = new Date(d);
  const day = getDayWhenWeekStartsMonday(d);
  d.setDate(d.getDate() - day);
  return getLocalDateWithZeroTime(d);
}

// returns the last day of the week that the given date is in with
// time zeroed
export function getLastDayOfTheWeek(d: Date) {
  d = new Date(d);
  const day = getDayWhenWeekStartsMonday(d);
  d.setDate(d.getDate() + (6 - day));
  return getLocalDateWithZeroTime(d);
}

export function isDateInTheSameWeekAsToday(d: Date) {
  // Convert all to iso string to just compare the days
  const t = getLocalDateWithZeroTime(d);
  const f = getFirstDayOfTheWeek(new Date());
  const l = getLastDayOfTheWeek(new Date());
  return t >= f && t <= l;
}

// Checks if a given date is in the same day as today in local time
export function isDateInTheSameDayAsToday(d: Date) {
  const todayStr = new Date().toLocaleString(undefined, {
    month: 'numeric',
    year: 'numeric',
    day: 'numeric',
  });
  const dateStr = d.toLocaleString(undefined, {
    month: 'numeric',
    year: 'numeric',
    day: 'numeric',
  });
  console.log(todayStr, dateStr);
  return todayStr == dateStr;
}

// Given a date this function returns the same date with zeroed time to compare
// at day level only.
export function getLocalDateWithZeroTime(d: Date) {
  // Create a new Date object to avoid modifying the original
  const localDate = new Date(d);

  // Set hours, minutes, seconds, and milliseconds to zero
  localDate.setHours(0, 0, 0, 0);

  return localDate;
}

export function daysFromToday(i: number) {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
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
// to login with a redirectTo value of the provided url or non if url is undefined.
// It will redirect to the search param redirecToAuthFallback, or create it's own from
// the provided url (url.pathname + url.search) if the former does not exist
export async function getSessionOrRedirect({ locals, url }: { locals: App.Locals; url?: URL }) {
  const session = await locals.auth.validate();

  // If the session is null, attempt to redirect
  if (session === null) {
    if (url === undefined) {
      console.error('Cannot redirect because url was not provided.', new Error().stack);
      redirect(302, '/login');
    }
    const redirectToAuthFallback = url.searchParams.get('redirectToAuthFallback');
    redirect(302, `/login?redirectTo=${redirectToAuthFallback || url.pathname + url.search}`);
  }

  // The session definitely exists now, so return it
  return session;
}

// Returns the active training cycle for a program activated at a certain date
// and undefined if the activation is no longer valid.
export function getActiveTrainingCycleForTrainingProgramActivation(
  activation: Prisma.TrainingProgramActivationGetPayload<{
    include: {
      trainingProgram: {
        include: {
          owner: true;
          trainingProgramScheduledSlots: {
            orderBy: {
              order: 'asc';
            };
            include: {
              trainingCycles: {
                include: {
                  owner: true;
                  exerciseGroups: {
                    include: {
                      exercises: {
                        orderBy: {
                          name: 'asc';
                        };
                      };
                    };
                    orderBy: {
                      name: 'asc';
                    };
                  };
                  days: {
                    include: {
                      exercises: {
                        orderBy: {
                          name: 'asc';
                        };
                      };
                      exerciseGroups: {
                        orderBy: {
                          name: 'asc';
                        };
                        include: {
                          exercises: {
                            orderBy: {
                              name: 'asc';
                            };
                          };
                        };
                      };
                    };
                    orderBy: {
                      // Note: ui depends on this being sorted in this way
                      dayOfTheWeek: 'asc';
                    };
                  };
                  saves: true;
                  activations: true;
                  _count: {
                    select: {
                      saves: true;
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>
) {
  const slots = activation.trainingProgram.trainingProgramScheduledSlots;
  const startDateWeekOfYear = dayjs.tz(activation.startDate, 'UTC').week();
  let todayWeekOfYear = dayjs.tz(new Date(), 'UTC').week();
  // Account for year rollover
  if (todayWeekOfYear < startDateWeekOfYear) {
    todayWeekOfYear += startDateWeekOfYear;
  }
  const weekDiff = todayWeekOfYear - startDateWeekOfYear;
  if (slots[weekDiff] === undefined) {
    return undefined;
  }
  return slots[weekDiff].trainingCycles[0];
}

export function kgToLb(kg: number) {
  return kg * 2.20462;
}

export function lbToKg(lb: number) {
  if (lb == 0) {
    return 0;
  }
  return lb / 2.20462;
}

export function roundTo(num: number, decimalPlace: number) {
  return Math.round((num + Number.EPSILON) * (10 * decimalPlace)) / (10 * decimalPlace);
}
