import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';

export function ApposList({ appointments }: { appointments: IAppointmentView[] }) {
  return (
    <main>
      <h1>Appointments list</h1>
      <section>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>{`${appointment.day} - ${appointment.professional.lastName}`}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
