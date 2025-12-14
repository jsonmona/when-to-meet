import {
  participantRepository,
  type IParticipantRepository,
} from '../repository/participant.ts';

export interface IParticipantService {
  /**
   * 약속에 새로운 참가자를 추가함
   *
   * @param appointmentId 참가자를 추가할 약속의 ID
   * @param nonce 해당 약속의 nonce
   * @param name 이름
   *
   * @returns 새로 생성된 참가자 ID. 약속을 찾을 수 없다면 null.
   */
  createParticipant(
    appointmentId: bigint,
    nonce: number,
    name: string
  ): Promise<bigint | null>;

  /**
   * 참가자 이름을 변경함
   *
   * @param id 갱신할 참가자 ID
   * @param name 변경할 이름
   */
  updateParticipant(id: bigint, name: string): Promise<void>;

  /**
   * 약속을 삭제함
   */
  deleteParticipant(id: bigint): Promise<void>;
}

export class ParticipantService implements IParticipantService {
  repository: IParticipantRepository;

  constructor(repository: IParticipantRepository) {
    this.repository = repository;
  }

  async createParticipant(
    appointmentId: bigint,
    nonce: number,
    name: string
  ): Promise<bigint | null> {
    const data = await this.repository.addParticipant(
      appointmentId,
      nonce,
      name
    );
    if (!data) {
      return null;
    }

    return data.id;
  }

  async updateParticipant(id: bigint, name: string): Promise<void> {
    await this.repository.updateParticipant(id, name);
  }

  async deleteParticipant(id: bigint): Promise<void> {
    await this.repository.deleteParticipant(id);
  }
}

export const participantService = new ParticipantService(participantRepository);
