import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskContextType, Theme, SortOption } from '../types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = '@tasks_storage';
const THEME_KEY = '@theme_preference';
const SORT_KEY = '@sort_preference';
const MAX_TASKS = 50;

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('light');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Load tasks, theme, and sort preference on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  // Save theme preference
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, isLoading]);

  // Save sort preference
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(SORT_KEY, sortBy);
    }
  }, [sortBy, isLoading]);

  const loadData = async () => {
    try {
      const [storedTasks, storedTheme, storedSort] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(THEME_KEY),
        AsyncStorage.getItem(SORT_KEY),
      ]);

      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }

      if (storedTheme) {
        setTheme(storedTheme as Theme);
      }

      if (storedSort) {
        setSortBy(storedSort as SortOption);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const completed = !task.completed;
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Sort tasks based on selected option
  const getSortedTasks = (tasksToSort: Task[]): Task[] => {
    const sorted = [...tasksToSort];
    
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      
      case 'dueDate':
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
      
      case 'completed':
        return sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      
      case 'date':
      default:
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const sortedTasks = getSortedTasks(tasks);
  const completedTasks = sortedTasks.filter(task => task.completed);
  const incompleteTasks = sortedTasks.filter(task => !task.completed);
  const overdueTasks = incompleteTasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  });

  const isMaxReached = tasks.length >= MAX_TASKS;

  return (
    <TaskContext.Provider
      value={{
        tasks: sortedTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        completedTasks,
        incompleteTasks,
        overdueTasks,
        MAX_TASKS,
        isMaxReached,
        sortBy,
        setSortBy,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
};