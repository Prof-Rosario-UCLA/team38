import React from 'react';
import { Box } from '@mui/material';
import { NewsCard } from './NewsCard';

interface NewsArticle {
  id?: string;
  headline: string;
  description: string;
  published: string;
  byline?: string;
  images?: Array<{ url: string; caption?: string }>;
  categories?: Array<{ description: string }>;
  links: { web: { href: string } };
}

interface NewsSectionProps {
  news: NewsArticle[];
  newsLoading: boolean;
  newsError: string | null;
  currentLeague: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  newsLoading,
  newsError,
  currentLeague
}) => {
  if (newsLoading) return <p>Loading {currentLeague.toUpperCase()} news...</p>;
  if (newsError) return <p>No news available</p>;

  return (
    <section className="dashboard-section">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {news.slice(0, 10).map((article, index) => (
          <NewsCard key={article.id || index} article={article} index={index} />
        ))}
      </Box>
    </section>
  );
};
