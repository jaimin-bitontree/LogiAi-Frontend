import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileArtAvatar from "../assets/profile-art-avatar.svg";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  title?: string;
  showLogout?: boolean;
}

function Header({ title = "Dashboard", showLogout = false }: HeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { adminName, logout } = useAuth();
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (profileMenuRef.current.contains(event.target as Node)) return;
      setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className='bg-white/95 border border-slate-200 shadow-sm flex flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-3xl shrink-0'>
      <div className="min-w-0">
        <p className='font-bold text-xl sm:text-2xl leading-tight text-slate-900 truncate'>{title}</p>
        <p className='text-[11px] sm:text-xs font-medium text-slate-500 whitespace-nowrap'>Shipments overview • {today}</p>
      </div>

      {/* Right icons area */}
      <div className='flex items-center gap-2 ml-auto'>
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => {
              if (!showLogout) return;
              setIsProfileMenuOpen((previous) => !previous);
            }}
            className="flex items-center gap-2 border border-slate-200 bg-white rounded-full p-1 pr-2 sm:pr-3 hover:bg-slate-50 transition-colors"
            aria-label="Profile menu"
            title="Profile menu"
          >
            <img
              src={profileArtAvatar}
              alt="Profile avatar"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
            />
            <div className="hidden sm:block leading-tight text-left">
              <p className="text-sm font-semibold text-slate-800">{adminName}</p>
              <p className="text-[11px] text-slate-500">Administrator</p>
            </div>
          </button>

          {showLogout && isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-20">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
