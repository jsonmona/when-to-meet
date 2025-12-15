import {
  Text,
  Container,
  Title,
  TextInput,
  Button,
  Group,
  Stack,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQueryDefaultTag } from '../../queries/tag';
import { TagSelector } from '../../components/TagSelector';
import { useEffect } from 'react';
import { useMutationCreateAppointment } from '../../queries/appointment';

export const Route = createFileRoute('/appointment/new')({
  component: NewAppointment,
});

/** 약속에 이름을 지정하지 않았을 때 사용할 이름 */
const DEFAULT_NAME = '제목 없는 약속';

interface AppointmentFormValues {
  name: string;
  startDate: string | null;
  endDate: string | null;
  tags: string[] | null;
}

function NewAppointment() {
  const navigate = useNavigate();
  const { mutateAsync: onSubmit, isPending } = useMutationCreateAppointment();

  const form = useForm<AppointmentFormValues>({
    initialValues: {
      name: '',
      startDate: null,
      endDate: null,
      tags: null,
    },

    validate: {
      startDate: (value) => (!value ? '시작일을 선택해주세요.' : null),
      endDate: (value, values) => {
        if (!value) return '종료일을 선택해주세요.';
        if (values.startDate && value < values.startDate) {
          return '종료일은 시작일 이후여야 합니다.';
        }
        return null;
      },
      tags: (value) => {
        if (!value) return '아직 태그 목록이 로딩중이에요.';
        return value.length === 0 ? '최소 하나의 태그를 선택해주세요.' : null;
      },
    },
  });

  const defaultTags = useQueryDefaultTag();
  useEffect(() => {
    if (form.values.tags === null && defaultTags.isSuccess) {
      form.setFieldValue('tags', defaultTags.data);
    }
  }, [form, defaultTags.isSuccess, defaultTags.data]);

  const handleSubmit = (values: AppointmentFormValues) => {
    // 폼 검증시에 null이 아님을 체크했음
    const payload = {
      name: values.name || DEFAULT_NAME,
      startDate: values.startDate!,
      endDate: values.endDate!,
      tags: values.tags!,
    };

    onSubmit(payload).then((newKey) => {
      navigate({ to: '/appointment/$key', params: { key: newKey } });
    });
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>새 약속 만들기</Title>
          <Text c="dimmed" size="sm">
            약속 이름과 기간, 카테고리를 설정하여 모두가 가능한 날짜를 간편하게
            투표해보세요.
          </Text>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="약속 제목"
              placeholder={DEFAULT_NAME}
              maxLength={80}
              {...form.getInputProps('name')}
            />

            <Group grow align="flex-start">
              <DateInput
                withAsterisk
                label="시작일"
                placeholder="날짜 선택"
                valueFormat="YYYY년 MM월 DD일"
                firstDayOfWeek={0}
                {...form.getInputProps('startDate')}
              />
              <DateInput
                withAsterisk
                label="종료일"
                placeholder="날짜 선택"
                valueFormat="YYYY년 MM월 DD일"
                firstDayOfWeek={0}
                minDate={form.values.startDate ?? undefined}
                {...form.getInputProps('endDate')}
              />
            </Group>

            <TagSelector
              disabled={!defaultTags.isSuccess}
              selectedTags={form.values.tags || []}
              onSelectTags={(newTags) => form.setFieldValue('tags', newTags)}
            />

            <Button
              type="submit"
              fullWidth
              mt="md"
              size="md"
              loading={isPending}
            >
              약속 만들기
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
