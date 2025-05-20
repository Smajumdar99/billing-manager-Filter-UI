export interface Task {
  id: string;
  title: string;
  priority: 'Blockers' | 'High' | 'Medium' | 'Low';
  program: string;
  type: 'Reminder' | 'Messages' | 'Dr First Notifications' | 'Review Forms' | 'Birthdays' | 'Agenda' | 'Assessment' | 'Medication' | 'Treatment' | 'Insurance' | 'Clinical' | 'Administrative' | 'Transaction Reviews';
  due: string;
  status?: string;
  description?: string;
  assignedTo?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string;
  person?: string;
  message: string;
  date?: string;
} 