import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header fijo en la parte superior */}
      <Header />

      {/* Contenedor principal */}
      <div className="flex pt-1">
        {/* Sidebar fijo a la izquierda con margen superior */}
        <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] z-40">
          <Sidebar />
        </div>
        
        {/* Espaciador para el sidebar (mantiene el espacio ocupado) */}
        <div className="w-72 shrink-0"></div>
        
        {/* Contenido principal con scroll independiente */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          {console.log("Renderizó children:", children)}
          {children}
        </main>
      </div>
    </div>
  );
}