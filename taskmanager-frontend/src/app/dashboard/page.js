"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

const statusColors = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Completed: "bg-green-500/10 text-green-400 border-green-500/30",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}/status`, { status });
    fetchTasks();
  };

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const overdue = tasks.filter((t) => t.isOverdue).length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tasks", value: total, color: "text-white" },
            { label: "In Progress", value: inProgress, color: "text-blue-400" },
            { label: "Completed", value: completed, color: "text-green-400" },
            { label: "Overdue", value: overdue, color: "text-red-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tasks */}
        <h3 className="text-lg font-semibold text-white mb-4">My Tasks</h3>
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-500">No tasks assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-gray-900 border rounded-xl p-4 flex items-center justify-between gap-4 ${
                  task.isOverdue ? "border-red-500/40" : "border-gray-800"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-medium">{task.title}</p>
                    {task.isOverdue && (
                      <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {task.project?.name} · Due{" "}
                    {new Date(task.dueDate).toLocaleDateString()} ·{" "}
                    {task.assignedTo?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs border px-2 py-1 rounded-full ${statusColors[task.status]}`}
                  >
                    {task.status}
                  </span>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
