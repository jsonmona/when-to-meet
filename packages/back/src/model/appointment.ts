import type { ParticipantInfo } from './participant.ts';

export interface AppointmentInfo {
  name: string;
  startDate: Date;
  endDate: Date;

  /** Tag.name만 기록됨 */
  tags: string[];
  participants: ParticipantInfo[];
}
