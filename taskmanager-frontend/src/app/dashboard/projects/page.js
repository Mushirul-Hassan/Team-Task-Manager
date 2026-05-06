"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/axios";
import Navbar from "@/components/Navbar";

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

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
    const { data } = await API.get("/projects");
    setProjects(data);
  };

  return (
    <div>
      <Navbar user={user} />
      <div style={{ padding: "24px" }}>
        <h2>Projects</h2>
        <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
          {projects.length === 0 && <p>No projects found.</p>}
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => router.push(`/dashboard/projects/${project._id}`)}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <strong>{project.name}</strong>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {project.description}
              </p>
              <p style={{ fontSize: "13px" }}>
                Members:{" "}
                {project.teamMembers.map((m) => m.name).join(", ") || "None"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
