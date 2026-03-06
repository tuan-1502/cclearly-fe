import { useState } from "react";
import { 
  Globe, Store, CreditCard, Truck, ShieldCheck, Bell, 
  Save, ChevronRight, MapPin, Wrench, Mail, Eye, EyeOff, Send, AlertTriangle 
} from "lucide-react";
import { toast } from "react-toastify";

// Import components con
import { SectionHeader, FormField, SelectField } from "@/components/common/CommonControls";
import PaymentTab from "@/components/admin/setting/PaymentTab";

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [whitelistedIPs, setWhitelistedIPs] = useState("192.168.1.100");
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { key: "general", label: "Cấu hình chung", icon: Globe, description: "Tên cửa hàng, SEO, liên hệ" },
    { key: "shop", label: "Cửa hàng", icon: Store, description: "Địa chỉ, giờ mở cửa, thuế" },
    { key: "payments", label: "Thanh toán", icon: CreditCard, description: "Cổng thanh toán PayOS" },
    { key: "shipping", label: "Vận chuyển", icon: Truck, description: "Phí ship" },
    { key: "maintenance", label: "Bảo trì", icon: Wrench, description: "Chế độ bảo trì hệ thống" },
    { key: "email", label: "Email", icon: Mail, description: "Cấu hình SMTP" },
    { key: "security", label: "Bảo mật", icon: ShieldCheck, description: "2FA, mật khẩu" },
    { key: "notifications", label: "Thông báo", icon: Bell, description: "Email & SMS" }
  ];

  const handleSave = () => {
    toast.success("Đã lưu cấu hình hệ thống!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-8">
            <SectionHeader title="Cấu hình chung" description="Thông tin cơ bản website" />
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Tên cửa hàng" defaultValue="CClearly - Eye Care Center" />
              <FormField label="Slogan" defaultValue="See Clearly, Live Better" />
              <FormField label="Email hỗ trợ" defaultValue="support@cclearly.com" />
              <FormField label="Số điện thoại" defaultValue="091 234 5678" />
            </div>
          </div>
        );
      case "payments":
        return <PaymentTab />;
      case "maintenance":
        return (
          <div className="space-y-8">
            <SectionHeader title="Chế độ bảo trì" description="Tắt/mở website khi bảo trì" />
            <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${maintenanceMode ? 'bg-red-100' : 'bg-green-100'}`}>
                  <Wrench className={`w-6 h-6 ${maintenanceMode ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#222]">Chế độ bảo trì</h3>
                  <p className="text-sm text-gray-500">{maintenanceMode ? 'Website đang tắt' : 'Website đang hoạt động'}</p>
                </div>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell size={40} className="text-gray-300" />
            <h3 className="font-semibold mt-4">Đang phát triển</h3>
            <p className="text-sm text-gray-400">Tính năng {activeTab} sẽ cập nhật sớm</p>
          </div>
        );
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-gray-500 text-sm">Quản lý toàn bộ cấu hình hệ thống</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700">
          <Save size={16} /> Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 text-left">
        <div className="col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all
                ${activeTab === tab.key ? "bg-white border-blue-500" : "border-transparent hover:bg-gray-50"}`}
            >
              <tab.icon size={18} className={activeTab === tab.key ? "text-blue-600" : "text-gray-400"} />
              <div className="flex-1">
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs text-gray-400 truncate w-40">{tab.description}</div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
        <div className="col-span-9 bg-white border rounded-xl p-8 shadow-sm min-h-[500px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;