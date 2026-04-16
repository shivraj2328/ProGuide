import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import BecomeProfessional from "./pages/BecomeProfessional";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import StudentDashboard from "./pages/StudentDashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/become-professional" element={<BecomeProfessional />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />
        <Route path="/my-bookings" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;