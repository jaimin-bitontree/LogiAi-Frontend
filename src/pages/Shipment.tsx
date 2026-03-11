import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Shipments() {
    return (
        <div className='w-full h-screen flex bg-[#f0f2f5] p-2 gap-4 overflow-hidden'>
            <Sidebar />
            <div className='flex flex-col flex-1 gap-4 pr-2 overflow-hidden'>
                <Header />
                <div className='info bg-transparent flex-1 overflow-y-auto rounded-3xl pb-4 p-4'>
                    <h1 className="text-2xl font-bold text-gray-800">Shipments Page</h1>
                    <p className="text-gray-500 mt-2">The data table will go here.</p>
                </div>
            </div>
        </div>
    );
}
