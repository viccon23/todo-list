import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { apiBaseUrl } from './config';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');

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
  
  return (
    <div className="App">
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
            <h3>{task.text}</h3>
            <p>{task.description}</p>
            <div className="task-buttons">
              <button onClick={() => updateTask(task._id, { ...task, completed: !task.completed })}>
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;