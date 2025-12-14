import { prisma } from './prisma.ts';
import type {
  AppointmentModel,
  AppointmentUpdateInput,
} from '../prisma-generated/models.ts';
import type { AppointmentInfo } from '../model/appointment.ts';

export interface IAppointmentRepository {
  /**
   * 지금까지 시스템에 생성된 약속의 총 개수를 샘
   */
  countAllAppointments(): Promise<number>;

  /**
   * 새로운 약속을 생성함
   *
   * @param nonce 랜덤 토큰값
   * @param name 약속의 제목
   * @param startDate 시작날짜 (포함)
   * @param endDate 종료날짜 (포함)
   *
   * @returns 생성된 약속 값
   *
   * @throws endDate < startDate라면 예외 발생
   */
  createAppointment(
    nonce: number,
    name: string,
    startDate: Date,
    endDate: Date
  ): Promise<AppointmentModel>;

  /**
   * 약속의 기본 정보를 불러옴
   *
   * @returns 약속 정보
   */
  getAppointment(id: number, nonce: number): Promise<AppointmentInfo | null>;

  /**
   * 약속의 기본 정보를 업데이트함
   *
   * @param updates 업데이트할 내용. key는 항상 포함되어 있어야 함.
   * @returns 업데이트된 약속 값
   */
  updateAppointment(
    id: number,
    nonce: number,
    updates: Omit<AppointmentUpdateInput, 'nonce'>
  ): Promise<void>;

  /**
   * 약속을 삭제함
   */
  deleteAppointment(id: number, nonce: number): Promise<void>;

  /**
   * 기존 태그를 삭제하고 새로 태그를 붙임
   *
   * @param id 수정할 약속의 ID
   * @param nonce 수정할 약속의 nonce값
   * @param tagIds 태그 ID 배열
   */
  updateTags(id: number, nonce: number, tagIds: number[]): Promise<void>;
}

export class AppointmentRepository implements IAppointmentRepository {
  constructor() {}

  async countAllAppointments() {
    return await prisma.appointment.count();
  }

  async createAppointment(
    nonce: number,
    name: string,
    startDate: Date,
    endDate: Date
  ): Promise<AppointmentModel> {
    if (endDate.getTime() < startDate.getTime())
      throw new Error('End date must be after start date');

    return await prisma.appointment.create({
      data: {
        nonce,
        name,
        startDate,
        endDate,
      },
    });
  }

  async getAppointment(
    id: number,
    nonce: number
  ): Promise<AppointmentInfo | null> {
    const data = await prisma.appointment.findUnique({
      where: { id, nonce },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (data === null) {
      return null;
    }

    return {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      participants: data.participants,
      tags: data.tags.map((x) => x.tag),
    };
  }

  async updateAppointment(
    id: number,
    nonce: number,
    updates: Omit<AppointmentUpdateInput, 'nonce'>
  ): Promise<void> {
    await prisma.appointment.update({
      where: { id, nonce },
      data: updates,
    });
  }

  async deleteAppointment(id: number, nonce: number): Promise<void> {
    await prisma.appointment.delete({
      where: { id, nonce },
    });
  }

  async updateTags(id: number, nonce: number, tagIds: number[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      //TODO: Handle error
      await tx.appointment.findUniqueOrThrow({
        where: {
          id,
          nonce,
        },
      });
      await tx.tagsOnAppointments.deleteMany({
        where: {
          appointmentId: id,
        },
      });
      await tx.tagsOnAppointments.createMany({
        data: tagIds.map((tagId) => ({ appointmentId: id, tagId })),
      });
    });
  }
}

export const appointmentRepository = new AppointmentRepository();
