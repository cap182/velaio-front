export interface Task {
    taskId?: string,
    title: string;
    limitDate: number;
    isCompleted: boolean;
    users: User[];
  }
  
  export interface User {
    userName: string;
    userAge: number;
    skills: string[];
  }
  
  export interface AppState {
    isLoading: boolean;
    error: string | null;
  }