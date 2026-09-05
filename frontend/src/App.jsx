import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";   // ✅ ADD THIS

import Home from "./pages/Home";
import About from "./pages/About";
import BecomeProfessional from "./pages/BecomeProfessional";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import PaymentConfirm from "./pages/PaymentConfirm";

function App() {
  return (
    <BrowserRouter>

      {/* ✅ Navbar always visible */}
      <Navbar />

      {/* ✅ Page content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/become-professional" element={<BecomeProfessional />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/payment-confirm" element={<PaymentConfirm />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;