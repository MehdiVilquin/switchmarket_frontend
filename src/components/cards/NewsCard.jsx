import { ExternalLink, Newspaper, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export default function NewsCard({ article }) {
  const { title, description, url, image, source, publishedAt } = article;

  const formattedDate = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true })
    : "Unknown date";

  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 bg-white border-2 border-gray-200 hover:border-black">
      <div className="flex flex-col p-4">
        <CardContent className="flex flex-col gap-6 p-0">
          {/* Image Container */}
          <div className="relative flex justify-center">
            <div className="relative h-48 w-full group-hover:scale-105 transition-transform duration-300">
              <img
                src={image || "/placeholder.png"}
                alt={title}
                className="object-cover w-full h-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Newspaper className="h-4 w-4 text-emerald-300" />
                    {source}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-gray-900 leading-tight tracking-tight line-clamp-2">
              {title}
            </h3>
            <p className="text-base text-gray-600 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Read More Link */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-base font-medium text-emerald-600 hover:text-emerald-800 hover:underline self-end mt-auto"
          >
            Read article
            <ExternalLink className="h-4 w-4 ml-1.5" />
          </a>
        </CardContent>
      </div>
    </Card>
  );
}
