import { useState, useEffect } from 'react';
import './App.css';

interface Task {
  text: string;
  completed: boolean;
}

interface BitcoinPrice {
  USD: {
    code: string;
    symbol: string;
    rate: string;
    description: string;
    rate_float: number;
  };
  GBP: {
    code: string;
    symbol: string;
    rate: string;
    description: string;
    rate_float: number;
  };
  EUR: {
    code: string;
    symbol: string;
    rate: string;
    description: string;
    rate_float: number;
  };
}

function AddBitoc() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [btcPrice, setBtcPrice] = useState<BitcoinPrice | null>(null); 

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
    setTasks(savedTasks);
    
    fetchBitcoinPrice(); 
    
    const intervalId = setInterval(fetchBitcoinPrice, 1000); 
    
    return () => clearInterval(intervalId);
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

  async function fetchBitcoinPrice() 
  {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json'); // Api 
      const data = await response.json();
      setBtcPrice(data.bpi);
    } 
    catch (error) 
    {
      console.error('Ошибка получения данных о состоянии биткоина', error);
      setBtcPrice(null);
    }
  }

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
      <div className="bitcoin-price">
        {btcPrice ? (
          <div className="bitcoin-card">
            <h2>Цена Bitcoin:</h2>
            <div className="price-container">
            <span className="price-symbol">{btcPrice.USD.symbol}</span>
              <span className="price-value">
                {new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(btcPrice.USD.rate_float)}
              </span>
            </div>
          </div>
        ) : (
          <h2>Ошибка загрузки цены Bitcoin</h2>
        )}
      </div>
    </>
  );
}

export default AddBitoc;
