import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;