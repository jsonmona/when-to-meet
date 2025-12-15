import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../constants';
import { getCalendarMonth, updateCalendar } from '../apis/calendar';

export const useQueryCalendarMonth = (
  key: string,
  year: number,
  month: number
) =>
  useQuery({
    queryKey: ['appointment', key, 'calendar', year, month],
    queryFn: () => getCalendarMonth({ key, year, month }),
  });

export const useMutationUpdateCalendar = (key: string) =>
  useMutation({
    mutationFn: updateCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', key, 'calendar'],
      });
    },
  });
