// src/pages/index.tsx
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Plus, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: 'Learn Next.js',
      description: 'Complete the official Next.js tutorial',
      status: 'in-progress',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      title: 'Design UI',
      description: 'Create wireframes for the task management app',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority']
  });

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: uuidv4(),
      ...newTask,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="text-red-500" />;
      case 'medium': return <Clock className="text-yellow-500" />;
      case 'low': return <ClipboardList className="text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Task Management</h1>
        
        {/* New Task Input */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex space-x-4 mb-4">
            <input 
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="flex-grow border rounded-md p-2"
            />
            <select 
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
              className="border rounded-md p-2"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button 
              onClick={addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-600"
            >
              <Plus className="mr-2" /> Add Task
            </button>
          </div>
          <textarea 
            placeholder="Task Description (Optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            className="w-full border rounded-md p-2"
            rows={2}
          />
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {getPriorityIcon(task.priority)}
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-500 text-sm">{task.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className={`p-2 rounded-full ${
                    task.status === 'todo' ? 'bg-gray-200' :
                    task.status === 'in-progress' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}
                >
                  {task.status === 'todo' && <ClipboardList className="text-gray-500" />}
                  {task.status === 'in-progress' && <Clock className="text-yellow-500" />}
                  {task.status === 'done' && <CheckCircle2 className="text-green-500" />}
                </button>
                <button className="text-blue-500 hover:bg-blue-100 p-2 rounded-full">
                  <Edit2 />
                </button>
                <button className="text-red-500 hover:bg-red-100 p-2 rounded-full">
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}