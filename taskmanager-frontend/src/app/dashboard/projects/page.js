"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(saved));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p className="text-gray-500">No projects found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() =>
                  router.push(`/dashboard/projects/${project._id}`)
                }
                className="bg-gray-900 border border-gray-800 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold group-hover:text-indigo-400 transition">
                    {project.name}
                  </h3>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                    {project.teamMembers.length} members
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.teamMembers.slice(0, 4).map((m) => (
                    <span
                      key={m._id}
                      className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full"
                    >
                      {m.name}
                    </span>
                  ))}
                  {project.teamMembers.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{project.teamMembers.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
