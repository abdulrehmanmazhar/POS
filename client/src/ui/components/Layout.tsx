// components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./styles/Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
