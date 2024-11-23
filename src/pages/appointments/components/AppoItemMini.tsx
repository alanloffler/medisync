// External imports
import { format } from '@formkit/tempo';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function AppoItemMini({ data }: { data: IAppointment }) {
  const capitalize = useCapitalize();

  return (
    <button className='hover:!opacity-100 hover:!blur-none w-full rounded-sm flex items-center space-x-4 border border-transparent hover:border hover:border-slate-200 py-1 pr-2 pl-1'>
      <div className='flex w-[135px] items-center space-x-3'>
        <p className='rounded-sm bg-slate-200 px-2 py-1 text-xsm text-slate-600'>{format(data.day, 'DD/MM/YY')}</p>
        <p className='rounded-sm bg-emerald-100 px-2 py-1 text-xsm text-emerald-600'>{data.hour}</p>
      </div>
      <div className='flex flex-row justify-between flex-1'>
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
