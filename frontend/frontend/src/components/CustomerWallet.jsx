import { useState } from "react";

function getSpendingMetrics(services) {
  let monthly = 0;
  let yearly = 0;
  let lifetime = 0;
  let completedCount = 0;

  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  services.forEach(s => {
    // Only count completed bookings for actual spent money
    const cost = parseFloat(s.cost) || 0;
    
    // Parse date: Use updatedAt for completed services as it represents the completion date
    let dateToParse = s.date;
    if (s.status === "completed" && s.updatedAt) {
      dateToParse = s.updatedAt;
    }

    let d = new Date(dateToParse);
    if (isNaN(d.getTime())) {
      const parts = String(dateToParse).split(/[\s/\-]+/);
      if (parts.length === 3) {
        const year = parseInt(parts[2]);
        const monthStr = parts[1];
        let month = parseInt(parts[1]) - 1;
        if (isNaN(month)) {
          const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
          month = months.indexOf(monthStr.toLowerCase().substring(0, 3));
        }
        if (year > 1000 && month >= 0 && month <= 11) {
          d = new Date(year, month, 1);
        }
      }
    }

    if (s.status === "completed") {
      completedCount++;
      lifetime += cost;
      if (!isNaN(d.getTime())) {
        if (d.getFullYear() === currentYear) {
          yearly += cost;
          if (d.getMonth() === currentMonth) {
            monthly += cost;
          }
        }
      } else {
        // Fallback to yearly if parsing fails but it exists
        yearly += cost;
      }
    }
  });

  return { monthly, yearly, lifetime, completedCount };
}

export default function CustomerWallet({ services = [] }) {
  const { monthly, yearly, lifetime, completedCount } = getSpendingMetrics(services);

  // Filter completed services for transactional history
  const completedServices = services.filter(s => s.status === "completed");

  const formatCompletionDate = (s) => {
    if (s.updatedAt) {
      const d = new Date(s.updatedAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      }
    }
    return s.date;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5 w-full">
      
      {/* Lifetime Service Spending Banner */}
      <div className="bg-[#111827] rounded-[1.5rem] p-6 relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase mb-1">Lifetime Service Spending</p>
            <h2 className="text-white text-3xl font-black tracking-tight">
              ₹{lifetime.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center space-x-1.5 mt-3 text-gray-400 text-[11px] font-medium">
              <iconify-icon icon="lucide:info" class="text-orange-500 text-sm"></iconify-icon>
              <span>Active Bookings Count: <span className="text-white font-bold">{services.filter(s => s.status !== "completed").length}</span></span>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm p-3 rounded-xl shrink-0 self-start md:self-center">
            <p className="text-gray-400 text-[8px] font-bold tracking-widest uppercase mb-1">Account Status</p>
            <div className="flex items-center space-x-1.5 text-white font-bold text-[11px]">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Premium Customer</span>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 3 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Spent This Month */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-3 shrink-0">
            <iconify-icon icon="lucide:calendar" class="text-lg"></iconify-icon>
          </div>
          <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase mb-1">Spent This Month</p>
          <p className="text-gray-900 text-xl font-black">₹{monthly.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Spent This Year */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-3 shrink-0">
            <iconify-icon icon="lucide:line-chart" class="text-lg"></iconify-icon>
          </div>
          <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase mb-1">Spent This Year</p>
          <p className="text-gray-900 text-xl font-black">₹{yearly.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Completed Services */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-3 shrink-0">
            <iconify-icon icon="lucide:check-circle-2" class="text-lg"></iconify-icon>
          </div>
          <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase mb-1">Completed Services</p>
          <p className="text-gray-900 text-xl font-black">{completedCount}</p>
        </div>

      </div>

      {/* Service Payment History Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Service Payment History</h3>
          <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-gray-100">
            {completedServices.length} Transactions
          </span>
        </div>

        <div>
          {completedServices.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-2 shrink-0">
                <iconify-icon icon="lucide:receipt" class="text-xl"></iconify-icon>
              </div>
              <h4 className="text-gray-900 font-bold mb-1 text-xs">No payment history</h4>
              <p className="text-[11px] text-gray-500">Completed services will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {completedServices.map((s, i) => (
                <div key={s._id || i} className="p-4 md:px-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-white group-hover:shadow-sm group-hover:text-gray-900 transition-all border border-transparent group-hover:border-gray-100">
                      <iconify-icon icon="lucide:wrench" class="text-base md:text-lg"></iconify-icon>
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold text-xs md:text-sm mb-0.5">{s.type}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center text-[10px] md:text-[11px] text-gray-500 sm:space-x-1.5">
                        <span>Vehicle: <span className="font-semibold text-gray-700">{s.vehicle}</span></span>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <span className="text-gray-400 mt-0.5 sm:mt-0">Completed: {formatCompletionDate(s)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0 pl-3">
                    <span className="text-red-500 font-black text-sm md:text-base">
                      -₹{(s.cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="mt-0.5 flex items-center space-x-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                      <iconify-icon icon="lucide:lock" class="text-[7px]"></iconify-icon>
                      <span className="text-[7px] font-black tracking-widest uppercase">Paid</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
