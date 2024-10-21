import { useQuery } from '@sveltestack/svelte-query';

export function getTrainingProgramActivations() {
  const fetchData = async () => {
    const data = await fetch(`/api/trainingProgramActivations`);
    return data.json();
  };

  return useQuery(['trainingProgramActivations'], () => fetchData());
}
