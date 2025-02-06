// Icons: https://lucide.dev/icons/
import { FilePlus, Menu } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent } from '@core/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@core/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@core/components/ui/dropdown-menu';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@core/components/ui/form';
import { Input } from '@core/components/ui/input';
import { Label } from '@core/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@core/components/ui/select';
import { Switch } from '@core/components/ui/switch';
import { Textarea } from '@core/components/ui/textarea';
// https://github.com/mona-health/react-input-mask
import InputMask from '@mona-health/react-input-mask';
// Components
import { BackButton } from '@core/components/common/BackButton';
import { CardHeaderPrimary } from '@core/components/common/header/CardHeaderPrimary';
import { FormError } from '@core/components/common/form/FormError';
import { FormHeader } from '@core/components/common/form/FormHeader';
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { SelectPhoneArea } from '@core/components/common/SelectPhoneArea';
import { WorkingDays } from '@professionals/components/common/WorkingDays';
// External imports
import { Link, useNavigate } from 'react-router-dom';
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IArea } from '@core/interfaces/area.interface';
import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import type { ITitle } from '@core/interfaces/title.interface';
import type { IWorkingDay } from '@professionals/interfaces/working-days.interface';
import { AreaService } from '@core/services/area.service';
import { PROFESSIONAL_CREATE_CONFIG as PC_CONFIG } from '@config/professionals/professional-create.config';
import { ProfessionalApiService } from '@professionals/services/professional-api.service';
import { ScheduleService } from '@settings/services/schedule-settings.service';
import { TitleService } from '@core/services/title.service';
import { UtilsString } from '@core/services/utils/string.service';
import { generateWeekOfWorkingDays } from '@professionals/utils/week-working-days.util';
import { professionalSchema } from '@professionals/schemas/professional.schema';
import { useNotificationsStore } from '@core/stores/notifications.store';
// React component
export default function CreateProfessional() {
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [titles, setTitles] = useState<ITitle[]>([]);
  const [titlesIsLoading, setTitlesIsLoading] = useState<boolean>(false);
  const [workingDays, setWorkingDays] = useState<IWorkingDay[]>([]);
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const [dropdownScope, dropdownAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      addNotification({ type: 'error', message: areasError.message });
    }
  }, [addNotification, areasIsError, areasError?.message]);

  useEffect(() => {
    setTitlesIsLoading(true);

    TitleService.findAll()
      .then((response: IResponse) => {
        if (response.statusCode === 200) setTitles(response.data);
        if (response.statusCode > 399) {
          createForm.setError('title', { message: response.message });
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          createForm.setError('title', { message: t('error.internalServer') });
          addNotification({ type: 'error', message: t('error.internalServer') });
        }
      })
      .finally(() => setTitlesIsLoading(false));

    const daysOfWeek: IWorkingDay[] = generateWeekOfWorkingDays();
    setWorkingDays(daysOfWeek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: slotDuration,
    error: slotDurationError,
    isError: slotDurationIsError,
  } = useQuery<number[], Error>({
    queryKey: ['slot-duration'],
    queryFn: async () => await ScheduleService.findAllSlotDurations(),
  });

  const defaultValues = {
    area: '',
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
  };

  const createForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: defaultValues,
  });

  function handleCreateProfessional(data: z.infer<typeof professionalSchema>): void {
    const { configuration, ...formData } = data;
    const { unavailableTimeSlot, ...configData } = configuration;

    const formattedData = {
      ...formData,
      configuration: {
        ...configData,
        unavailableTimeSlot: {
          timeSlotUnavailableEnd: unavailableTimeSlot?.timeSlotUnavailableEnd === '' ? undefined : unavailableTimeSlot?.timeSlotUnavailableEnd,
          timeSlotUnavailableInit: unavailableTimeSlot?.timeSlotUnavailableInit === '' ? undefined : unavailableTimeSlot?.timeSlotUnavailableInit,
        },
      },
    };

    setIsCreating(true);

    ProfessionalApiService.create(formattedData)
      .then((response) => {
        if (response.statusCode === 200) {
          setDisabledSpec(true);
          addNotification({ type: 'success', message: response.message });
          createForm.reset(defaultValues);
          navigate(`/professionals/${response.data._id}`);
        }
        if (response.statusCode > 399) {
          setOpenDialog(true);
          setErrorMessage(response.message);
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          setOpenDialog(true);
          setErrorMessage(t('error.internalServer'));
          addNotification({ type: 'error', message: t('error.internalServer') });
        }
      })
      .finally(() => setIsCreating(false));
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLInputElement>): void {
    event.preventDefault();
    createForm.reset(defaultValues);
    setDisabledSpec(true);
    setWorkingDays([]);
    setWorkingDaysKey(crypto.randomUUID());
  }

  function handleChangeArea(event: string): void {
    const specializations = areas?.data.find((area) => area._id === event)?.specializations || [];
    setSpecializations(specializations);
    setDisabledSpec(false);
    createForm.setValue('specialization', '');
  }

  function handleWorkingDaysValues(data: IWorkingDay[]): void {
    createForm.setValue('configuration.workingDays', data);
    createForm.clearErrors('configuration.workingDays');
  }

  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={t('pageTitle.createProfessional')} breadcrumb={PC_CONFIG.breadcrumb} />
        <BackButton label={t('button.back')} />
      </header>
      {/* Section: Form */}
      <Card className='mx-auto mt-6 flex w-full flex-col md:w-full lg:w-4/5'>
        <CardHeaderPrimary className='justify-between' title={t('cardTitle.createProfessional')} icon={<FilePlus size={18} strokeWidth={2} />}>
          {/* Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className='!hover:bg-transparent'
                ref={dropdownScope}
                size='miniIcon'
                onMouseOver={() =>
                  dropdownAnimation(dropdownScope.current, { scale: 1.2 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                }
                onMouseOut={() =>
                  dropdownAnimation(dropdownScope.current, { scale: 1 }, { duration: 0.7, ease: 'linear', type: spring, bounce: 0.7 })
                }
              >
                <Menu size={17} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-fit' align='end' onCloseAutoFocus={(e) => e.preventDefault()}>
              {PC_CONFIG.dropdownMenu.map((item) => (
                <DropdownMenuItem key={item.id}>
                  <Link to={item.path}>{t(item.name)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeaderPrimary>
        <CardContent className='pt-6'>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateProfessional)}>
              {/* Section: Form fields */}
              <section className='grid grid-cols-1 space-y-6 md:grid-cols-8 md:space-y-0 lg:grid-cols-6'>
                {/* Section: Professional data (left side) */}
                <section className='col-span-1 flex flex-col gap-4 md:col-span-5 md:pr-6 lg:col-span-3'>
                  <FormHeader step={1} title={t('cardTitle.professionalData')} />
                  {/* Form fields: area and specialization */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* <SelectSpecialtiesForm formControl={createForm.control} callback={handleChangeArea} /> */}
                    <FormField
                      control={createForm.control}
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
                            value={field.value}
                          >
                            <FormControl>
                              <div className='flex items-center space-x-3'>
                                <SelectTrigger className={`h-9 flex-1 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  {areasIsLoading ? (
                                    <LoadingDB variant='default' text={t('loading.default')} className='ml-0' />
                                  ) : (
                                    <SelectValue placeholder={t('placeholder.area')} />
                                  )}
                                </SelectTrigger>
                                {areasIsError && <FormError message={areasError.message} />}
                              </div>
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
                      control={createForm.control}
                      name='specialization'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('table.header.specialty')}</FormLabel>
                          <Select
                            defaultValue={field.value}
                            disabled={disabledSpec || specializations.length < 1}
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
                      control={createForm.control}
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
                              <div className='flex items-center space-x-3'>
                                <SelectTrigger className={`h-9 flex-1 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  {titlesIsLoading ? (
                                    <LoadingDB variant='default' text={t('loading.default')} className='ml-0' />
                                  ) : (
                                    <SelectValue placeholder={t('placeholder.title')} />
                                  )}
                                </SelectTrigger>
                                {titlesIsError && <FormError message={titlesError.message} />}
                              </div>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                              {titles.length > 0 &&
                                titles.map((el) => (
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
                      control={createForm.control}
                      name='available'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormControl className='h-9'>
                            <div className='flex h-full items-center space-x-4 pb-2 pt-4 md:place-content-center md:pb-0 md:pt-8 lg:place-content-center lg:pb-0 lg:pt-8'>
                              <Switch id='available' defaultChecked={true} onCheckedChange={field.onChange} />
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                  {/* Form fields: identity card and phone */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={createForm.control}
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
                      control={createForm.control}
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
                  {/* Form fields: phone */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-1'>
                    <div className='flex flex-row items-center space-x-3'>
                      <FormField
                        control={createForm.control}
                        name='areaCode'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('label.phone')}</FormLabel>
                            <FormControl className='h-9'>
                              <SelectPhoneArea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
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
                      control={createForm.control}
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
                      control={createForm.control}
                      name='configuration.workingDays'
                      render={() => (
                        <FormItem className='w-full'>
                          <FormControl>
                            <WorkingDays
                              key={workingDaysKey}
                              label={t('label.workingDays')}
                              data={workingDays}
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
                      control={createForm.control}
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
                              <div className='flex items-center space-x-3'>
                                <SelectTrigger
                                  className={`max-w-1/2 h-9 w-fit space-x-2 ${!field.value ? 'text-muted-foreground' : ''}`}
                                  disabled={slotDurationIsError}
                                >
                                  <SelectValue placeholder={t('placeholder.slotDuration')} />
                                </SelectTrigger>
                                {slotDurationIsError && <FormError message={slotDurationError.message} />}
                              </div>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                              {slotDuration &&
                                slotDuration.length > 0 &&
                                slotDuration.map((el) => (
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                <Button type='submit' size='sm' variant='default' className='order-1 md:order-2 lg:order-2'>
                  {isCreating ? <LoadingDB text={t('loading.creating')} variant='button'></LoadingDB> : t('button.addProfessional')}
                </Button>
                <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                  {t('button.cancel')}
                </Button>
              </footer>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* Section: Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-xl'>{t('dialog.error.createProfessional.title')}</DialogTitle>
            <DialogDescription className='sr-only'></DialogDescription>
          </DialogHeader>
          <section className='flex flex-col'>{errorMessage}</section>
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
