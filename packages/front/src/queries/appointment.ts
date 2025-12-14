import { useQuery } from '@tanstack/react-query';
import { getAppointmentCount } from '../apis/appointment';

export const useQueryAppointmentCount = () =>
  useQuery({
    queryKey: ['appointment', 'count'],
    queryFn: getAppointmentCount,
    initialData: 0,
  });
