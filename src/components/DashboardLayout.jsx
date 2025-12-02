// src/layouts/DashboardLayout.jsx
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ userRole = "student", children }) {
  const [open, setOpen] = useState(true);

  const menuItems = {
    student: ["Dashboard", "My Lessons", "Recordings", "Feedback"],
    tutor: ["Dashboard", "Schedule", "Earnings", "Reviews"],
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-jakarta">

      {/* Sidebar */}
      <aside
        className={`${open ? "w-64" : "w-20"} bg-white border-r shadow-lg transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h1 className="text-2xl font-extrabold text-purple-600">{open ? "LMS" : "L"}</h1>
          <button onClick={() => setOpen(!open)} className="lg:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {menuItems[userRole].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-gray-50 hover:bg-purple-100 text-gray-700 cursor-pointer transition font-medium"
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Body */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 capitalize">
            {userRole} Dashboard
          </h2>

          <button className="bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600">
            Logout
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}
