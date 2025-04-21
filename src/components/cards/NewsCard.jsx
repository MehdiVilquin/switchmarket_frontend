import { ExternalLink, Newspaper, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsCard({ article }) {
  const {
    title,
    description,
    url,
    image,
    source,
    publishedAt
  } = article;

  const formattedDate = publishedAt 
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : 'Unknown date';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-100">
      <div className="relative h-48 w-full">
        <img
          src={image || "/placeholder.png"}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="font-medium text-sm flex items-center">
            <Newspaper className="h-4 w-4 mr-2 text-emerald-300" />
            {source}
          </div>
          <div className="text-xs flex items-center text-gray-200">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-3 line-clamp-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-4 flex-grow">{description}</p>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:underline self-end"
        >
          Read more
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}
