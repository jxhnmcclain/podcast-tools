
export interface PodcastPoint {
  id: string;
  title: string;
  speaker?: string;
  durationSeconds: number; // Duration in seconds for this segment
}

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
}
