// Icons: https://lucide.dev/icons/
import { FilePlus, Menu } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@core/components/ui/button';
import { Card, CardContent, CardTitle } from '@core/components/ui/card';
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
import { LoadingDB } from '@core/components/common/LoadingDB';
import { PageHeader } from '@core/components/common/PageHeader';
import { SelectSpecialtiesForm } from '@core/components/common/SelectSpecialtiesForm';
import { WorkingDays } from '@professionals/components/common/WorkingDays';
// External imports
import { Link, useNavigate } from 'react-router-dom';
import { spring, useAnimate } from 'motion/react';
import { useEffect, useState, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
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
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasIsLoading, setAreasIsLoading] = useState<boolean>(false);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [slotDurationValues, setSlotDurationValues] = useState<number[]>([]);
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [titles, setTitles] = useState<ITitle[]>([]);
  const [titlesIsLoading, setTitlesIsLoading] = useState<boolean>(false);
  const [workingDays, setWorkingDays] = useState<IWorkingDay[]>([]);
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const [dropdownScope, dropdownAnimation] = useAnimate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          createForm.setError('area', { message: response.message });
          createForm.setError('specialization', { message: response.message });
          addNotification({ type: 'error', message: response.message });
        }
        if (response instanceof Error) {
          createForm.setError('area', { message: t('error.internalServer') });
          createForm.setError('specialization', { message: t('error.internalServer') });
          addNotification({ type: 'error', message: t('error.internalServer') });
        }
      })
      .finally(() => setAreasIsLoading(false));

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

    ScheduleService.findAllSlotDurations().then((response: number[]) => {
      // TODO: dynamic when database entity created
      // Manage errors then
      setSlotDurationValues(response);
    });

    const daysOfWeek: IWorkingDay[] = generateWeekOfWorkingDays();
    setWorkingDays(daysOfWeek);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = {
    area: '',
    available: true,
    configuration: {
      scheduleTimeEnd: '',
      scheduleTimeInit: '',
      slotDuration: '',
      unavailableTimeSlot: {
        timeSlotUnavailableEnd: '',
        timeSlotUnavailableInit: '',
      },
      workingDays: [],
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
    const specializations = areas.find((area) => area._id === event)?.specializations || [];
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
        <CardTitle className='flex flex-row items-center justify-between rounded-b-none bg-card-header text-slate-700'>
          <header className='flex items-center gap-3.5 p-2'>
            <FilePlus size={16} strokeWidth={2} />
            <span>{t('cardTitle.createProfessional')}</span>
          </header>
          {/* Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                ref={dropdownScope}
                variant={'tableHeader'}
                size={'miniIcon'}
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
              {PC_CONFIG.dropdownMenu.map((item) => (
                <DropdownMenuItem key={item.id}>
                  <Link to={item.path}>{t(item.name)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
        <CardContent className='pt-6'>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateProfessional)}>
              {/* Section: Form fields */}
              <section className='grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0'>
                {/* Section: Professional data (left side) */}
                <section className='flex flex-col gap-4 md:pr-6'>
                  <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 text-base font-semibold text-slate-700'>
                    {t('cardTitle.professionalData')}
                  </h1>
                  {/* Form fields: area and specialization */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <SelectSpecialtiesForm formControl={createForm.control} callback={handleChangeArea} />
                    {/* WIP */}
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
                  {/* Form fields: dni */}
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
                  </section>
                  {/* Form fields: email and phone */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                    <FormField
                      control={createForm.control}
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
                <section className='flex flex-col gap-4 border-t pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0'>
                  <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 text-base font-semibold text-slate-700'>
                    {t('cardTitle.scheduleConfiguration')}
                  </h1>
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
