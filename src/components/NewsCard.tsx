import React from 'react';
import {
  CardContent,
  CardMedia,
  Typography,
  Box,
  Link,
  Chip
} from '@mui/material';

import useWindowDimensions from '../customHooks/useWindowDimensions';

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
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 680;

  return (
    <article key={article.id || index} style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>
      {article.images && article.images.length > 0 && (
        <CardMedia
          component="img"
          sx={{ width: 360, height: 200, objectFit: 'fill' }}
          image={article.images[0].url}
          alt={article.images[0].caption || 'News image'}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">
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
          <Typography variant="caption" >
            {new Date(article.published).toLocaleDateString()}
          </Typography>
          {article.byline && (
            <Typography variant="caption" >
              By {article.byline}
            </Typography>
          )}
        </Box>

        <Typography variant="body2">
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
                color='primary'
              />
            ))}
          </Box>
        )}
      </CardContent>
    </article>
  );
};