import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { orders as initialOrders } from "@/mocks/data"
import { Search, Eye, Edit2, Mail, Package, CheckCircle, TrendingUp, Filter } from "lucide-react"
import { ConfirmModal } from "@/components/ui"
import { toast } from "react-toastify"
import Pagination from "@/components/ui/Pagination"
import OrderDetailModal from "../../components/sale/OrderDetailModal"
import PrescriptionModal from "../../components/sale/PrescriptionModal"

const PAGE_SIZES = [5, 10, 15, 20, 30, 50]

const SalesOrdersPage = () => {
  const { user } = useAuth()

  const [orders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderToEdit, setOrderToEdit] = useState(null)

  const [prescriptionForm, setPrescriptionForm] = useState({
    rightEye: { sph: "", cyl: "", axis: "", add: "" },
    leftEye: { sph: "", cyl: "", axis: "", add: "" },
    pd: "",
    prescriptionImage: null
  })

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null
  })

  const SPH_VALUES = Array.from({ length: 81 }, (_, i) => (i * 0.25 - 10).toFixed(2))
  const CYL_VALUES = Array.from({ length: 25 }, (_, i) => (i * 0.25 - 3).toFixed(2))
  const AXS_VALUES = Array.from({ length: 181 }, (_, i) => i.toString())

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.phone?.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalItems = filteredOrders.length
  const totalPages = Math.ceil(totalItems / pageSize)

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount || 0)

  const getStatusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700"
    }
    return map[status] || "bg-gray-100 text-gray-700"
  }

  const getTypeBadge = (type) => {
    const map = {
      regular: "bg-green-100 text-green-700",
      prescription: "bg-blue-100 text-blue-700"
    }
    return map[type] || "bg-gray-100 text-gray-700"
  }

  const handleEditPrescription = (order) => {
    setOrderToEdit(order)

    if (order.prescription) {
      setPrescriptionForm({
        ...order.prescription,
        rightEye: { ...order.prescription.rightEye },
        leftEye: { ...order.prescription.leftEye },
        pd: order.prescription.pd?.toString(),
        prescriptionImage: order.prescriptionImage
      })
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h1>
        <p className="text-gray-500 text-sm">
          Xin chào, {user?.name || "Sales User"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {[
          {
            label: "Chờ xác nhận",
            val: orders.filter((o) => o.status === "pending").length,
            icon: Package,
            color: "text-yellow-600",
            bg: "bg-yellow-50"
          },
          {
            label: "Đã xác nhận",
            val: orders.filter((o) => o.status === "confirmed").length,
            icon: CheckCircle,
            color: "text-blue-600",
            bg: "bg-blue-50"
          },
          {
            label: "Hoàn thành",
            val: orders.filter((o) => o.status === "delivered").length,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50"
          },
          {
            label: "Tổng đơn",
            val: orders.length,
            icon: Search,
            color: "text-gray-600",
            bg: "bg-gray-50"
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon size={20} />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-800">{item.val}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4 items-center">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm mã đơn, khách hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="outline-none bg-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="delivered">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Mã đơn</th>
              <th className="px-6 py-3 text-left">Khách hàng</th>
              <th className="px-6 py-3 text-left">Loại</th>
              <th className="px-6 py-3 text-center">Trạng thái</th>
              <th className="px-6 py-3 text-right">Tổng tiền</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">

                <td className="px-6 py-3 text-blue-600 font-medium">
                  #{order.id}
                </td>

                <td className="px-6 py-3">
                  <p className="font-medium text-gray-800">
                    {order.shippingAddress?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.shippingAddress?.phone}
                  </p>
                </td>

                <td className="px-6 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getTypeBadge(order.type)}`}
                  >
                    {order.type}
                  </span>
                </td>

                <td className="px-6 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusBadge(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-3 text-right font-medium">
                  {formatCurrency(order.totalAmount)}
                </td>

                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Eye size={16} />
                    </button>

                    {order.type === "prescription" && (
                      <button
                        onClick={() => handleEditPrescription(order)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}

                    <button className="p-2 bg-gray-100 text-gray-500 rounded-lg">
                      <Mail size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border">

        <div className="flex items-center gap-2 text-sm text-gray-600">
          Hiển thị
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border rounded px-2 py-1"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          / {totalItems} đơn
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </div>

      <OrderDetailModal
  order={selectedOrder}
  onClose={() => setSelectedOrder(null)}
  getTypeBadge={getTypeBadge}
  getStatusBadge={getStatusBadge}
  formatCurrency={formatCurrency}
/>

      <PrescriptionModal
        isOpen={!!orderToEdit}
        order={orderToEdit}
        onClose={() => setOrderToEdit(null)}
        onSave={() => {
          toast.success("Đã lưu!")
          setOrderToEdit(null)
        }}
        form={prescriptionForm}
        setForm={setPrescriptionForm}
        options={{ SPH: SPH_VALUES, CYL: CYL_VALUES, AXIS: AXS_VALUES }}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ ...confirmModal, isOpen: false })
        }
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  )
}

export default SalesOrdersPage