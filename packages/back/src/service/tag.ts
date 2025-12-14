import type { TagModel } from '../prisma-generated/models.ts';
import { tagRepository, type ITagRepository } from '../repository/tag.ts';

export interface ITagService {
  /**
   * 주어진 이름으로 시작하는 태그를 검색함.
   *
   * @param searchTerm 검색할 문자열
   * @param maxItems 최대 반환 수
   *
   * @returns 검색된 태그 목록
   */
  searchTag(searchTerm: string, maxItems: number): Promise<TagModel[]>;
}

export class TagService implements ITagService {
  repository: ITagRepository;

  constructor(repository: ITagRepository) {
    this.repository = repository;
  }

  async searchTag(searchTerm: string, maxItems: number): Promise<TagModel[]> {
    return await this.repository.searchTag(searchTerm, maxItems);
  }
}

export const tagService = new TagService(tagRepository);
