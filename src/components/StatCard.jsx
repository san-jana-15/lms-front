export default function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition font-jakarta border">
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 text-blue-600 p-3 rounded-2xl mr-4 text-xl">
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}
