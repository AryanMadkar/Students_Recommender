import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Settings from "./pages/user/settings/Settings"
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-black min-w-[100vw] min-h-[100vh] text-white">
      <Navbar />
      <Settings/>
    </div>
  );
}

export default App;
