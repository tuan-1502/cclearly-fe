import { X, Image as ImageIcon, Upload, Save } from 'lucide-react';
import { POSITIONS } from '@/mocks/data';

const BannerModal = ({ show, onClose, onSave, editingBanner, formData, setFormData }) => {
  if (!show) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-[#222]">
            {editingBanner ? 'Sửa banner' : 'Thêm banner mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSave} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#222] mb-1 text-left">Tiêu đề banner</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f5dd9]/20 outline-none"
              placeholder="Ví dụ: Khuyến mãi mùa hè"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#222] mb-2 text-left">Hình ảnh banner</label>
            <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {formData.image ? (
                <div className="relative h-32 w-full rounded-lg overflow-hidden">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white w-6 h-6" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <ImageIcon className="w-6 h-6 text-[#0f5dd9]" />
                  </div>
                  <p className="text-sm text-gray-500">Nhấn để chọn ảnh từ máy tính</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1 text-left">Vị trí</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none bg-white"
              >
                {POSITIONS.map(pos => <option key={pos.value} value={pos.value}>{pos.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1 text-left">Thứ tự</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1 text-left">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#222] mb-1 text-left">Ngày kết thúc</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="p-5 border-t flex gap-3 -mx-5 -mb-5 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-2.5 bg-[#0f5dd9] text-white rounded-xl font-medium hover:bg-[#0b4fc0] flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {editingBanner ? 'Cập nhật' : 'Lưu banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerModal;