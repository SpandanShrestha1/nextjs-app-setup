"use client";

import React, { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import api from '../lib/api';

const HomePage = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  const fetchTasks = async () => {
    if (!user) return;
    try {
      const params: any = {};
      if (filterStatus === 'completed') params.status = 'completed';
      else if (filterStatus === 'pending') params.status = 'pending';
      if (filterCategory) params.category = filterCategory;
      if (filterPriority) params.priority = filterPriority;

      const response = await api.get('/tasks', { params });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user, filterStatus, filterCategory, filterPriority]);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    localStorage.removeItem('token');
  };

  const handleTaskSubmit = async (taskData: any) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
        setEditingTask(null);
      } else {
        await api.post('/tasks', taskData);
      }
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">
        <h1 className="text-3xl font-bold mb-6">Personal Task Manager</h1>
        <AuthForm mode="login" onAuthSuccess={handleAuthSuccess} />
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <button
            className="text-blue-600 underline"
            onClick={() => setUser('signup')}
          >
            Sign Up
          </button>
        </p>
      </div>
    );
  }

  if (user === 'signup') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        <AuthForm mode="signup" onAuthSuccess={handleAuthSuccess} />
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button
            className="text-blue-600 underline"
            onClick={() => setUser(null)}
          >
            Login
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-white text-black max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <section className="mb-6">
        <TaskForm onSubmit={handleTaskSubmit} initialData={editingTask} />
        {editingTask && (
          <button
            onClick={() => setEditingTask(null)}
            className="mt-2 text-red-600 underline"
          >
            Cancel Edit
          </button>
        )}
      </section>

      <section className="mb-6">
        <div className="flex space-x-4 mb-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Personal">Personal</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </section>
    </div>
  );
};

export default HomePage;
