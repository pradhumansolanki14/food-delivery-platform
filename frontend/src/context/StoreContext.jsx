import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, SetCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [favorites, setFavorites] = useState([]); // array of food IDs

  // ─── Cart ──────────────────────────────────────────────────
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      SetCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      SetCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    SetCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((p) => p._id === item);
        if (itemInfo) total += itemInfo.price * cartItems[item];
      }
    }
    return total;
  };

  // ─── Favorites ────────────────────────────────────────────
  const loadFavorites = useCallback(async (tkn) => {
    try {
      const res = await axios.get(url + "/api/favorites/ids", { headers: { token: tkn } });
      if (res.data.success) setFavorites(res.data.data);
    } catch { /* silent */ }
  }, [url]);

  const toggleFavorite = async (foodId) => {
    if (!token) return false; // caller should prompt login
    try {
      const res = await axios.post(url + "/api/favorites/toggle", { foodId }, { headers: { token } });
      if (res.data.success) {
        if (res.data.isFavorite) {
          setFavorites((prev) => [...prev, foodId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== foodId));
        }
        return res.data.isFavorite;
      }
    } catch { /* silent */ }
    return null;
  };

  const isFavorite = (foodId) => favorites.includes(foodId);

  // ─── Food list ─────────────────────────────────────────────
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (tkn) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: tkn } });
    SetCartItems(response.data.cartData);
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
        await loadFavorites(savedToken);
      }
    }
    loadData();
  }, []);

  // Reload favorites when token changes (login/logout)
  useEffect(() => {
    if (token) {
      loadFavorites(token);
    } else {
      setFavorites([]);
    }
  }, [token, loadFavorites]);

  const contextValue = {
    food_list,
    cartItems,
    SetCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
