import { motion } from "framer-motion";
import FantasyMap from "../components/map/FantasyMap";

export default function Home() {
  return (
    <div className="w-full bg-[radial-gradient(ellipse_at_center,_#1a2035_0%,_#0a0d12_70%)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="w-full"
      >
        <FantasyMap />
      </motion.div>
    </div>
  );
}
