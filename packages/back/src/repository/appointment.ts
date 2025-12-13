import { prisma } from './prisma.ts';
import { LocalDate, convert, nativeJs } from 'js-joda';
import crypto from 'crypto';
import util from 'util';

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

export interface IAppointmentRepository {
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
   * @returns 생성된 약속 값
   *
   * @throws endDate < startDate라면 예외 발생
   */
  createAppointment(
    name: string,
    startDate: LocalDate,
    endDate: LocalDate
  ): Promise<IAppointmentValue>;

  /**
   * 약속의 기본 정보를 업데이트함
   *
   * @param updates 업데이트할 내용. key는 항상 포함되어 있어야 함.
   * @returns 업데이트된 약속 값
   */
  updateAppointment(updates: IAppointmentValue): Promise<void>;
}

//TODO: 다른곳으로 분리
export interface IAppointmentValue {
  key: string;
  name: string;
  startDate: LocalDate;
  endDate: LocalDate;
}

export class AppointmentRepository implements IAppointmentRepository {
  constructor() {}

  async countAllAppointments() {
    return await prisma.appointment.count();
  }

  async createAppointment(
    name: string,
    startDate: LocalDate,
    endDate: LocalDate
  ): Promise<IAppointmentValue> {
    if (endDate.isBefore(startDate))
      throw new Error('End date must be after start date');

    const data = await prisma.appointment.create({
      data: {
        name,
        nonce: await generateNonce(),
        startDate: convert(startDate).toDate(),
        endDate: convert(endDate).toDate(),
      },
    });

    return {
      key: composeKey(data),
      name: data.name,
      startDate: LocalDate.from(nativeJs(data.startDate)),
      endDate: LocalDate.from(nativeJs(data.endDate)),
    };
  }

  async updateAppointment(updates: IAppointmentValue): Promise<void> {
    const { id, nonce } = decomposeKey(updates.key);

    await prisma.appointment.update({
      where: { id, nonce },
      data: {
        name: updates.name,
        startDate: convert(updates.startDate).toDate(),
        endDate: convert(updates.endDate).toDate(),
      },
    });
  }
}

export const appointmentRepository = new AppointmentRepository();
