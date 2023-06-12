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
      difficulty: newExercise['Difficulty Level']?.toString().toLowerCase() || null,
      videoUrl: newExercise['In Depth YouTube Technique'] || newExercise['Short YouTube Demonstration'] || null,
      muscleGroup: newExercise['Muscle Group']?.toString().toLowerCase() || null,
      primeMoverMuscle: newExercise['Prime Mover Muscle']?.toString().toLowerCase(),
      secondaryMuscle: newExercise['Secondary Muscle']?.toString().toLowerCase() || null,
      tertiaryMuscle: newExercise['Tertiary Muscle'].toString().toLowerCase() || null,
      primaryEquipment: newExercise['Primary Equipment'].toString().toLowerCase() || null,
      posture: newExercise['Posture'].toString().toLowerCase() || null,
      fieldsToShow: ['sets', 'reps', 'minutes', 'seconds', 'weight'],
      createdBy: {
        connect: {
          id: '1'
        }
      }
    }
  })

}
