import { Outlet } from "react-router-dom";

export default function ScannerLayout() {
  return (
    <div>
      <Navbar />
      
      <Outlet />
    </div>
  );
}
