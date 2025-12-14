import { useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { LocalDate } from '@js-joda/core';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useQueryCalendarMonth } from '../../queries/calendar';

const EMPTY_ARRAY: [string, string][][] = Array.from({ length: 31 }, () => []);

interface AvailabilityCalendarProps {
  appointmentKey: string;
  editParticipantId: string | null;
  highlightTags: string[] | null;
  startDate: LocalDate;
  endDate: LocalDate;
  renderMonth: LocalDate;
  totalParticipantsCount: number;
  onPaintDate: (date: LocalDate) => void;
}

export const AvailabilityCalendar = ({
  appointmentKey,
  editParticipantId,
  highlightTags,
  startDate,
  endDate,
  renderMonth,
  totalParticipantsCount,
  onPaintDate,
}: AvailabilityCalendarProps) => {
  const calendarQuery = useQueryCalendarMonth(
    appointmentKey,
    renderMonth.year(),
    renderMonth.monthValue()
  );

  const calendarData = calendarQuery.data?.tags ?? EMPTY_ARRAY;

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = renderMonth.withDayOfMonth(1);
    const dayOfWeekVal = firstDayOfMonth.dayOfWeek().value();
    const startOffset = dayOfWeekVal % 7;
    const calendarStart = firstDayOfMonth.minusDays(startOffset);

    return Array.from({ length: 42 }, (_, i) => calendarStart.plusDays(i));
  }, [renderMonth]);

  const cellStyles = useMemo(() => {
    return calendarDays.map((date) => {
      const isCurrentMonth = date.month() === renderMonth.month();
      if (!isCurrentMonth) {
        return {
          bg: 'transparent',
          color: 'transparent',
          cursor: 'default',
          interactive: false,
          icon: null,
          borderColor: 'transparent',
        };
      }

      const isOutOfRange = date.isBefore(startDate) || date.isAfter(endDate);
      if (isOutOfRange) {
        return {
          bg: '#f8f9fa',
          color: '#adb5bd',
          cursor: 'default',
          interactive: false,
          icon: null,
          borderColor: 'transparent',
        };
      }

      const dayIndex = date.dayOfMonth() - 1;
      const votes = calendarData[dayIndex] || [];

      if (editParticipantId) {
        const hasVoted = votes.some(([uid]) => uid === editParticipantId);

        return {
          bg: hasVoted ? '#e6fcf5' : '#ffffff',
          borderColor: hasVoted ? '#0ca678' : '#dee2e6',
          color: hasVoted ? '#087f5b' : '#212529',
          interactive: true,
          icon: hasVoted ? <BsCheckCircleFill /> : null,
          cursor: 'pointer',
        };
      }

      let ratio = 0;

      if (highlightTags && highlightTags.length > 0) {
        const userVotes = new Map<string, Set<string>>();
        votes.forEach(([uid, tag]) => {
          if (!userVotes.has(uid)) userVotes.set(uid, new Set());
          userVotes.get(uid)?.add(tag);
        });

        let qualifiedUsers = 0;
        userVotes.forEach((tags) => {
          const hasAllTags = highlightTags.every((ht) => tags.has(ht));
          if (hasAllTags) qualifiedUsers++;
        });

        ratio =
          totalParticipantsCount > 0
            ? qualifiedUsers / totalParticipantsCount
            : 0;
      } else {
        const uniqueVoters = new Set(votes.map(([uid]) => uid)).size;
        ratio =
          totalParticipantsCount > 0
            ? uniqueVoters / totalParticipantsCount
            : 0;
      }

      let backgroundColor = '#ffffff';
      if (ratio > 0) {
        backgroundColor = `rgba(18, 184, 134, ${0.1 + ratio * 0.9})`;
      }

      return {
        bg: backgroundColor,
        borderColor: 'transparent',
        color: ratio > 0.6 ? '#fff' : '#212529',
        interactive: true,
        icon: null,
        cursor: 'pointer',
      };
    });
  }, [
    calendarDays,
    calendarData,
    renderMonth,
    startDate,
    endDate,
    editParticipantId,
    highlightTags,
    totalParticipantsCount,
  ]);

  return (
    <Container size="sm">
      {/* 요일 헤더 */}
      <Grid columns={7} gutter={0} mb="xs">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <Grid.Col span={1} key={day}>
            <Text
              ta="center"
              size="sm"
              fw={500}
              c={idx === 0 ? 'red.5' : idx === 6 ? 'blue.5' : 'dimmed'}
            >
              {day}
            </Text>
          </Grid.Col>
        ))}
      </Grid>

      {/* 날짜 그리드 */}
      <Grid columns={7} gutter={4}>
        {calendarDays.map((date, index) => {
          // 미리 계산된 스타일 배열에서 해당 인덱스의 스타일을 가져옴
          const style = cellStyles[index];
          const isToday = date.equals(LocalDate.now());

          return (
            <Grid.Col span={1} key={date.toString()}>
              <Tooltip
                label={date.toString()}
                disabled={!style.interactive}
                openDelay={500}
              >
                <UnstyledButton
                  onClick={() => style.interactive && onPaintDate(date)}
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 0.8',
                    backgroundColor: style.bg,
                    borderRadius: '8px',
                    border: `1px solid ${style.borderColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: style.cursor,
                    position: 'relative',
                  }}
                >
                  <Text
                    size="sm"
                    fw={isToday ? 700 : 500}
                    c={style.color}
                    td={isToday ? 'underline' : undefined}
                  >
                    {date.dayOfMonth()}
                  </Text>

                  {style.icon && (
                    <Box mt={2} c={style.color} style={{ fontSize: '0.8rem' }}>
                      {style.icon}
                    </Box>
                  )}
                </UnstyledButton>
              </Tooltip>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
};
