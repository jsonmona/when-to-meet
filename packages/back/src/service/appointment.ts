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
  const bytes = await randomBytesAsync(8);
  return bytes.readUInt8();
}

function composeKey({ id, nonce }: { id: number; nonce: number }) {
  return `${id}-${nonce}`;
}

function decomposeKey(key: string) {
  const [id, nonce] = key.split('-');

  return {
    id: parseInt(id!),
    nonce: parseInt(nonce!),
  };
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
   *
   * @returns 새로 생성된 약속의 key값
   */
  createAppointment(
    name: string,
    startDate: LocalDate,
    endDate: LocalDate
  ): Promise<string>;

  /**
   * 약속 기본정보를 불러옴
   *
   * @param key 약속의 key값
   */
  getAppointment(key: string): Promise<AppointmentInfo | null>;

  /**
   * 약속 기본사항을 갱신함
   *
   * @param key 약속의 key값
   * @param updates 갱신할 내용
   */
  updateAppointment(
    key: string,
    name: string,
    startDate: LocalDate,
    endDate: LocalDate
  ): Promise<void>;

  /**
   * 약속을 삭제함
   */
  deleteAppointment(key: string): Promise<void>;
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
    endDate: LocalDate
  ) {
    const data = await this.repository.createAppointment(
      await generateNonce(),
      name,
      convert(startDate).toDate(),
      convert(endDate).toDate()
    );

    return composeKey(data);
  }

  async getAppointment(key: string): Promise<AppointmentInfo | null> {
    const { id, nonce } = decomposeKey(key);

    return await this.repository.getAppointment(id, nonce);
  }

  async updateAppointment(
    key: string,
    name: string,
    startDate: LocalDate,
    endDate: LocalDate
  ) {
    const { id, nonce } = decomposeKey(key);

    await this.repository.updateAppointment(id, nonce, {
      name: name,
      startDate: convert(startDate).toDate(),
      endDate: convert(endDate).toDate(),
    });
  }

  async deleteAppointment(key: string) {
    const { id, nonce } = decomposeKey(key);
    await this.repository.deleteAppointment(id, nonce);
  }
}

export const appointmentService = new AppointmentService(appointmentRepository);
