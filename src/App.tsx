import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DrawingApp from "./Drawing";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <DrawingApp />
    </>
  );
}

export default App;
