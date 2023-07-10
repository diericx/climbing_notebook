<script lang="ts">
  import CalHeatmap from 'cal-heatmap';
  import Legend from 'cal-heatmap/plugins/Legend';
  import Tooltip from 'cal-heatmap/plugins/Tooltip';

  import 'cal-heatmap/cal-heatmap.css';

  import type { ExerciseEvent, Metric } from '@prisma/client';
  import type { CustomQueryResults } from '$lib/customQuery';
  import { onMount } from 'svelte';
  import type { DatasetComplete } from '$lib/prisma';

  export let customQueryResults: CustomQueryResults[];
  export let datasets: DatasetComplete[];

  let domain = [...datasets.map((d) => d.name), 'combo'];

  let chartData = [];
  for (const dataset of datasets) {
    const customQueryResult = customQueryResults.find(
      (r) => r.customQueryId == dataset.customQueryId
    );
    if (customQueryResult == undefined) {
      console.error('Could not find data for custom query: ', dataset.customQueryId);
      continue;
    }

    if (dataset.customQuery.table == 'exerciseEvent') {
      const data = customQueryResult.data as ExerciseEvent[];
      for (const e of data) {
        if (e.date) {
          chartData.push({
            date: e.date.toISOString().split('T')[0],
            value: dataset.name,
          });
        }
      }
    } else if (dataset.customQuery.table == 'metric') {
      const data = customQueryResult.data as Metric[];
      for (const m of data) {
        if (m.date) {
          chartData.push({
            date: e.date.toISOString().split('T')[0],
            value: dataset.name,
          });
        }
      }
    }
  }

  onMount(() => {
    const cal = new CalHeatmap();
    cal.paint(
      {
        data: {
          source: chartData,
          x: 'date',
          y: 'value',
          groupY: (d) => {
            if (d.length > 1) {
              return 'combo';
            }
            return d[0];
          },
        },
        range: 1,
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
            text: function (date, value, dayjsDate) {
              let label = '';
              if (value == undefined) {
                label += 'No data';
              } else {
                if (value == 'combo') {
                  // Find all the values existing on this date and apend
                  const dataPoints = chartData.filter(
                    (d) => d.date == new Date(date).toISOString().split('T')[0]
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
