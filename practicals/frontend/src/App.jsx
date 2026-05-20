import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Counter: {count}</h1>   
      <button onClick={() => setCount(count + 1)} style={{ fontSize: "20px", marginRight: "10px" }}>+</button>     
      <button onClick={() => setCount(count - 1)} style={{ fontSize: "20px" }}>-</button>
    </div>
  );
}

export default App;