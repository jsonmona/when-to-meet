import { LocalDate, convert } from 'js-joda';
import crypto from 'crypto';
import util from 'util';
import {
  appointmentRepository,
  type IAppointmentRepository,
} from '../repository/appointment.ts';
import type { AppointmentInfo } from '../model/appointment.ts';

const randomBytesAsync = util.promisify(crypto.randomBytes);

async function generateNonce() {
  const bytes = await randomBytesAsync(16);
  return bytes.readUInt16LE();
}

export interface IAppointmentService {
  /**
   * 지금까지 시스템에 생성된 약속의 총 개수를 샘
   */
  countAllAppointments(): Promise<number>;

  /**
   * 새로운 약속을 생성함
   *
   * @param name 약속의 제목
   * @param startDate 시작날짜 (포함)
   * @param endDate 종료날짜 (포함)
   * @param tagNames 태그 목록
   *
   * @returns 새로 생성된 약속의 key값
   */
  createAppointment(
    name: string,
    startDate: LocalDate,
    endDate: LocalDate,
    tagNames: string[]
  ): Promise<{ id: bigint; nonce: number }>;

  /**
   * 약속의 nonce가 맞는지 확인함
   */
  validateNonce(id: bigint, nonce: number): Promise<boolean>;

  /**
   * 약속 기본정보를 불러옴
   */
  getAppointment(id: bigint, nonce: number): Promise<AppointmentInfo | null>;

  /**
   * 약속 기본사항을 갱신함
   */
  updateAppointment(
    id: bigint,
    nonce: number,
    name: string,
    startDate: LocalDate,
    endDate: LocalDate,
    tagNames: string[]
  ): Promise<void>;

  /**
   * 약속을 삭제함
   */
  deleteAppointment(id: bigint, nonce: number): Promise<void>;
}

export class AppointmentService implements IAppointmentService {
  repository: IAppointmentRepository;

  constructor(repository: IAppointmentRepository) {
    this.repository = repository;
  }

  async countAllAppointments() {
    return await this.repository.countAllAppointments();
  }

  async createAppointment(
    name: string,
    startDate: LocalDate,
    endDate: LocalDate,
    tagNames: string[]
  ) {
    const data = await this.repository.createAppointment(
      await generateNonce(),
      name,
      convert(startDate).toDate(),
      convert(endDate).toDate()
    );
    await this.repository.updateTagsByName(data.id, data.nonce, tagNames);
    return data;
  }

  async validateNonce(id: bigint, nonce: number): Promise<boolean> {
    try {
      return (await this.repository.getAppointment(id, nonce)) !== null;
    } catch (e) {
      return false;
    }
  }

  async getAppointment(
    id: bigint,
    nonce: number
  ): Promise<AppointmentInfo | null> {
    return await this.repository.getAppointment(id, nonce);
  }

  async updateAppointment(
    id: bigint,
    nonce: number,
    name: string,
    startDate: LocalDate,
    endDate: LocalDate,
    tagNames: string[]
  ) {
    await this.repository.updateAppointment(id, nonce, {
      name: name,
      startDate: convert(startDate).toDate(),
      endDate: convert(endDate).toDate(),
    });
    await this.repository.updateTagsByName(id, nonce, tagNames);
  }

  async deleteAppointment(id: bigint, nonce: number) {
    await this.repository.deleteAppointment(id, nonce);
  }
}

export const appointmentService = new AppointmentService(appointmentRepository);
