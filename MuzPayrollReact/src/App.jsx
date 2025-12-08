import { Routes, Route } from "react-router-dom";
import MasterPage from "./pages/Masters/MasterPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/masters" element={<MasterPage />} />
      </Routes>
    </>
  );
}

export default App;
