import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CipherRoom from "./pages/CipherRoom";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cipher/:algo" element={<CipherRoom />} />
      </Route>
    </Routes>
  );
}

export default App;
