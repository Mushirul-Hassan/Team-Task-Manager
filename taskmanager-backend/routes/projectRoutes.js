const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMembers,
} = require("../controllers/projectController");

router.post("/", protect, adminOnly, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);
router.put("/:id/members", protect, adminOnly, updateMembers);

module.exports = router;
