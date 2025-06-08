import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Link,
  Chip
} from '@mui/material';

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

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, index }) => {
  return (
    <Card key={article.id || index} sx={{ display: 'flex', mb: 2 }}>
      {article.images && article.images.length > 0 && (
        <CardMedia
          component="img"
          sx={{ width: 180, height: 100, objectFit: 'fill' }}
          image={article.images[0].url}
          alt={article.images[0].caption || 'News image'}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          <Link
            href={article.links.web.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit', 
              '&:hover': { color: 'primary.main' } 
            }}
          >
            {article.headline}
          </Link>
        </Typography>
        
        <Box display="flex" gap={2} mb={1}>
          <Typography variant="caption" color="text.secondary">
            {new Date(article.published).toLocaleDateString()}
          </Typography>
          {article.byline && (
            <Typography variant="caption" color="text.secondary">
              By {article.byline}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {article.description}
        </Typography>

        {article.categories && article.categories.length > 0 && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {article.categories.slice(0, 3).map((category, i) => (
              <Chip
                key={i}
                label={category.description}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};