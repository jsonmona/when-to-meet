import {
  Button,
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Center,
  Badge,
  Group,
} from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQueryAppointmentCount } from '../queries/appointment';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const appointmentCount = useQueryAppointmentCount();

  return (
    <Container size="sm" py="xl">
      <Stack gap={40} align="center">
        <Stack gap="xs" align="center">
          <Badge variant="light" size="lg" mb="sm">
            약속 잡기 서비스
          </Badge>
          <Title order={1} size={42} style={{ letterSpacing: -1 }}>
            언제만나?
          </Title>
          <Text c="dimmed" size="lg" ta="center">
            친구들과 만날때 언제 어디서 만날지 정하는게 어려우신가요?
            <br />
            날짜와 시간, 장소 투표까지 한번에 끝낼 수 있습니다.
          </Text>
        </Stack>

        <Paper
          shadow="md"
          radius="md"
          p="xl"
          withBorder
          w="100%"
          style={{ borderColor: 'var(--mantine-color-blue-2)' }}
        >
          <Stack align="center" gap="lg">
            <Text size="lg" fw={500}>
              지금까지 전국에서{' '}
              <Text span c="blue" inherit fw={800} size="xl">
                {appointmentCount.data.toLocaleString()}개
              </Text>
              의 약속을 잡았어요!
            </Text>

            <Button
              component={Link}
              to="/appointment/new"
              size="xl"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            >
              새 약속 만들기
            </Button>
          </Stack>
        </Paper>

        <Stack w="100%" gap="sm">
          <Text fw={600} size="sm" c="dimmed">
            서비스 미리보기
          </Text>
          <Paper w="100%" h={300} bg="gray.1" withBorder radius="md">
            <Center h="100%">
              <Stack align="center" gap="xs">
                <Text c="dimmed">홍보용 화면 스크린샷 영역</Text>
              </Stack>
            </Center>
          </Paper>
        </Stack>

        <Paper p="md" bg="gray.0" radius="md" w="100%">
          <Group justify="center">
            <Text size="sm" c="dimmed">
              이미 약속을 만드셨나요? 저장해둔 약속 링크로 바로 접속하세요.
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}
