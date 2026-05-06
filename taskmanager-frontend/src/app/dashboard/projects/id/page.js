"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(saved));
    fetchProject();
    fetchTasks();
  }, []);

  const fetchProject = async () => {
    const { data } = await API.get(`/projects/${id}`);
    setProject(data);
  };

  const fetchTasks = async () => {
    const { data } = await API.get(`/tasks?project=${id}`);
    setTasks(data);
  };

  const updateStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}/status`, { status });
    fetchTasks();
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "24px" }}>
        <h2>{project.name}</h2>
        <p style={{ color: "#666" }}>{project.description}</p>
        <p>
          <strong>Members:</strong>{" "}
          {project.teamMembers.map((m) => m.name).join(", ") || "None"}
        </p>

        <h3 style={{ marginTop: "24px" }}>Tasks</h3>
        <div style={{ display: "grid", gap: "12px" }}>
          {tasks.length === 0 && <p>No tasks in this project.</p>}
          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <strong>{task.title}</strong>
              <p style={{ fontSize: "14px" }}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p style={{ fontSize: "14px" }}>
                Assigned to: {task.assignedTo?.name}
              </p>
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
