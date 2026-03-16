import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package } from "lucide-react"; // Import some nice icons
import logiAiFullLogo from "../assets/logiai-full-logo.svg";

export default function Sidebar() {
    return (
        <div className='sidebar bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white w-[260px] p-6 rounded-[2rem] shadow-lg flex flex-col'>
            {/* Logo Section */}
            <div className="mb-10">
                <img
                    src={logiAiFullLogo}
                    alt="Logi AI"
                    className="h-10 w-auto"
                />
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`
                    }
                >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                <NavLink 
                    to="/shipments" 
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`
                    }
                >
                    <Package size={20} />
                    <span className="font-medium">Shipments</span>
                </NavLink>
            </nav>
        </div>
    );
}
