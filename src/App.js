import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { apiBaseUrl } from './config';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true });
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');

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
      const response = await axios.post(`${apiBaseUrl}/tasks`, { text: newTask, description: newDescription, completed: false });
      setTasks([...tasks, response.data]);
      setNewTask('');
      setNewDescription('');
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
      description: editDescription 
    });
    
    setEditingTask(null);
  };
  
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
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="task-box">
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
  );
}

export default App;