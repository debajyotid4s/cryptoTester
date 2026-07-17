import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();
  return (
    <div className="w-screen h-screen bg-[#0a0d12] flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={false}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
