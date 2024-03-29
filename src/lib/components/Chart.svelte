<script lang="ts">
  // @ts-nocheck
  import type { widgetSelects } from '$lib/prismaHelpers/widgetHelper';
  import type { CustomQueryResults } from '$lib/server/repos/customQuery';
  import type { ExerciseEvent, Metric, Prisma } from '@prisma/client';
  import {
    BarController,
    BarElement,
    Chart as ChartJS,
    Colors,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
  } from 'chart.js';
  import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
  import { evaluate } from 'mathjs';
  import { onMount } from 'svelte';
  import { Chart } from 'svelte-chartjs';
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

  export let datasets: Prisma.DatasetGetPayload<
    typeof widgetSelects.everythingValidator.select.datasets
  >[];

  export let customQueryResults: CustomQueryResults[];

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
      if (chartComponent) {
        chartComponent.resize();
      }
    });
  });
</script>

<div class="w-full h-full" style="position: relative">
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
      maintainAspectRatio: false,
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
