<script lang="ts">
  import type { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
  import type { CustomQueryResults } from '$lib/server/repos/customQuery';
  import type { ExerciseEvent, Metric, Prisma } from '@prisma/client';
  import { default as CalHeatmap } from 'cal-heatmap';
  import 'cal-heatmap/cal-heatmap.css';
  // @ts-ignore
  import Legend from 'cal-heatmap/plugins/Legend';
  // @ts-ignore
  import Tooltip from 'cal-heatmap/plugins/Tooltip';
  // @ts-ignore
  import type { DataGroupType, DataRecord } from 'cal-heatmap/src/options/Options';
  import type dayjs from 'dayjs';
  import { onMount } from 'svelte';

  export let customQueryResults: CustomQueryResults[];
  export let datasets: Prisma.DatasetGetPayload<
    typeof widgetSelects.everythingValidator.select.datasets
  >[];

  let domain: String[] = [...datasets.map((d) => d.name), 'combo'];
  let chartData: DataRecord[];

  // Reactively update chart data
  $: {
    chartData = [];
    for (const dataset of datasets) {
      for (const customQuery of dataset.customQueries) {
        const customQueryResult = customQueryResults.find((r) => r.customQueryId == customQuery.id);
        if (customQueryResult == undefined) {
          console.error('Could not find data for custom query: ', customQuery.id);
          continue;
        }

        if (customQuery.table == 'exerciseEvent') {
          const data = customQueryResult.data as ExerciseEvent[];
          for (const e of data) {
            if (e.date) {
              chartData.push({
                date: e.date.toISOString().split('T')[0],
                value: dataset.name,
              });
            }
          }
        } else if (customQuery.table == 'metric') {
          const data = customQueryResult.data as Metric[];
          for (const m of data) {
            if (m.date) {
              chartData.push({
                date: m.date.toISOString().split('T')[0],
                value: dataset.name,
              });
            }
          }
        }
      }
    }
  }

  onMount(() => {
    // @ts-ignore
    const cal = new CalHeatmap();
    cal.paint(
      {
        data: {
          source: chartData,
          x: 'date',
          y: 'value',
          groupY: (d: DataGroupType) => {
            if (d.length > 1) {
              return 'combo';
            }
            return d[0];
          },
        },
        range: 1,
        // This is a use case called 'ordinal domain' but does not look like the
        // type safety is implemented.
        // @ts-ignore
        scale: { color: { type: 'ordinal', scheme: 'tableau10', domain } },
        domain: {
          type: 'year',
          label: { text: null },
        },
        subDomain: { type: 'day', radius: 2 },
      },
      [
        [
          Legend,
          {
            tickSize: 0,
            width: '100%',
            itemSelector: '#legend',
          },
        ],
        [
          Tooltip,
          {
            // Value is a string because we are using ordinal chart
            text: function (timestamp: number, value: String, dayjsDate: dayjs.Dayjs) {
              let label = '';
              if (value == undefined) {
                label += 'No data';
              } else {
                if (value == 'combo') {
                  // Find all the values existing on this date and apend
                  const dataPoints = chartData.filter(
                    (d) => d.date == new Date(timestamp).toISOString().split('T')[0]
                  );
                  for (const p of dataPoints) {
                    label += p.value + ', ';
                  }
                } else {
                  label += value;
                }
              }
              return label + ' on ' + dayjsDate.format('LL');
            },
          },
        ],
      ]
    );
  });
</script>

<div class="w-full" style="position: relative">
  <div class="overflow-scroll pb-4" id="cal-heatmap" />
  <div id="legend" />
</div>
