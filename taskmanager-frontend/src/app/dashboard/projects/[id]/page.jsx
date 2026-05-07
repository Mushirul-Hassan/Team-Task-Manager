"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

const statusColors = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Completed: "bg-green-500/10 text-green-400 border-green-500/30",
};

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

  if (!project)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-white text-sm mb-6 transition"
        >
          ← Back
        </button>

        {/* Project Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          <p className="text-gray-400 mt-1">
            {project.description || "No description."}
          </p>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.teamMembers.map((m) => (
              <span
                key={m._id}
                className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-full"
              >
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <h3 className="text-lg font-semibold text-white mb-4">
          Tasks{" "}
          <span className="text-gray-500 font-normal text-base">
            ({tasks.length})
          </span>
        </h3>
        {tasks.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-500">No tasks in this project.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Assigned to {task.assignedTo?.name} · Due{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
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
