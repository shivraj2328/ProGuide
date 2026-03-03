import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import BecomeProfessional from "./pages/BecomeProfessional"

function App() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="become-professional" element={<BecomeProfessional/>}/>
      </Routes>
    // </BrowserRouter>
  );
}

export default App;