
import profileArtAvatar from "../assets/profile-art-avatar.svg";

interface HeaderProps {
  title?: string;
}

function Header({ title = "Dashboard" }: HeaderProps) {
  return (
    <div className='bg-white shadow-sm flex items-center justify-between px-6 py-4 rounded-3xl shrink-0'>
      <div className='font-bold text-lg text-slate-800'>
        {title}
      </div>

      {/* Right icons area */}
      <div className='flex items-center gap-4'>
        <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center">🔔</button>
        <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center">⚙️</button>
        <div className="flex items-center gap-2 border border-slate-200 rounded-full p-1 pr-4">
          <img
            src={profileArtAvatar}
            alt="Profile avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">Logi AI</span>
        </div>
      </div>
    </div>
  )
}

export default Header
