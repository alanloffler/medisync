// Components
import { DateTime } from '@core/components/common/DateTime';
// External imports
import { spring, useAnimate } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Imports
import type { IAppointment } from '@appointments/interfaces/appointment.interface';
import { useCapitalize } from '@core/hooks/useCapitalize';
// React component
export function AppoItemMini({ data }: { data: IAppointment }) {
  const [firstScope, firstAnimation] = useAnimate();
  const [secondScope, secondAnimation] = useAnimate();
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  return (
    <button
      className='flex w-full items-center space-x-4 rounded-sm py-1 hover:bg-slate-50'
      onClick={() => navigate(`/appointments/${data._id}`)}
      onMouseOver={() => {
        firstAnimation(firstScope.current, { x: 5 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
        secondAnimation(secondScope.current, { x: -5 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
      }}
      onMouseOut={() => {
        firstAnimation(firstScope.current, { x: 0 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
        secondAnimation(secondScope.current, { x: 0 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 });
      }}
    >
      <section className='flex w-[135px] items-center'>
        <div ref={firstScope}>
          <DateTime day={data.day} hour={data.hour} />
        </div>
      </section>
      <section className='flex flex-1 flex-row justify-between'>
        <div className='flex w-1/2 justify-around space-x-2 text-slate-700'>
          <div className='flex text-xsm font-bold'>{`${capitalize(data.user.firstName)} ${capitalize(data.user.lastName)}`}</div>
          <div className='text-xs text-slate-500'>{`${t('label.identityCard')} ${i18n.format(data.user.dni, 'number', i18n.resolvedLanguage)}`}</div>
        </div>
        <div className='flex w-1/2 justify-end text-xs text-slate-700'>
          <div className='font-bold md:w-1/2'>{`${capitalize(data.professional.title.abbreviation)} ${capitalize(data.professional.firstName)} ${capitalize(data.professional.lastName)}`}</div>
          <div ref={secondScope} className='hidden text-slate-500 md:block md:w-1/2'>
            {capitalize(data.professional.specialization.name)}
          </div>
        </div>
      </section>
    </button>
  );
}
