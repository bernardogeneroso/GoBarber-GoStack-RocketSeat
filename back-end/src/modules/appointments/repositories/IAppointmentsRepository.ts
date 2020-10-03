import Appointment from '@modules/appointments/infra/typeorm/models/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthDTO from '@modules/appointments/dtos/IFindAllInMonthDTO';
import IFindAllInDayDTO from '@modules/appointments/dtos/IFindAllInDayDTO';

interface IAppointmentsRepository {
	create(data: ICreateAppointmentDTO): Promise<Appointment>;
	findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
	findAllInMonth(data: IFindAllInMonthDTO): Promise<Appointment[]>;
	findAllInDay(data: IFindAllInDayDTO): Promise<Appointment[]>;
}

export default IAppointmentsRepository;
