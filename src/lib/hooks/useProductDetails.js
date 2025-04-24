import { useState, useEffect } from "react";
import { fetchOBFData, getBestOBFImage } from "@/lib/openBeautyFacts";
import { BASE_APIURL } from "@/config";

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
        const url = `${BASE_APIURL}/products/${productId}`;
        console.log(`Fetching product details from: ${url}`)
        const res = await fetch(url);
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
