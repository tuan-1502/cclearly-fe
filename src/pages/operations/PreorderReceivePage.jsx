import { Package, Truck, Check, Search, AlertCircle } from 'lucide-react'

const PreorderReceivePage = () => {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#222]">Nhận hàng Pre-order</h1>
                <p className="text-[#4f5562] mt-1">Cập nhật hàng về kho cho các đơn đặt trước</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Đang chờ về</p>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-[#222]">42</span>
                        <Package className="w-8 h-8 text-blue-100" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Về hôm nay</p>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-emerald-600">15</span>
                        <Truck className="w-8 h-8 text-emerald-100" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Trễ hẹn (SLA)</p>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-red-500">3</span>
                        <AlertCircle className="w-8 h-8 text-red-100" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f9f9f9]/50">
                    <h2 className="font-bold text-[#222]">Lô hàng sắp về</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Mã vận đơn / SKU..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#e0e0e0] rounded-full text-sm focus:outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-50 uppercase text-[10px] font-bold">
                                <th className="p-4">SKU / Sản phẩm</th>
                                <th className="p-4">Số lượng</th>
                                <th className="p-4">Nhà cung cấp</th>
                                <th className="p-4">Ngày dự kiến</th>
                                <th className="p-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { sku: 'FRAME-RAYBAN-001', name: 'Ray-Ban Wayfarer Classic', qty: 10, supplier: 'Luxottica', date: '2024-03-20' },
                                { sku: 'LENS-ESSILOR-156', name: 'Essilor Crizal 1.56', qty: 50, supplier: 'Essilor VN', date: '2024-03-21' },
                                { sku: 'FRAME-BOLON-X80', name: 'Bolon X80 Titanium', qty: 5, supplier: 'Bolon Eyewear', date: '2024-03-22' },
                            ].map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="p-4">
                                        <p className="font-bold text-[#222]">{item.sku}</p>
                                        <p className="text-[11px] text-[#4f5562]">{item.name}</p>
                                    </td>
                                    <td className="p-4 font-medium">{item.qty} psc</td>
                                    <td className="p-4 text-gray-500">{item.supplier}</td>
                                    <td className="p-4 text-gray-500">{item.date}</td>
                                    <td className="p-4 text-right">
                                        <button className="bg-[#0f5dd9] text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-[#0d4fb8] flex items-center gap-1 ml-auto">
                                            <Check className="w-3 h-3" /> Nhập kho
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PreorderReceivePage
