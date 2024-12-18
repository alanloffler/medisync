// Icons: https://lucide.dev/icons/
import { ArrowRight, CalendarClock, CalendarDays, Mail, PencilLine, Send, Share2, Smartphone, Tag, Trash2 } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Badge } from '@core/components/ui/badge';
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardFooter } from '@core/components/ui/card';
// Components
import { AvailableProfessional } from '@professionals/components/common/AvailableProfessional';
import { BackButton } from '@core/components/common/BackButton';
import { IconMedic } from '@core/components/icons/IconMedic';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { RemoveDialog } from '@core/components/common/RemoveDialog';
import { TooltipWrapper } from '@core/components/common/TooltipWrapper';
// External imports
import { Trans, useTranslation } from 'react-i18next';
import { useAnimate } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Imports
import type { IEmail } from '@core/interfaces/email.interface';
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IProfessional } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import { CalendarService } from '@appointments/services/calendar.service';
import { PROFESSIONAL_VIEW_CONFIG as PV_CONFIG } from '@config/professionals/professional-view.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { UtilsString } from '@core/services/utils/string.service';
import { motion } from '@core/services/motion.service';
import { useDelimiter } from '@core/hooks/useDelimiter';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function ViewProfessional() {
  const [email, setEmail] = useState<IEmail>({} as IEmail);
  const [infoCard, setInfoCard] = useState<IInfoCard>({} as IInfoCard);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [legibleWorkingDays, setLegibleWorkingDays] = useState<string>('');
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [gotoScope, gotoAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const delimiter = useDelimiter();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const selectedLocale = i18n.resolvedLanguage || i18n.language;

      setIsLoading(true);

      ProfessionalApiService.findOne(id)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            setProfessional(response.data);
            setEmail({
              to: response.data.email,
              subject: t('email.sendToProfessional.subject'),
              body: t('email.sendToProfessional.body', {
                titleAbbreviation: UtilsString.upperCase(response.data.title.abbreviation),
                firstName: UtilsString.upperCase(response.data.firstName, 'each'),
                lastName: UtilsString.upperCase(response.data.lastName, 'each'),
              }),
            });
            setShowCard(true);

            const legibleWorkingDays: string = CalendarService.getLegibleWorkingDays(response.data.configuration.workingDays, true, selectedLocale);
            setLegibleWorkingDays(legibleWorkingDays);
          }
          if (response.statusCode > 399) {
            setInfoCard({ type: 'warning', text: response.message });
            addNotification({ type: 'warning', message: response.message });
          }
          if (response instanceof Error) {
            setInfoCard({ type: 'error', text: t('error.internalServer') });
            addNotification({ type: 'error', message: t('error.internalServer') });
          }
        })
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, i18n.resolvedLanguage]);

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
      <section className='mx-auto mt-4 flex w-full flex-row px-2 md:w-[500px]'>
        <Card className='w-full'>
          {showCard ? (
            <div className='relative flex items-center justify-center rounded-t-lg bg-slate-200 p-3 text-slate-700'>
              <h1 className='text-center text-xl font-bold'>
                {UtilsString.upperCase(`${professional.title.abbreviation} ${professional.firstName} ${professional.lastName}`, 'each')}
              </h1>
            </div>
          ) : (
            <InfoCard type={infoCard.type} text={infoCard.text} className='py-6' />
          )}
          {isLoading ? (
            <LoadingDB text={t('loading.professional')} className='-mt-12 py-6' />
          ) : (
            showCard && (
              <>
                <CardContent className='mt-6 space-y-6'>
                  {professional.description && (
                    <section className='flex space-x-4 text-ellipsis rounded-md bg-slate-100 px-4 py-3 italic text-slate-600'>
                      <IconMedic name={professional.specialization.icon} size={20} />
                      <span>{UtilsString.upperCase(professional.description)}</span>
                    </section>
                  )}
                  <section className='space-y-3'>
                    <h2 className='pt-2 text-xsm font-semibold uppercase leading-none text-slate-700'>{t('label.scheduleTitle')}</h2>
                    {professional.configuration?.workingDays && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <CalendarDays size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>{legibleWorkingDays}</span>
                      </div>
                    )}
                    {professional.configuration?.scheduleTimeInit && professional.configuration?.scheduleTimeEnd && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <CalendarClock size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>
                          {professional.configuration?.scheduleTimeInit &&
                            professional.configuration?.scheduleTimeEnd &&
                            !professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableInit &&
                            !professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableEnd &&
                            `${professional.configuration.scheduleTimeInit} ${t('words.hoursSeparator')} ${professional.configuration.scheduleTimeEnd}`}
                          {professional.configuration?.scheduleTimeInit &&
                            professional.configuration?.scheduleTimeEnd &&
                            professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableInit &&
                            professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableEnd &&
                            `${professional.configuration.scheduleTimeInit} ${t('words.hoursSeparator')} ${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableInit} ${t('words.slotsSeparator')} ${professional.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd} ${t('words.hoursSeparator')} ${professional.configuration.scheduleTimeEnd}`}
                        </span>
                      </div>
                    )}
                  </section>
                  <section className='space-y-3'>
                    <h2 className='pt-2 text-xsm font-semibold uppercase leading-none text-slate-700'>{t('label.contact')}</h2>
                    {professional.phone && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <Smartphone size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>{delimiter(professional.phone, '-', 6)}</span>
                      </div>
                    )}
                    {professional.email && (
                      <div className='flex items-center space-x-3'>
                        <div className='rounded-md bg-slate-100 p-1.5 text-slate-600'>
                          <Mail size={17} strokeWidth={2} />
                        </div>
                        <span className='text-sm'>{professional.email}</span>
                      </div>
                    )}
                    {professional.area && professional.specialization && (
                      <div className='flex justify-end space-x-4 pt-3'>
                        <Badge variant='default'>
                          <Tag size={13} strokeWidth={2} className='stroke-slate-600' />
                          <span>{UtilsString.upperCase(professional.area.name)}</span>
                        </Badge>
                        <Badge variant='default'>
                          <Tag size={13} strokeWidth={2} className='stroke-slate-600' />
                          <span>{UtilsString.upperCase(professional.specialization.name)}</span>
                        </Badge>
                      </div>
                    )}
                  </section>
                </CardContent>
                <CardFooter className='justify-between border-t p-2'>
                  <AvailableProfessional items={PV_CONFIG.select} data={{ _id: professional._id, available: professional.available }} />
                  <section className='space-x-2'>
                    <TooltipWrapper tooltip={t('tooltip.sendEmail')}>
                      <Button
                        variant='ghost'
                        size='miniIcon'
                        onClick={() =>
                          window.open(`https://mail.google.com/mail/?view=cm&to=${email.to}&su=${email.subject}&body=${email.body}`, '_blank')
                        }
                        className='transition-transform hover:scale-110 hover:bg-white hover:text-fuchsia-400 hover:animate-in'
                      >
                        <Send size={18} strokeWidth={1.5} />
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper tooltip={t('tooltip.share')}>
                      <Button
                        variant='ghost'
                        size='miniIcon'
                        className='transition-transform hover:scale-110 hover:bg-white hover:text-sky-400 hover:animate-in'
                      >
                        <Share2 size={18} strokeWidth={1.5} />
                      </Button>
                    </TooltipWrapper>
                    <TooltipWrapper tooltip={t('tooltip.edit')}>
                      <Button
                        variant='ghost'
                        size='miniIcon'
                        onClick={() => navigate(`/professionals/update/${professional._id}`)}
                        className='transition-transform hover:scale-110 hover:bg-white hover:text-orange-400 hover:animate-in'
                      >
                        <PencilLine size={18} strokeWidth={1.5} />
                      </Button>
                    </TooltipWrapper>
                    <RemoveDialog
                      action={() => Promise.resolve({} as IResponse)}
                      dialogContent={
                        <Trans
                          i18nKey={'dialog.deleteProfessional.content'}
                          values={{
                            titleAbbreviation: UtilsString.upperCase(professional.title.abbreviation),
                            firstName: UtilsString.upperCase(professional.firstName, 'each'),
                            lastName: UtilsString.upperCase(professional.lastName, 'each'),
                            identityCard: i18n.format(professional.dni, 'number', i18n.resolvedLanguage),
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
                      triggerButton={<Trash2 size={18} strokeWidth={1.5} />}
                    />
                  </section>
                </CardFooter>
              </>
            )
          )}
        </Card>
      </section>
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
