import { Box, Button, Group, Text } from '@mantine/core';
import React from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onMoveMonth: (adjust: number) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year,
  month,
  onMoveMonth,
}) => {
  return (
    <Box mb="sm">
      <Group align="baseline" justify="center" gap="sm">
        <Button variant="light" onClick={() => onMoveMonth(-1)}>
          <BsArrowLeft />
        </Button>
        <Text size="lg" fw={700}>
          {year}년 {month}월
        </Text>
        <Button variant="light" onClick={() => onMoveMonth(1)}>
          <BsArrowRight />
        </Button>
      </Group>
    </Box>
  );
};
