import getFoodImage from "../utils/getFoodImage";
import getDisplayName from "../utils/getDisplayName";
import getDisplayDescription from "../utils/getDisplayDescription";

function FoodCard({ item, onOrder, isOrdering }) {
  const displayName = getDisplayName(item.itemName);
  const displayDescription = getDisplayDescription(item.itemName, item.description);
  const isAvailable = item.available !== false;

  return (
    <article className={`card ${!isAvailable ? "card-unavailable" : ""}`}>
      <img src={getFoodImage({ ...item, itemName: displayName })} alt={`${displayName} dish`} className="card-image" />
      <div className="card-content">
        <div className="card-meta">
          {item.category && <span className="category-badge">{item.category}</span>}
          {!isAvailable && <span className="unavailable-badge">Unavailable</span>}
        </div>
        <h3>{displayName}</h3>
        <p>{displayDescription}</p>
        <p className="price">₹{item.price}</p>
        <button
          onClick={onOrder}
          className="primary-btn"
          type="button"
          disabled={isOrdering || !isAvailable}
        >
          {isOrdering ? "Ordering..." : isAvailable ? "Order Now" : "Not Available"}
        </button>
      </div>
    </article>
  );
}

export default FoodCard;
