import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { orders as initialOrders } from "@/mocks/data"
import { Search, Package, Truck, CheckCircle } from "lucide-react"
import { toast } from "react-toastify"
import ConfirmModal from "@/components/ui/ConfirmModal"
import Pagination from "@/components/ui/Pagination"

const PAGE_SIZES = [5, 10, 15, 20, 30, 50]

const OperationsOrdersPage = () => {

  const { user } = useAuth()

  const [orders,setOrders] = useState(initialOrders)
  const [search,setSearch] = useState("")
  const [status,setStatus] = useState("all")
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)

  const [confirmModal,setConfirmModal] = useState({open:false,id:null,action:null})
  const [trackingModal,setTrackingModal] = useState({open:false,id:null,tracking:""})

  const currency = v =>
    new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(v)

  const statusMap = {
    pending:["Chờ xác nhận","bg-yellow-100 text-yellow-700"],
    confirmed:["Đã xác nhận","bg-blue-100 text-blue-700"],
    processing:["Đang xử lý","bg-purple-100 text-purple-700"],
    shipped:["Đang giao","bg-orange-100 text-orange-700"],
    delivered:["Hoàn thành","bg-green-100 text-green-700"],
    cancelled:["Đã hủy","bg-red-100 text-red-700"]
  }

  const filtered = useMemo(()=>{
    return orders.filter(o=>{
      const searchMatch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.shippingAddress?.name?.toLowerCase().includes(search.toLowerCase())

      const statusMatch = status === "all" || o.status === status

      return searchMatch && statusMatch
    })
  },[orders,search,status])

  // Pagination
  const totalItems = filtered.length
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(totalItems / pageSize)
  const startIndex = pageSize === 'all' ? 0 : (page - 1) * pageSize
  const endIndex = pageSize === 'all' ? totalItems : startIndex + pageSize
  const paginated = filtered.slice(startIndex, endIndex)

  const handlePageSizeChange = (e) => {
    const newSize = e.target.value === 'all' ? 'all' : parseInt(e.target.value)
    setPageSize(newSize)
    setPage(1)
  }

  const updateStatus = (id,newStatus,data={})=>{
    setOrders(o =>
      o.map(x =>
        x.id===id ? {...x,status:newStatus,...data} : x
      )
    )
  }


  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Xử lý đơn hàng</h1>
        <p className="text-gray-500">
          Xin chào, {user?.name || "Operations"}
        </p>
      </div>


      {/* FILTER */}

      <div className="bg-white p-4 rounded-xl shadow-sm flex gap-3">

        <div className="flex-1 relative">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>

          <input
            placeholder="Tìm đơn hàng..."
            value={search}
            onChange={e=>{
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 border rounded-lg"
          />

        </div>

        <select
          value={status}
          onChange={e=>{
            setStatus(e.target.value)
            setPage(1)
          }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">Tất cả</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="processing">Đang xử lý</option>
          <option value="shipped">Đang giao</option>
          <option value="delivered">Hoàn thành</option>
        </select>

      </div>



      {/* TABLE */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* header */}

        <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-sm font-semibold text-gray-600">

          <div>Mã đơn</div>
          <div>Khách hàng</div>
          <div>Trạng thái</div>
          <div className="text-right">Tổng tiền</div>
          <div className="text-right">Ngày</div>
          <div className="text-right">Thao tác</div>

        </div>


        {/* rows */}

        {paginated.map(order=>{

          const [label,color] =
            statusMap[order.status] || ["Không rõ","bg-gray-100"]

          return(

            <div
              key={order.id}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-t items-center text-sm"
            >

              {/* id */}

              <div className="flex items-center gap-2 font-semibold">

                <Package size={16} className="text-purple-600"/>

                {order.id}

              </div>


              {/* customer */}

              <div>

                <p>{order.shippingAddress?.name}</p>

                <p className="text-xs text-gray-500">
                  {order.shippingAddress?.phone}
                </p>

              </div>


              {/* status */}

              <div>

                <span className={`px-2 py-0.5 text-xs rounded ${color}`}>
                  {label}
                </span>

              </div>


              {/* price */}

              <div className="text-right font-medium">
                {currency(order.totalAmount)}
              </div>


              {/* date */}

              <div className="text-right text-gray-500 text-xs">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </div>


              {/* actions */}

              <div className="flex justify-end gap-2">

                {order.status==="confirmed" && (
                  <button
                    onClick={()=>updateStatus(order.id,"processing")}
                    className="bg-purple-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Package size={12}/> Lấy
                  </button>
                )}

                {order.status==="processing" && (
                  <button
                    onClick={()=>setTrackingModal({open:true,id:order.id,tracking:""})}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"
                  >
                    <CheckCircle size={12}/> Đóng gói
                  </button>
                )}

                {order.status==="shipped" && (
                  <button
                    onClick={()=>updateStatus(order.id,"delivered")}
                    className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Truck size={12}/> Bàn giao
                  </button>
                )}

              </div>

            </div>

          )

        })}

      </div>



      {!paginated.length && (
        <div className="bg-white rounded-xl py-10 text-center text-gray-500">
          Không tìm thấy đơn hàng
        </div>
      )}



      {/* pagination with page size */}

      {totalItems > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
            >
              {PAGE_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
              <option value="all">Tất cả</option>
            </select>
            <span className="text-sm text-gray-500">/ {totalItems} kết quả</span>
          </div>

          {pageSize !== 'all' && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}


      {/* tracking modal */}

      {trackingModal.open && (

        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={()=>setTrackingModal({open:false,id:null,tracking:""})}
          />

          <div className="relative bg-white p-6 rounded-xl w-full max-w-sm space-y-4">

            <h3 className="font-semibold text-lg">
              Tạo vận đơn
            </h3>

            <input
              value={trackingModal.tracking}
              onChange={e=>setTrackingModal({...trackingModal,tracking:e.target.value})}
              placeholder="Nhập mã vận đơn"
              className="w-full border p-2 rounded"
            />

            <div className="flex gap-2">

              <button
                onClick={()=>setTrackingModal({open:false,id:null,tracking:""})}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Hủy
              </button>

              <button
                onClick={()=>{
                  updateStatus(trackingModal.id,"shipped",{trackingNumber:trackingModal.tracking})
                  toast.success("Đã tạo vận đơn")
                  setTrackingModal({open:false,id:null,tracking:""})
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Xác nhận
              </button>

            </div>

          </div>

        </div>

      )}



      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={()=>setConfirmModal({open:false,id:null,action:null})}
      />

    </div>
  )
}

export default OperationsOrdersPage
