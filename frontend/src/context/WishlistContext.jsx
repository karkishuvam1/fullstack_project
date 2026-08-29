import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const WishlistContext = createContext(null);

const STORAGE_KEY = "lambo_wishlist";

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(readFromStorage());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (_) {
      /* ignore storage quota */
    }
  }, [items]);

  const addToWishlist = useCallback(async (car) => {
    if (!car || !car._id) return;
    setItems((prev) => {
      if (prev.some((c) => c._id === car._id)) return prev;
      return [...prev, car];
    });
    try {
      await api.post("/users/wishlist", { carId: car._id });
    } catch (_) {
      /* offline-safe */
    }
  }, []);

  const removeFromWishlist = useCallback(async (carId) => {
    setItems((prev) => prev.filter((c) => c._id !== carId));
    try {
      await api.delete(`/users/wishlist/${carId}`);
    } catch (_) {
      /* ignore */
    }
  }, []);

  const toggleWishlist = useCallback(
    (car) => {
      if (!car || !car._id) return;
      const inList = items.some((c) => c._id === car._id);
      if (inList) removeFromWishlist(car._id);
      else addToWishlist(car);
    },
    [items, addToWishlist, removeFromWishlist]
  );

  const isInWishlist = useCallback(
    (carId) => items.some((c) => c._id === carId),
    [items]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistIds: items.map((c) => c._id),
        count: items.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

export default WishlistContext;
