import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function useNewsData(options = {}) {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { limit = 20, feedType = 'all', refresh = false } = options;

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit);
        if (feedType && feedType !== 'all') queryParams.append('feedType', feedType);
        if (refresh) queryParams.append('refresh', 'true');
        
        const url = `${API_URL}/news?${queryParams.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        // Trier les articles pour mettre en priorité ceux avec des images
        const sortedArticles = [...(data.articles || [])].sort((a, b) => {
          // Si a a une image et b n'en a pas, a vient en premier
          if (a.image && !b.image) return -1;
          // Si b a une image et a n'en a pas, b vient en premier
          if (!a.image && b.image) return 1;
          // Sinon, trier par date (plus récent en premier)
          if (a.publishedAt && b.publishedAt) {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
          }
          // Si une des dates est manquante, garder l'ordre existant
          return 0;
        });
        
        setArticles(sortedArticles);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [limit, feedType, refresh]);

  return { articles, isLoading, error };
}
