import { useEffect, useState } from "react";
import { addMenuItem, getOrderAnalytics, MENU_CATEGORIES, updateMenuItem } from "../services/api";
import { workingHours } from "../constants";
import getDisplayName from "../utils/getDisplayName";
import parseWorkingHour from "../utils/parseWorkingHour";

const initialMenuForm = {
  itemName: "",
  description: "",
  price: "",
  image: "",
  category: "Main Course",
  available: true,
};

function PaginationControls({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-controls">
      <button
        type="button"
        className="secondary-btn"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </button>
      <span className="muted-text">
        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
      </span>
      <button
        type="button"
        className="secondary-btn"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </button>
    </div>
  );
}

function DashboardPage({
  consumers,
  menuItems,
  menuPagination,
  consumerPagination,
  isLoading,
  error,
  refreshData,
}) {
  const [formData, setFormData] = useState(initialMenuForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [analytics, setAnalytics] = useState({
    overview: { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
    topItems: [],
    dailyOrders: [],
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    document.title = "Spice Garden | Dashboard";
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        setAnalyticsError("");
        const response = await getOrderAnalytics();
        setAnalytics(response.data);
      } catch (fetchError) {
        setAnalyticsError(fetchError.response?.data?.message || "Unable to load analytics.");
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [refreshData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("success");

    try {
      await addMenuItem({ ...formData, price: Number(formData.price) });
      setMessage("Menu item added successfully.");
      setFormData(initialMenuForm);
      await refreshData(menuPagination.page, consumerPagination.page);
    } catch (submitError) {
      setMessageType("error");
      setMessage(submitError.response?.data?.message || "Failed to add menu item.");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item._id, { available: !item.available });
      await refreshData(menuPagination.page, consumerPagination.page);
    } catch (toggleError) {
      setMessageType("error");
      setMessage(toggleError.response?.data?.message || "Failed to update item availability.");
    }
  };

  const handleMenuPageChange = (page) => {
    refreshData(page, consumerPagination.page);
  };

  const handleConsumerPageChange = (page) => {
    refreshData(menuPagination.page, page);
  };

  return (
    <main className="section dashboard">
      <h1>Dashboard</h1>
      <p className="muted-text">Protected with JWT — only authenticated admins can access this page.</p>
      {isLoading && <p className="muted-text">Loading dashboard data...</p>}
      {!isLoading && error && <p className="error-text">{error}</p>}

      <section className="dashboard-section">
        <h2>Order Analytics</h2>
        {isLoadingAnalytics ? (
          <p className="muted-text">Loading analytics...</p>
        ) : analyticsError ? (
          <p className="error-text">{analyticsError}</p>
        ) : (
          <>
            <div className="analytics-grid">
              <article className="analytics-card">
                <h3>Total Orders</h3>
                <p>{analytics.overview.totalOrders}</p>
              </article>
              <article className="analytics-card">
                <h3>Total Revenue</h3>
                <p>₹{analytics.overview.totalRevenue}</p>
              </article>
              <article className="analytics-card">
                <h3>Average Order Value</h3>
                <p>₹{analytics.overview.averageOrderValue}</p>
              </article>
            </div>

            <div className="analytics-list-wrap">
              <div>
                <h3>Top Ordered Items</h3>
                {analytics.topItems.length === 0 ? (
                  <p className="muted-text">No orders yet.</p>
                ) : (
                  <ul>
                    {analytics.topItems.map((item) => (
                      <li key={item.itemName}>
                        {getDisplayName(item.itemName)} - {item.orders} orders - ₹{item.revenue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3>Daily Orders</h3>
                {analytics.dailyOrders.length === 0 ? (
                  <p className="muted-text">No daily order trend available yet.</p>
                ) : (
                  <ul>
                    {analytics.dailyOrders.map((day) => (
                      <li key={day.date}>
                        {day.date} - {day.orders} orders - ₹{day.revenue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Add Menu Item</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="itemName">Item Name</label>
          <input id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} required />

          <label htmlFor="description">Description</label>
          <input id="description" name="description" value={formData.description} onChange={handleChange} />

          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            name="price"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            {MENU_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label htmlFor="image">Image URL</label>
          <input id="image" name="image" value={formData.image} onChange={handleChange} />

          <label className="checkbox-label">
            <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
            Available for ordering
          </label>

          <button className="primary-btn" type="submit">
            Add Item
          </button>
        </form>
        {message && (
          <p className={messageType === "success" ? "success-text" : "error-text"} role="alert" aria-live="polite">
            {message}
          </p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Registered Consumers</h2>
        {!isLoading && !error && consumers.length === 0 ? (
          <p>No consumers registered yet.</p>
        ) : !isLoading && !error ? (
          <>
            <ul>
              {consumers.map((consumer) => (
                <li key={consumer._id}>
                  {consumer.name} - {consumer.email} - {consumer.phone}
                  {consumer.isVerified ? " (verified)" : ""}
                </li>
              ))}
            </ul>
            <PaginationControls pagination={consumerPagination} onPageChange={handleConsumerPageChange} />
          </>
        ) : null}
      </section>

      <section className="dashboard-section">
        <h2>Menu Items</h2>
        {!isLoading && !error && menuItems.length === 0 ? (
          <p>No menu items available.</p>
        ) : !isLoading && !error ? (
          <>
            <ul className="menu-admin-list">
              {menuItems.map((item) => (
                <li key={item._id}>
                  <span>
                    {getDisplayName(item.itemName)} - {item.category || "Main Course"} - ₹{item.price} -{" "}
                    {item.available !== false ? "Available" : "Unavailable"}
                  </span>
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => handleToggleAvailability(item)}
                  >
                    {item.available !== false ? "Mark Unavailable" : "Mark Available"}
                  </button>
                </li>
              ))}
            </ul>
            <PaginationControls pagination={menuPagination} onPageChange={handleMenuPageChange} />
          </>
        ) : null}
      </section>

      <section className="dashboard-section">
        <h2>Working Hours</h2>
        <div className="hours-card" role="region" aria-label="Working hours">
          <div className="hours-table" role="table" aria-label="Working hours table">
            <div className="hours-row hours-header" role="row">
              <span className="hours-cell" role="columnheader">
                Day
              </span>
              <span className="hours-cell" role="columnheader">
                Time
              </span>
            </div>
            {workingHours.map((slot) => {
              const { label, value } = parseWorkingHour(slot);
              return (
                <div className="hours-row" role="row" key={slot}>
                  <span className="hours-cell" role="cell">
                    {label}
                  </span>
                  <span className="hours-cell" role="cell">
                    {value || slot}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
