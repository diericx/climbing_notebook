<script lang="ts">
  import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
  import { Chart } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Colors,
    Tooltip,
    Legend,
    Title,
    TimeScale,
    LinearScale,
    LineController,
    BarController,
    LineElement,
    BarElement,
    PointElement,
  } from 'chart.js';
  import { evaluate } from 'mathjs';
  import type { ExerciseEvent, Metric, Prisma } from '@prisma/client';
  import type { CustomQueryResults } from '$lib/customQuery';
  import { onMount } from 'svelte';
  ChartJS.register(
    Colors,
    TimeScale,
    LinearScale,
    LineController,
    BarController,
    LineElement,
    PointElement,
    BarElement,
    Legend,
    Tooltip,
    Title
  );

  type ChartDataPoint = {
    x: string;
    y: number;
  };

  type ChartDataset = {
    label: string;
    data: ChartDataPoint[];
    pointHoverRadius: number;
    pointHitRadius: number;
    type: string;
    backgroundColor: string;
  };

  type Dataset = Prisma.DatasetGetPayload<{
    include: {
      customQueries: true;
    };
  }>;

  export let customQueryResults: CustomQueryResults[];
  export let datasets: Dataset[];

  let equationErrorMessage: string | undefined = undefined;

  // Reactively update chart data
  let chartDatasets: ChartDataset[];
  $: chartDatasets = [];
  $: chartData = { datasets: chartDatasets };
  $: {
    chartDatasets = [];
    chartData = { datasets: chartDatasets };

    for (const dataset of datasets) {
      // Set up the chart
      let chartDataset: ChartDataset = {
        pointHoverRadius: 5,
        pointHitRadius: 25,
        label: dataset.name,
        type: dataset.type,
        backgroundColor: dataset.color,
        data: [],
      };
      // Create helper function for adding a data point to this chart
      function addDataPoint(dataPoint: ChartDataPoint) {
        let existingDatumIndex = chartDataset.data.findIndex((d) => d.x == dataPoint.x);
        if (existingDatumIndex != -1) {
          chartDataset.data[existingDatumIndex].y += dataPoint.y;
        } else {
          chartDataset.data.push(dataPoint);
        }
      }
      // Loop through all queries for this dataset and add them to the chart
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
              try {
                let score = evaluate(customQuery.equation, {
                  sets: e.sets,
                  reps: e.reps,
                  weight: e.weight,
                  minutes: e.minutes,
                  seconds: e.seconds,
                });
                addDataPoint({ x: e.date.toISOString().split('T')[0], y: score });
              } catch (e: any) {
                equationErrorMessage = e.toString();
              }
            }
          }
        } else if (customQuery.table == 'metric') {
          const data = customQueryResult.data as Metric[];
          for (const m of data) {
            if (m.date) {
              try {
                let score = evaluate(customQuery.equation, {
                  value: m.value,
                });
                addDataPoint({ x: m.date.toISOString().split('T')[0], y: score });
              } catch (e: any) {
                equationErrorMessage = e.toString();
              }
            }
          }
        }
      }
      chartDatasets.push(chartDataset);
    }
    chartData.datasets = chartDatasets;
  }

  // Chart resizes with window
  let chartComponent;
  onMount(() => {
    window.addEventListener('resize', function () {
      chartComponent.resize();
    });
  });
</script>

<div class="w-full" style="position: relative">
  {#if equationErrorMessage}
    <div class="overflow-scroll">
      <div class="invalid">Equation error: {equationErrorMessage}</div>
    </div>
  {/if}
  <Chart
    type={'line'}
    bind:chart={chartComponent}
    data={chartData}
    options={{
      responsive: true,
      interaction: {
        mode: 'point',
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            round: 'day',
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'rgb(255, 99, 132)',
          },
        },
        colors: {
          enabled: true,
        },
      },
    }}
  />
</div>
