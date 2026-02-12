export enum WeekStatus {
  Completed = 'Completed',
  InProgress = 'In Progress',
  Locked = 'Locked'
}

export enum DayType {
  EasyRun = 'Easy Run',
  Intervals = 'Intervals',
  TempoRun = 'Tempo Run',
  LongRun = 'Long Run',
  CrossTraining = 'Cross-Training',
  Rest = 'Rest'
}

export interface IntervalDetails {
  sets: number;
  workDuration: number;
  recoveryDuration: number;
}

export interface WorkoutStep {
  type: 'warmup' | 'main' | 'cooldown';
  title: string;
  description: string;
  duration?: string;
  intervals?: IntervalDetails;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  type: DayType;
  title: string;
  subtitle: string;
  details?: string;
  isToday?: boolean;
  isCompleted?: boolean;
  steps?: WorkoutStep[];
  duration?: string;
}

export interface WeekPlan {
  id: string;
  title: string;
  subtitle: string;
  status: WeekStatus;
  days: DayPlan[];
}
