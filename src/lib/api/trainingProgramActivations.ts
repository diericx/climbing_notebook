import { useQuery } from '@sveltestack/svelte-query';

export function getTrainingProgramActivations(startStr: string, endStr: string) {
  const fetchData = async () => {
    const data = await fetch(`/api/trainingProgramActivations?start=${startStr}&end=${endStr}`);
    return data.json();
  };

  return useQuery(['trainingProgramActivations', { startStr, endStr }], () => fetchData());
}
