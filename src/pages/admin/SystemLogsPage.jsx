import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Download, Eye, Calendar, User, X } from 'lucide-react'
import { LOG_TYPES, mockLogs } from '@/mocks/data' 

const SystemLogsPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)

  // Filter logic
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter

    let matchesDate = true
    if (dateFrom) {
      matchesDate = matchesDate && new Date(log.timestamp) >= new Date(dateFrom)
    }
    if (dateTo) {
      matchesDate = matchesDate && new Date(log.timestamp) <= new Date(dateTo + 'T23:59:59')
    }

    return matchesSearch && matchesAction && matchesDate
  })

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionBadge = (action) => {
    const badges = {
      import_stock: 'bg-blue-100 text-blue-700',
      add_product: 'bg-green-100 text-green-700',
      add_voucher: 'bg-purple-100 text-purple-700',
      change_banner: 'bg-orange-100 text-orange-700',
      change_email_template: 'bg-cyan-100 text-cyan-700',
      ban_account: 'bg-red-100 text-red-700',
      create_account: 'bg-emerald-100 text-emerald-700',
      reset_password: 'bg-amber-100 text-amber-700',
    }
    return badges[action] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Nhật ký hệ thống</h1>
          <p className="text-[#4f5562]">Theo dõi các hoạt động trong hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0f5dd9] text-white rounded-xl font-medium hover:bg-[#0b4fc0] transition-colors">
          <Download size={18} />
          Xuất log
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo người dùng hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]/20 focus:border-[#0f5dd9]"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]/20 focus:border-[#0f5dd9] bg-white cursor-pointer"
          >
            {LOG_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]/20 focus:border-[#0f5dd9]"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]/20 focus:border-[#0f5dd9]"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người thực hiện</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chi tiết</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#4f5562]">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-[#222]">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getActionBadge(log.action)}`}>
                      {log.actionLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4f5562] max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-gray-400 hover:text-[#0f5dd9] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Không tìm thấy kết quả nào khớp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-[#222]">Chi tiết nhật ký hoạt động</h3>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Thời gian</p>
                  <p className="font-medium text-[#222]">{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hành động</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getActionBadge(selectedLog.action)}`}>
                    {selectedLog.actionLabel}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Người thực hiện</p>
                  <p className="font-medium text-[#222]">{selectedLog.user}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Địa chỉ IP</p>
                  <p className="font-medium text-[#222] font-mono">{selectedLog.ip}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Chi tiết thay đổi</p>
                <div className="text-[#4f5562] bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
            </div>
            <div className="p-5 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-[#222] rounded-xl hover:bg-gray-100 font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemLogsPage