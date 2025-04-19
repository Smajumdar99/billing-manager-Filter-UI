import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Task type
export interface Task {
  id: string;
  subject: string;
  message: string;
  recipients: { id: string; name: string; role: string }[];
  linkedPatientId?: string | null;
  progress: string;
  priority: string;
  startDate: string;
  dueDate: string;
  attachments: File[];
  createdAt: string;
  createdBy: string;
}

interface TaskContextType {
  myTasks: Task[];
  addTask: (task: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [myTasks, setMyTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => setMyTasks(prev => [task, ...prev]);

  return (
    <TaskContext.Provider value={{ myTasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};
