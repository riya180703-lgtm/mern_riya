import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { workingHours } from "../constants";
import { getMenuItems } from "../services/api";
import getFoodImage from "../utils/getFoodImage";
import getDisplayName from "../utils/getDisplayName";
import parseWorkingHour from "../utils/parseWorkingHour";

function HomePage() {
  const [previewItems, setPreviewItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Spice Garden | Home";
  }, []);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true);
        const response = await getMenuItems({ page: 1, limit: 3, available: true });
        setPreviewItems(response.data.data || []);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Unable to load menu preview.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, []);

  return (
    <main>
      <section className="hero">
        <h1>Welcome to Spice Garden</h1>
        <p>Fresh flavors, quick service, and a warm dining experience.</p>

        <Link className="primary-btn inline-btn" to="/menu">
          Explore Menu
        </Link>
      </section>

      <section className="section">
        <h2>About Us</h2>
        <p>
          Spice Garden is a student-friendly restaurant that serves tasty and affordable meals made with quality
          ingredients.
        </p>
      </section>

      <section className="section">
        <h2>Menu Preview</h2>

        <div className="preview-grid">
          {isLoading ? (
            <p className="muted-text">Loading menu preview...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : previewItems.length === 0 ? (
            <p>No menu items available yet.</p>
          ) : (
            previewItems.map((item) => (
              <article key={item._id || item.itemName} className="preview-card">
                <img
                  src={getFoodImage({
                    ...item,
                    itemName: getDisplayName(item.itemName),
                  })}
                  alt={`${getDisplayName(item.itemName)} preview`}
                />
                <h3>{getDisplayName(item.itemName)}</h3>
                <p>₹{item.price}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section">
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
                    {value}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="muted-text" style={{ marginTop: "18px" }}>
            Kitchen closes 30 minutes before closing time.
          </p>
          <p className="muted-text">Dine-in and takeaway available during all working hours.</p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
