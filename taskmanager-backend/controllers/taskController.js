const { Task } = require('../models/task');
const { Project } = require('../models/project');

const createTask = async (req, res) => {
  try {
    const { project, assignedTo } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ message: 'Project not found' });

    
    if (assignedTo && !projectDoc.teamMembers.some(m => m.equals(assignedTo))) {
      return res.status(400).json({ message: 'Assigned user is not a member of this project' });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name');

    const now = new Date();

    
    const tasksWithOverdue = tasks.map(task => ({
      ...task.toObject(),
      isOverdue: task.status !== 'Completed' && task.dueDate < now
    }));

    res.json(tasksWithOverdue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    
    if (req.user.role !== 'Admin' && !task.assignedTo?._id.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const filter = { project: req.query.project };
    if (req.user.role !== 'Admin') filter.assignedTo = req.user._id;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

  
    if (req.user.role !== 'Admin' && !task.assignedTo?.equals(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getDashboard, getTaskById, getTasksByProject, updateTask, updateTaskStatus, deleteTask };