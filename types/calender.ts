export interface Task {
  id: string;
  title: string;
  color: string;
  rows: TaskRow[];
}

export interface TaskRow {
  title: string;
  startDay: number;
  endDay: number;
  color: string;
}
