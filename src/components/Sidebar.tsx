import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, Package } from "lucide-react";
import logiAiFullLogo from "../assets/logiai-full-logo.svg";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const getNavLinkClass = (isActive: boolean, collapsed: boolean) => {
    return `flex items-center rounded-xl transition-colors ${
        collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
    } ${
        isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <aside
            className={`sidebar bg-linear-to-b from-slate-950 via-slate-900 to-slate-800 text-white h-full shrink-0 shadow-lg flex flex-col transition-all duration-300 ${
                collapsed
                    ? "w-16 sm:w-20 p-2 sm:p-3"
                    : "w-16 sm:w-55 lg:w-65 p-2 sm:p-4 lg:p-5"
            }`}
        >
            {/* Logo Section */}
            <div className={`mb-6 sm:mb-8 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
                {collapsed ? (
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xs font-bold tracking-wide">
                        LA
                    </div>
                ) : (
                    <>
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex sm:hidden items-center justify-center text-xs font-bold tracking-wide">
                            LA
                        </div>
                        <img
                            src={logiAiFullLogo}
                            alt="Logi AI"
                            className="hidden sm:block h-8 lg:h-9 w-auto"
                        />
                    </>
                )}

                {!collapsed && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="hidden sm:flex w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 transition-colors items-center justify-center"
                        aria-label="Close sidebar"
                        title="Close sidebar"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>

            {collapsed && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="hidden sm:flex w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 transition-colors items-center justify-center mb-6 mx-auto"
                    aria-label="Open sidebar"
                    title="Open sidebar"
                >
                    <ChevronRight size={16} />
                </button>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => getNavLinkClass(isActive, collapsed)}
                    title="Dashboard"
                >
                    <LayoutDashboard size={20} />
                    {!collapsed && <span className="hidden sm:inline font-medium truncate">Dashboard</span>}
                </NavLink>

                <NavLink
                    to="/shipments"
                    className={({ isActive }) => getNavLinkClass(isActive, collapsed)}
                    title="Shipments"
                >
                    <Package size={20} />
                    {!collapsed && <span className="hidden sm:inline font-medium truncate">Shipments</span>}
                </NavLink>
            </nav>

            {!collapsed && (
                <p className="hidden sm:block text-[11px] text-slate-400 mt-auto px-2">
                    Logi AI Logistics
                </p>
            )}
        </aside>
    );
}
