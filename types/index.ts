

export type RootStackParamList = {
  Home: undefined;
  AddTask: { taskId?: string } | undefined;
};

export type Theme = 'light' | 'dark';

export type SortOption = 'date' | 'dueDate' | 'alphabetical' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  completedTasks: Task[];
  incompleteTasks: Task[];
  overdueTasks: Task[];
  MAX_TASKS: number;
  isMaxReached: boolean;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  theme: Theme;
  toggleTheme: () => void;
}

export interface VoiceInputResult {
  transcription: string;
  tasks: string[];
}