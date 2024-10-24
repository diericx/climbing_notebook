import { APIBaseURL } from '$lib/utils';
import { useQuery } from '@sveltestack/svelte-query';

export function getJournalEntries(startStr: string, endStr: string) {
  const fetchData = async () => {
    const data = await fetch(`${APIBaseURL()}/api/journalEntries?start=${startStr}&end=${endStr}`);
    return data.json();
  };

  return useQuery(['journalEntries', { startStr, endStr }], () => fetchData());
}
