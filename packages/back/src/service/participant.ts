import {
  participantRepository,
  type IParticipantRepository,
} from '../repository/participant.ts';
import { decomposeKey } from './appointment.ts';

export interface IParticipantService {
  /**
   * 약속에 새로운 참가자를 추가함
   *
   * @param appointmentKey 참가자를 추가할 약속의 key값
   * @param name 이름
   *
   * @returns 새로 생성된 참가자 ID. 약속을 찾을 수 없다면 null.
   */
  createParticipant(
    appointmentKey: string,
    name: string
  ): Promise<string | null>;

  /**
   * 참가자 이름을 변경함
   *
   * @param id 갱신할 참가자 ID
   * @param name 변경할 이름
   */
  updateParticipant(id: string, name: string): Promise<void>;

  /**
   * 약속을 삭제함
   */
  deleteParticipant(id: string): Promise<void>;
}

export class ParticipantService implements IParticipantService {
  repository: IParticipantRepository;

  constructor(repository: IParticipantRepository) {
    this.repository = repository;
  }

  async createParticipant(
    appointmentKey: string,
    name: string
  ): Promise<string | null> {
    const { id, nonce } = decomposeKey(appointmentKey);

    const data = await this.repository.addParticipant(id, nonce, name);
    if (!data) {
      return null;
    }

    return data.id.toString();
  }

  async updateParticipant(id: string, name: string): Promise<void> {
    const intId = parseInt(id);
    if (isNaN(intId)) {
      throw new Error('invalid id');
    }

    await this.repository.updateParticipant(intId, name);
  }

  async deleteParticipant(id: string): Promise<void> {
    const intId = parseInt(id);
    if (isNaN(intId)) {
      throw new Error('invalid id');
    }

    await this.repository.deleteParticipant(intId);
  }
}

export const participantService = new ParticipantService(participantRepository);
