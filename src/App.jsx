import React, { useState, useRef, useEffect } from 'react';
import { FaRegEdit, FaTrash } from 'react-icons/fa';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [filter, setFilter] = useState('all');

  const taskTitle = useRef('');
  const taskSummary = useRef('');

  const createTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      completed: false,
      priority: 'low'
    };

    setTasks([...tasks, newTask]);

    taskTitle.current.value = '';
    taskSummary.current.value = '';

    saveTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const editTask = (id, updatedTask) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const loadTasks = () => {
    const loadedTasks = localStorage.getItem('tasks');
    const tasks = JSON.parse(loadedTasks);
    if (tasks) {
      setTasks(tasks);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className={`container mt-5`}>
      {/* Modal */}
      <div className='modal fade' id='exampleModal' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>{opened ? 'Edit Task' : 'New Task'}</h5>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <input type='text' className='form-control mb-3' ref={taskTitle} placeholder='Task Title' defaultValue={opened ? opened.title : ''} required />
              <input type='text' className='form-control mb-3' ref={taskSummary} placeholder='Task Summary' defaultValue={opened ? opened.summary : ''} />
              <select className='form-select mb-3' defaultValue={opened ? opened.priority : 'low'}>
                <option value='low'>Low Priority</option>
                <option value='medium'>Medium Priority</option>
                <option value='high'>High Priority</option>
              </select>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cancel</button>
              <button type='button' className='btn btn-primary' onClick={() => {
                if (opened) {
                  editTask(opened.id, {
                    title: taskTitle.current.value,
                    summary: taskSummary.current.value
                  });
                  setOpened(false);
                } else {
                  createTask();
                }
              }}>{opened ? 'Save Changes' : 'Create Task'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <h1 className='mb-4'>My Tasks</h1>
      <div className='mb-3'>
        <button type='button' className='btn btn-primary me-2 mb-lg-0 mb-3' data-bs-toggle='modal' data-bs-target='#exampleModal'>New Task</button>
        <div className='btn-group'>
          <button type='button' className={`btn btn-outline-secondary ${filter === 'all' && 'active'}`} onClick={() => setFilter('all')}>All</button>
          <button type='button' className={`btn btn-outline-secondary ${filter === 'low' && 'active'}`} onClick={() => setFilter('low')}>Low Priority</button>
          <button type='button' className={`btn btn-outline-secondary ${filter === 'medium' && 'active'}`} onClick={() => setFilter('medium')}>Medium Priority</button>
          <button type='button' className={`btn btn-outline-secondary ${filter === 'high' && 'active'}`} onClick={() => setFilter('high')}>High Priority</button>
        </div>

      </div>
      {tasks.length > 0 ? (
        tasks.filter(task => filter === 'all' || task.priority === filter).map(task => (
          <div className={`card mb-3`} key={task.id}>
            <div className='card-body d-lg-flex justify-content-between align-items-center'>
              <div className='flex-grow-1'>
                <h5 className={`card-title ${task.completed ? 'text-decoration-line-through' : ''}`}>{task.title}</h5>
                <p className='card-text'>{task.summary}</p>
              </div>
              <div className='d-flex align-items-center mt-4'>
                <span className={`badge bg-${task.priority === 'low' ? 'info' : task.priority === 'medium' ? 'warning' : 'danger'} me-2`}>{task.priority}</span>
                <div>
                  <button className='btn btn-success me-2' onClick={() => toggleTaskCompletion(task.id)}>{task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                  <button className='btn btn-primary me-2' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick={() => setOpened(task)}><FaRegEdit /></button>
                  <button className='btn btn-danger' onClick={() => deleteTask(task.id)}><FaTrash /></button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className='text-muted'>You have no tasks</p>
      )}

    </div>
  );
}

export default App;
