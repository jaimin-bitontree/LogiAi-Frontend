import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package } from "lucide-react"; // Import some nice icons

export default function Sidebar() {
    return (
        <div className='sidebar bg-[#1e1b4b] text-white w-[260px] p-6 rounded-[2rem] shadow-lg flex flex-col'>
            {/* Logo Section */}
            <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-full bg-indigo-500/30"></div>
                <span className="text-xl font-bold">Logi AI</span>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isActive ? "bg-indigo-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                            isActive ? "bg-indigo-500 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
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
