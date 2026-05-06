"use client";
import { useRouter } from "next/navigation";

export default function Navbar({ user }) {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#1a1a2e",
        color: "white",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </a>
        <a
          href="/dashboard/projects"
          style={{ color: "white", textDecoration: "none" }}
        >
          Projects
        </a>
        {user?.role === "Admin" && (
          <a
            href="/dashboard/admin"
            style={{ color: "white", textDecoration: "none" }}
          >
            Admin Panel
          </a>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span>
          {user?.name} ({user?.role})
        </span>
        <button
          onClick={logout}
          style={{ padding: "6px 14px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
