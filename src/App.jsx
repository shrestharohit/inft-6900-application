import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";
import { TTSProvider } from "./contexts/TTSContext";

function App() {
  return (
    <AuthProvider>
      <TTSProvider>
        <RouterProvider router={router} />
      </TTSProvider>
    </AuthProvider>
  );
}

export default App;
