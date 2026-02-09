import { WeekPlan, WeekStatus, DayType } from '../types';

export const planData: WeekPlan[] = [
  {
    id: 'week-1',
    title: 'Week 1: Base Building & Speed Intro',
    subtitle: 'Focus: Routine & turnover',
    status: WeekStatus.InProgress,
    days: [
      {
        id: 'w1-d1',
        dayNumber: 1,
        type: DayType.EasyRun,
        title: 'Easy Run',
        subtitle: '30 mins • RPE 3-4',
        details: 'Purpose: Aerobic base building.\nIntensity: RPE 3-4 (Conversational pace).',
        duration: '30 mins',
        isCompleted: false
      },
      {
        id: 'w1-d2',
        dayNumber: 2,
        type: DayType.Intervals,
        title: 'Speed Work (Intervals)',
        subtitle: '8 x 400m',
        details: 'Purpose: Improve VO2 max and running economy.\nIntensity: RPE 8-9 (Hard, roughly 10-15 sec/mile faster than goal 5K pace).',
        duration: '45 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up jog.' },
          { type: 'main', title: 'Main Set', description: '8 x 400m (or 2 mins) hard, with 90 seconds standing rest between each.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down jog.' }
        ]
      },
      {
        id: 'w1-d3',
        dayNumber: 3,
        type: DayType.CrossTraining,
        title: 'Strength + Cross-Training',
        subtitle: 'Bike + Strength',
        details: 'Purpose: Build power and active recovery.',
        steps: [
          { type: 'main', title: 'Bike', description: '30 mins steady state (RPE 4).' },
          { type: 'main', title: 'Strength', description: '3 sets of 10-12: Goblet Squats, Walking Lunges, Dumbbell Deadlifts, Plank (45 sec).' }
        ]
      },
      {
        id: 'w1-d4',
        dayNumber: 4,
        type: DayType.TempoRun,
        title: 'Tempo Run',
        subtitle: '20 mins @ comfortsably hard',
        details: 'Purpose: Increase lactate threshold.\nIntensity: RPE 6-7 (Sustainable discomfort).',
        duration: '40 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up.' },
          { type: 'main', title: 'Tempo', description: '20 minutes at "comfortably hard" pace.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w1-d5',
        dayNumber: 5,
        type: DayType.Rest,
        title: 'Rest Day',
        subtitle: 'Full Recovery',
        details: 'Purpose: Full physiological recovery.'
      },
      {
        id: 'w1-d6',
        dayNumber: 6,
        type: DayType.LongRun,
        title: 'Long Run',
        subtitle: '4-5 miles • RPE 3-4',
        details: 'Purpose: Endurance.\nIntensity: RPE 3-4 (Keep it slow).',
        duration: '45-50 mins'
      },
      {
        id: 'w1-d7',
        dayNumber: 7,
        type: DayType.CrossTraining,
        title: 'Active Recovery',
        subtitle: '30 min Bike/Walk',
        details: 'Purpose: Blood flow without impact.\n30 min stationary bike (very light resistance) or gentle walk.'
      }
    ]
  },
  {
    id: 'week-2',
    title: 'Week 2: Increasing Volume',
    subtitle: 'Focus: Endurance & Strength',
    status: WeekStatus.Locked,
    days: [
      {
        id: 'w2-d1',
        dayNumber: 1,
        type: DayType.EasyRun,
        title: 'Easy Run + Strides',
        subtitle: '35 mins + 4x Strides',
        details: 'Purpose: Recovery form weekend/aerobic maintenance.\nIntensity: RPE 3-4.',
        duration: '40 mins',
        steps: [
          { type: 'main', title: 'Run', description: '35 minutes running.' },
          { type: 'main', title: 'Strides', description: '4 x 20-second "strides" (accelerations) at the end.' }
        ]
      },
      {
        id: 'w2-d2',
        dayNumber: 2,
        type: DayType.Intervals,
        title: 'Speed Work (Longer Intervals)',
        subtitle: '5 x 800m',
        details: 'Purpose: Speed endurance.\nIntensity: RPE 8 (Goal 5K pace).',
        duration: '45 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up.' },
          { type: 'main', title: 'Main Set', description: '5 x 800m (or 4 mins) hard, with 2 mins jog recovery.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w2-d3',
        dayNumber: 3,
        type: DayType.CrossTraining,
        title: 'Strength + Cross-Training',
        subtitle: 'Bike + Heavier Strength',
        details: 'Purpose: Muscular endurance.',
        steps: [
          { type: 'main', title: 'Bike', description: '40 mins steady state (RPE 5).' },
          { type: 'main', title: 'Strength', description: '3 sets of 8-10: Split Squats, Single-Leg RDLs, Calf Raises, Russian Twists.' }
        ]
      },
      {
        id: 'w2-d4',
        dayNumber: 4,
        type: DayType.TempoRun,
        title: 'Tempo Run',
        subtitle: '25 mins continuous',
        details: 'Purpose: Threshold maintenance.\nIntensity: RPE 7.',
        duration: '45 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up.' },
          { type: 'main', title: 'Tempo', description: '25 minutes continuous tempo.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w2-d5',
        dayNumber: 5,
        type: DayType.Rest,
        title: 'Rest Day',
        subtitle: 'Recovery',
        details: 'Purpose: Recovery.'
      },
      {
        id: 'w2-d6',
        dayNumber: 6,
        type: DayType.LongRun,
        title: 'Long Run',
        subtitle: '5-6 miles • RPE 3-4',
        details: 'Purpose: Endurance.\nIntensity: RPE 3-4.'
      },
      {
        id: 'w2-d7',
        dayNumber: 7,
        type: DayType.CrossTraining,
        title: 'Active Recovery',
        subtitle: '30-45 min Bike/Walk',
        details: 'Purpose: Flush legs.\n30-45 min bike or brisk walk.'
      }
    ]
  },
  {
    id: 'week-3',
    title: 'Week 3: Peak Training Load',
    subtitle: 'Focus: Max Volume & Intensity',
    status: WeekStatus.Locked,
    days: [
      {
        id: 'w3-d1',
        dayNumber: 1,
        type: DayType.EasyRun,
        title: 'Easy Run',
        subtitle: '40 mins • RPE 3-4',
        details: 'Purpose: Aerobic base.\nIntensity: RPE 3-4.',
        duration: '40 mins'
      },
      {
        id: 'w3-d2',
        dayNumber: 2,
        type: DayType.Intervals,
        title: 'Speed Work (Over-Speed)',
        subtitle: '12 x 200m',
        details: 'Purpose: Sharpening speed and leg turnover.\nIntensity: RPE 9 (Faster than goal 5K pace).',
        duration: '50-60 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '15 min warm-up.' },
          { type: 'main', title: 'Main Set', description: '12 x 200m (or 45-60 secs) very hard, with 200m slow jog recovery.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w3-d3',
        dayNumber: 3,
        type: DayType.CrossTraining,
        title: 'Strength + Cross-Training',
        subtitle: 'Bike Sprints + Strength',
        details: 'Purpose: Maintenance without impact.',
        steps: [
          { type: 'main', title: 'Bike', description: '45 mins (include 5 x 1-min hard sprints).' },
          { type: 'main', title: 'Strength', description: '3 sets of 10: Squats, Lateral Lunges, Glute Bridges (weighted), Plank to Push-up.' }
        ]
      },
      {
        id: 'w3-d4',
        dayNumber: 4,
        type: DayType.Intervals, // Using Intervals for Threshold Intervals
        title: 'Threshold Intervals',
        subtitle: '3 x 10 mins',
        details: 'Purpose: Mental toughness and lactate clearance.\nIntensity: RPE 7-8.',
        duration: '50 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up.' },
          { type: 'main', title: 'Threshold', description: '3 x 10 minutes at Tempo pace with 2 min jog recovery between reps.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w3-d5',
        dayNumber: 5,
        type: DayType.Rest,
        title: 'Rest Day',
        subtitle: 'Critical Recovery',
        details: 'Purpose: Critical recovery before long run.'
      },
      {
        id: 'w3-d6',
        dayNumber: 6,
        type: DayType.LongRun,
        title: 'Long Run',
        subtitle: '6-7 miles • RPE 4',
        details: 'Purpose: Max endurance stimulus.\nIntensity: RPE 4 (Last mile can be at goal race pace if feeling good).'
      },
      {
        id: 'w3-d7',
        dayNumber: 7,
        type: DayType.CrossTraining,
        title: 'Active Recovery',
        subtitle: '30 min Bike/Roll',
        details: 'Purpose: Relax muscles.\n30 min bike or stretching/foam rolling.'
      }
    ]
  },
  {
    id: 'week-4',
    title: 'Week 4: The Sharpening Phase',
    subtitle: 'Focus: Maintain intensity, reduce volume',
    status: WeekStatus.Locked,
    days: [
      {
        id: 'w4-d1',
        dayNumber: 1,
        type: DayType.EasyRun,
        title: 'Easy Run',
        subtitle: '30 mins • RPE 3',
        details: 'Purpose: Recovery.\nIntensity: RPE 3.',
        duration: '30 mins'
      },
      {
        id: 'w4-d2',
        dayNumber: 2,
        type: DayType.Intervals,
        title: 'Speed Work (Race Sim)',
        subtitle: '3 x 1 Mile',
        details: 'Purpose: Confidence building at race pace.\nIntensity: RPE 8-9.',
        duration: '50-60 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up.' },
          { type: 'main', title: 'Main Set', description: '3 x 1 Mile (1600m) at Goal 5K Pace with 3 mins rest.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w4-d3',
        dayNumber: 3,
        type: DayType.CrossTraining,
        title: 'Strength + Cross-Training',
        subtitle: 'Easy Bike + Maint. Weights',
        details: 'Purpose: Reduce load.',
        steps: [
          { type: 'main', title: 'Bike', description: '30 mins easy spinning.' },
          { type: 'main', title: 'Strength', description: '2 sets only: Maintenance weights. Focus on form. Core work emphasis.' }
        ]
      },
      {
        id: 'w4-d4',
        dayNumber: 4,
        type: DayType.Intervals, // Mapping Fartlek to Intervals type for structure
        title: 'Fartlek Run',
        subtitle: '30 mins total',
        details: 'Purpose: Variable heart rate training.\nIntensity: Hard segments at RPE 7-8.',
        duration: '30 mins',
        steps: [
          { type: 'main', title: 'Run', description: '30 min run total. During the middle, alternate 2 mins hard / 1 min easy for 15 mins.' }
        ]
      },
      {
        id: 'w4-d5',
        dayNumber: 5,
        type: DayType.Rest,
        title: 'Rest Day',
        subtitle: 'Recovery',
        details: 'Purpose: Recovery.'
      },
      {
        id: 'w4-d6',
        dayNumber: 6,
        type: DayType.LongRun,
        title: 'Moderate Long Run',
        subtitle: '4-5 miles • RPE 3',
        details: 'Purpose: Aerobic maintenance.\nIntensity: RPE 3.'
      },
      {
        id: 'w4-d7',
        dayNumber: 7,
        type: DayType.CrossTraining,
        title: 'Active Recovery',
        subtitle: '20 min Bike/Walk',
        details: 'Purpose: Rest.\n20 min easy bike or walk.'
      }
    ]
  },
  {
    id: 'week-5',
    title: 'Week 5: Taper & Race Week',
    subtitle: 'Focus: Fresh legs for Race Day',
    status: WeekStatus.Locked,
    days: [
      {
        id: 'w5-d1',
        dayNumber: 1,
        type: DayType.Rest,
        title: 'Rest or Shakeout',
        subtitle: 'Optional 20 min jog',
        details: 'Purpose: Full rest.\nOptional 20 min easy jog or complete rest.'
      },
      {
        id: 'w5-d2',
        dayNumber: 2,
        type: DayType.Intervals,
        title: 'Speed Work (Taper Intervals)',
        subtitle: '4 x 400m @ Race Pace',
        details: 'Purpose: Neuromuscular priming.\nIntensity: RPE 8 (Feel fast and smooth).',
        duration: '35 mins',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10 min warm-up.' },
          { type: 'main', title: 'Main Set', description: '4 x 400m at goal race pace with full 3 min rest.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min cool-down.' }
        ]
      },
      {
        id: 'w5-d3',
        dayNumber: 3,
        type: DayType.CrossTraining,
        title: 'Mobility / Light Bike',
        subtitle: '20 mins spinning',
        details: 'Purpose: Blood flow.\n20 mins easy spinning. No weights this week.'
      },
      {
        id: 'w5-d4',
        dayNumber: 4,
        type: DayType.EasyRun,
        title: 'Easy Run + Strides',
        subtitle: '20 mins + 4 Strides',
        details: 'Purpose: Keep systems online.\nIntensity: RPE 3 for run, RPE 8 for strides.'
      },
      {
        id: 'w5-d5',
        dayNumber: 5,
        type: DayType.Rest,
        title: 'Rest Day',
        subtitle: 'Hydrate well',
        details: 'Purpose: Race prep. Complete rest.'
      },
      {
        id: 'w5-d6',
        dayNumber: 6,
        type: DayType.Rest, // Using Rest type as placeholder if user hasn't selected Sat vs Sun
        title: 'Pre-Race / Race Day',
        subtitle: 'See Sunday',
        details: 'If race is Sunday, rest today. If race is today, Good Luck!'
      },
      {
        id: 'w5-d7',
        dayNumber: 7,
        type: DayType.Intervals, // Using Intervals to denote the Race event logic/importance
        title: 'RACE DAY 🏁',
        subtitle: '5K PR Attempt',
        details: 'Purpose: PR Attempt.\nStart controlled, push middle, empty tank at end.',
        steps: [
          { type: 'warmup', title: 'Warm-up', description: '10-15 min very slow jog. Drills: High knees, butt kicks, 2-3 short accelerations.' },
          { type: 'main', title: 'Race', description: '5K Race.' },
          { type: 'cooldown', title: 'Cool-down', description: '10 min walk/jog.' }
        ]
      }
    ]
  }
];