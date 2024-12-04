// External imports
import { format } from '@formkit/tempo';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function AppoItemMini({ data }: { data: IAppointment }) {
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  return (
    <button
      className='flex w-full items-center space-x-4 rounded-sm py-1 hover:bg-slate-50 hover:pl-1'
      onClick={() => navigate(`/appointments/${data._id}`)}
    >
      <div className='flex w-[135px] items-center'>
        <div className='flex items-center rounded-l-sm rounded-r-sm bg-slate-100 text-xsm'>
          <p className='rounded-l-sm bg-slate-200 px-2 py-1 text-slate-600'>{format(data.day, 'short', i18n.resolvedLanguage).slice(0, -3)}</p>
          <p className='rounded-sm px-2 py-1 text-slate-500'>{data.hour}</p>
        </div>
      </div>
      <div className='flex flex-1 flex-row justify-between'>
        <div className='flex text-slate-700 space-x-2 w-1/2 justify-between'>
          <div className='text-xsm font-bold'>{`${capitalize(data.user.firstName)} ${capitalize(data.user.lastName)}`}</div>
          <div className='text-xs text-slate-500'>{`${t('label.identityCard')} ${i18n.format(data.user.dni, 'number', i18n.resolvedLanguage)}`}</div>
        </div>
        <div className='flex justify-end text-xs text-slate-700 w-1/2'>
          <div className='font-bold md:w-1/2'>{`${capitalize(data.professional.title.abbreviation)} ${capitalize(data.professional.firstName)} ${capitalize(data.professional.lastName)}`}</div>
          <div className='text-slate-500 md:w-1/2 hidden md:block'>{capitalize(data.professional.specialization.name)}</div>
        </div>
      </div>
    </button>
  );
}
