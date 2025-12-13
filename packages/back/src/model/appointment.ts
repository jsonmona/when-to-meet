import type { TagInfo } from './tag.ts';
import type { ParticipantInfo } from './participant.ts';

export interface AppointmentInfo {
  name: string;
  startDate: Date;
  endDate: Date;

  tags: TagInfo[];
  participants: ParticipantInfo[];
}
