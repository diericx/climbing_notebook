-- This is an empty migration.
update exercise set type = 'Climbing' where type = 'climbing';
update exercise set type = 'Strength & Power' where type = 'strength';
update exercise set type = 'Endurance' where type = 'cardio';
update exercise set type = 'Conditioning & Mobility' where type = 'stretch';