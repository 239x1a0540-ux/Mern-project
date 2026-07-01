export default function CustomerOverview({ services, setActive, userName }) {
  const total = services.length;
  const pending = services.filter(s => s.status === "pending").length;
  const activeCount = services.filter(s => s.status === "progress").length;
  const completed = services.filter(s => s.status === "completed").length;

  const totalSpent = services.reduce((sum, svc) => sum + (svc.cost || 0), 0);

  const getCompletionDate = (item) => {
    if (item.status === "completed" && item.updatedAt) {
      const d = new Date(item.updatedAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      }
    }
    return "—";
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 w-full">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-[1.5rem] p-6 shadow-sm">
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome back, {userName}! 👋</h2>
          <p className="text-gray-500 mt-2 max-w-xl text-sm">
            You have <span className="text-orange-600 font-bold underline decoration-orange-200">{pending} pending service{pending !== 1 ? 's' : ''}</span> scheduled. Stay on top of your vehicle's health with ease.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -right-10 top-0 opacity-10">
          <iconify-icon icon="lucide:settings-2" class="text-[10rem] text-orange-900 rotate-12"></iconify-icon>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <iconify-icon icon="lucide:book-open" class="text-xl"></iconify-icon>
            </div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Lifetime</span>
          </div>
          <div className="mt-3">
            <h3 className="text-gray-500 text-xs font-medium">Total Bookings</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-blue-600 font-medium mt-1.5 flex items-center">
              All time history
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <iconify-icon icon="lucide:clock" class="text-xl"></iconify-icon>
            </div>
            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Active</span>
          </div>
          <div className="mt-3">
            <h3 className="text-gray-500 text-xs font-medium">Pending Tasks</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{pending.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-gray-400 mt-1.5">Awaiting your action</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <iconify-icon icon="lucide:loader" class="text-xl animate-[spin_3s_linear_infinite]"></iconify-icon>
            </div>
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Live</span>
          </div>
          <div className="mt-3">
            <h3 className="text-gray-500 text-xs font-medium">In Progress</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeCount.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-gray-400 mt-1.5">Currently in service</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <iconify-icon icon="lucide:check-circle" class="text-xl"></iconify-icon>
            </div>
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Done</span>
          </div>
          <div className="mt-3">
            <h3 className="text-gray-500 text-xs font-medium">Completed</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{completed.toString().padStart(2, '0')}</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-1.5">Successfully done</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Bookings</h3>
              <p className="text-[11px] text-gray-500">Latest update on your service schedule</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                {Math.min(services.length, 5)} of {services.length} records
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {services.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <iconify-icon icon="lucide:calendar-x" class="text-2xl"></iconify-icon>
                </div>
                <h4 className="text-gray-900 font-bold mb-1 text-sm">No bookings yet</h4>
                <p className="text-xs text-gray-500">Book your first vehicle service to get started!</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.slice(0, 5).map((s, i) => (
                    <tr key={s._id || i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4 text-xs font-medium text-gray-400">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                            <iconify-icon icon="lucide:car-front" class="text-sm"></iconify-icon>
                          </div>
                          <span className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {s.vehicle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">{s.type}</td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-gray-900">{s.date}</p>
                        {s.status === "completed" && (
                          <p className="text-[10px] text-emerald-500 mt-0.5">Done: {getCompletionDate(s)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {s.status === "completed" && (
                          <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Completed
                          </span>
                        )}
                        {s.status === "progress" && (
                          <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
                            In Progress
                          </span>
                        )}
                        {s.status === "pending" && (
                          <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <button 
              onClick={() => setActive("bookings")}
              className="text-[10px] font-bold text-gray-400 hover:text-orange-600 uppercase tracking-widest transition-colors"
            >
              See all history
            </button>
          </div>
        </div>

        {/* Sidebar Components */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActive("book")}
                  className="flex items-center justify-center space-x-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 group text-sm"
                >
                  <iconify-icon icon="lucide:plus-circle" class="text-lg group-hover:rotate-90 transition-transform"></iconify-icon>
                  <span>Book Service</span>
                </button>
                <button 
                  onClick={() => setActive("bookings")}
                  className="flex items-center justify-center space-x-2 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm"
                >
                  <iconify-icon icon="lucide:list" class="text-lg"></iconify-icon>
                  <span>All Bookings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Spending Summary */}
          <div className="bg-[#111827] p-6 rounded-[1.5rem] border border-gray-800 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Spent</span>
                <iconify-icon icon="lucide:credit-card" class="text-orange-500 text-lg"></iconify-icon>
              </div>
              <p className="text-3xl font-extrabold tracking-tight">₹{totalSpent.toLocaleString("en-IN")}</p>
              <p className="text-xs text-gray-400 mt-1.5">Across {services.length} active booking(s)</p>
              
              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                <button 
                  onClick={() => setActive("wallet")}
                  className="text-[10px] font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest flex items-center group"
                >
                  Details 
                  <iconify-icon icon="lucide:chevron-right" class="ml-1 group-hover:translate-x-1 transition-transform"></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
