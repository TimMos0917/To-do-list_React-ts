import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';
import './App.css';

interface Task {
  text: string;
  completed: boolean;
}

interface BitcoinPrice {
  usd: number; 
}

function AddBitoc() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [btcPrice, setBtcPrice] = useState<BitcoinPrice | null>(null);
  const [taskInput, setTaskInput] = useState<string>('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]') as Task[];
    setTasks(savedTasks);

    fetchBitcoinPrice();

    const intervalId = setInterval(fetchBitcoinPrice, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  const addTask = () => {
    <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
    if (taskInput.trim() === '') {
      alert('Введите задачу!');
      return;
    }
    const newTask: Task = { text: taskInput, completed: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTaskInput('');
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

  async function fetchBitcoinPrice() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      setBtcPrice(data.bitcoin); 
    } catch (error) {
      console.error('Ошибка получения данных о состоянии биткоина', error);
      setBtcPrice(null);
    }
  }

  return (
    <Paper style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        To-Do List
      </Typography>
      <div className="add-container">
        <TextField
          label="Введите задачу"
          variant="outlined"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={addTask}>
          Добавить
        </Button>
      </div>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} button onClick={() => toggleTaskCompletion(index)}>
            <ListItemText primary={task.text} secondary={task.completed ? 'Завершено' : 'Не завершено'} />
            <Button onClick={(e) => { e.stopPropagation(); editTask(index); }} color="secondary">
              Изменить
            </Button>
            <Button onClick={(e) => { e.stopPropagation(); deleteTask(index); }} color="error">
              Удалить
            </Button>
          </ListItem>
        ))}
      </List>
      <div className="bitcoin-price">
        {btcPrice ? (
          <div className="bitcoin-card">
            <Typography variant="h6">Цена Bitcoin:</Typography>
            <Typography variant="h5">
            ${new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2 }).format(btcPrice.usd)}
            </Typography>
          </div>
        ) : (
          <Typography variant="h6" color="error">Ошибка загрузки цены Bitcoin</Typography>
        )}
      </div>
    </Paper>
  );
}

export default AddBitoc;
