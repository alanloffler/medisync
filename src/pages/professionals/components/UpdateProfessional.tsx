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
import { Separator } from '@/core/components/ui/separator';
import { Switch } from '@/core/components/ui/switch';
import { Textarea } from '@/core/components/ui/textarea';
// https://github.com/mona-health/react-input-mask
import InputMask from '@mona-health/react-input-mask';
// Components
import { Loading } from '@/core/components/common/Loading';
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
import type { ISpecialization } from '@/core/interfaces/specialization.interface';
import type { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';
import { APP_CONFIG } from '@/config/app.config';
import { AreaService } from '@/core/services/area.service';
import { PROF_UPDATE_CONFIG as PU_CONFIG } from '@/pages/professionals/config/update-professional.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { professionalSchema } from '@/pages/professionals/schemas/professional.schema';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useNotificationsStore } from '@/core/stores/notifications.store';
// React component
export default function UpdateProfessional() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasLoading, setAreasLoading] = useState<boolean>(true);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [professionalLoading, setProfessionalLoading] = useState<boolean>(true);
  const [specKey, setSpecKey] = useState<string>('');
  const [specializations, setSpecializations] = useState<ISpecialization[]>();
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const [workingDaysValuesRef, setWorkingDaysValuesRef] = useState<IWorkingDay[]>([] as IWorkingDay[]);
  const { id } = useParams();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const valuesRef = useRef<IProfessionalForm>({} as IProfessionalForm);

  const defaultValues = {
    _id: '',
    area: '',
    available: true,
    configuration: {
      scheduleTimeEnd: '',
      scheduleTimeInit: '',
      slotDuration: '',
      timeSlotUnavailableEnd: '',
      timeSlotUnavailableInit: '',
      workingDays: [],
    },
    description: '',
    dni: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    title: ''
  };

  const updateForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: defaultValues,
  });
  // TODO: implement toast
  useEffect(() => {
    setIsLoading(true);

    AreaService
    .findAll()
    .then((response) => {
      if (response.statusCode === 200) {
        setAreas(response.data);
        setAreasLoading(false);
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id && !areasLoading) {
      ProfessionalApiService
      .findOne(id)
      .then((response) => {
        setProfessional(response.data);
        setProfessionalLoading(false);
        setIsLoading(false);
        setWorkingDaysValuesRef(response.data.configuration?.workingDays || []);
      });
    }
  }, [areasLoading, id]);

  useEffect(() => {
    if (!areasLoading && !professionalLoading) {
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
      updateForm.setValue('firstName', capitalize(professional.firstName) || '');
      updateForm.setValue('lastName', capitalize(professional.lastName) || '');
      updateForm.setValue('phone', professional.phone);
      updateForm.setValue('specialization', professional.specialization._id);
      updateForm.setValue('title', capitalize(professional.title.abbreviation) || '');

      valuesRef.current = updateForm.getValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areasLoading, professionalLoading]);

  function handleChangeArea(event: string) {
    const specializations = areas.find((area) => area._id === event)?.specializations || [];
    setSpecializations(specializations);
    setDisabledSpec(false);
    updateForm.setValue('specialization', '');
  }

  function handleUpdateProfessional(data: z.infer<typeof professionalSchema>) {
    if (id) {
      ProfessionalApiService
      .update(id, data)
      .then((response) => {
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
    <main className='flex flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Section: Page Header */}
      <header className='flex h-fit items-center justify-between'>
        <PageHeader title={''} breadcrumb={PU_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {PU_CONFIG.button.back}
        </Button>
      </header>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-6'>
          <Card className='w-full md:grid-cols-2'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <FilePlus className='h-4 w-4' strokeWidth={2} />
                  <span>{PU_CONFIG.formTitle}</span>
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
              <CardDescription>{PU_CONFIG.formDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(handleUpdateProfessional)} className='space-y-4'>
                  {/* Form fields: area and specialization */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='area'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{PU_CONFIG.labels.area}</FormLabel>
                          <Select
                            disabled={false}
                            onValueChange={(event) => {
                              field.onChange(event);
                              handleChangeArea(event);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={`focus:red h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                <SelectValue placeholder={PU_CONFIG.placeholders.area} />
                              </SelectTrigger>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                              {areas &&
                                areas.length > 0 &&
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
                          <Select disabled={disabledSpec} key={specKey} onValueChange={(event) => field.onChange(event)} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                <SelectValue placeholder={PU_CONFIG.placeholders.specialization} />
                              </SelectTrigger>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                              {specializations &&
                                specializations.length > 0 &&
                                specializations.map((el) => (
                                  <SelectItem key={el._id} value={el._id} className='text-sm'>
                                    {capitalize(el.name)}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Form fields: titleAbbreviation and available */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='title'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.titleAbbreviation}</FormLabel>
                          <FormControl className='h-9'>
                            <Input placeholder={PU_CONFIG.placeholders.titleAbbreviation} {...field} />
                          </FormControl>
                          <FormMessage />
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
                  </div>
                  {/* Form fields: lastName and firstName */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                  </div>
                  {/* Form fields: dni */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                  </div>
                  {/* Form fields: email and phone */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                  </div>
                  {/* Form fields: description */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
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
                  </div>
                  {/* FORM SECTION: Schedule */}
                  <div className='flex flex-row pt-4'>
                    <Separator />
                  </div>
                  <div className='flex flex-row font-semibold'>{PU_CONFIG.formSubtitle}</div>
                  {/* Schedule working days */}
                  <div className='flex flex-row pt-2'>
                    <FormField
                      control={updateForm.control}
                      name='configuration.workingDays'
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            {/* prettier-ignore */}
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
                  </div>
                  {/* Schedule time slot duration */}
                  <div className='grid grid-cols-1 gap-6 pt-2 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='configuration.slotDuration'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{PU_CONFIG.labels.slotDuration}</FormLabel>
                          <FormControl className='h-9 w-1/2'>
                            <Input type='number' placeholder={PU_CONFIG.placeholders.slotDuration} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Schedule time init and end */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
                  </div>
                  {/* Schedule time slot unavailable init and end */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={updateForm.control}
                      name='configuration.unavailableTimeSlot.timeSlotUnavailableInit'
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>{PU_CONFIG.labels.timeSlotUnavailableInit}</FormLabel>
                          <FormControl className='h-9'><>{field.value}
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
                  </div>
                  {/* Buttons */}
                  <div className='grid grid-cols-1 space-y-2 pt-4 md:flex md:justify-end md:gap-6 md:space-y-0'>
                    <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                      {PU_CONFIG.button.create}
                    </Button>
                    <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                      {PU_CONFIG.button.cancel}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          {/* TODO: here add dialog for error */}
        </div>
    </main>
  );
}
