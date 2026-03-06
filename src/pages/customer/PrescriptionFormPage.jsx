import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Scan, Upload, ArrowRight, Info } from 'lucide-react'
import { toast } from 'react-toastify'

const PrescriptionFormPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const productId = searchParams.get('productId')
    const quantity = searchParams.get('quantity') || 1

    const [prescription, setPrescription] = useState({
        od_sph: '', od_cyl: '', od_axs: '', od_add: '',
        os_sph: '', os_cyl: '', os_axs: '', os_add: '',
        pd: '',
        note: ''
    })

    const [uploadFile, setUploadFile] = useState(null)

    const handleInputChange = (field, value) => {
        setPrescription(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success('Đã lưu đơn kính!')
        navigate('/cart')
    }

    const SPH_VALUES = Array.from({ length: 81 }, (_, i) => (i * 0.25 - 10).toFixed(2))
    const CYL_VALUES = Array.from({ length: 25 }, (_, i) => (i * 0.25 - 3).toFixed(2))
    const AXS_VALUES = Array.from({ length: 181 }, (_, i) => i.toString())

    return (
        <div className="bg-[#ececec] min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-6">

                {/* HEADER */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#222]">Nhập đơn kính (Rx)</h1>
                        <p className="text-[#4f5562] mt-1">Vui lòng nhập chính xác các thông số từ bác sĩ</p>
                    </div>

                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow">
                        <Scan className="w-6 h-6 text-[#0f5dd9]" />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* MAIN GRID */}
                    <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

                        {/* LEFT SIDE - RX INPUT */}
                        <div className="bg-white rounded-3xl shadow p-8">

                            <div className="flex items-center gap-3 mb-8">
                                <Info className="w-4 h-4 text-[#0f5dd9]" />
                                <p className="text-xs text-[#0f5dd9] font-semibold uppercase">
                                    Thông số kỹ thuật
                                </p>
                            </div>

                            {/* HEADER */}
                            <div className="grid grid-cols-5 gap-4 mb-6 text-center">
                                <div></div>
                                <div className="text-xs font-bold text-gray-400">SPH</div>
                                <div className="text-xs font-bold text-gray-400">CYL</div>
                                <div className="text-xs font-bold text-gray-400">AXS</div>
                                <div className="text-xs font-bold text-gray-400">ADD</div>
                            </div>

                            {/* RIGHT EYE */}
                            <div className="grid grid-cols-5 gap-4 items-center mb-6">
                                <div className="font-semibold">Mắt phải (OD)</div>

                                {['od_sph', 'od_cyl', 'od_axs', 'od_add'].map(field => (
                                    <select
                                        key={field}
                                        value={prescription[field]}
                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                        className="border rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">0.00</option>

                                        {(field.includes('sph')
                                            ? SPH_VALUES
                                            : field.includes('cyl')
                                                ? CYL_VALUES
                                                : AXS_VALUES
                                        ).map(val => (
                                            <option key={val} value={val}>{val}</option>
                                        ))}
                                    </select>
                                ))}
                            </div>

                            {/* LEFT EYE */}
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="font-semibold">Mắt trái (OS)</div>

                                {['os_sph', 'os_cyl', 'os_axs', 'os_add'].map(field => (
                                    <select
                                        key={field}
                                        value={prescription[field]}
                                        onChange={(e) => handleInputChange(field, e.target.value)}
                                        className="border rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="">0.00</option>

                                        {(field.includes('sph')
                                            ? SPH_VALUES
                                            : field.includes('cyl')
                                                ? CYL_VALUES
                                                : AXS_VALUES
                                        ).map(val => (
                                            <option key={val} value={val}>{val}</option>
                                        ))}
                                    </select>
                                ))}
                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col gap-6">

                            {/* PD */}
                            <div className="bg-white rounded-3xl shadow p-6">
                                <label className="font-semibold mb-2 block">
                                    Khoảng cách đồng tử (PD)
                                </label>

                                <input
                                    type="number"
                                    value={prescription.pd}
                                    onChange={(e) => handleInputChange('pd', e.target.value)}
                                    placeholder="Ví dụ: 62"
                                    className="w-full border rounded-lg px-4 py-2"
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    * Nếu không có PD hãy liên hệ nhân viên hỗ trợ
                                </p>
                            </div>

                            {/* NOTE */}
                            <div className="bg-white rounded-3xl shadow p-6">
                                <label className="font-semibold mb-2 block">
                                    Ghi chú thêm
                                </label>

                                <textarea
                                    rows={3}
                                    value={prescription.note}
                                    onChange={(e) => handleInputChange('note', e.target.value)}
                                    placeholder="Lưu ý cho kỹ thuật viên..."
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                            </div>

                            {/* UPLOAD */}
                            <div className="bg-white rounded-3xl shadow p-6">
                                <h3 className="font-semibold mb-4">
                                    Hoặc tải ảnh đơn kính
                                </h3>

                                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50">

                                    <input
                                        type="file"
                                        id="rx-upload"
                                        className="hidden"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                    />

                                    <label htmlFor="rx-upload" className="cursor-pointer">

                                        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />

                                        <p className="text-sm font-medium">
                                            Nhấn để chọn ảnh
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            JPG / PNG / PDF (5MB)
                                        </p>

                                        {uploadFile && (
                                            <p className="text-xs text-green-600 mt-3">
                                                ✓ {uploadFile.name}
                                            </p>
                                        )}

                                    </label>

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4 mt-8">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border rounded-full"
                        >
                            Quay lại
                        </button>

                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#141f36] text-white rounded-full flex items-center gap-2"
                        >
                            Lưu & Tiếp tục
                            <ArrowRight size={18} />
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default PrescriptionFormPage