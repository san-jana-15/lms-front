import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ userRole = "student", children }) {
  const [open, setOpen] = useState(true);

  const menuItems = {
    student: [
      { name: "Dashboard", href: "#" },
      { name: "My Lessons", href: "#" },
      { name: "Recordings", href: "#" },
      { name: "Feedback", href: "#" },
    ],
    tutor: [
      { name: "Dashboard", href: "#" },
      { name: "Schedule", href: "#" },
      { name: "Earnings", href: "#" },
      { name: "Reviews", href: "#" },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-64" : "w-16"
        } bg-white border-r transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">
            {open ? "LMS" : "L"}
          </h1>
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems[userRole].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block p-2 rounded-lg text-gray-700 hover:bg-blue-100"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {userRole} dashboard
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Logout
          </button>
        </header>
        {children}
      </main>
    </div>
  );
}
