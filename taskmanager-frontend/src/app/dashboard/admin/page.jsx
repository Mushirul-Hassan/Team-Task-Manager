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
  const [activeTab, setActiveTab] = useState("project");

  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [taskForm, setTaskForm] = useState({
    title: "",
    dueDate: "",
    project: "",
    assignedTo: "",
  });
  const [memberForm, setMemberForm] = useState({ projectId: "", members: [] });
  const [message, setMessage] = useState(null);

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

  const notify = (msg, type = "success") => {
    setMessage({ msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", projectForm);
      notify("Project created successfully!");
      setProjectForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      notify(err.response?.data?.message || "Failed", "error");
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", taskForm);
      notify("Task created successfully!");
      setTaskForm({ title: "", dueDate: "", project: "", assignedTo: "" });
    } catch (err) {
      notify(err.response?.data?.message || "Failed", "error");
    }
  };

  const updateMembers = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/projects/${memberForm.projectId}/members`, {
        members: memberForm.members,
      });
      notify("Members updated!");
    } catch (err) {
      notify(err.response?.data?.message || "Failed", "error");
    }
  };

  const tabs = [
    { key: "project", label: "Create Project" },
    { key: "members", label: "Manage Members" },
    { key: "task", label: "Create Task" },
  ];

  const inputClass =
    "w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition";
  const labelClass = "block text-sm text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Panel</h2>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-green-500/10 border-green-500/30 text-green-400"
            }`}
          >
            {message.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm rounded-lg transition font-medium ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          {/* Create Project */}
          {activeTab === "project" && (
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className={labelClass}>Project Name</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Website Redesign"
                  value={projectForm.name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  placeholder="What is this project about?"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                Create Project
              </button>
            </form>
          )}

          {/* Manage Members */}
          {activeTab === "members" && (
            <form onSubmit={updateMembers} className="space-y-4">
              <div>
                <label className={labelClass}>Select Project</label>
                <select
                  className={inputClass}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, projectId: e.target.value })
                  }
                  required
                >
                  <option value="">Choose a project...</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Select Members{" "}
                  <span className="text-gray-600">
                    (Hold Ctrl/Cmd for multiple)
                  </span>
                </label>
                <select
                  className={`${inputClass} h-40`}
                  multiple
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      members: [...e.target.selectedOptions].map(
                        (o) => o.value,
                      ),
                    })
                  }
                >
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {u.role}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                Update Members
              </button>
            </form>
          )}

          {/* Create Task */}
          {activeTab === "task" && (
            <form onSubmit={createTask} className="space-y-4">
              <div>
                <label className={labelClass}>Task Title</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Design homepage mockup"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Due Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Project</label>
                <select
                  className={inputClass}
                  value={taskForm.project}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, project: e.target.value })
                  }
                  required
                >
                  <option value="">Choose a project...</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Assign To</label>
                <select
                  className={inputClass}
                  value={taskForm.assignedTo}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, assignedTo: e.target.value })
                  }
                  required
                >
                  <option value="">Choose a member...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                Create Task
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
