import { useEffect, useState } from "react";
import { fetchOBFData, getBestOBFImage } from "@/lib/openBeautyFacts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function useHomeData() {
  const [products, setProducts] = useState([]);
  const [additives, setAdditives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, additivesRes] = await Promise.all([
          fetch(`${API_URL}/products/random/6`),
          fetch(`${API_URL}/additives/random/4`), // 4 is the number of additives to display
        ]);
        const productsData = await productsRes.json();
        const additivesData = await additivesRes.json();

        if (productsData.result && productsData.products) {
          const processedProducts = await Promise.all(
            productsData.products.map(async (p) => {
              let image = "/placeholder.png";

              if (p.OBFProductId) {
                try {
                  const obfData = await fetchOBFData(p.OBFProductId);
                  const bestImage = getBestOBFImage(obfData);
                  if (bestImage) {
                    image = bestImage;
                  }
                } catch (err) {
                  console.warn("Failed to fetch OBF image:", err.message);
                }
              }

              return {
                id: p._id,
                name: p.product_name,
                brands: p.brands,
                score: p.completion_score,
                ingredients: p.ingredients || [],
                additives: p.additives || [],
                labeltags: p.labeltags || [],
                image,
                chemicalPercentage: p.chemicalPercentage || 0,
              };
            })
          );

          setProducts(processedProducts);
        }

        if (additivesData.result && additivesData.additives) {
          const processedAdditives = additivesData.additives.map((a) => ({
            id: a._id,
            shortName: a.shortName || "N/A",
            name: a.name?.uk || "Unknown",
            function: a.fonction || "No function specified",
            note: a.note || "No note available",
            imageUrl: `/placeholder.png?height=100&width=100&text=${encodeURIComponent(
              a.shortName || "A"
            )}`,
          }));
          setAdditives(processedAdditives);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { products, additives, isLoading };
}
