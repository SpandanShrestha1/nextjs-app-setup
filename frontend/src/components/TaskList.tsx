"use client";

import React from 'react';

interface TaskListProps {
  tasks: any[];
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  if (tasks.length === 0) {
    return <p className="text-center mt-4">No tasks found.</p>;
  }

  return (
    <ul className="max-w-3xl mx-auto space-y-4">
      {tasks.map((task) => (
        <li key={task._id} className="border rounded p-4 flex justify-between items-center">
          <div>
            <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-600">
              Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date'}
            </p>
            <p className="text-sm text-gray-600">
              Priority: <span className={`font-semibold ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{task.priority}</span>
            </p>
            <p className="text-sm text-gray-600">Category: {task.category}</p>
          </div>
          <div className="space-x-2 flex items-center">
            <button
              onClick={() => onToggleComplete(task)}
              className={`px-3 py-1 rounded ${task.completed ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
            >
              {task.completed ? 'Completed' : 'Mark Complete'}
            </button>
            <button
              onClick={() => onEdit(task)}
              className="px-3 py-1 bg-black text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
