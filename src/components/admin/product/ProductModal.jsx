import React from 'react'
import { Glasses, Scan, Palette, X, Save, Upload, Trash2, Image, Plus } from 'lucide-react'
import {
  FRAME_MATERIALS, FRAME_SHAPES, FRAME_ORIGINS,
  LENS_INDEXES, LENS_MATERIALS, LENS_TECHNOLOGIES, LENS_BRANDS,
  categories
} from '@/mocks/data'

const ProductModal = ({
  show, onClose, onSubmit, editingProduct, formData, setFormData,
  variants, handleAddVariant, handleVariantChange, handleDeleteVariant,
  isPending
}) => {
  if (!show) return null

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }))
    setFormData({ ...formData, images: [...(formData.images || []), ...newImages] })
  }

  const handleRemoveImage = (imageId) => {
    setFormData({ ...formData, images: formData.images.filter(img => img.id !== imageId) })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header - Cố định */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body - Có thể cuộn */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <form id="product-form" onSubmit={onSubmit} className="space-y-6">
            
            {/* Section 1: Thông tin cơ bản (3 cột để tiết kiệm diện tích) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                    placeholder="VD: Gọng kính Ray-Ban Aviator"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Giá (VND)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Loại</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50"
                    >
                      <option value="frame">Gọng kính</option>
                      <option value="lens">Tròng kính</option>
                      <option value="accessory">Phụ kiện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">Danh mục</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                    >
                      <option value="">Chọn...</option>
                      {categories.filter(c => {
                        if (formData.type === 'frame') return c.slug.includes('frame') || c.slug.includes('kids')
                        if (formData.type === 'lens') return c.slug.includes('lens')
                        return c.slug.includes('accessories')
                      }).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload Ảnh - Gọn hơn */}
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Hình ảnh</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 min-h-[110px]">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.images?.map((img) => (
                      <div key={img.id} className="relative group w-12 h-12">
                        <img src={img.preview} alt="Thumb" className="w-full h-full object-cover rounded-md border" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label className="w-12 h-12 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-gray-400">
                      <Plus size={16} />
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Thông số kỹ thuật - Bố cục ngang */}
            {(formData.type === 'frame' || formData.type === 'lens') && (
              <div className={`p-4 rounded-xl border ${formData.type === 'frame' ? 'bg-blue-50/50 border-blue-100' : 'bg-green-50/50 border-green-100'}`}>
                <div className="flex items-center gap-2 mb-3 font-bold text-gray-700 text-sm">
                  {formData.type === 'frame' ? <Glasses size={18} /> : <Scan size={18} />}
                  Thông số kỹ thuật
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {formData.type === 'frame' ? (
                    <>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Chất liệu</label>
                        <select value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {FRAME_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Dáng kính</label>
                        <select value={formData.shape} onChange={(e) => setFormData({...formData, shape: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {FRAME_SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Xuất xứ</label>
                        <select value={formData.origin} onChange={(e) => setFormData({...formData, origin: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {FRAME_ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Mắt (mm)</label>
                          <input type="text" value={formData.lensWidth} onChange={(e) => setFormData({...formData, lensWidth: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white" placeholder="50" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Cầu (mm)</label>
                          <input type="text" value={formData.bridgeWidth} onChange={(e) => setFormData({...formData, bridgeWidth: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white" placeholder="18" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Chiết suất</label>
                        <select value={formData.index} onChange={(e) => setFormData({...formData, index: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {LENS_INDEXES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Công nghệ</label>
                        <select value={formData.technology} onChange={(e) => setFormData({...formData, technology: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {LENS_TECHNOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Thương hiệu</label>
                        <select value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {LENS_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Chất liệu</label>
                        <select value={formData.lensMaterial} onChange={(e) => setFormData({...formData, lensMaterial: e.target.value})} className="w-full p-2 border rounded-md text-sm bg-white">
                          <option value="">Chọn...</option>
                          {LENS_MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Section 3: Biến thể - Table gọn hơn */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Palette size={18} /> Biến thể sản phẩm
                </h3>
                <button type="button" onClick={handleAddVariant} className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition flex items-center gap-1">
                  <Plus size={14} /> Thêm biến thể
                </button>
              </div>

              <div className="border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-gray-500 text-[11px] uppercase tracking-wider">
                      <th className="px-4 py-2 text-left">Mô tả biến thể</th>
                      <th className="px-4 py-2 text-left">SKU</th>
                      <th className="px-4 py-2 text-left">Giá niêm yết</th>
                      <th className="px-4 py-2 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {variants.map((variant, index) => (
                      <tr key={variant.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2">
                          {formData.type === 'frame' ? (
                            <div className="flex items-center gap-2">
                              <input type="text" placeholder="Màu sắc" value={variant.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} className="w-full p-1.5 border rounded" />
                              <input type="color" value={variant.colorCode || '#000000'} onChange={(e) => handleVariantChange(index, 'colorCode', e.target.value)} className="w-6 h-6 rounded-full overflow-hidden border-none p-0 cursor-pointer" />
                            </div>
                          ) : (
                            <select value={variant.technology} onChange={(e) => handleVariantChange(index, 'technology', e.target.value)} className="w-full p-1.5 border rounded">
                              <option value="">Chọn công nghệ...</option>
                              {LENS_TECHNOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <input type="text" value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="w-full p-1.5 border rounded bg-gray-50/50" placeholder="SKU-AUTO" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full p-1.5 border rounded" />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button type="button" onClick={() => handleDeleteVariant(index)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {variants.length === 0 && (
                  <div className="py-6 text-center text-gray-400 text-xs italic">Chưa có biến thể nào được tạo.</div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Cố định */}
        <div className="p-4 border-t flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
          >
            Hủy bỏ
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={isPending}
            className="px-8 py-2 bg-[#141f36] text-white rounded-lg hover:bg-[#0d1322] disabled:bg-gray-400 transition font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-900/10"
          >
            {isPending ? 'Đang xử lý...' : (
              <>
                <Save size={16} />
                {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal