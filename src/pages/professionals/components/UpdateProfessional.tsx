// Icons: https://lucide.dev/icons/
import { FilePlus, Menu } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@core/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Label } from '@core/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@core/components/ui/select';
import { Switch } from '@core/components/ui/switch';
import { Textarea } from '@core/components/ui/textarea';
// https://github.com/mona-health/react-input-mask
import InputMask from '@mona-health/react-input-mask';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { WorkingDays } from '@professionals/components/common/WorkingDays';
// External imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState, MouseEvent, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IArea } from '@core/interfaces/area.interface';
import type { IInfoCard } from '@core/components/common/interfaces/infocard.interface';
import type { IProfessional, IProfessionalForm } from '@professionals/interfaces/professional.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import type { ITitle } from '@core/interfaces/title.interface';
import type { IWorkingDay } from '@professionals/interfaces/working-days.interface';
import { APP_CONFIG } from '@config/app.config';
import { AreaService } from '@core/services/area.service';
import { PROF_UPDATE_CONFIG as PU_CONFIG } from '@config/professionals.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { ScheduleService } from '@settings/services/schedule-settings.service';
import { TitleService } from '@core/services/title.service';
import { professionalSchema } from '@professionals/schemas/professional.schema';
import { useCapitalize } from '@core/hooks/useCapitalize';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function UpdateProfessional() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasIsLoading, setAreasIsLoading] = useState<boolean>(false);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [errorLoadingProfessional, setErrorLoadingProfessional] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoCardContent, setInfoCardContent] = useState<IInfoCard>({ type: 'success', text: '' });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [professionalLoading, setProfessionalLoading] = useState<boolean>(true);
  const [slotDurationValues, setSlotDurationValues] = useState<number[]>([]);
  const [specKey, setSpecKey] = useState<string>('');
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [titles, setTitles] = useState<ITitle[]>([]);
  const [titlesIsLoading, setTitlesIsLoading] = useState<boolean>(false);
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const [workingDaysValuesRef, setWorkingDaysValuesRef] = useState<IWorkingDay[]>([] as IWorkingDay[]);
  const [dropdownScope, dropdownAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const valuesRef = useRef<IProfessionalForm>({} as IProfessionalForm);
  const { id } = useParams();
  const { t } = useTranslation();

  const updateForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
  });

  useEffect(() => {
    setAreasIsLoading(true);
    setTitlesIsLoading(true);

    AreaService.findAll()
      .then((response: IResponse) => {
        if (response.statusCode === 200) {
          setAreas(response.data);
          setDisabledSpec(false);
        }
        if (response.statusCode > 399) {
          updateForm.setError('area', { message: response.message });
          updateForm.setError('specialization', { message: response.message });
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          updateForm.setError('area', { message: APP_CONFIG.error.server });
          updateForm.setError('specialization', { message: APP_CONFIG.error.server });
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      })
      .finally(() => setAreasIsLoading(false));

    TitleService.findAll()
      .then((response: IResponse) => {
        if (response.statusCode === 200) setTitles(response.data);
        if (response.statusCode > 399) {
          updateForm.setError('title', { message: response.message });
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          updateForm.setError('title', { message: APP_CONFIG.error.server });
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      })
      .finally(() => setTitlesIsLoading(false));

    ScheduleService.findAllSlotDurations().then((response: number[]) => {
      // TODO: dynamic when database entity created
      // Manage errors then
      setSlotDurationValues(response);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id && !areasIsLoading) {
      ProfessionalApiService.findOne(id).then((response: IResponse) => {
        if (response.statusCode === 200) {
          setProfessional(response.data);
          setWorkingDaysValuesRef(response.data.configuration?.workingDays || []);
          setProfessionalLoading(false);
        }
        if (response.statusCode > 399) {
          setErrorLoadingProfessional(true);
          setInfoCardContent({ type: 'error', text: response.message });
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setErrorLoadingProfessional(true);
          setInfoCardContent({ type: 'error', text: APP_CONFIG.error.server });
          addNotification({ type: 'error', message: APP_CONFIG.error.server });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areasIsLoading, id]);

  useEffect(() => {
    if (!areasIsLoading && !professionalLoading) {
      updateForm.setValue('area', professional.area._id);
      handleChangeArea(professional.area._id);
      setSpecKey(crypto.randomUUID());

      updateForm.setValue('available', professional.available);
      updateForm.setValue('configuration.scheduleTimeEnd', professional.configuration?.scheduleTimeEnd);
      updateForm.setValue('configuration.scheduleTimeInit', professional.configuration?.scheduleTimeInit);
      updateForm.setValue('configuration.slotDuration', professional.configuration?.slotDuration);
      updateForm.setValue(
        'configuration.unavailableTimeSlot.timeSlotUnavailableEnd',
        professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableEnd || '',
      );
      updateForm.setValue(
        'configuration.unavailableTimeSlot.timeSlotUnavailableInit',
        professional.configuration?.unavailableTimeSlot?.timeSlotUnavailableInit || '',
      );
      updateForm.setValue('configuration.workingDays', professional.configuration?.workingDays);
      updateForm.setValue('description', professional.description);
      updateForm.setValue('dni', professional.dni);
      updateForm.setValue('email', professional.email);
      updateForm.setValue('firstName', capitalize(professional.firstName));
      updateForm.setValue('lastName', capitalize(professional.lastName));
      updateForm.setValue('phone', professional.phone);
      updateForm.setValue('specialization', professional.specialization._id);
      updateForm.setValue('title', professional.title._id);

      setWorkingDaysKey(crypto.randomUUID());
      valuesRef.current = updateForm.getValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areasIsLoading, professionalLoading]);

  function handleChangeArea(event: string): void {
    const specializations = areas.find((area) => area._id === event)?.specializations || [];
    setSpecializations(specializations);
    setDisabledSpec(false);
    updateForm.setValue('specialization', '');
  }

  function handleUpdateProfessional(data: z.infer<typeof professionalSchema>): void {
    setIsUpdating(true);

    if (id) {
      ProfessionalApiService.update(id, data)
        .then((response: IResponse) => {
          if (response.statusCode === 200) {
            navigate(`/professionals/${response.data._id}`);
            addNotification({ type: 'success', message: response.message });
          }
          if (response.statusCode > 399) {
            setOpenDialog(true);
            setErrorMessage(response.message);
            addNotification({ type: 'error', message: response.message });
          }
          if (response instanceof Error) {
            setOpenDialog(true);
            setErrorMessage(APP_CONFIG.error.server);
            addNotification({ type: 'error', message: APP_CONFIG.error.server });
          }
        })
        .finally(() => setIsUpdating(false));
    }
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    updateForm.reset(valuesRef.current);
    setWorkingDaysKey(crypto.randomUUID());
    updateForm.setValue('configuration.workingDays', workingDaysValuesRef);
    setDisabledSpec(true);
  }

  function handleWorkingDaysValues(data: IWorkingDay[]): void {
    updateForm.setValue('configuration.workingDays', data);
  }

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.updateProfessional')} breadcrumb={PU_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Form */}
      {!errorLoadingProfessional ? (
        <Card className='mx-auto mt-4 flex w-full flex-col md:w-full lg:w-4/5'>
          <CardTitle className='flex flex-row items-center justify-between rounded-b-none bg-card-header text-slate-700'>
            <header className='flex items-center gap-3.5 p-2'>
              <FilePlus size={16} strokeWidth={2} />
              <span>{t('cardTitle.updateProfessional')}</span>
            </header>
            {/* Dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  ref={dropdownScope}
                  size={'miniIcon'}
                  variant={'tableHeader'}
                  onMouseOver={() =>
                    dropdownAnimation(dropdownScope.current, { scale: 1.1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                  }
                  onMouseOut={() =>
                    dropdownAnimation(dropdownScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                  }
                >
                  <Menu size={16} strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit' align='center'>
                {PU_CONFIG.dropdownMenu.map((item) => (
                  <DropdownMenuItem key={item.id}>
                    <Link to={item.path}>{t(item.name)}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardContent className='pt-6'>
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(handleUpdateProfessional)}>
                {/* Section: Form fields */}
                <section className='grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0'>
                  {/* Section: Professional data (left side) */}
                  <section className='flex flex-col gap-4 md:pr-6'>
                    <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 text-base font-semibold text-slate-700'>
                      {t('cardTitle.professionalData')}
                    </h1>
                    {/* Form fields: area and specialization */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='area'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('table.header.area')}</FormLabel>
                            <Select
                              defaultValue={field.value}
                              disabled={areas.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                                handleChangeArea(event);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  {areasIsLoading ? (
                                    <LoadingDB variant='default' text={t('loading.default')} className='ml-0' />
                                  ) : (
                                    <SelectValue placeholder={t('placeholder.area')} />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {areas.length > 0 &&
                                  areas.map((el) => (
                                    <SelectItem key={el._id} value={el._id} className='text-sm'>
                                      {capitalize(el.name)}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='specialization'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('table.header.specialty')}</FormLabel>
                            <Select
                              defaultValue={field.value}
                              disabled={disabledSpec || specializations.length < 1}
                              key={specKey}
                              onValueChange={(event) => field.onChange(event)}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  {areasIsLoading ? (
                                    <LoadingDB variant='default' text={t('loading.default')} className='ml-0' />
                                  ) : (
                                    <SelectValue placeholder={t('placeholder.specialty')} />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {specializations.map((el) => (
                                  <SelectItem key={el._id} value={el._id} className='text-sm'>
                                    {capitalize(el.name)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: titleAbbreviation and available */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.title')}</FormLabel>
                            <Select
                              defaultValue={field.value}
                              disabled={titles.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  {titlesIsLoading ? (
                                    <LoadingDB variant='default' text={t('loading.default')} className='ml-0' />
                                  ) : (
                                    <SelectValue placeholder={t('placeholder.title')} />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {titles.length > 0 &&
                                  titles.map((el) => (
                                    <SelectItem key={el._id} value={el._id} className='text-sm'>
                                      {capitalize(el.name)}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='available'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormControl className='h-9'>
                              <div className='flex h-full items-center space-x-4 pb-2 pt-4 md:place-content-center md:pb-0 md:pt-8 lg:place-content-center lg:pb-0 lg:pt-8'>
                                <Switch id='available' checked={field.value} onCheckedChange={field.onChange} />
                                <Label htmlFor='available'>{t('label.available')}</Label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: lastName and firstName */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.lastName')}</FormLabel>
                            <FormControl className='h-9'>
                              <Input placeholder={t('placeholder.lastName')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.firstName')}</FormLabel>
                            <FormControl className='h-9'>
                              <Input placeholder={t('placeholder.firstName')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: dni */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='dni'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.identityCard')}</FormLabel>
                            <FormControl className='h-9'>
                              <Input type='number' placeholder={t('placeholder.identityCard')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: email and phone */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.email')}</FormLabel>
                            <FormControl className='h-9'>
                              <Input placeholder={t('placeholder.email')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.phone')}</FormLabel>
                            <FormControl className='h-9'>
                              <Input type='number' placeholder={t('placeholder.phone')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: description */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-1'>
                      <FormField
                        control={updateForm.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.description')}</FormLabel>
                            <FormControl className='h-9'>
                              <Textarea placeholder={t('placeholder.description')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                  </section>
                  {/* Section: Schedule (right side) */}
                  <section className='flex flex-col gap-4 border-t pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0'>
                    <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 font-semibold text-slate-700'>{t('cardTitle.scheduleConfiguration')}</h1>
                    {/* Form fields: Schedule working days */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='configuration.workingDays'
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormControl>
                              <WorkingDays
                                key={workingDaysKey}
                                label={t('label.workingDays')}
                                data={field.value}
                                handleWorkingDaysValues={handleWorkingDaysValues}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: Schedule time slot duration */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='configuration.slotDuration'
                        render={({ field }) => (
                          <FormItem className='space-y-2'>
                            <FormLabel>{t('label.slotDuration')}</FormLabel>
                            <Select
                              disabled={areas.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                              }}
                              value={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger className={`h-9 w-1/2 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  <SelectValue placeholder={t('placeholder.slotDuration')} />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {slotDurationValues.length > 0 &&
                                  slotDurationValues.map((el) => (
                                    <SelectItem key={el} value={String(el)} className='text-sm'>
                                      {el}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: Schedule time init and end */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='configuration.scheduleTimeInit'
                        render={({ field }) => (
                          <FormItem className='space-y-2'>
                            <FormLabel>{t('label.scheduleTimeInit')}</FormLabel>
                            <FormControl className='h-9'>
                              <InputMask mask='99:99' maskPlaceholder='--:--' alwaysShowMask={false} placeholder={t('placeholder.hour')} {...field}>
                                <Input />
                              </InputMask>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='configuration.scheduleTimeEnd'
                        render={({ field }) => (
                          <FormItem className='space-y-2'>
                            <FormLabel>{t('label.scheduleTimeEnd')}</FormLabel>
                            <FormControl className='h-9'>
                              <InputMask mask='99:99' maskPlaceholder='--:--' alwaysShowMask={false} placeholder={t('placeholder.hour')} {...field}>
                                <Input />
                              </InputMask>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                    {/* Form fields: Schedule time slot unavailable init and end */}
                    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={updateForm.control}
                        name='configuration.unavailableTimeSlot.timeSlotUnavailableInit'
                        render={({ field }) => (
                          <FormItem className='space-y-2'>
                            <FormLabel>{t('label.timeSlotUnavailableInit')}</FormLabel>
                            <FormControl className='h-9'>
                              <InputMask mask='99:99' maskPlaceholder='--:--' alwaysShowMask={false} placeholder={t('placeholder.hour')} {...field}>
                                <Input />
                              </InputMask>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updateForm.control}
                        name='configuration.unavailableTimeSlot.timeSlotUnavailableEnd'
                        render={({ field }) => (
                          <FormItem className='space-y-2'>
                            <FormLabel>{t('label.timeSlotUnavailableEnd')}</FormLabel>
                            <FormControl className='h-9'>
                              <InputMask mask='99:99' maskPlaceholder='--:--' alwaysShowMask={false} placeholder={t('placeholder.hour')} {...field}>
                                <Input />
                              </InputMask>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </section>
                  </section>
                </section>
                {/* Section footer: Buttons */}
                <footer className='grid grid-cols-1 space-y-2 pt-6 md:flex md:justify-end md:gap-6 md:space-y-0'>
                  <Button type='submit' variant='default' size='sm' className='order-1 md:order-2 lg:order-2'>
                    {isUpdating ? <LoadingDB text={t('loading.updating')} variant='button' /> : t('button.updateProfessional')}
                  </Button>
                  <Button variant='ghost' size='sm' onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                    {t('button.cancel')}
                  </Button>
                </footer>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className='mx-auto mt-4 w-fit p-2'>
          <InfoCard text={infoCardContent.text} type={infoCardContent.type} />
        </Card>
      )}
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{t('dialog.error.updateProfessional')}</DialogTitle>
            <DialogDescription className='sr-only'></DialogDescription>
            <div className='flex flex-col'>{errorMessage}</div>
          </DialogHeader>
          <footer className='flex justify-end space-x-4'>
            <Button variant='remove' size='sm' onClick={() => setOpenDialog(false)}>
              {t('button.close')}
            </Button>
          </footer>
        </DialogContent>
      </Dialog>
    </main>
  );
}
