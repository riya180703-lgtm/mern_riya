import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ConsumerPage from "./pages/ConsumerPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import { getConsumers, getMenuItems } from "./services/api";

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [menuPagination, setMenuPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [consumerPagination, setConsumerPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (menuPage = 1, consumerPage = 1) => {
    try {
      setIsLoading(true);
      setError("");
      const [menuResponse, consumerResponse] = await Promise.all([
        getMenuItems({ page: menuPage, limit: 10 }),
        getConsumers({ page: consumerPage, limit: 10 }),
      ]);
      setMenuItems(menuResponse.data.data || []);
      setMenuPagination(menuResponse.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      setConsumers(consumerResponse.data.data || []);
      setConsumerPagination(consumerResponse.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to connect to backend server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/consumers" element={<ConsumerPage onConsumerAdded={fetchData} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage
                  consumers={consumers}
                  menuItems={menuItems}
                  menuPagination={menuPagination}
                  consumerPagination={consumerPagination}
                  isLoading={isLoading}
                  error={error}
                  refreshData={fetchData}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
