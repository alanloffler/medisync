// Icons: https://lucide.dev/icons/
import { ArrowRight, CalendarClock, CalendarDays, Mail, MessageCircle, PencilLine, Smartphone, Tag, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Badge } from '@core/components/ui/badge';
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardFooter } from '@core/components/ui/card';
import { Separator } from '@core/components/ui/separator';
// Components
import { AvailableProfessional } from '@professionals/components/common/AvailableProfessional';
import { BackButton } from '@core/components/common/BackButton';
import { CardHeaderPrimary } from '@core/components/common/header/CardHeaderPrimary';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TableButton } from '@core/components/common/TableButton';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { CalendarService } from '@appointments/services/calendar.service';
import { EUserType } from '@core/enums/user-type.enum';
import { EWhatsappTemplate } from '@whatsapp/enums/template.enum';
import { PROFESSIONAL_VIEW_CONFIG as PV_CONFIG } from '@config/professionals/professional-view.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { motion } from '@core/services/motion.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function ViewProfessional() {
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [gotoScope, gotoAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  const {
    data: professional,
    error: professionalError,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<IResponse<IProfessional>, Error>({
    queryKey: ['professional', 'find-one', id],
    queryFn: async () => await ProfessionalApiService.findOne(id!),
    retry: 1,
  });

  useEffect(() => {
    if (isSuccess && professional.data.configuration.workingDays) {
      const selectedLocale: string = i18n.resolvedLanguage || i18n.language;
      const legibleWorkingDays: string = CalendarService.getLegibleWorkingDays(professional.data.configuration.workingDays, true, selectedLocale);
      setLegibleWorkingDays(legibleWorkingDays);
    }
  }, [i18n.language, i18n.resolvedLanguage, isSuccess, professional?.data.configuration.workingDays]);

  useEffect(() => {
    if (isError) addNotification({ type: 'error', message: t(professionalError.message) });
  }, [addNotification, isError, professionalError?.message, t]);

  function gotoAnimateOver(): void {
    const { keyframes, options } = motion.x(3).type('bounce').animate();
    gotoAnimation(gotoScope.current, keyframes, options);
  }

  function gotoAnimateOut(): void {
    const { keyframes, options } = motion.x(0).type('bounce').animate();
    gotoAnimation(gotoScope.current, keyframes, options);
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:gap-8 lg:p-8'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.viewProfessional')} breadcrumb={PV_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Page content */}
      <Card className='mx-auto w-full md:max-w-[550px]'>
        {isLoading && <LoadingDB text={t('loading.professional')} className='py-6' />}
        {isError && <InfoCard type='error' text={t(professionalError.message)} className='py-6' />}
        {professional && (
          <>
            <CardHeaderPrimary
              className='justify-center'
              title={UtilsString.upperCase(
                `${professional.data.title.abbreviation} ${professional.data.firstName} ${professional.data.lastName}`,
                'each',
              )}
            />
            <CardContent className='mt-6 space-y-6'>
              {professional.data.description && (
                <section className='flex space-x-4 text-ellipsis rounded-md bg-slate-100 px-4 py-3 italic text-slate-600'>
                  <span>{UtilsString.upperCase(professional.data.description)}</span>
                </section>
              )}
              <section className='space-y-3'>
                <h2 className='pt-2 text-xs font-medium uppercase leading-none text-slate-500'>{t('label.scheduleTitle')}</h2>
                {professional.data.configuration.workingDays && (
                  <div className='flex items-center space-x-3'>
                    <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                      <CalendarDays size={17} strokeWidth={2} />
                    </div>
                    <span className='text-sm'>{legibleWorkingDays}</span>
                  </div>
                )}
                {professional.data.configuration.scheduleTimeInit && professional.data.configuration.scheduleTimeEnd && (
                  <div className='flex items-center space-x-3'>
                    <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                      <CalendarClock size={17} strokeWidth={2} />
                    </div>
                    <span className='text-sm'>
                      {professional.data.configuration.scheduleTimeInit &&
                        professional.data.configuration.scheduleTimeEnd &&
                        !professional.data.configuration.unavailableTimeSlot?.timeSlotUnavailableInit &&
                        !professional.data.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd &&
                        `${professional.data.configuration.scheduleTimeInit} ${t('words.hoursSeparator')} ${professional.data.configuration.scheduleTimeEnd}`}
                      {professional.data.configuration.scheduleTimeInit &&
                        professional.data.configuration.scheduleTimeEnd &&
                        professional.data.configuration.unavailableTimeSlot?.timeSlotUnavailableInit &&
                        professional.data.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd &&
                        `${professional.data.configuration.scheduleTimeInit} ${t('words.hoursSeparator')} ${professional.data.configuration.unavailableTimeSlot?.timeSlotUnavailableInit} ${t('words.slotsSeparator')} ${professional.data.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd} ${t('words.hoursSeparator')} ${professional.data.configuration.scheduleTimeEnd}`}
                    </span>
                  </div>
                )}
              </section>
              <section className='space-y-3'>
                <h2 className='pt-2 text-xs font-medium uppercase leading-none text-slate-500'>{t('label.contact')}</h2>
                {professional.data.phone && (
                  <div className='flex items-center space-x-3'>
                    <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                      <Smartphone size={17} strokeWidth={2} />
                    </div>
                    <span className='text-sm'>{delimiter(professional.data.phone, '-', 6)}</span>
                  </div>
                )}
                {professional.data.email && (
                  <div className='flex items-center space-x-3'>
                    <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                      <Mail size={17} strokeWidth={2} />
                    </div>
                    <span className='text-sm'>{professional.data.email}</span>
                  </div>
                )}
                {professional.data.area && professional.data.specialization && (
                  <div className='flex justify-end space-x-4 pt-3'>
                    <Badge variant='default'>
                      <Tag size={13} strokeWidth={2} className='stroke-slate-600' />
                      <span>{UtilsString.upperCase(professional.data.area.name)}</span>
                    </Badge>
                    <Badge variant='default'>
                      <Tag size={13} strokeWidth={2} className='stroke-slate-600' />
                      <span>{UtilsString.upperCase(professional.data.specialization.name)}</span>
                    </Badge>
                  </div>
                )}
              </section>
            </CardContent>
            <CardFooter className='justify-between border-t p-2'>
              <AvailableProfessional items={PV_CONFIG.select} data={{ _id: professional.data._id, available: professional.data.available }} />
              <section className='flex items-center justify-end space-x-2'>
                <TableButton
                  callback={() => navigate(`/professionals/update/${professional.data._id}`)}
                  className='h-8 w-8 hover:bg-amber-100/75 hover:text-amber-400'
                  tooltip={t('tooltip.edit')}
                >
                  <PencilLine size={17} strokeWidth={1.5} />
                </TableButton>
                <RemoveDialog
                  action={() => Promise.resolve({} as IResponse)}
                  dialogContent={
                    <Trans
                      i18nKey={'dialog.deleteProfessional.content'}
                      values={{
                        titleAbbreviation: UtilsString.upperCase(professional.data.title.abbreviation),
                        firstName: UtilsString.upperCase(professional.data.firstName, 'each'),
                        lastName: UtilsString.upperCase(professional.data.lastName, 'each'),
                        identityCard: i18n.format(professional.data.dni, 'number', i18n.resolvedLanguage),
                      }}
                      components={{
                        span: <span className='font-semibold' />,
                        i: <i />,
                      }}
                    />
                  }
                  dialogTexts={{
                    title: t('dialog.deleteProfessional.title'),
                    description: t('dialog.deleteProfessional.description'),
                    cancelButton: t('button.cancel'),
                    removeButton: t('button.deleteProfessional'),
                  }}
                  tooltip={t('tooltip.delete')}
                  triggerButton={<Trash2 size={17} strokeWidth={1.5} />}
                />
                <div className='px-1'>
                  <Separator orientation='vertical' className='h-5' />
                </div>
                <TableButton
                  callback={() => navigate(`/email/professional/${professional.data._id}`)}
                  className='h-8 w-8 hover:bg-purple-100/75 hover:text-purple-400'
                  tooltip={t('tooltip.sendEmail')}
                >
                  <Mail size={17} strokeWidth={1.5} />
                </TableButton>
                <TableButton
                  callback={() =>
                    navigate(`/whatsapp/${professional.data._id}`, {
                      state: { type: EUserType.PROFESSIONAL, template: EWhatsappTemplate.EMPTY },
                    })
                  }
                  className='h-8 w-8 hover:bg-emerald-100/75 hover:text-emerald-400'
                  tooltip={t('tooltip.sendMessage')}
                >
                  <MessageCircle size={17} strokeWidth={1.5} />
                </TableButton>
              </section>
            </CardFooter>
          </>
        )}
      </Card>
      {/* Section: Page footer */}
      <footer className='mx-auto'>
        <Button
          variant='default'
          size='default'
          className='flex items-center gap-3'
          onClick={() => navigate('/professionals')}
          onMouseOver={gotoAnimateOver}
          onMouseOut={gotoAnimateOut}
        >
          {t('button.goToProfessionals')}
          <ArrowRight ref={gotoScope} size={16} strokeWidth={2} />
        </Button>
      </footer>
    </main>
  );
}
