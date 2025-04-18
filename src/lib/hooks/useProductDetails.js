import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const fetchOBFData = async (ean) => {
  try {
    const response = await fetch(
      `https://world.openbeautyfacts.org/api/v0/product/${ean}.json`
    );
    if (!response.ok) throw new Error(`OBF API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch OBF data:", error);
    return null;
  }
};

const getBestOBFImage = (obfData) => {
  if (!obfData?.product) return null;
  const options = [
    obfData.product.images?.front?.display?.fr,
    obfData.product.image_front_url,
    obfData.product.image_url,
    obfData.product.image_front_small_url,
  ];
  return options.find((url) => typeof url === "string") || null;
};

const getDirectOBFImageUrl = (ean) => {
  if (!ean) return null;
  return `https://images.openbeautyfacts.org/images/products/${ean.slice(
    0,
    3
  )}/${ean.slice(3, 6)}/${ean.slice(6, 9)}/${ean.slice(9)}/front_fr.4.full.jpg`;
};

const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [obfData, setObfData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

        const data = await res.json();
        const productData = data.result && data.product ? data.product : data;
        setProduct(productData);

        if (productData.OBFProductId) {
          const obf = await fetchOBFData(productData.OBFProductId);
          setObfData(obf);

          const bestImage = getBestOBFImage(obf);
          if (bestImage) {
            setImageUrl(bestImage);
          } else {
            const fallback = getDirectOBFImageUrl(productData.OBFProductId);
            if (fallback) {
              try {
                const check = await fetch(fallback, { method: "HEAD" });
                setImageUrl(
                  check.ok ? fallback : "/placeholder.png?text=Product+Image"
                );
              } catch {
                setImageUrl("/placeholder.png?text=Product+Image");
              }
            }
          }
        } else {
          setImageUrl("/placeholder.png?text=Product+Image");
        }
      } catch (err) {
        setError(err.message);
        setImageUrl("/placeholder.png?text=Product+Image");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return {
    product,
    imageUrl,
    obfData,
    isLoading,
    error,
  };
};

export default useProductDetails;
