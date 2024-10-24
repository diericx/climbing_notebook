import { APIBaseURL } from '$lib/utils';
import { useQuery } from '@sveltestack/svelte-query';

export function getExerciseEvents(startStr: string, endStr: string) {
  const fetchData = async () => {
    const data = await fetch(`${APIBaseURL()}/api/exerciseEvents?start=${startStr}&end=${endStr}`);
    return data.json();
  };

  return useQuery(['exerciseEvents', { startStr, endStr }], () => fetchData());
}
