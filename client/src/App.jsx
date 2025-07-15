import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

import { useTheme } from "./contexts/ThemeContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useTheme();

  const basename = import.meta.env.PROD ? "/FAZAnote" : "/";

  useEffect(() => {
    const hasVisited = localStorage.getItem("faza_has_visited");

    if (hasVisited === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("faza_has_visited", "true");
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className={`app ${theme}`}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
