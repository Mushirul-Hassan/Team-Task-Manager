"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(saved));
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks/dashboard");
      setTasks(data);
    } catch {
      router.push("/login");
    }
  };

  const updateStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}/status`, { status });
    fetchTasks();
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "24px" }}>
        <h2>My Tasks</h2>
        <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
          {tasks.length === 0 && <p>No tasks assigned.</p>}
          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                border: `1px solid ${task.isOverdue ? "red" : "#ccc"}`,
                padding: "16px",
                borderRadius: "8px",
                background: task.isOverdue ? "#fff5f5" : "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{task.title}</strong>
                {task.isOverdue && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    ⚠ Overdue
                  </span>
                )}
              </div>
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
                Project: {task.project?.name} | Due:{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p style={{ margin: "4px 0", fontSize: "14px" }}>
                Assigned to: {task.assignedTo?.name}
              </p>
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                style={{ marginTop: "8px", padding: "4px" }}
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
