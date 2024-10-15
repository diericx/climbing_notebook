import { useQuery } from '@sveltestack/svelte-query';

export function getExerciseEvents(startStr: string, endStr: string) {
  const fetchData = async () => {
    const data = await fetch(`/api/exerciseEvents?start=${startStr}&end=${endStr}`);
    return data.json();
  };

  return useQuery(['exerciseEvents', { startStr, endStr }], () => fetchData());
}
