import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAppointmentCount,
  createAppointment,
  getAppointment,
} from '../apis/appointment';
import { queryClient } from '../constants';

export const useQueryAppointmentCount = () =>
  useQuery({
    queryKey: ['appointment', 'count'],
    queryFn: getAppointmentCount,
    initialData: 0,
  });

export const useMutationCreateAppointment = () =>
  useMutation({
    mutationFn: createAppointment,
    onSuccess: (newKey) => {
      queryClient.invalidateQueries({ queryKey: ['appointment', newKey] });
    },
  });

export const useQueryAppointment = (key: string) =>
  useQuery({
    queryKey: ['appointment', key],
    queryFn: () => getAppointment(key),
  });
