// import { RouterProvider } from "react-router-dom";
// import { router } from "./routes/router";
// import { AuthProvider } from "./contexts/AuthContext";
// import { TTSProvider } from "./contexts/TTSContext";

// function App() {
//   return (
//     <AuthProvider>
//       <TTSProvider>
//         <RouterProvider router={router} />
//       </TTSProvider>
//     </AuthProvider>
//   );
// }

// export default App;


import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";
import { TTSProvider } from "./contexts/TTSContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <TTSProvider>
        {/* 🌍 Global Toast container (persistent across all routes) */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* 🧭 App routes */}
        <RouterProvider router={router} />
      </TTSProvider>
    </AuthProvider>
  );
}

export default App;
