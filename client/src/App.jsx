import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import CipherRoom from "./pages/CipherRoom";
import Layout from "./components/layout/Layout";

function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cipher/:algo" element={<CipherRoom />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
