const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-slate-800">
          Admin Dashboard
        </h1>
        <div className="h-9 w-9 rounded-full bg-slate-300" />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-3xl font-semibold text-slate-800">Not updated </h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
