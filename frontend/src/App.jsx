import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 1c686d0ebb29e44076ab7eb96804c84a9199eb46
