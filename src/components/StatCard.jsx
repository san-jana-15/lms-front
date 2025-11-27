export default function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
