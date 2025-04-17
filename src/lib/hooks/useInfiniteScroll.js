import { useState, useEffect } from "react";

export default function useInfiniteScroll(fetchCallback) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 800) {
        loadMore(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    loadMore(1);
  }, []);

  async function loadMore(pageNumber) {
    setIsLoading(true);
    try {
      const hasMoreData = await fetchCallback(pageNumber);
      setHasMore(hasMoreData);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error in infinite scroll:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, hasMore, page, loadMore };
}
