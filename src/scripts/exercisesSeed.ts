import { prisma } from '../lib/prisma.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const exercises = require('./exercises_seed.json');

for (const newExercise of exercises) {
  const foundExercise = await prisma.exercise.findUnique({
    where: {
      name: newExercise['Exercise']
    }
  });

  // Don't create dupes
  if (foundExercise != null) {
    continue
  }

  await prisma.exercise.create({
    data: {
      name: newExercise['Exercise'],
      type: 'strength',
      difficulty: newExercise['Difficulty Level'] || null,
      videoUrl: newExercise['In Depth YouTube Technique'] || newExercise['Short YouTube Demonstration'] || null,
      muscleGroup: newExercise['Muscle Group'] || null,
      primaryMoverMuscle: newExercise['Prime Mover Muscle'],
      secondaryMuscle: newExercise['Secondary Muscle'] || null,
      tertiaryMuscle: newExercise['Tertiary Muscle'] || null,
      primaryEquipment: newExercise['Primary Equipment'] || null,
      posture: newExercise['Posture'] || null,
      fieldsToShow: ['sets', 'reps', 'minutes', 'seconds', 'weight'],
      createdBy: {
        connect: {
          id: '1'
        }
      }
    }
  })

}
