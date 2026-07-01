import { useState, useEffect } from "react";
import axios from "axios";

export default function CustomerBookings({ services, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 5;

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/services/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel service");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filteredServices = services.filter(s => {
    const v = s.vehicle || "";
    const t = s.type || "";
    const matchesSearch =
      v.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredServices.length);
  const currentItems = filteredServices.slice(startIndex, endIndex);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-5 w-full">
      {/* Top Bar: Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Filters */}
        <div className="flex items-center space-x-2">
          {["all", "pending", "progress", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                statusFilter === f
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "All" : f === "progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <iconify-icon icon="lucide:search" class="text-gray-400 text-base"></iconify-icon>
          </div>
          <input
            type="text"
            placeholder="Search vehicle or service type..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[1.5rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Card Header */}
        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Service History</h3>
          <span className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-semibold rounded-full border border-gray-100">
            {filteredServices.length} records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {filteredServices.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                <iconify-icon icon="lucide:calendar-x" class="text-2xl"></iconify-icon>
              </div>
              <h4 className="text-gray-900 font-bold mb-1 text-sm">No bookings found</h4>
              <p className="text-xs text-gray-500">Try adjusting your search criteria or filter options.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">#</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Vehicle No.</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Service Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Booking Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Completion</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Cost</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentItems.map((s, i) => {
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
                    return "--";
                  };

                  const dateStr = s.date || "Unknown";
                  const timeStr = s.time || "10:00 AM";

                  return (
                    <tr key={s._id || i} className="hover:bg-gray-50/50 transition-colors group bg-white">
                      <td className="px-6 py-5 text-xs font-medium text-gray-400 whitespace-nowrap">{startIndex + i + 1}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {s.vehicle}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs font-medium text-gray-500 whitespace-nowrap">{s.type}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <p className="text-xs font-bold text-gray-900">{dateStr}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">{timeStr}</p>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`text-xs font-bold ${s.status === 'completed' ? 'text-gray-900' : 'text-gray-400'}`}>
                          {getCompletionDate(s)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-gray-900 whitespace-nowrap">
                        ₹{(s.cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {s.status === "completed" && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-500 border border-emerald-100 inline-block">
                            Completed
                          </span>
                        )}
                        {s.status === "progress" && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-500 border border-indigo-100 inline-block">
                            In Progress
                          </span>
                        )}
                        {s.status === "pending" && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-500 border border-amber-100 inline-block">
                            Pending
                          </span>
                        )}
                        {s.status === "cancelled" && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-500 border border-red-100 inline-block">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {["pending", "progress"].includes(s.status) ? (
                          <button
                            onClick={() => handleCancel(s._id)}
                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {filteredServices.length > 0 && (
          <div className="p-5 md:px-6 md:py-4 bg-white border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
            <span className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{startIndex + 1}-{endIndex}</span> of <span className="font-bold text-gray-900">{filteredServices.length} records</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
              >
                <iconify-icon icon="lucide:chevron-left" class="text-base"></iconify-icon>
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Simple logic: show first, last, and pages around current page
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold focus:outline-none transition-colors ${
                        currentPage === pageNum 
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600" 
                          : "border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 || 
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-gray-400 text-xs px-1">...</span>;
                }
                return null;
              })}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
              >
                <iconify-icon icon="lucide:chevron-right" class="text-base"></iconify-icon>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
