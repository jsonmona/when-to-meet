import z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../constants';
import {
  addParticipant,
  deleteParticipant,
  updateParticipant,
} from '../apis/participant';
import type {
  CreateParticipantRequest,
  UpdateParticipantRequest,
} from '@when-to-meet/api';

export const useMutationAddParticipant = (appointmentKey: string) =>
  useMutation({
    mutationFn: (
      req: Omit<z.input<typeof CreateParticipantRequest>, 'appointmentKey'>
    ) => addParticipant({ ...req, appointmentKey }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', appointmentKey],
      });
    },
  });

export const useMutationUpdateParticipant = (appointmentKey: string) =>
  useMutation({
    mutationFn: updateParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', appointmentKey],
      });
    },
  });

export const useMutationDeleteParticipant = (appointmentKey: string) =>
  useMutation({
    mutationFn: (id: string) => deleteParticipant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', appointmentKey],
      });
    },
  });
