const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  createTask,
  getDashboard,
  getTaskById,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", protect, adminOnly, createTask);
router.get("/dashboard", protect, getDashboard);
router.get("/", protect, getTasksByProject);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, adminOnly, updateTask);
router.put("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
