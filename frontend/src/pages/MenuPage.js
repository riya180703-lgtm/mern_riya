import { useCallback, useEffect, useState } from "react";
import FoodCard from "../components/FoodCard";
import MenuFilter from "../components/MenuFilter";
import { getMenuGrouped, placeOrder } from "../services/api";
import getDisplayName from "../utils/getDisplayName";

const PRICE_FILTERS = {
  all: {},
  below100: { maxPrice: 99 },
  "100to500": { minPrice: 100, maxPrice: 500 },
};

function MenuPage() {
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [orderingItemId, setOrderingItemId] = useState("");

  useEffect(() => {
    document.title = "Spice Garden | Menu";
  }, []);

  const fetchGroupedMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const params = {
        ...PRICE_FILTERS[priceFilter],
        ...(categoryFilter ? { category: categoryFilter } : {}),
      };
      const response = await getMenuGrouped(params);
      setGroupedMenu(response.data.data || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load menu.");
      setGroupedMenu([]);
    } finally {
      setIsLoading(false);
    }
  }, [priceFilter, categoryFilter]);

  useEffect(() => {
    fetchGroupedMenu();
  }, [fetchGroupedMenu]);

  const totalItems = groupedMenu.reduce((sum, group) => sum + group.count, 0);

  const handleOrder = async (item) => {
    const displayName = getDisplayName(item.itemName);
    setOrderMessage("");
    setMessageType("success");
    setOrderingItemId(item._id || item.itemName);
    try {
      await placeOrder({ itemName: displayName, price: item.price });
      setOrderMessage(`Order placed for ${displayName}. Thank you!`);
    } catch (orderError) {
      setMessageType("error");
      setOrderMessage(orderError.response?.data?.message || "Could not place your order. Please try again.");
    } finally {
      setOrderingItemId("");
    }
  };

  return (
    <main className="section menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p className="menu-subtitle">
          Filtered server-side with MongoDB aggregation — grouped by category with average price stats.
        </p>
      </div>

      <div className="menu-filter-card">
        <MenuFilter
          priceFilter={priceFilter}
          categoryFilter={categoryFilter}
          onPriceChange={setPriceFilter}
          onCategoryChange={setCategoryFilter}
        />
      </div>

      {orderMessage && (
        <p className={messageType === "success" ? "success-text" : "error-text"} role="alert" aria-live="polite">
          {orderMessage}
        </p>
      )}

      {isLoading && <p className="muted-text">Loading menu items...</p>}
      {!isLoading && error && <p className="error-text">{error}</p>}

      {!isLoading && !error && totalItems === 0 && <p>No items found for this filter.</p>}

      {!isLoading &&
        !error &&
        groupedMenu.map((group) => (
          <section className="menu-category-section" key={group.category}>
            <div className="category-header">
              <h2>{group.category}</h2>
              <p className="muted-text">
                {group.count} item{group.count !== 1 ? "s" : ""} · avg ₹{group.avgPrice}
              </p>
            </div>
            <div className="card-grid">
              {group.items.map((item) => (
                <FoodCard
                  key={item._id || item.itemName}
                  item={item}
                  onOrder={() => handleOrder(item)}
                  isOrdering={orderingItemId === (item._id || item.itemName)}
                />
              ))}
            </div>
          </section>
        ))}
    </main>
  );
}

export default MenuPage;
