const dishNameMap = {
  "masala dosa": "Paneer and Rice Combo",
};

const getDisplayName = (itemName = "") => {
  const normalizedName = itemName.trim().toLowerCase();
  return dishNameMap[normalizedName] || itemName;
};

export default getDisplayName;
