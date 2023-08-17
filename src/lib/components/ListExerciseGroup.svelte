<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Prisma } from '@prisma/client';

  const _exerciseGroup = Prisma.validator<Prisma.ExerciseGroupArgs>()({
    include: {
      exercises: true,
    }
  })
  type ExerciseGroup = Prisma.ExerciseGroupGetPayload<typeof _exerciseGroup>;

  export let exerciseGroups: ExerciseGroup[];
</script>

<ul class="divide-y divide-gray-200 border-t border-b">
  {#each exerciseGroups as group}
    <li class="bg-white py-2">
      <div class="flex items-center md:space-x-3">
        <div class="mr-2">
          <Icon icon="material-symbols:list-alt" width="35" />
        </div>
        <div class="flex items-center md:space-x-8">
          <div class="flex-1 min-w-0">
            <p>{group.name}</p>
            <p class="text-sm text-gray-400">
              {group.exercises.length} exercises
            </p>
          </div>
        </div>
        <div class="flex-1" />
        <div class="flex min-w-0 float-right space-x-2">
          <slot name="buttons" {group} />
        </div>
      </div>
    </li>
  {/each}
</ul>
