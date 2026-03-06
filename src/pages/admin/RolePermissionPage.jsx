import { useState } from 'react'
import { Shield, User, Lock, Settings } from 'lucide-react'

const RolePermissionPage = () => {
    const [activeTab, setActiveTab] = useState('accounts')

    const employees = [
        { id: 'ST001', name: 'Trần Thị Thuý', role: 'Sales', status: 'Active', lastActive: '10 phút trước' },
        { id: 'ST002', name: 'Lê Văn Nam', role: 'Operations', status: 'Active', lastActive: '2 giờ trước' },
        { id: 'ST003', name: 'Hoàng Minh Tuấn', role: 'Sales', status: 'Inactive', lastActive: '3 ngày trước' },
    ]

    const auditLogs = [
        { id: 1, user: 'Admin', action: 'Cập nhật giá sản phẩm', target: 'Ray-Ban Aviator', time: '2026-03-05 14:20' },
        { id: 2, user: 'Manager', action: 'Tạo mã giảm giá mới', target: 'WELCOME10', time: '2026-03-05 11:30' },
        { id: 3, user: 'Sales', action: 'Hủy đơn hàng', target: 'ORD-12345', time: '2026-03-05 09:15' },
        { id: 4, user: 'Admin', action: 'Thay đổi quyền truy cập', target: 'ST003', time: '2026-03-04 16:45' },
    ]

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#222]">Quản lý nội bộ</h1>
                    <p className="text-[#4f5562] mt-1">Quản lý nhân sự và lịch sử thao tác hệ thống</p>
                </div>
                <button className="bg-[#141f36] text-white px-6 py-3 rounded-full font-bold hover:bg-black transition flex items-center gap-2">
                    <User className="w-5 h-5" /> Thêm nhân sự mới
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: Shield, title: 'Admin', desc: 'Toàn quyền hệ thống', count: 2, color: 'bg-red-50 text-red-600' },
                    { icon: User, title: 'Manager', desc: 'Quản lý kho và báo cáo', count: 5, color: 'bg-blue-50 text-blue-600' },
                    { icon: Settings, title: 'Staff', desc: 'Xử lý đơn hàng & Sales', count: 12, color: 'bg-green-50 text-green-600' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-[#222] text-lg">{item.title}</h3>
                        <p className="text-xs text-[#4f5562] mt-1">{item.desc}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-sm font-medium text-[#222]">{item.count} nhân viên</span>
                            <button className="text-[#0f5dd9] text-xs font-bold hover:underline">Phân quyền</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <div className="px-8 flex">
                        <button
                            onClick={() => setActiveTab('accounts')}
                            className={`py-5 px-6 font-bold text-sm border-b-2 transition ${activeTab === 'accounts' ? 'border-[#0f5dd9] text-[#0f5dd9]' : 'border-transparent text-[#666] hover:text-[#222]'}`}
                        >
                            Tài khoản nhân viên
                        </button>
                        <button
                            onClick={() => setActiveTab('audit')}
                            className={`py-5 px-6 font-bold text-sm border-b-2 transition ${activeTab === 'audit' ? 'border-[#0f5dd9] text-[#0f5dd9]' : 'border-transparent text-[#666] hover:text-[#222]'}`}
                        >
                            Audit Log (Lịch sử thao tác)
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {activeTab === 'accounts' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[#999] uppercase tracking-wider text-[10px] font-bold">
                                        <th className="px-4 py-3 pb-5">Mã NV</th>
                                        <th className="px-4 py-3 pb-5">Họ tên</th>
                                        <th className="px-4 py-3 pb-5">Vai trò</th>
                                        <th className="px-4 py-3 pb-5">Trạng thái</th>
                                        <th className="px-4 py-3 pb-5">Hoạt động cuối</th>
                                        <th className="px-4 py-3 pb-5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {employees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-4 font-mono font-bold text-[#666]">{emp.id}</td>
                                            <td className="px-4 py-4 font-bold text-[#222]">{emp.name}</td>
                                            <td className="px-4 py-4 text-[#4f5562]">{emp.role}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-[#666] italic">{emp.lastActive}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-[#0f5dd9] font-bold hover:underline">Sửa</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[#999] uppercase tracking-wider text-[10px] font-bold">
                                        <th className="px-4 py-3 pb-5">Thời gian</th>
                                        <th className="px-4 py-3 pb-5">Người thực hiện</th>
                                        <th className="px-4 py-3 pb-5">Hành động</th>
                                        <th className="px-4 py-3 pb-5">Đối tượng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 transition text-xs">
                                            <td className="px-4 py-4 text-[#666]">{log.time}</td>
                                            <td className="px-4 py-4 font-bold text-[#222]">{log.user}</td>
                                            <td className="px-4 py-4 text-[#4f5562]">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[#222] border border-gray-200">{log.action}</span>
                                            </td>
                                            <td className="px-4 py-4 font-medium text-[#0f5dd9]">{log.target}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RolePermissionPage
