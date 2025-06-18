import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useTumblrPostsByIds(ids = []) {
  return useQuery({
    queryKey: ['tumblrPostsByIds', ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        ids.map(id =>
          axios
            .get(`${import.meta.env.VITE_API_URL}/api/tumblr/post/${id}`)
            .then(res => res.data)
            .catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
  });
}