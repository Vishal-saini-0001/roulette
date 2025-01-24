import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouletteBoard from "./pages/RouletteBoard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rouletteBoard" element={<RouletteBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
