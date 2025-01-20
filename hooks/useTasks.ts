import { useState, useEffect } from "react";

export interface Task {
  id: string;
  date: string;
  title: string;
  category: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("yearCalendarTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("yearCalendarTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return { tasks, addTask, removeTask };
}
