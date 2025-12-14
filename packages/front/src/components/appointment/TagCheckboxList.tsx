import React from 'react';
import {
  Stack,
  Checkbox,
  Group,
  Text,
  Paper,
  Title,
  UnstyledButton,
  Divider,
} from '@mantine/core';
import { BsTag, BsCheckAll } from 'react-icons/bs';
import styles from './TagCheckboxList.module.css';

interface TagCheckboxListProps {
  editMode: boolean;
  allTags: string[];
  selectedTags: string[];
  onChange: (selected: string[]) => void;
}

export const TagCheckboxList = ({
  editMode,
  allTags,
  selectedTags,
  onChange,
}: TagCheckboxListProps) => {
  // 태그 토글 핸들러
  const handleToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    if (selectedTags.length === allTags.length) {
      onChange([]);
    } else {
      onChange([...allTags]);
    }
  };

  const isAllSelected =
    allTags.length > 0 && selectedTags.length === allTags.length;
  const isIndeterminate =
    selectedTags.length > 0 && selectedTags.length < allTags.length;

  /**
   * 개별 행을 렌더링하는 내부 컴포넌트 (스타일 및 클릭 영역 통합)
   */
  const SelectableRow = ({
    label,
    checked,
    indeterminate,
    icon,
    onClick,
  }: {
    label: string;
    checked: boolean;
    indeterminate?: boolean;
    icon: React.ReactNode;
    onClick: () => void;
  }) => (
    <UnstyledButton onClick={onClick} className={styles.rowButton}>
      <Group gap="sm" wrap="nowrap">
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          readOnly
          tabIndex={-1} // 탭 이동 시 버튼이 포커스를 받도록 설정
          style={{ pointerEvents: 'none' }} // 체크박스 자체 클릭 방지 (버튼 클릭으로 처리)
          aria-hidden="true"
        />
        <Group gap="xs" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', opacity: 0.6 }}>
            {icon}
          </div>
          <Text size="sm" fw={500} style={{ lineHeight: 1 }}>
            {label}
          </Text>
        </Group>
      </Group>
    </UnstyledButton>
  );

  return (
    <Paper withBorder shadow="xs" radius="md" p="md" mb="md">
      <Title order={5} mb="sm" px="xs">
        {editMode ? '날짜에 덮어쓸 카테고리' : '카테고리 필터'}
      </Title>

      <Stack gap={2}>
        {/* 전체 선택 옵션 */}
        <SelectableRow
          label="전체 보기"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          icon={<BsCheckAll size={16} />}
          onClick={handleSelectAll}
        />

        <Divider my={4} variant="dashed" />

        {/* 개별 태그 리스트 */}
        {allTags.map((tag) => (
          <SelectableRow
            key={tag}
            label={tag}
            checked={selectedTags.includes(tag)}
            icon={<BsTag size={14} />}
            onClick={() => handleToggle(tag)}
          />
        ))}

        {allTags.length === 0 && (
          <Text c="dimmed" size="xs" ta="center" py="sm">
            등록된 태그가 없습니다.
          </Text>
        )}
      </Stack>
    </Paper>
  );
};
