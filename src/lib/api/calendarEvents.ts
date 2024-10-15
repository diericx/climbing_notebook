import { useQuery } from '@sveltestack/svelte-query';

export function getCalendarEvents(startStr: string, endStr: string) {
  const fetchData = async () => {
    const data = await fetch(`/api/calendarEvents?start=${startStr}&end=${endStr}`);
    return data.json();
  };

  return useQuery(['calendarEvents', { startStr, endStr }], () => fetchData());
}
