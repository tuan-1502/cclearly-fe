import { useState } from 'react'
import { coupons as initialCoupons, products as allProducts } from '@/mocks/data'
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Zap,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  X
} from 'lucide-react'
import { toast } from 'react-toastify'
import ConfirmModal from '@/components/ui/ConfirmModal'

const PromotionPage = () => {

  const [coupons, setCoupons] = useState(initialCoupons)

  const [flashSales, setFlashSales] = useState([
    { id: 1, productId: 'f1', name: 'Kính Ray-Ban Aviator', originalPrice: 3500000, salePrice: 1999000, stock: 10, sold: 7, slot: '09:00 - 12:00' },
    { id: 2, productId: 'f5', name: 'Gọng kính Titanium Pro', originalPrice: 1200000, salePrice: 599000, stock: 20, sold: 15, slot: '09:00 - 12:00' },
    { id: 3, productId: 'l2', name: 'Tròng Essilor Crizal', originalPrice: 800000, salePrice: 450000, stock: 50, sold: 12, slot: '12:00 - 15:00' },
  ])
  const [activeSlot, setActiveSlot] = useState('09:00 - 12:00')
  const [couponSearch, setCouponSearch] = useState('')
  const [couponFilter, setCouponFilter] = useState('all')

  const [showCouponModal, setShowCouponModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  const [couponFormData, setCouponFormData] = useState({
    code: '',
    type: 'percent',
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    description: '',
    isActive: true
  })

  const [showFlashSaleModal, setShowFlashSaleModal] = useState(false)
  const [editingFlashSale, setFlashSaleEditing] = useState(null)

  const [flashSaleFormData, setFlashSaleFormData] = useState({
    productId: '',
    name: '',
    originalPrice: 0,
    salePrice: 0,
    stock: 0,
    slot: '09:00 - 12:00'
  })

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    type: '',
    id: null
  })

  const timeSlots = [
    '00:00 - 09:00',
    '09:00 - 12:00',
    '12:00 - 15:00',
    '15:00 - 18:00',
    '18:00 - 21:00',
    '21:00 - 00:00'
  ]


  const handleCouponSubmit = (e) => {
    e.preventDefault()

    if (editingCoupon) {
      setCoupons(prev =>
        prev.map(c =>
          c.code === editingCoupon.code
            ? { ...couponFormData }
            : c
        )
      )
      toast.success('Đã cập nhật mã giảm giá')
    } else {

      if (coupons.some(c => c.code === couponFormData.code)) {
        toast.error('Mã này đã tồn tại!')
        return
      }

      setCoupons(prev => [
        ...prev,
        { ...couponFormData, usageCount: 0 }
      ])

      toast.success('Đã tạo mã giảm giá mới')
    }

    setShowCouponModal(false)
    setEditingCoupon(null)
  }

  const toggleCouponStatus = (code) => {
    setCoupons(prev =>
      prev.map(c =>
        c.code === code
          ? { ...c, isActive: !c.isActive }
          : c
      )
    )
  }

  const openEditCoupon = (coupon) => {
    setEditingCoupon(coupon)
    setCouponFormData({ ...coupon })
    setShowCouponModal(true)
  }

  const openAddCoupon = () => {
    setEditingCoupon(null)

    setCouponFormData({
      code: '',
      type: 'percent',
      value: 0,
      minOrder: 0,
      maxDiscount: 0,
      description: '',
      isActive: true
    })

    setShowCouponModal(true)
  }

  const handleFlashSaleSubmit = (e) => {
    e.preventDefault()

    const product = allProducts.find(p => p.id === flashSaleFormData.productId)

    const finalData = {
      ...flashSaleFormData,
      name: product?.name || 'Sản phẩm mới',
      originalPrice: product?.price || 0
    }

    if (editingFlashSale) {

      setFlashSales(prev =>
        prev.map(fs =>
          fs.id === editingFlashSale.id
            ? { ...finalData, id: fs.id, sold: fs.sold }
            : fs
        )
      )

      toast.success('Đã cập nhật Flash Sale')

    } else {

      setFlashSales(prev => [
        ...prev,
        { ...finalData, id: Date.now(), sold: 0 }
      ])

      toast.success('Đã thêm sản phẩm vào Flash Sale')
    }

    setShowFlashSaleModal(false)
    setFlashSaleEditing(null)
  }

  const openAddFlashSale = () => {
    setFlashSaleEditing(null)

    setFlashSaleFormData({
      productId: '',
      name: '',
      originalPrice: 0,
      salePrice: 0,
      stock: 0,
      slot: activeSlot
    })

    setShowFlashSaleModal(true)
  }

  const openEditFlashSale = (fs) => {
    setFlashSaleEditing(fs)
    setFlashSaleFormData({ ...fs })
    setShowFlashSaleModal(true)
  }

  const handleDeleteRequest = (type, id) => {
    setConfirmDelete({
      isOpen: true,
      type,
      id
    })
  }

  const onConfirmDelete = () => {

    if (confirmDelete.type === 'coupon') {
      setCoupons(prev =>
        prev.filter(c => c.code !== confirmDelete.id)
      )

      toast.info('Đã xóa mã giảm giá')

    } else {

      setFlashSales(prev =>
        prev.filter(fs => fs.id !== confirmDelete.id)
      )

      toast.info('Đã gỡ sản phẩm khỏi Flash Sale')
    }

    setConfirmDelete({
      isOpen: false,
      type: '',
      id: null
    })
  }

  const filteredCoupons = coupons.filter(c => {

    const matchesSearch =
      c.code.toLowerCase().includes(
        couponSearch.toLowerCase()
      )

    if (couponFilter === 'active')
      return matchesSearch && c.isActive

    if (couponFilter === 'expired')
      return matchesSearch && !c.isActive

    return matchesSearch
  })

  const activeFlashSales =
    flashSales.filter(fs => fs.slot === activeSlot)


  const Stat = ({ icon: Icon, label, value }) => (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-3">
      <Icon size={18} />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  )

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Promotion Manager
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý Flash Sale và Voucher
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={openAddCoupon}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm"
          >
            <Ticket size={16} />
            Tạo Voucher
          </button>

          <button
            onClick={openAddFlashSale}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm"
          >
            <Zap size={16} />
            Flash Sale
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-5">

        <Stat
          icon={Ticket}
          label="Voucher Active"
          value={coupons.filter(c => c.isActive).length}
        />

        <Stat
          icon={Zap}
          label="Flash Sale"
          value={flashSales.length}
        />

        <Stat
          icon={CheckCircle}
          label="Total Usage"
          value={coupons.reduce((s, c) => s + c.usageCount, 0)}
        />

        <Stat
          icon={Clock}
          label="Today"
          value={124}
        />

      </div>


      {/* MAIN */}

      <div className="grid grid-cols-12 gap-6">


        {/* FLASH SALE */}

        <div className="col-span-4 bg-white border rounded-xl p-5 space-y-4">

          <div className="flex justify-between items-center">
            <h2 className="font-semibold flex gap-2 items-center">
              <Zap size={18} />
              Flash Sale
            </h2>

            <button
              onClick={openAddFlashSale}
              className="text-blue-600 text-sm flex gap-1 items-center"
            >
              <Plus size={14} />
              Add
            </button>
          </div>


          {/* SLOT */}

          <div className="flex gap-2 overflow-x-auto pb-2">

            {timeSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setActiveSlot(slot)}
                className={`px-3 py-1 text-xs rounded-md whitespace-nowrap
                ${activeSlot === slot
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'}`}
              >
                {slot}
              </button>
            ))}

          </div>


          {/* ITEMS */}

          <div className="space-y-3">

            {activeFlashSales.map(fs => {

              const percent =
                (fs.sold / fs.stock) * 100

              return (

                <div
                  key={fs.id}
                  className="border rounded-lg p-3 space-y-2"
                >

                  <div className="flex justify-between">

                    <span className="text-xs text-gray-500">
                      {fs.sold}/{fs.stock}
                    </span>

                    <div className="flex gap-1">

                      <button
                        onClick={() => openEditFlashSale(fs)}
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteRequest('flash', fs.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>

                  <div className="font-medium text-sm">
                    {fs.name}
                  </div>

                  <div className="flex gap-2 text-sm">

                    <span className="text-red-600 font-semibold">
                      {fs.salePrice.toLocaleString()}₫
                    </span>

                    <span className="line-through text-gray-400">
                      {fs.originalPrice.toLocaleString()}₫
                    </span>

                  </div>

                  <div className="h-1 bg-gray-200 rounded">
                    <div
                      className="h-full bg-red-500 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                </div>

              )

            })}

          </div>

        </div>



        {/* COUPONS */}

        <div className="col-span-8 bg-white border rounded-xl">

          <div className="p-5 flex justify-between items-center border-b">

            <h2 className="font-semibold flex items-center gap-2">
              <Ticket size={18} />
              Vouchers
            </h2>

            <div className="flex gap-3">

              <div className="relative">

                <Search
                  size={16}
                  className="absolute left-2 top-2 text-gray-400"
                />

                <input
                  value={couponSearch}
                  onChange={(e) => setCouponSearch(e.target.value)}
                  placeholder="Search"
                  className="pl-7 pr-3 py-1.5 border rounded-md text-sm"
                />

              </div>

              <select
                value={couponFilter}
                onChange={(e) => setCouponFilter(e.target.value)}
                className="border rounded-md text-sm px-2"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="expired">Disabled</option>
              </select>

            </div>

          </div>


          {/* TABLE */}

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-3">
                  Code
                </th>

                <th className="text-left p-3">
                  Discount
                </th>

                <th className="text-left p-3">
                  Usage
                </th>

                <th className="text-left p-3">
                  Status
                </th>

                <th className="text-right p-3">
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCoupons.map(coupon => (
                <tr key={coupon.code} className="border-t">

                  <td className="p-3 font-medium">
                    {coupon.code}
                  </td>

                  <td className="p-3">

                    {coupon.type === 'percent'
                      ? `${coupon.value}%`
                      : coupon.value.toLocaleString() + "₫"}

                  </td>

                  <td className="p-3">

                    {coupon.usageCount}
                    /
                    {coupon.usageLimit || '∞'}

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() => toggleCouponStatus(coupon.code)}
                      className={`text-xs px-2 py-1 rounded
                      ${coupon.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'}`}
                    >
                      {coupon.isActive
                        ? 'Active'
                        : 'Disabled'}
                    </button>

                  </td>

                  <td className="p-3 text-right">

                    <button
                      onClick={() => openEditCoupon(coupon)}
                      className="mr-2"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteRequest('coupon', coupon.code)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn chắc chắn muốn xóa?"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, type: '', id: null })}
        type="danger"
      />

    </div>

  )
}

export default PromotionPage