// Icons: https://lucide.dev/icons/
import { FilePlus, Menu } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
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
import { CardHeaderPrimary } from '@core/components/common/header/CardHeaderPrimary';
import { FormHeader } from '@core/components/common/form/FormHeader';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { SelectPhoneArea } from '@core/components/common/SelectPhoneArea';
import { WorkingDays } from '@professionals/components/common/WorkingDays';
// External imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { type AnimationPlaybackControls, useAnimate } from 'motion/react';
import { type MouseEvent, useEffect, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
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
import { AreaService } from '@core/services/area.service';
import { PROF_UPDATE_CONFIG as PU_CONFIG } from '@config/professionals.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { ScheduleService } from '@settings/services/schedule-settings.service';
import { TitleService } from '@core/services/title.service';
import { UtilsString } from '@core/services/utils/string.service';
import { motion } from '@core/services/motion.service';
import { professionalSchema } from '@professionals/schemas/professional.schema';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function UpdateProfessional() {
  const [_area, setArea] = useState<number | undefined>();
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [infoCardContent, setInfoCardContent] = useState<IInfoCard>({ type: 'success', text: '' });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [specKey, setSpecKey] = useState<string>('');
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const [workingDaysValuesRef, setWorkingDaysValuesRef] = useState<IWorkingDay[]>([] as IWorkingDay[]);
  const [dropdownScope, dropdownAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const valuesRef = useRef<IProfessionalForm>({} as IProfessionalForm);
  const { id } = useParams();
  const { t } = useTranslation();

  const updateForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      area: undefined,
      areaCode: undefined,
      available: true,
      configuration: {
        scheduleTimeEnd: '',
        scheduleTimeInit: '',
        slotDuration: '',
        unavailableTimeSlot: {
          timeSlotUnavailableEnd: '',
          timeSlotUnavailableInit: '',
        },
        workingDays: undefined,
      },
      description: '',
      dni: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialization: '',
      title: '',
    },
  });

  const {
    data: areas,
    error: areasError,
    isError: areasIsError,
    isLoading: areasIsLoading,
    isSuccess: areasIsSuccess,
  } = useQuery<IResponse<IArea[]>, Error>({
    queryKey: ['areas', 'find-all'],
    queryFn: async () => await AreaService.findAll(),
  });

  useEffect(() => {
    if (areasIsSuccess) setDisabledSpec(false);
  }, [areasIsSuccess]);

  useEffect(() => {
    if (areasIsError) {
      setDisabledSpec(true);
      updateForm.setError('area', { message: areasError.message });
      updateForm.setError('specialization', { message: areasError.message });
      addNotification({ type: 'error', message: areasError.message });
    }
  }, [addNotification, areasIsError, areasError?.message, updateForm]);

  const {
    data: titles,
    error: titlesError,
    isError: titlesIsError,
    isLoading: titlesIsLoading,
  } = useQuery<IResponse<ITitle[]>, Error>({
    queryKey: ['titles', 'find-all'],
    queryFn: async () => await TitleService.findAll(),
  });

  useEffect(() => {
    if (titlesIsError) {
      updateForm.setError('title', { message: titlesError.message });
      addNotification({ type: 'error', message: titlesError.message });
    }
  }, [addNotification, titlesIsError, titlesError?.message, updateForm]);

  const {
    data: slotDuration,
    error: slotDurationError,
    isError: slotDurationIsError,
  } = useQuery<number[], Error>({
    queryKey: ['slot-duration'],
    queryFn: async () => await ScheduleService.findAllSlotDurations(),
  });

  useEffect(() => {
    if (slotDurationIsError) updateForm.setError('configuration.slotDuration', { message: slotDurationError?.message });
  }, [slotDurationError?.message, slotDurationIsError, updateForm]);

  const {
    data: professional,
    error: professionalError,
    isError: professionalIsError,
    isLoading: professionalIsLoading,
  } = useQuery<IResponse<IProfessional> | undefined, Error>({
    queryKey: ['professional', 'find-one', id],
    queryFn: async () => {
      if (id) return await ProfessionalApiService.findOne(id);
    },
  });

  useEffect(() => {
    if (professional?.data.configuration.workingDays && !areasIsLoading) setWorkingDaysValuesRef(professional.data.configuration.workingDays || []);
  }, [areasIsLoading, professional?.data.configuration.workingDays]);

  useEffect(() => {
    if (professionalIsError) {
      setInfoCardContent({ type: 'error', text: professionalError.message });
      addNotification({ type: 'error', message: professionalError.message });
    }
  }, [addNotification, professionalError?.message, professionalIsError]);

  const handleChangeArea = useCallback(
    (event: string): void => {
      const specializations = areas?.data.find((area) => area._id === event)?.specializations || [];
      setSpecializations(specializations);
      setDisabledSpec(false);
      updateForm.setValue('specialization', '');
    },
    [areas?.data, updateForm],
  );

  useEffect(() => {
    if (!areasIsLoading && !professionalIsLoading && professional) {
      updateForm.setValue('area', professional.data.area._id);
      handleChangeArea(professional.data.area._id);
      setSpecKey(crypto.randomUUID());

      updateForm.setValue('areaCode', professional.data.areaCode);
      updateForm.setValue('available', professional.data.available);
      updateForm.setValue('configuration.scheduleTimeEnd', professional.data.configuration?.scheduleTimeEnd);
      updateForm.setValue('configuration.scheduleTimeInit', professional.data.configuration?.scheduleTimeInit);
      updateForm.setValue('configuration.slotDuration', professional.data.configuration?.slotDuration);
      updateForm.setValue(
        'configuration.unavailableTimeSlot.timeSlotUnavailableEnd',
        professional.data.configuration?.unavailableTimeSlot?.timeSlotUnavailableEnd || '',
      );
      updateForm.setValue(
        'configuration.unavailableTimeSlot.timeSlotUnavailableInit',
        professional.data.configuration?.unavailableTimeSlot?.timeSlotUnavailableInit || '',
      );
      updateForm.setValue('configuration.workingDays', professional.data.configuration?.workingDays);
      updateForm.setValue('description', professional.data.description);
      updateForm.setValue('dni', professional.data.dni);
      updateForm.setValue('email', professional.data.email);
      updateForm.setValue('firstName', UtilsString.upperCase(professional.data.firstName, 'each'));
      updateForm.setValue('lastName', UtilsString.upperCase(professional.data.lastName, 'each'));
      updateForm.setValue('phone', professional.data.phone);
      updateForm.setValue('specialization', professional.data.specialization._id);
      updateForm.setValue('title', professional.data.title._id);

      setWorkingDaysKey(crypto.randomUUID());
      valuesRef.current = updateForm.getValues();
    }
  }, [areasIsLoading, handleChangeArea, professional, professionalIsLoading, updateForm]);

  const {
    mutate: updateProfessional,
    error: professionalUpdatingError,
    isPending: professionalIsUpdating,
  } = useMutation<IResponse<IProfessional>, Error, { id: string; data: z.infer<typeof professionalSchema> }>({
    mutationKey: ['professional', 'update', id],
    mutationFn: async ({ id, data }) => await ProfessionalApiService.update(id, data),
    onSuccess: (response) => {
      navigate(`/professionals/${id}`);
      addNotification({ type: 'success', message: response.message });
    },
    onError: (response) => {
      setOpenDialog(true);
      addNotification({ type: 'error', message: response.message });
    },
  });

  function handleCancel(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    updateForm.reset(valuesRef.current);
    setWorkingDaysKey(crypto.randomUUID());
    updateForm.setValue('configuration.workingDays', workingDaysValuesRef);
    if (professional) {
      handleChangeArea(professional.data.area._id);
      updateForm.setValue('specialization', professional.data.specialization._id);
    }
    setSpecKey(crypto.randomUUID());
  }

  function handleWorkingDaysValues(data: IWorkingDay[]): void {
    updateForm.setValue('configuration.workingDays', data);
  }

  function dropdownMouseOver(): AnimationPlaybackControls {
    const { options, keyframes } = motion.scale(1.1).type('bounce').animate();
    return dropdownAnimation(dropdownScope.current, keyframes, options);
  }

  function dropdownMouseOut(): AnimationPlaybackControls {
    const { options, keyframes } = motion.scale(1).type('bounce').animate();
    return dropdownAnimation(dropdownScope.current, keyframes, options);
  }

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.updateProfessional')} breadcrumb={PU_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Form */}
      {!professionalIsError ? (
        <Card className='mx-auto mt-4 flex w-full flex-col md:w-full lg:w-4/5'>
          <CardHeaderPrimary className='justify-between' title={t('cardTitle.updateProfessional')} icon={<FilePlus size={18} strokeWidth={2} />}>
            {/* Dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className='!hover:bg-transparent'
                  ref={dropdownScope}
                  size='miniIcon'
                  onMouseOver={dropdownMouseOver}
                  onMouseOut={dropdownMouseOut}
                >
                  <Menu size={17} strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit' align='end' onCloseAutoFocus={(e) => e.preventDefault()}>
                {PU_CONFIG.dropdownMenu.map((item) => (
                  <DropdownMenuItem key={item.id}>
                    <Link to={item.path}>{t(item.name)}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeaderPrimary>
          <CardContent className='pt-6'>
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit((data) => id && updateProfessional({ id, data }))}>
                {/* Section: Form fields */}
                <section className='grid grid-cols-1 space-y-6 md:grid-cols-8 md:space-y-0 lg:grid-cols-6'>
                  {/* Section: Professional data (left side) */}
                  <section className='col-span-1 flex flex-col gap-4 md:col-span-5 md:pr-6 lg:col-span-3'>
                    <FormHeader step={1} title={t('cardTitle.professionalData')} />
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
                              disabled={!areas || areas?.data.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                                handleChangeArea(event);
                              }}
                              value={updateForm.watch('area') ?? ''}
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
                                {areas &&
                                  areas.data.length > 0 &&
                                  areas.data.map((el: IArea) => (
                                    <SelectItem key={el._id} value={el._id} className='text-sm'>
                                      {UtilsString.upperCase(el.name)}
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
                                    {UtilsString.upperCase(el.name)}
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
                              disabled={!titles || titles?.data.length < 1}
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
                                {titles &&
                                  titles.data.length > 0 &&
                                  titles.data.map((el: ITitle) => (
                                    <SelectItem key={el._id} value={el._id} className='text-sm'>
                                      {UtilsString.upperCase(el.name)}
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
                    </section>
                    {/* Form fields: email and phone */}
                    <section className='grid grid-cols-1'>
                      <div className='flex flex-row items-center space-x-6'>
                        <FormField
                          control={updateForm.control}
                          name='areaCode'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('label.phone')}</FormLabel>
                              <FormControl className='h-9 w-fit'>
                                <SelectPhoneArea setArea={setArea} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={updateForm.control}
                          name='phone'
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormLabel> </FormLabel>
                              <FormControl className='h-9'>
                                <Input type='number' placeholder={t('placeholder.phone')} {...field} className='!mt-8 h-9' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
                  <section className='col-span-1 flex flex-col gap-4 border-t pt-6 md:col-span-3 md:border-l md:border-t-0 md:pl-6 md:pt-0 lg:col-span-3'>
                    <FormHeader step={2} title={t('cardTitle.scheduleConfiguration')} className='mb-1.5' />
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
                              disabled={areas && areas.data.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                              }}
                              value={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger
                                  disabled={slotDurationIsError}
                                  className={`max-w-1/2 h-9 w-fit space-x-2 ${!field.value ? 'text-muted-foreground' : ''}`}
                                >
                                  <SelectValue placeholder={t('placeholder.slotDuration')} />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {slotDuration &&
                                  slotDuration.length > 0 &&
                                  slotDuration.map((el: number) => (
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
                    {professionalIsUpdating ? <LoadingDB text={t('loading.updating')} variant='button' /> : t('button.updateProfessional')}
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
            {professionalUpdatingError && <div className='flex flex-col'>{professionalUpdatingError.message}</div>}
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
