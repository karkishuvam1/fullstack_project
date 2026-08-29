// High quality reliable supercar CDN fallback imagery for all models
export const CAR_FALLBACK_IMAGES = {
  revuelto: "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1600&q=80",
  "urus-se": "https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1600&q=80",
  temerario: "https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1600&q=80",
  "huracan-tecnica": "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
  "sian-fkp-37": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
  "countach-lpi-800-4": "https://images.unsplash.com/photo-1592197935497-364af94a50ed?auto=format&fit=crop&w=1600&q=80",
  "aventador-svj": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  default: "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1600&q=80",
};

/**
 * Returns a fully qualified image URL.
 * If given a relative path like "/uploads/revuelto.jpg", prepends backend URL.
 * If missing, returns high-res CDN fallback.
 */
export function getImageUrl(imagePath, slug = "") {
  const cleanSlug = String(slug).toLowerCase().trim();
  const fallback = CAR_FALLBACK_IMAGES[cleanSlug] || CAR_FALLBACK_IMAGES.default;

  if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
    return fallback;
  }

  // If already an absolute HTTP/HTTPS URL or data URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  // If relative upload path
  const backendBase = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${backendBase}${cleanPath}`;
}

/**
 * OnError handler for <img> tags to swap broken image with guaranteed CDN fallback
 */
export function handleImageError(e, slug = "default") {
  const cleanSlug = String(slug).toLowerCase().trim();
  const fallback = CAR_FALLBACK_IMAGES[cleanSlug] || CAR_FALLBACK_IMAGES.default;
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
}
