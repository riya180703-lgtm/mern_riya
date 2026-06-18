function MenuFilter({ priceFilter, categoryFilter, onPriceChange, onCategoryChange }) {
  return (
    <div className="filter-row">
      <div className="filter-field">
        <label htmlFor="priceFilter">Filter by price:</label>
        <select id="priceFilter" value={priceFilter} onChange={(event) => onPriceChange(event.target.value)}>
          <option value="all">All items</option>
          <option value="below100">Below ₹100</option>
          <option value="100to500">₹100 to ₹500</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="categoryFilter">Filter by category:</label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All categories</option>
          <option value="Starter">Starter</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
        </select>
      </div>
    </div>
  );
}

export default MenuFilter;
