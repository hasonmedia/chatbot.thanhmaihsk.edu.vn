import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import {
    BookUser,
    MessageSquare,
    Database,
    Settings,
    Home,
    Menu,
    X,
    User,
    Bell,
    Crown,
    PackageIcon,
    User2Icon,
    Tag,
    MessageCircleCode,
    BookAlert,
    ChartBar
} from "lucide-react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom"

const menuItems = [
    {
        label: "Trang quản lý",
        icon: Home,
        href: "/dashboard",
        color: "text-blue-600",
        bgColor: "bg-blue-100"
    },
    {
        label: "Cấu hình hệ thống",
        icon: Settings,
        href: "/dashboard/cau-hinh-he-thong",
        color: "text-purple-600",
        bgColor: "bg-purple-100"
    },
    {
        label: "Quản lý người dùng",
        icon: User2Icon,
        href: "/admin/users",
        color: "text-blue-600",
        bgColor: "bg-blue-100"
    },
    {
        label: "Dữ liệu Chatbot",
        icon: BookUser,
        href: "/dashboard/cau-hinh-kien-thuc",
        color: "text-green-600",
        bgColor: "bg-green-100"
    },
    {
        label: "Quản lý kênh",
        icon: PackageIcon,
        href: "/admin/facebook_page",
        color: "text-purple-600",
        bgColor: "bg-purple-100"
    },
    {
        label: "Dữ liệu khách hàng",
        icon: Database,
        href: "/dashboard/export",
        color: "text-orange-600",
        bgColor: "bg-orange-100"
    },
    {
        label: "Quản lý Tag",
        icon: Tag,
        href: "/admin/tag",
        color: "text-indigo-600",
        bgColor: "bg-indigo-100"
    },
    {
        label: "Gửi tin nhắn hàng loạt",
        icon: MessageCircleCode,
        href: "/dashboard/send-messages",
        color: "text-purple-600",
        bgColor: "bg-purple-100"
    },
    {
        label: "Chat Interface",
        icon: MessageSquare,
        href: "/admin/chat",
        color: "text-indigo-600",
        bgColor: "bg-indigo-100"
    },
    {
        label: "Thống kê hoạt động",
        icon: ChartBar,
        href: "/admin/admin-analytics",
        color: "text-blue-600",
        bgColor: "bg-blue-100"
    },
    {
        label: "Hướng dẫn sử dụng",
        icon: BookAlert,
        href: "/admin/dashboard-guide",
        color: "text-blue-600",
        bgColor: "bg-blue-100"
    }
];

export default function Sidebar({ children }) {
    const location = useLocation();
    const currentPath = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { handleLogout, user } = useAuth(); // Giả sử có thông tin user từ context
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    const logout = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (err) {
            console.error("Logout thất bại:", err);
        }
    };

    // Mock user data - thay thế bằng dữ liệu thực từ context
    const userData = user || {
        name: "Nguyễn Văn Admin",
        email: "admin@company.com",
        role: "Super Admin",
        avatar: null,
        lastLogin: "15/09/2025 14:30",
        notifications: 3
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleMobileMenu}
                    className="p-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={closeMobileMenu}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 lg:w-64
                bg-white border-r border-gray-200
                flex flex-col shadow-lg
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg font-bold">🤖</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Menu Quản Trị</h1>
                            <p className="text-gray-500 text-sm">Hệ thống Chat AI</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.href;

                        return (
                            <Link
                                key={idx}
                                to={item.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                    : "text-gray-700 hover:bg-blue-400"
                                    }`}
                            >

                                {/* Icon */}
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-700" : "text-gray-500"}`} />

                                {/* Label */}
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - System Status - Compact */}
                <div className="relative p-4 border-t border-gray-700/50">
                    <div className="relative">
                        {/* Profile Dropdown */}
                        {showProfileDropdown && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                                <div className="p-3 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Đăng nhập lần cuối</div>
                                    <div className="text-gray-900 text-sm">{userData.lastLogin}</div>
                                </div>

                                <div className="p-2">
                                    <Link
                                        to="/profile"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-700 text-sm">Thông tin cá nhân</span>
                                    </Link>

                                    <div className="h-px bg-gray-100 my-2"></div>

                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-red-600"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={toggleProfileDropdown}
                            className="w-full bg-white hover:bg-gray-50 rounded-lg p-3 border border-gray-200 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        {userData.avatar ? (
                                            <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    {/* Online status */}
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-gray-900 font-medium text-sm truncate">{userData.name}</h3>
                                        {userData.role === 'Super Admin' && (
                                            <Crown className="w-4 h-4 text-amber-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-xs truncate">{userData.email}</p>
                                    <div className="mt-1">
                                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                            {userData.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Notifications */}
                                {userData.notifications > 0 && (
                                    <div className="relative">
                                        <Bell className="w-5 h-5 text-gray-400" />
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                            {userData.notifications}
                                        </span>
                                    </div>
                                )}

                                {/* Dropdown Arrow */}
                                <svg
                                    className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-50 overflow-hidden lg:ml-0">
                <div className="lg:hidden h-16"></div> {/* Spacer for mobile menu button */}
                {children}
            </div>
        </div>
    );
}