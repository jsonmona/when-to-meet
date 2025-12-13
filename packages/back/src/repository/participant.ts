import { prisma } from './prisma.ts';
import type { ParticipantModel } from '../prisma-generated/models.ts';

export interface IParticipantRepository {
  /**
   * 새 참가자를 주어진 약속에 추가함
   *
   * @param appointmentId 추가될 약속 ID
   * @param nonce 추가될 약속의 nonce, null이면 검증 안함
   * @param name 추가될 참가자의 이름
   *
   * @returns 추가된 참가자 정보. 약속을 찾을 수 없다면 null.
   */
  addParticipant(
    appointmentId: number,
    nonce: number | null,
    name: string
  ): Promise<ParticipantModel | null>;

  /**
   * 참가자 정보를 수정함
   *
   * @param id 참가자 ID
   * @param name 새 이름
   */
  updateParticipant(id: number, name: string): Promise<void>;

  /**
   * 참가자를 삭제함
   *
   * @param id 참가자 ID
   */
  deleteParticipant(id: number): Promise<void>;
}

export class ParticipantRepository implements IParticipantRepository {
  constructor() {}

  async addParticipant(
    appointmentId: number,
    nonce: number | null,
    name: string
  ): Promise<ParticipantModel | null> {
    const data = await prisma.$transaction(async (tx) => {
      if (nonce !== null) {
        const found = await tx.appointment.findUnique({
          where: {
            id: appointmentId,
            nonce: nonce,
          },
          select: {
            id: true,
          },
        });

        if (found === null) {
          return null;
        }
      }

      return await tx.participant.create({
        data: {
          name,
          appointmentId,
        },
      });
    });

    return data;
  }

  async updateParticipant(id: number, name: string): Promise<void> {
    await prisma.participant.update({
      where: { id },
      data: { name },
    });
  }

  async deleteParticipant(id: number): Promise<void> {
    await prisma.participant.delete({
      where: { id },
    });
  }
}

export const participantRepository = new ParticipantRepository();
