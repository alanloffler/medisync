// Imports
import type { IAppointmentView } from '@appointments/interfaces/appointment.interface';
// React component
export function ApposList({ appointments }: { appointments: IAppointmentView[] }) {
  return (
    <main>
      {/* TODO: implement tanstack table */}
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
