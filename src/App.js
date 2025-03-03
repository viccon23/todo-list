import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { apiBaseUrl } from './config';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTaskType, setNewTaskType] = useState('Other');
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true });
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTaskType, setEditTaskType] = useState('Other');

  useEffect(() => {
    // Check MongoDB connection status
    const checkConnectionStatus = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/status`);
        setDbStatus({ connected: response.data.connected, checking: false });
      } catch (error) {
        setDbStatus({ connected: false, checking: false });
        console.error("Error checking connection status:", error);
      }
    };
    // Initial check
    checkConnectionStatus();
    
    // Set up periodic checking (every 30 seconds)
    const statusInterval = setInterval(checkConnectionStatus, 30000);
    
    // Cleanup
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === "") {
      console.log("Please enter a task");
      return;
    }
  
    try {
      const response = await axios.post(`${apiBaseUrl}/tasks`, { text: newTask, description: newDescription, completed: false, type: newTaskType });
      setTasks([...tasks, response.data]);
      // Reset to default
      setNewTask('');
      setNewDescription('');
      setNewTaskType('Other'); 
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };
  
  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditText(task.text);
    setEditDescription(task.description);
    setEditTaskType(task.type || 'Other');
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingTask(null);
    setEditText('');
    setEditDescription('');
  };
  
  // Save edited task
  const saveEdit = async (id) => {
    if (editText.trim() === '') {
      return;
    }
    
    await updateTask(id, { 
      text: editText, 
      description: editDescription,
      type: editTaskType
    });
    
    setEditingTask(null);
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    const type = task.type || 'Other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(task);
    return groups;
  }, {});

  // Define the order based on schema
  const typeOrder = ['Personal', 'Work', 'School', 'Research', 'Health', 'Other'];
  
  return (
    <div className="App">
      <div className="db-status-indicator">
        {dbStatus.checking ? (
          <span className="checking">Checking database connection...</span>
        ) : dbStatus.connected ? (
          <span className="connected">✅ Connected to Database</span>
        ) : (
          <span className="disconnected">❌ Database disconnected</span>
        )}
      </div>
      <h1 className="TODOLIST">Todo List</h1>
      <div className="add-task-container">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <textarea
          value={newDescription}
          onChange={handleDescriptionChange}
          placeholder="Description"
        />
        <select
          value={newTaskType}
          onChange={(e) => setNewTaskType(e.target.value)}
          className="task-type-select"
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="School">School</option>
          <option value="Research">Research</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="tasks-container">
      {typeOrder
        .filter(type => groupedTasks[type] && groupedTasks[type].length > 0)
        .map((taskType) => (
          <div key={taskType} className="task-type-section">
            <h2 className="task-type-heading">{taskType}</h2>
            <ul>
              {groupedTasks[taskType].map((task) => (
                <li key={task._id} className={`task-box task-type-${task.type?.toLowerCase() || 'other'}`}>
                    {editingTask === task._id ? (
                // Editing mode
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-input"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="edit-textarea"
                      />
                      <select
                        value={editTaskType}
                        onChange={(e) => setEditTaskType(e.target.value)}
                        className="edit-task-type-select"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="School">School</option>
                        <option value="Research">Research</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="task-buttons">
                        <button onClick={() => saveEdit(task._id)}>Save</button>
                        <button onClick={cancelEditing}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <h3>{task.text}</h3>
                      <p className="task-description">{task.description}</p>
                      <div className="task-buttons">
                        <button onClick={() => updateTask(task._id, { ...task, completed: !task.completed })}>
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button onClick={() => startEditing(task)}>Edit</button>
                        <button onClick={() => deleteTask(task._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;