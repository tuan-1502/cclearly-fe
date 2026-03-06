import { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { POSITIONS, mockBanners } from '@/mocks/data';
import BannerModal from '@/components/admin/bannar/BannerModal';

const BannerPage = () => {
  const [banners, setBanners] = useState(mockBanners);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '', image: '', position: 'home_main', order: 1, isActive: true, startDate: '', endDate: ''
  });

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({ ...banner });
    } else {
      setEditingBanner(null);
      setFormData({ title: '', image: '', position: 'home_main', order: 1, isActive: true, startDate: '', endDate: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
      toast.success('Cập nhật thành công');
    } else {
      setBanners([...banners, { id: 'b' + Date.now(), ...formData, clicks: 0, views: 0 }]);
      toast.success('Thêm mới thành công');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa banner này?')) {
      setBanners(banners.filter(b => b.id !== id));
      toast.error('Đã xóa banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Quản lý Banner</h1>
          <p className="text-[#4f5562]">Cấu hình hình ảnh quảng cáo hiển thị trên website</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5dd9] text-white rounded-xl font-medium hover:bg-[#0b4fc0]"
        >
          <Plus size={18} /> Thêm banner
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng banner', val: banners.length, color: 'text-gray-900' },
          { label: 'Đang hiển thị', val: banners.filter(b => b.isActive).length, color: 'text-green-600' },
          { label: 'Lượt xem', val: banners.reduce((s, b) => s + b.views, 0).toLocaleString(), color: 'text-blue-600' },
          { label: 'Lượt click', val: banners.reduce((s, b) => s + b.clicks, 0).toLocaleString(), color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {POSITIONS.map(pos => {
          const items = banners.filter(b => b.position === pos.value).sort((a, b) => a.order - b.order);
          if (items.length === 0) return null;

          return (
            <div key={pos.value} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50/50 border-b flex justify-between items-center">
                <h3 className="font-bold text-[#222]">{pos.label}</h3>
                <span className="text-xs bg-white px-2 py-1 rounded-lg border text-gray-500">{items.length} Banner</span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {items.map(banner => (
                    <tr key={banner.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 w-10"><GripVertical className="text-gray-300 w-4 h-4 cursor-move" /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {banner.image ? (
                              <img src={banner.image} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-gray-300 w-5 h-5" /></div>
                            )}
                          </div>
                          <p className="font-semibold text-[#222]">{banner.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">Thứ tự: {banner.order}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {banner.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                          {banner.isActive ? 'ĐANG HIỆN' : 'ĐANG ẨN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal(banner)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(banner.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <BannerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSubmit}
        editingBanner={editingBanner}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default BannerPage;