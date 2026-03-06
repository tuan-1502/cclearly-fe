// Staff Management Page
import { users } from '@/mocks/data'

const StaffPage = () => {
  const staff = users.filter(u => u.role !== 'customer')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Quản lý nhân sự</h1>
          <p className="text-[#4f5562]">Quản lý tài khoản nhân viên</p>
        </div>
        <button className="bg-[#0f5dd9] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#0b4fc0]">
          + Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f9f9f9]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#222]">Nhân viên</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#222]">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#222]">Vai trò</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#222]">Số điện thoại</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#222]">Trạng thái</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#222]">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ececec]">
            {staff.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0f5dd9] rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-[#222]">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#4f5562]">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-[#ececec] text-[#222] capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#4f5562]">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">Hoạt động</span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[#0f5dd9] hover:underline text-sm mr-3">Sửa</button>
                  <button className="text-red-500 hover:underline text-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StaffPage
