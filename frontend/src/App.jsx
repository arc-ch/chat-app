import Navbar from "./components/Navbar";

import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";  
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  // Destructure necessary values and actions from the useAuthStore hook
  const { authUser, checkAuth, isCheckingAuth, onlineUsers, } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUsers);
  
  // Run checkAuth when the component mounts to check if the user is authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);  // Empty dependency array means this runs once after the initial render

  // While the authentication check is in progress, show a loading spinner
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  console.log({ authUser });

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
         {/* Home page is accessible only if the user is authenticated */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>

    </div>


  )
}

export default App