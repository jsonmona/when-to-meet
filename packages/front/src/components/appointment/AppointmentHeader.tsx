import { ActionIcon, Group, Paper, Text, Title, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LocalDate, DateTimeFormatter } from '@js-joda/core';
import { BsFillClipboardFill } from 'react-icons/bs';

interface AppointmentHeaderProps {
  title: string;
  startDate: LocalDate;
  endDate: LocalDate;
}

// 날짜 포맷터 정의 (예: 12.01)
const dateFormatter = DateTimeFormatter.ofPattern('M.d');

export const AppointmentHeader = ({
  title,
  startDate,
  endDate,
}: AppointmentHeaderProps) => {
  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);

      notifications.show({
        title: '링크 복사 완료',
        message:
          '약속 링크가 클립보드에 저장되었습니다. 친구들에게 공유하세요!',
        color: 'teal',
      });
    } catch (err) {
      notifications.show({
        title: '복사 실패',
        message: '링크를 복사하는 중 오류가 발생했습니다.',
        color: 'red',
      });
    }
  };

  const dateRangeString = `${startDate.format(dateFormatter)} ~ ${endDate.format(dateFormatter)}`;

  return (
    <Paper withBorder shadow="xs" radius="md" p="md" mb="md">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} size="h3" mb={4}>
            {title}
          </Title>
          <Text c="dimmed" size="sm" fw={500}>
            📅 {dateRangeString}
          </Text>
        </div>

        <Tooltip label="약속 링크 복사하기" withArrow position="left">
          <ActionIcon
            variant="light"
            color="blue"
            size="xl"
            radius="md"
            onClick={handleCopyLink}
            aria-label="공유 링크 복사"
          >
            <BsFillClipboardFill />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
};
