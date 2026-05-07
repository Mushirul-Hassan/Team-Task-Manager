"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar({ user }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/dashboard/projects" },
    ...(user?.role === "Admin"
      ? [{ label: "Admin Panel", href: "/dashboard/admin" }]
      : []),
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-white font-bold text-lg">TaskManager</span>
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                pathname === link.href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-white text-sm font-medium">{user?.name}</p>
          <p className="text-gray-500 text-xs">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
