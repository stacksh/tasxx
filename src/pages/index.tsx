
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Plus, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit2, 
  Trash2,
  Filter,
  SortDesc,
  Search,
  CalendarDays
} from 'lucide-react';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Task['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority'>('createdAt');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority']
  });


  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const updateTaskStatus = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const statusFlow: Task['status'][] = ['todo', 'in-progress', 'done'];
        const currentIndex = statusFlow.indexOf(task.status);
        const newStatus = statusFlow[(currentIndex + 1) % statusFlow.length];
        return { 
          ...task, 
          status: newStatus,
          updatedAt: new Date()
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredAndSortedTasks = tasks
    .filter(task => 
      (filter === 'all' || task.status === filter) &&
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }

      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-600';
      case 'in-progress': return 'bg-yellow-100 text-yellow-600';
      case 'done': return 'bg-green-100 text-green-600';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="text-red-500" />;
      case 'medium': return <Clock className="text-yellow-500" />;
      case 'low': return <ClipboardList className="text-green-500" />;
    }
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Task</h2>
              <div className="space-y-4">
                <input 
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <textarea 
                  placeholder="Task Description (Optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as Task['priority']})}
                    className="flex-grow border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <button 
                    onClick={addTask}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition flex items-center space-x-2"
                  >
                    <Plus /> <span>Add Task</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Task Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <ClipboardList className="text-gray-500" />
                    <span>To Do</span>
                  </div>
                  <span className="font-bold">{taskStats.todo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-yellow-500" />
                    <span>In Progress</span>
                  </div>
                  <span className="font-bold">{taskStats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="text-green-500" />
                    <span>Completed</span>
                  </div>
                  <span className="font-bold">{taskStats.done}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <div className="flex space-x-4">
                <div className="relative flex-grow">
                  <input 
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as Task['status'] | 'all')}
                  className="border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'priority')}
                  className="border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="priority">Sort by Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAndSortedTasks.length === 0 ? (
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center text-gray-500">
                  No tasks found. Start by creating a new task!
                </div>
              ) : (
                filteredAndSortedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white shadow-lg rounded-2xl p-4 flex items-center justify-between hover:shadow-xl transition"
                  >
                    <div className="flex items-center space-x-4">
                      {getPriorityIcon(task.priority)}
                      <div>
                        <h3 className="font-semibold text-gray-800">{task.title}</h3>
                        {task.description && (
                          <p className="text-gray-500 text-sm">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                          <CalendarDays size={14} />
                          <span>{task.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateTaskStatus(task.id)}
                        className={`p-2 rounded-full ${getStatusColor(task.status)}`}
                      >
                        {task.status === 'todo' && <ClipboardList />}
                        {task.status === 'in-progress' && <Clock />}
                        {task.status === 'done' && <CheckCircle2 />}
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}