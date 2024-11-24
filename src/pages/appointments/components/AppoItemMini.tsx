// External imports
import { format } from '@formkit/tempo';
import { useNavigate } from 'react-router-dom';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function AppoItemMini({ data }: { data: IAppointment }) {
  const capitalize = useCapitalize();
  const navigate = useNavigate();

  return (
    <button
      className='flex w-full items-center space-x-4 rounded-sm border border-transparent px-1 py-1 hover:border hover:border-slate-200'
      onClick={() => navigate(`/appointments/${data._id}`)}
    >
      <div className='flex w-[135px] items-center space-x-3'>
        <p className='rounded-sm bg-slate-200 px-2 py-1 text-xsm text-slate-600'>{format(data.day, 'DD/MM/YY')}</p>
        <p className='rounded-sm bg-emerald-100 px-2 py-1 text-xsm text-emerald-600'>{data.hour}</p>
      </div>
      <div className='flex flex-1 flex-row justify-between'>
        <div>
          <p className='text-sm'>{`${capitalize(data.user.firstName)} ${capitalize(data.user.lastName)}`}</p>
        </div>
        <div>
          <p className='text-sm'>{`${capitalize(data.professional.title.abbreviation)} ${capitalize(data.professional.firstName)} ${capitalize(data.professional.lastName)}`}</p>
        </div>
      </div>
    </button>
  );
}
