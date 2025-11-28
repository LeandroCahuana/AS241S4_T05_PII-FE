import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import SplashScreen from "../components/SplashScreen";
import './index.css'

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Verificar si ya se mostró el splash en esta sesión
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <MainLayout>
      <Outlet /> {/* Aquí se renderizan las rutas hijas */}
    </MainLayout>
  );
}

export default App;