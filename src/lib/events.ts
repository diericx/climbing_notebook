export let presetEvents = [
		{
			label: 'Bouldering',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Hard Route Climbing',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Weight Training',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Easy Climbing (at OS level or below)',
			amountUnit: 'hour',
			pointsPerUnit: 10,
			type: 'training'
		},
		{
			label: 'Sleep, hours before midnight',
			amountUnit: 'hour',
			pointsPerUnit: 3,
			type: 'recovery'
		},
		{
			label: 'Post-training meal',
			amountUnit: 'meal',
			pointsPerUnit: 2,
			type: 'recovery'
		},
		{
			label: 'Water',
			amountUnit: 'liter',
			pointsPerUnit: 1,
			type: 'recovery'
		},
		{
			label: 'Nap',
			amountUnit: 'nap',
			pointsPerUnit: 5,
			type: 'recovery'
		},
		{
			label: 'Easy Walk',
			amountUnit: 'walk',
			pointsPerUnit: 2,
			type: 'recovery'
		},
		{
			label: 'Easy cycle',
			amountUnit: 'walk',
			pointsPerUnit: 2,
			type: 'recovery'
		},
		{
			label: 'Hit Protein Goal',
			amountUnit: 'protein goal reached',
			pointsPerUnit: 3,
			type: 'recovery'
		},
		{
			label: 'Stretch for 15 min',
			amountUnit: 'stretch',
			pointsPerUnit: 1,
			type: 'recovery'
		}
]
export let presetTrainingEvents  = presetEvents.filter((event) => event.type == 'training') || [];
export let presetRecoveryEvents  = presetEvents.filter((event) => event.type == 'recovery') || [];

