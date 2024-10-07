// Icons: https://lucide.dev/icons/
import { ArrowLeft, FilePlus, Menu } from 'lucide-react';
// External components:
// https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/core/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/core/components/ui/select';
import { Switch } from '@/core/components/ui/switch';
import { Textarea } from '@/core/components/ui/textarea';
// https://github.com/mona-health/react-input-mask
// import InputMask from '@mona-health/react-input-mask';
// Components
import { LoadingDB } from '@/core/components/common/LoadingDB';
import { PageHeader } from '@/core/components/common/PageHeader';
import { WorkingDays } from '@/pages/professionals/components/common/WorkingDays';
// External imports
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, MouseEvent, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Imports
import type { IArea } from '@/core/interfaces/area.interface';
import type { IProfessional, IProfessionalForm } from '@/pages/professionals/interfaces/professional.interface';
import type { IResponse } from '@/core/interfaces/response.interface';
import type { ISpecialization } from '@/core/interfaces/specialization.interface';
import type { ITitle } from '@/core/interfaces/title.interface';
import type { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AreaService } from '@/core/services/area.service';
import { PROF_UPDATE_CONFIG as PU_CONFIG } from '@/config/professionals.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { TitleService } from '@/core/services/title.service';
import { professionalSchema } from '@/pages/professionals/schemas/professional.schema';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export default function UpdateProfessional() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasIsLoading, setAreasIsLoading] = useState<boolean>(false);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [professionalLoading, setProfessionalLoading] = useState<boolean>(true);
  const [specKey, setSpecKey] = useState<string>('');
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [titles, setTitles] = useState<ITitle[]>([]);
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const [workingDaysValuesRef, setWorkingDaysValuesRef] = useState<IWorkingDay[]>([] as IWorkingDay[]);
  const { id } = useParams();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const valuesRef = useRef<IProfessionalForm>({} as IProfessionalForm);

  const updateForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
  });

  useEffect(() => {
    setAreasIsLoading(true);

    AreaService.findAll()
      .then((response) => {
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

    TitleService.findAll().then((response: IResponse) => {
      if (response.statusCode === 200) setTitles(response.data);
      if (response.statusCode > 399) {
        updateForm.setError('title', { message: response.message });
        addNotification({ type: 'error', message: response.message });
      }
      if (response instanceof Error) {
        updateForm.setError('title', { message: APP_CONFIG.error.server });
        addNotification({ type: 'error', message: APP_CONFIG.error.server });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id && !areasIsLoading) {
      ProfessionalApiService.findOne(id).then((response) => {
        setProfessional(response.data);
        setProfessionalLoading(false);
        setWorkingDaysValuesRef(response.data.configuration?.workingDays || []);
      });
    }
  }, [areasIsLoading, id]);

  useEffect(() => {
    if (!areasIsLoading && !professionalLoading) {
      // set area value, update specs for select then force specs select re-render
      updateForm.setValue('area', professional.area._id);
      handleChangeArea(professional.area._id);
      setSpecKey(crypto.randomUUID());
      updateForm.setValue('available', professional.available);
      updateForm.setValue('configuration.scheduleTimeEnd', professional.configuration?.scheduleTimeEnd);
      updateForm.setValue('configuration.scheduleTimeInit', professional.configuration?.scheduleTimeInit);
      updateForm.setValue('configuration.slotDuration', professional.configuration?.slotDuration);
      updateForm.setValue('configuration.unavailableTimeSlot.timeSlotUnavailableEnd', professional.configuration?.timeSlotUnavailableEnd || '');
      updateForm.setValue('configuration.unavailableTimeSlot.timeSlotUnavailableInit', professional.configuration?.timeSlotUnavailableInit || '');
      updateForm.setValue('configuration.workingDays', professional.configuration?.workingDays);
      updateForm.setValue('description', professional.description);
      updateForm.setValue('dni', professional.dni);
      updateForm.setValue('email', professional.email);
      updateForm.setValue('firstName', capitalize(professional.firstName));
      updateForm.setValue('lastName', capitalize(professional.lastName));
      updateForm.setValue('phone', professional.phone);
      updateForm.setValue('specialization', professional.specialization._id);
      updateForm.setValue('title', capitalize(professional.title.abbreviation));

      valuesRef.current = updateForm.getValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areasIsLoading, professionalLoading]);

  function handleChangeArea(event: string) {
    const specializations = areas.find((area) => area._id === event)?.specializations || [];
    setSpecializations(specializations);
    setDisabledSpec(false);
    updateForm.setValue('specialization', '');
  }

  function handleUpdateProfessional(data: z.infer<typeof professionalSchema>) {
    if (id) {
      ProfessionalApiService.update(id, data).then((response) => {
        if (response.statusCode === 200) {
          addNotification({ type: 'success', message: response.message });
        }
        if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
      });
    }
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    updateForm.reset(valuesRef.current);
    updateForm.setValue('configuration.workingDays', workingDaysValuesRef);
    setWorkingDaysKey(crypto.randomUUID());
    setDisabledSpec(true);
  }

  function handleWorkingDaysValues(data: IWorkingDay[]) {
    updateForm.setValue('configuration.workingDays', data);
  }
  // TODO: copy form with 2 columns like create
  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex items-center justify-between'>
        <PageHeader title={PU_CONFIG.title} breadcrumb={PU_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {PU_CONFIG.button.back}
        </Button>
      </header>
      {/* Section: Form */}
      <Card className='mx-auto mt-4 flex w-full flex-col md:w-full lg:w-4/5'>
        <CardHeader className='flex flex-col'>
          <CardTitle className='flex flex-row items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FilePlus className='h-4 w-4' strokeWidth={2} />
              <span>{PU_CONFIG.formTitle.header}</span>
            </div>
            {/* Dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'tableHeader'} size={'miniIcon'}>
                  <Menu className='h-4 w-4' strokeWidth={2} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-fit' align='center'>
                {PU_CONFIG.dropdownMenu.map((item) => (
                  <DropdownMenuItem key={item.id}>
                    <Link to={item.path}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription className='flex w-full flex-row'>{PU_CONFIG.formTitle.description}</CardDescription>
        </CardHeader>
        <CardContent className='pt-1'>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateProfessional)}>
              {/* Section: Form fields */}
              <section className='grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0'>
                {/* Section: Professional data (left side) */}
                <section className='flex flex-col gap-4 md:pr-6'>
                  <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 font-semibold text-slate-700'>{PU_CONFIG.formTitle.professional}</h1>
                  {/* Form fields: area and specialization */}
                  <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='area'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{PU_CONFIG.labels.area}</FormLabel>
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
                                  <LoadingDB variant='default' text={PU_CONFIG.select.loadingText} className='ml-0' />
                                ) : (
                                  <SelectValue placeholder={PU_CONFIG.placeholders.area} />
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
                          <FormLabel>{PU_CONFIG.labels.specialization}</FormLabel>
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
                                  <LoadingDB variant='default' text={PU_CONFIG.select.loadingText} className='ml-0' />
                                ) : (
                                  <SelectValue placeholder={PU_CONFIG.placeholders.specialization} />
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
                          <FormLabel>{PU_CONFIG.labels.titleAbbreviation}</FormLabel>
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
                                <SelectValue placeholder={PU_CONFIG.placeholders.titleAbbreviation} />
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
                              <Label htmlFor='available'>{PU_CONFIG.labels.available}</Label>
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
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.lastName}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.lastName} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.firstName}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.firstName} {...field} />
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
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.dni}</FormLabel>
                          <FormControl className='h-9'>
                            <Input type='number' placeholder={PU_CONFIG.placeholders.dni} {...field} />
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
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.email}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.email} {...field} />
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
                          <FormLabel>{PU_CONFIG.labels.phone}</FormLabel>
                          <FormControl className='h-9'>
                            <Input type='number' placeholder={PU_CONFIG.placeholders.phone} {...field} />
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
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.description}</FormLabel>
                          <FormControl className='h-9'>
                            <Textarea placeholder={PU_CONFIG.placeholders.description} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>
                </section>
                {/* Section: Schedule (right side) */}
                <section className='flex flex-col gap-4 border-t pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0'>
                  <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 font-semibold text-slate-700'>{PU_CONFIG.formTitle.schedule}</h1>
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
                              label={PU_CONFIG.labels.workingDays}
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
                        <FormItem className='space-y-1'>
                          <FormLabel>{PU_CONFIG.labels.slotDuration}</FormLabel>
                          <FormControl className='h-9 w-1/2'>
                            <Input type='number' placeholder={PU_CONFIG.placeholders.slotDuration} {...field} />
                          </FormControl>
                          <FormMessage />
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
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.scheduleTimeInit}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.scheduleTimeInit} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name='configuration.scheduleTimeEnd'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.scheduleTimeEnd}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.scheduleTimeEnd} {...field} />
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
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.timeSlotUnavailableInit}</FormLabel>
                          <FormControl className='h-9'>
                            <>
                              {field.value}
                              <Input placeholder={PU_CONFIG.placeholders.timeSlotUnavailableInit} {...field} />
                            </>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name='configuration.unavailableTimeSlot.timeSlotUnavailableEnd'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.timeSlotUnavailableEnd}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.timeSlotUnavailableEnd} {...field} />
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
                <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                  {PU_CONFIG.button.create}
                </Button>
                <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                  {PU_CONFIG.button.cancel}
                </Button>
              </footer>
            </form>
          </Form>
        </CardContent>
      </Card>
      {/* TODO: here add dialog for error */}
      {/* </div> */}
    </main>
  );
}
