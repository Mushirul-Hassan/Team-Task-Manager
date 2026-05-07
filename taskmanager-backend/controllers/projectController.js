const { Project } = require('../models/project');
const { User } = require('../models/user');

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { teamMembers: req.user._id };
    const projects = await Project.find(filter).populate('teamMembers', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('teamMembers', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    
    if (req.user.role !== 'Admin' && !project.teamMembers.some(m => m._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMembers = async (req, res) => {
  try {
    
    const { members } = req.body;

    
    const users = await User.find({ _id: { $in: members } });
    if (users.length !== members.length) {
      return res.status(400).json({ message: 'One or more user IDs are invalid' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { teamMembers: members },
      { new: true }
    ).populate('teamMembers', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, updateMembers };