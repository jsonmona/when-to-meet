import {
  appointmentRepository,
  type IAppointmentRepository,
} from '../repository/appointment.ts';

export class AppointmentService {
  repository: IAppointmentRepository;

  constructor(repository: IAppointmentRepository) {
    this.repository = repository;
  }

  async countAllAppointments() {
    return await this.repository.countAllAppointments();
  }
}

export const appointmentService = new AppointmentService(appointmentRepository);
