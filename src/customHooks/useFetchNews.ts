import { useState, useEffect } from "react";
import axios from "axios";

interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  published: string;
  byline?: string;
  images?: Array<{
    url: string;
    caption?: string;
  }>;
  links: {
    web: {
      href: string;
    };
  };
  categories?: Array<{
    description: string;
  }>;
}

interface NewsResponse {
  articles: NewsArticle[];
}

export default function useFetchNews(
  sport: "basketball" | "football" | "baseball",
  league: "nba" | "nfl" | "mlb"
) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!sport || !league) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<NewsResponse>(
          `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/news`
        );
        setNews(response.data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch news");
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [sport, league]);

  return { news, loading, error };
}
export type { NewsArticle };
