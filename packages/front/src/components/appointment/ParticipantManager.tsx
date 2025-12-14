import React, { useState } from 'react';
import type { Participant } from '../../types/participant';
import {
  Text,
  Group,
  Stack,
  TextInput,
  ActionIcon,
  Button,
  Avatar,
  Divider,
  Title,
  Box,
  Paper,
} from '@mantine/core';
import {
  BsPencil,
  BsCheck,
  BsTrash,
  BsPersonPlus,
  BsPerson,
} from 'react-icons/bs';
import {
  useMutationAddParticipant,
  useMutationDeleteParticipant,
} from '../../queries/participant';

interface ParticipantManagerProps {
  appointmentKey: string;
  participants: Participant[];
  editingParticipantId: string | null;

  /**
   * id가 있으면 해당 유저 수정 모드 진입 (다른 컴포넌트들에 전파됨)
   * null이면 수정 종료 (읽기 모드로 복귀)
   */
  onParticipantClick: (id: string | null) => void;
}

export function ParticipantManager({
  appointmentKey,
  participants,
  editingParticipantId,
  onParticipantClick,
}: ParticipantManagerProps) {
  const [newParticipantName, setNewParticipantName] = useState('');
  const { mutateAsync: addParticipant, isPending: isAdding } =
    useMutationAddParticipant(appointmentKey);
  const { mutateAsync: deleteParticipant, isPending: isDeleting } =
    useMutationDeleteParticipant(appointmentKey);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim()) return;

    addParticipant({ name: newParticipantName });
    setNewParticipantName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 이 참여자를 삭제하시겠습니까?')) {
      deleteParticipant(id);
      if (editingParticipantId === id) {
        onParticipantClick(null);
      }
    }
  };

  const handleToggleEdit = (id: string) => {
    if (editingParticipantId === id) {
      onParticipantClick(null);
    } else {
      onParticipantClick(id);
    }
  };

  return (
    <Paper withBorder shadow="xs" radius="md" p="md" mb="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>참여자 목록</Title>
          <Text c="dimmed" size="sm">
            {participants.length}명 참여 중
          </Text>
        </Group>

        <Divider />

        {/* 참여자 리스트 */}
        <Stack gap="sm">
          {participants.map((user) => {
            const isEditing = editingParticipantId === user.id;

            return (
              <Group key={user.id} justify="space-between" wrap="nowrap">
                <Group gap="sm">
                  <Avatar color="blue" radius="xl">
                    <BsPerson size="1.2rem" />
                  </Avatar>
                  <Box>
                    <Text fw={500} size="sm">
                      {user.name}
                    </Text>
                    {isEditing && (
                      <Text c="blue" size="xs" fw={700}>
                        수정 중...
                      </Text>
                    )}
                  </Box>
                </Group>

                <Group gap={8}>
                  <ActionIcon
                    variant={isEditing ? 'filled' : 'light'}
                    color={isEditing ? 'blue' : 'gray'}
                    onClick={() => handleToggleEdit(user.id)}
                    title={isEditing ? '수정 완료' : '참여 정보 수정'}
                  >
                    {isEditing ? (
                      <BsCheck size="1.1rem" />
                    ) : (
                      <BsPencil size="0.9rem" />
                    )}
                  </ActionIcon>

                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(user.id)}
                    title="참여자 삭제"
                    loading={isDeleting}
                  >
                    <BsTrash size="0.9rem" />
                  </ActionIcon>
                </Group>
              </Group>
            );
          })}

          {participants.length === 0 && (
            <Text c="dimmed" size="sm" ta="center" py="sm">
              아직 참여자가 없습니다.
            </Text>
          )}
        </Stack>

        <Divider />

        {/* 새 참여자 추가 폼 */}
        <form onSubmit={handleAddSubmit}>
          <Group gap="xs">
            <TextInput
              placeholder="이름 입력"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              style={{ flex: 1 }}
              size="sm"
            />
            <Button
              type="submit"
              size="sm"
              variant="light"
              leftSection={<BsPersonPlus />}
              disabled={!newParticipantName.trim()}
              loading={isAdding}
            >
              추가
            </Button>
          </Group>
        </form>
      </Stack>
    </Paper>
  );
}
