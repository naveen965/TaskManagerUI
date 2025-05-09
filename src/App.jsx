import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, CardActions, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';

const BASE_URL = 'https://localhost:4000/api/Tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newCreatedDate, setNewCreatedDate] = useState(null);
  const [newDueDate, setNewDueDate] = useState(null);
  const [selectTask, setSelectTask] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (task) => {
    setSelectTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectTask(null);
    setOpen(false);
  };

  const createTask = async () => {
    if (!newTitle || !newPriority || !newStatus) return toast.error('Please fill out both fields');
    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        priority: newPriority,
        status : newStatus,
        createdDate : newCreatedDate,
        dueDate : newDueDate
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    setTasks([...tasks, data]);
    clearTextFieldState();
    toast.success('Task created successfully');
  }

  const updateTask = async (id) => {
    if (!selectTask.title || !selectTask.priority || !selectTask.status) return toast.error('Please fill out both fields');
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(selectTask),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    setTasks(tasks.map(task => (task.id === id ? data : task)));
    toast.success('Task updated successfully');
    handleClose();
  }

  const clearTextFieldState = () => {
    setNewTitle('');
    setNewDescription('');
    setNewPriority('');
    setNewStatus('');
    setNewCreatedDate(null);
    setNewDueDate(null);
  }

  const deleteTask = async (id) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h5" gutterBottom>Create New Task</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Title"
              variant="outlined"
              size="small"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Priority"
              variant="outlined"
              size="small"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Status"
              variant="outlined"
              size="small"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Created Date"
              variant="outlined"
              size="small"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={newCreatedDate}
              onChange={(e) => setNewCreatedDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Due Date"
              variant="outlined"
              size="small"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={createTask}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" gutterBottom>All Task List</Typography>
      {tasks.map((task) => (
        <Card key={task.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Title : {task.title}</Typography>
            <Typography variant="body2" color="text.secondary">Description : {task.description}</Typography>
            <Typography variant="body2" color="text.secondary">Priority : {task.priority}</Typography>
            <Typography variant="body2" color="text.secondary">Status : {task.status}</Typography>
            <Typography variant="body2" color="text.secondary">Created Date : {task.createdDate}</Typography>
            <Typography variant="body2" color="text.secondary">Due Date : {task.dueDate}</Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' size="small" onClick={() => handleClickOpen(task)}>Update</Button>
            <Button variant='contained' size="small" color="error" onClick={() => deleteTask(task.id)}>Delete</Button>
          </CardActions>
        </Card>
      ))}

      <Dialog open={open}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Title"
                variant="outlined"
                size="small"
                value={selectTask?.title || ''}
                onChange={(e) => setSelectTask({ ...selectTask, title: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Description"
                variant="outlined"
                size="small"
                value={selectTask?.description || ''}
                onChange={(e) => setSelectTask({ ...selectTask, description: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Priority"
                variant="outlined"
                size="small"
                value={selectTask?.priority || ''}
                onChange={(e) => setSelectTask({ ...selectTask, priority: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Status"
                variant="outlined"
                size="small"
                value={selectTask?.status || ''}
                onChange={(e) => setSelectTask({ ...selectTask, status: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Created Date"
                variant="outlined"
                size="small"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={selectTask?.createdDate || ''}
                onChange={(e) => setSelectTask({ ...selectTask, createdDate: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Due Date"
                variant="outlined"
                size="small"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={selectTask?.dueDate || ''}
                onChange={(e) => setSelectTask({ ...selectTask, dueDate: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="medium" color="warning" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" size="medium" color="primary" onClick={() => updateTask(selectTask.id)}>Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App
