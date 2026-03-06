import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { dashboardStats, getActiveCoupons, getActiveStaff } from "@/mocks/data"
import {
  Users,
  DollarSign,
  Package,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Plus,
  Tag
} from "lucide-react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts"

const ManagerDashboardPage = () => {

  const { user } = useAuth()

  const stats = dashboardStats
  const activeStaff = getActiveStaff()
  const activeCoupons = getActiveCoupons()

  const [showAddModal,setShowAddModal] = useState(false)

  const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6"]

  const revenueData = stats.revenueByMonth.map((item)=>({
    name:`T${item.month}`,
    revenue:item.revenue/1000000
  }))

  const ordersStatusData = Object.entries(stats.ordersByStatus).map(
    ([key,value])=>({
      name:key,
      value
    })
  )

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold text-[#222]">
            Manager Dashboard
          </h1>

          <p className="text-[#4f5562]">
            Xin chào, {user?.name || "Manager"}!
          </p>
        </div>

        <button
          onClick={()=>setShowAddModal(true)}
          className="bg-[#0f5dd9] text-white px-5 py-2.5 rounded-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4"/>
          Thêm mới
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="text-green-600"/>
            </div>

            <span className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3"/>2.5%
            </span>
          </div>

          <p className="text-3xl font-bold">
            {stats.totalCustomers.toLocaleString()}
          </p>

          <p className="text-sm text-[#4f5562]">
            Total Customers
          </p>
        </div>


        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex justify-between mb-4">

            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <DollarSign className="text-orange-600"/>
            </div>

            <span className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3"/>0.5%
            </span>

          </div>

          <p className="text-3xl font-bold">
            {(stats.totalRevenue/1000000).toFixed(1)}M
          </p>

          <p className="text-sm text-[#4f5562]">
            Total Revenue
          </p>

        </div>


        <div className="bg-white rounded-2xl p-6 shadow">

          <div className="flex justify-between mb-4">

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="text-blue-600"/>
            </div>

            <span className="text-red-500 text-sm flex items-center gap-1">
              <TrendingDown className="w-3 h-3"/>0.2%
            </span>

          </div>

          <p className="text-3xl font-bold">
            {stats.totalOrders}
          </p>

          <p className="text-sm text-[#4f5562]">
            Total Orders
          </p>

        </div>


        <div className="bg-white rounded-2xl p-6 shadow">

          <div className="flex justify-between mb-4">

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <RotateCcw className="text-purple-600"/>
            </div>

            <span className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp className="w-3 h-3"/>0.12%
            </span>

          </div>

          <p className="text-3xl font-bold">
            {stats.ordersByStatus.cancelled}
          </p>

          <p className="text-sm text-[#4f5562]">
            Total Returns
          </p>

        </div>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* REVENUE CHART */}
        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="text-lg font-semibold mb-4">
            Doanh thu theo tháng
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={revenueData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="name"/>

              <YAxis/>

              <Tooltip formatter={(v)=>`${v}M`} />

              <Bar
                dataKey="revenue"
                fill="#0f5dd9"
                radius={[6,6,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* ORDERS STATUS PIE */}

        <div className="bg-white rounded-2xl p-6 shadow">

          <h3 className="text-lg font-semibold mb-4">
            Đơn hàng theo trạng thái
          </h3>

          <ResponsiveContainer width="100%" height={250}>

            <PieChart>

              <Pie
                data={ordersStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >

                {ordersStatusData.map((entry,index)=>(
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* STAFF */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow">

          <div className="flex justify-between mb-4">

            <h3 className="font-semibold">
              Nhân viên hoạt động
            </h3>

            <Link
              to="/admin/staff"
              className="text-[#0f5dd9] text-sm"
            >
              Xem tất cả
            </Link>

          </div>

          <div className="space-y-3">

            {activeStaff.slice(0,4).map(member=>(
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 bg-[#f9f9f9] rounded-xl"
              >

                <div className="w-10 h-10 bg-[#0f5dd9] text-white rounded-full flex items-center justify-center">
                  {member.name.charAt(0)}
                </div>

                <div className="flex-1">

                  <p className="font-medium">
                    {member.name}
                  </p>

                  <p className="text-sm text-[#4f5562]">
                    {member.role}
                  </p>

                </div>

                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Hoạt động
                </span>

              </div>
            ))}

          </div>

        </div>


        {/* COUPONS */}

        <div className="bg-white rounded-2xl p-6 shadow">

          <div className="flex justify-between mb-4">

            <h3 className="font-semibold">
              Khuyến mãi đang hoạt động
            </h3>

            <Link
              to="/admin/promotions"
              className="text-[#0f5dd9] text-sm"
            >
              Xem tất cả
            </Link>

          </div>

          <div className="space-y-3">

            {activeCoupons.slice(0,3).map(coupon=>(
              <div
                key={coupon.code}
                className="flex items-center gap-3 p-3 bg-[#f9f9f9] rounded-xl"
              >

                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Tag className="text-orange-600"/>
                </div>

                <div className="flex-1">

                  <p className="font-medium">
                    {coupon.code}
                  </p>

                  <p className="text-sm text-[#4f5562]">
                    {coupon.description}
                  </p>

                </div>

                <span className="text-[#0f5dd9] font-medium text-sm">
                  {coupon.type==="percent"
                    ? `${coupon.value}%`
                    : `${coupon.value.toLocaleString()}đ`}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default ManagerDashboardPage