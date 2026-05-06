"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);


  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: "",
    project: "",
    assignedTo: "",
  });
  const [memberForm, setMemberForm] = useState({ projectId: "", members: [] });

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(saved);
    if (parsed.role !== "Admin") {
      router.push("/dashboard");
      return;
    }
    setUser(parsed);
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    const { data } = await API.get("/users");
    setUsers(data);
  };

  const fetchProjects = async () => {
    const { data } = await API.get("/projects");
    setProjects(data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    await API.post("/projects", projectForm);
    alert("Project created!");
    setProjectForm({ name: "", description: "" });
    fetchProjects();
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", taskForm);
      alert("Task created!");
      setTaskForm({ title: "", dueDate: "", project: "", assignedTo: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateMembers = async (e) => {
    e.preventDefault();
    await API.put(`/projects/${memberForm.projectId}/members`, {
      members: memberForm.members,
    });
    alert("Members updated!");
  };

  const inputStyle = {
    padding: "8px",
    width: "100%",
    marginBottom: "8px",
    boxSizing: "border-box",
  };
  const sectionStyle = {
    background: "#f5f5f5",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "24px", maxWidth: "700px" }}>
        <h2>Admin Panel</h2>

        {/* Create Project */}
        <div style={sectionStyle}>
          <h3>Create Project</h3>
          <form onSubmit={createProject}>
            <input
              style={inputStyle}
              placeholder="Project Name"
              value={projectForm.name}
              onChange={(e) =>
                setProjectForm({ ...projectForm, name: e.target.value })
              }
              required
            />
            <input
              style={inputStyle}
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({ ...projectForm, description: e.target.value })
              }
            />
            <button type="submit">Create Project</button>
          </form>
        </div>

        {/* Manage Members */}
        <div style={sectionStyle}>
          <h3>Manage Project Members</h3>
          <form onSubmit={updateMembers}>
            <select
              style={inputStyle}
              onChange={(e) =>
                setMemberForm({ ...memberForm, projectId: e.target.value })
              }
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              style={inputStyle}
              multiple
              onChange={(e) =>
                setMemberForm({
                  ...memberForm,
                  members: [...e.target.selectedOptions].map((o) => o.value),
                })
              }
            >
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple members</small>
            <br />
            <br />
            <button type="submit">Update Members</button>
          </form>
        </div>

        {/* Create Task */}
        <div style={sectionStyle}>
          <h3>Create Task</h3>
          <form onSubmit={createTask}>
            <input
              style={inputStyle}
              placeholder="Task Title"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              required
            />
            <input
              style={inputStyle}
              type="date"
              value={taskForm.dueDate}
              onChange={(e) =>
                setTaskForm({ ...taskForm, dueDate: e.target.value })
              }
              required
            />
            <select
              style={inputStyle}
              value={taskForm.project}
              onChange={(e) =>
                setTaskForm({ ...taskForm, project: e.target.value })
              }
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              style={inputStyle}
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({ ...taskForm, assignedTo: e.target.value })
              }
              required
            >
              <option value="">Assign To</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
            <button type="submit">Create Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}
