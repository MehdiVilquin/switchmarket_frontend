"use client";

import { useState } from 'react';
import useNewsData from '@/lib/hooks/useNewsData';
import NewsCard from '@/components/cards/NewsCard';
import { Newspaper, Search, X } from 'lucide-react';

export default function DiscoverPage() {
  const { articles, isLoading, error } = useNewsData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrer les articles en fonction de la recherche
  const filteredArticles = searchQuery.trim() === '' 
    ? articles 
    : articles.filter(article => {
        const searchText = searchQuery.toLowerCase();
        return (
          (article.title && article.title.toLowerCase().includes(searchText)) ||
          (article.description && article.description.toLowerCase().includes(searchText)) ||
          (article.source && article.source.toLowerCase().includes(searchText))
        );
      });

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Newspaper className="h-7 w-7 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold">Ethical Beauty News</h1>
        </div>
        <p className="text-gray-600 text-center max-w-2xl">
          Stay up to date with the latest news and trends in ethical and sustainable beauty products.
        </p>
      </div>
      
      {/* Barre de recherche */}
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
        {searchQuery && (
          <div className="text-center text-sm text-gray-500 mt-2">
            Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
              <Newspaper className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery 
                  ? "No articles found matching your search" 
                  : "No articles found"}
              </p>
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="mt-3 text-emerald-600 hover:underline text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
