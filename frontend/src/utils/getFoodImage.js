const dishImageMap = {
  "paneer tikka":
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80",
  "veg biryani":
    "https://images.unsplash.com/photo-1701579231349-d7459c40919d?auto=format&fit=crop&w=1000&q=80",
  "paneer and rice combo":
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80",
  "masala dosa":
    "https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=1000&q=80",
};

const getFoodImage = (item) => {
  if (!item || !item.itemName) {
    return "";
  }

  const normalizedName = item.itemName.trim().toLowerCase();
  return dishImageMap[normalizedName] || item.image;
};

export default getFoodImage;
