import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient();
export const axiosClient = axios.create({
  allowAbsoluteUrls: false,
  baseURL: import.meta.env.PUBLIC_API_URL || '/api',
});
