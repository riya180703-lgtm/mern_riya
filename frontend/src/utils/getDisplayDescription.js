const dishDescriptionMap = {
  "paneer and rice combo": "Soft paneer curry served with seasoned rice and fresh salad.",
  "masala dosa": "Soft paneer curry served with seasoned rice and fresh salad.",
};

const getDisplayDescription = (itemName = "", description = "") => {
  const normalizedName = itemName.trim().toLowerCase();
  return dishDescriptionMap[normalizedName] || description;
};

export default getDisplayDescription;
