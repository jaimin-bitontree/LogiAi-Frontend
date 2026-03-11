
function Header() {
  return (
    <div className='bg-white shadow-sm flex items-center justify-between px-6 py-4 rounded-3xl shrink-0'>
      <div className='font-bold text-lg text-slate-800'>
        Dashboard
      </div>

      {/* Center search bar area */}
      <div className="flex-1 max-w-md mx-8">
        <input
          type="text"
          placeholder="Search here..."
          className="w-full bg-slate-50 border border-slate-100 rounded-full py-2 px-4 focus:outline-none"
        />
      </div>

      {/* Right icons area */}
      <div className='flex items-center gap-4'>
        <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center">🔔</button>
        <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center">⚙️</button>
        <div className="flex items-center gap-2 border border-slate-200 rounded-full p-1 pr-4">
          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          <span className="text-sm font-medium">Esther Howard</span>
        </div>
      </div>
    </div>
  )
}

export default Header
