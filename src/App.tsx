import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipment"; // <-- Notice the path matches your file name!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Dashboard is the home page ("/") */}
        <Route path="/" element={<Dashboard />} />
        
        {/* The Shipments page is at "/shipments" */}
        <Route path="/shipments" element={<Shipments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
