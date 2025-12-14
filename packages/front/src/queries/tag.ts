import { useQuery } from '@tanstack/react-query';
import { getDefaultTag } from '../apis/tag';

export const useQueryDefaultTag = () =>
  useQuery({
    queryKey: ['tag', 'default'],
    queryFn: getDefaultTag,
  });
