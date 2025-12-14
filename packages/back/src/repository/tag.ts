import { prisma } from './prisma.ts';
import type { TagModel } from '../prisma-generated/models.ts';
import { disassemble } from 'es-hangul';

export interface ITagRepository {
  /**
   * 기본으로 활성화될 태그 목록을 반환함.
   *
   * @returns 기본으로 활성화되어 있어야 할 태그 목록
   */
  defaultTag(): Promise<TagModel[]>;

  /**
   * 주어진 이름으로 시작하는 태그를 검색함.
   *
   * @param searchTerm 검색할 문자열
   * @param maxItems 최대 반환 수
   *
   * @returns 검색된 태그 목록
   */
  searchTag(searchTerm: string, maxItems: number): Promise<TagModel[]>;

  /**
   * 새로운 태그를 생성함.
   */
  createTag(name: string, isDefault: boolean): Promise<void>;
}

export class TagRepository implements ITagRepository {
  constructor() {}

  async defaultTag(): Promise<TagModel[]> {
    const data = await prisma.defaultTag.findMany({
      select: {
        id: true,
        tag: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return data.map((x) => x.tag);
  }

  async searchTag(searchTerm: string, maxItems: number): Promise<TagModel[]> {
    //TODO: 많이 사용한 순으로 정렬하면 좋을듯
    return await prisma.tag.findMany({
      where: {
        nameSearch: {
          startsWith: disassemble(searchTerm),
        },
      },
      take: maxItems,
    });
  }

  async createTag(name: string, isDefault: boolean): Promise<void> {
    let defaultTag = {};
    if (isDefault) {
      defaultTag = {
        create: {},
      };
    }

    await prisma.tag.create({
      data: {
        name,
        nameSearch: disassemble(name),
        defaultTag,
      },
    });
  }
}

export const tagRepository = new TagRepository();
