import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

function App() {
  return (
    <div className="appContainer">
      <RouterProvider router={router} />;
    </div>
  );
}

export default App;
