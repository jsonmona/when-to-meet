import { prisma } from './prisma.ts';
import type { TagModel } from '../prisma-generated/models.ts';

export interface ITagRepository {
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

export class TagRepository implements ITagRepository {
  constructor() {}

  async searchTag(searchTerm: string, maxItems: number): Promise<TagModel[]> {
    //TODO: 많이 사용한 순으로 정렬하면 좋을듯
    return await prisma.tag.findMany({
      where: {
        name: {
          startsWith: searchTerm,
        },
      },
      take: maxItems,
    });
  }
}

export const tagRepository = new TagRepository();
