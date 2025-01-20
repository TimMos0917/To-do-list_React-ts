import { useState, useEffect } from 'react';
import './App.css';

interface Task {
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
    setTasks(savedTasks);
  }, []);

  const addTask = () => {
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    const taskText = taskInput.value.trim();
    if (taskText === '') {
      alert('Введите задачу!');
      return;
    }
    const newTask: Task = { text: taskText, completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    taskInput.value = '';
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const editTask = (index: number) => {
    const newTaskText = prompt('Измените задачу:', tasks[index].text);
    if (newTaskText !== null && newTaskText.trim() !== '') {
      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: newTaskText } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <>
      <h1>To-Do List</h1>
      <div className="add-container">
        <input type="text" id="taskInput" placeholder="Введите задачу" />
        <button onClick={addTask}>Добавить</button>
      </div>
      <ul id="taskList">
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''} onClick={() => toggleTaskCompletion(index)}>
            {task.text}
            <div>
              <button onClick={(e) => { e.stopPropagation(); editTask(index); }}>Изменить</button>
              <button onClick={(e) => { e.stopPropagation(); deleteTask(index); }} className="delete-button">Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
