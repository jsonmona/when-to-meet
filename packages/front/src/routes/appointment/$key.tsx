import { createFileRoute } from '@tanstack/react-router';
import { AppointmentHeader } from '../../components/appointment/AppointmentHeader';
import { DateTimeFormatter, LocalDate } from '@js-joda/core';
import { ParticipantManager } from '../../components/appointment/ParticipantManager';
import { useQueryAppointment } from '../../queries/appointment';
import { Container, Paper, Skeleton, Stack } from '@mantine/core';
import { AvailabilityCalendar } from '../../components/appointment/AvailabilityCalendar';
import { CalendarHeader } from '../../components/appointment/CalendarHeader';
import { useState } from 'react';
import { TagCheckboxList } from '../../components/appointment/TagCheckboxList';

export const Route = createFileRoute('/appointment/$key')({
  component: RouteComponent,
});

function RouteComponent() {
  const { key: appointmentKey } = Route.useParams();
  const appointment = useQueryAppointment(appointmentKey);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [renderDate, setRenderDate] = useState(() =>
    LocalDate.now().withDayOfMonth(1)
  );

  if (!appointment.isSuccess) {
    return (
      <Container size="xl">
        <Stack gap="sm">
          <Skeleton height={80} />
          <Skeleton height={200} />
          <Skeleton height={150} />
          <Skeleton height={500} />
        </Stack>
      </Container>
    );
  }

  const startDate = LocalDate.parse(
    appointment.data.startDate,
    DateTimeFormatter.ISO_DATE
  );
  const endDate = LocalDate.parse(
    appointment.data.endDate,
    DateTimeFormatter.ISO_DATE
  );

  return (
    <Container size="xl">
      <AppointmentHeader
        title={appointment.data.name}
        startDate={startDate}
        endDate={endDate}
      />
      <ParticipantManager
        editingParticipantId={editTarget}
        appointmentKey={appointmentKey}
        onParticipantClick={setEditTarget}
        participants={appointment.data.participants}
      />
      <TagCheckboxList
        editMode={editTarget !== null}
        allTags={appointment.data.tags}
        selectedTags={selectedTags}
        onChange={setSelectedTags}
      />

      <Paper withBorder shadow="xs" radius="md" p="md" mb="md">
        <CalendarHeader
          year={renderDate.year()}
          month={renderDate.monthValue()}
          onMoveMonth={(adjust) =>
            setRenderDate((prev) => prev.plusMonths(adjust))
          }
        />
        <AvailabilityCalendar
          appointmentKey={appointmentKey}
          editParticipantId={editTarget}
          startDate={startDate}
          endDate={endDate}
          renderMonth={renderDate}
          highlightTags={selectedTags}
          onPaintDate={(x) => console.log(x)}
          totalParticipantsCount={appointment.data.participants.length}
        />
      </Paper>
    </Container>
  );
}
