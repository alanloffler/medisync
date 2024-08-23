// Icons: https://lucide.dev/icons/
import { ArrowLeft, FilePlus, Menu } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Switch } from '@/core/components/ui/switch';
import { Textarea } from '@/core/components/ui/textarea';
// App components
import InputMask2 from 'react-input-mask-next';
import { PageHeader } from '@/core/components/common/PageHeader';
import { WorkingDays } from '@/pages/professionals/components/common/WorkingDays';
// App
import { APP_CONFIG } from '@/config/app.config';
import { AreaService } from '@/core/services/area.service';
import { IArea } from '@/core/interfaces/area.interface';
import { IResponse } from '@/core/interfaces/response.interface';
import { ISpecialization } from '@/core/interfaces/specialization.interface';
import { ITitle } from '@/core/interfaces/title.interface';
import { IWorkingDay } from '@/pages/professionals/interfaces/working-days.interface';
import { Link, useNavigate } from 'react-router-dom';
import { PROF_CREATE_CONFIG as PC_CONFIG } from '@/config/professionals.config';
import { ProfessionalApiService } from '@/pages/professionals/services/professional-api.service';
import { ScheduleService } from '@/pages/settings/services/schedule-settings.service';
import { TitleService } from '@/core/services/title.service';
import { professionalSchema } from '@/pages/professionals/schemas/professional.schema';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// React component
export default function CreateProfessional() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slotDurationValues, setSlotDurationValues] = useState<number[]>([]);
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  const [titles, setTitles] = useState<ITitle[]>([]);
  const [workingDays, setWorkingDays] = useState<IWorkingDay[]>([]);
  const [workingDaysKey, setWorkingDaysKey] = useState<string>('');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  // #region Load data
  useEffect(() => {
    setIsLoading(true);
    AreaService.findAll().then((response: IResponse) => {
      if (response.statusCode === 200) {
        setAreas(response.data);
        setDisabledSpec(false);
        // TODO notification general file for all app with custom messages
        addNotification({ type: 'success', message: 'Areas y especialidades cargadas' });
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
      setIsLoading(false);
    });
    // TODO: manage errors from here to the end of the useEffect
    TitleService.findAll().then((response: IResponse) => {
      if (response.statusCode === 200) {
        setTitles(response.data);
      }
    });

    ScheduleService.findAllSlotDurations().then((response: number[]) => {
      setSlotDurationValues(response);
    });

    ScheduleService.findAllWorkingDays().then((response: IWorkingDay[]) => {
      setWorkingDays(response);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion
  // #region Form config and actions
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
    const formattedData = {
      ...data,
      configuration: {
        ...data.configuration,
        timeSlotUnavailableEnd: data.configuration.unavailableTimeSlot?.timeSlotUnavailableEnd,
        timeSlotUnavailableInit: data.configuration.unavailableTimeSlot?.timeSlotUnavailableInit,
      }
    };
    console.log(formattedData);

    ProfessionalApiService.create(formattedData).then((response) => {
      if (response.statusCode === 200) {
        setDisabledSpec(true);
        addNotification({ type: 'success', message: response.message });
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: APP_CONFIG.error.server });
      createForm.reset(defaultValues);
    });
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
  // #endregion
  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={PC_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          {PC_CONFIG.buttons.back}
        </Button>
      </div>
      {!isLoading && (
        <Card className='mt-4 flex w-full flex-col'>
          <CardHeader className='flex flex-col'>
            <CardTitle className='flex flex-row items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FilePlus className='h-4 w-4' strokeWidth={2} />
                <span>{PC_CONFIG.formTitle.header}</span>
              </div>
              {/* Dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'tableHeader'} size={'miniIcon'}>
                    <Menu className='h-4 w-4' strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-fit' align='center'>
                  {PC_CONFIG.dropdownMenu.map((item) => (
                    <DropdownMenuItem key={item.id}>
                      <Link to={item.path}>{item.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription className='flex w-full flex-row'>{PC_CONFIG.formTitle.description}</CardDescription>
          </CardHeader>
          <CardContent className='pt-1'>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateProfessional)}>
                {/* Form fields */}
                <div className='grid grid-cols-1 space-y-6 md:grid-cols-2 md:space-y-0'>
                  {/* SECTION: Professional data (left side) */}
                  <div className='flex flex-col gap-4 md:pr-6'>
                    <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 font-semibold text-slate-700'>{PC_CONFIG.formTitle.professional}</h1>
                    {/* Form fields: area and specialization */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='area'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{PC_CONFIG.labels.area}</FormLabel>
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
                                <SelectTrigger className={`focus:red h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  <SelectValue placeholder={PC_CONFIG.placeholders.area} />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {areas.length > 0 &&
                                  areas.map((el, index) => (
                                    <SelectItem key={index} value={el._id} className='text-sm'>
                                      {capitalize(el.name)}
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
                            <FormLabel>{PC_CONFIG.labels.specialization}</FormLabel>
                            <Select defaultValue={field.value} disabled={disabledSpec || specializations.length < 1} onValueChange={(event) => field.onChange(event)} value={field.value}>
                              <FormControl>
                                <SelectTrigger className={`h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  <SelectValue placeholder={PC_CONFIG.placeholders.specialization} />
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
                    </div>
                    {/* Form fields: titleAbbreviation and available */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{PC_CONFIG.labels.titleAbbreviation}</FormLabel>
                            <Select
                              defaultValue={field.value}
                              disabled={titles.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className={`focus:red h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  <SelectValue placeholder={PC_CONFIG.placeholders.titleAbbreviation} />
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
                        control={createForm.control}
                        name='available'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormControl className='h-9'>
                              <div className='flex h-full items-center space-x-4 pb-2 pt-4 md:place-content-center md:pb-0 md:pt-8 lg:place-content-center lg:pb-0 lg:pt-8'>
                                <Switch id='available' defaultChecked={true} onCheckedChange={field.onChange} />
                                <Label htmlFor='available'>{PC_CONFIG.labels.available}</Label>
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
                        control={createForm.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.lastName}</FormLabel>
                            <FormControl className='h-9'>
                              <Input placeholder={PC_CONFIG.placeholders.lastName} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.firstName}</FormLabel>
                            <FormControl className='h-9'>
                              <Input placeholder={PC_CONFIG.placeholders.firstName} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Form fields: dni */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='dni'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.dni}</FormLabel>
                            <FormControl className='h-9'>
                              <Input type='number' placeholder={PC_CONFIG.placeholders.dni} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Form fields: email and phone */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.email}</FormLabel>
                            <FormControl className='h-9'>
                              <Input placeholder={PC_CONFIG.placeholders.email} {...field} />
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
                            <FormLabel>{PC_CONFIG.labels.phone}</FormLabel>
                            <FormControl className='h-9'>
                              <Input type='number' placeholder={PC_CONFIG.placeholders.phone} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Form fields: description */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-1'>
                      <FormField
                        control={createForm.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.description}</FormLabel>
                            <FormControl className='h-9'>
                              <Textarea placeholder={PC_CONFIG.placeholders.description} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* SECTION: Schedule (right side) */}
                  <div className='flex flex-col gap-4 border-t pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0'>
                    <h1 className='mb-3 rounded-sm bg-slate-200/50 px-2 py-1 font-semibold text-slate-700'>{PC_CONFIG.formTitle.schedule}</h1>
                    {/* Schedule working days */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='configuration.workingDays'
                        render={() => (
                          <FormItem className='w-full'>
                            <FormControl>
                              {/* prettier-ignore */}
                              <WorkingDays 
                                key={workingDaysKey} 
                                label={PC_CONFIG.labels.workingDays} 
                                data={workingDays} 
                                handleWorkingDaysValues={handleWorkingDaysValues} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Schedule time slot duration */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='configuration.slotDuration'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>{PC_CONFIG.labels.configuration.slotDuration}</FormLabel>
                            <Select
                              disabled={areas.length < 1}
                              onValueChange={(event) => {
                                field.onChange(event);
                              }}
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className={`focus:red h-9 ${!field.value ? 'text-muted-foreground' : ''}`}>
                                  <SelectValue placeholder={PC_CONFIG.placeholders.configuration.slotDuration} />
                                </SelectTrigger>
                              </FormControl>
                              <FormMessage />
                              <SelectContent>
                                {slotDurationValues.length > 0 &&
                                  slotDurationValues.map((el) => (
                                    <SelectItem key={el} value={el.toString()} className='text-sm'>
                                      {el}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Schedule time init and end */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='configuration.scheduleTimeInit'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>{PC_CONFIG.labels.configuration.scheduleTimeInit}</FormLabel>
                            <FormControl className='h-9'>
                              {/* prettier-ignore */}
                              <InputMask2 
                                mask='99:99' 
                                maskPlaceholder='--:--' 
                                alwaysShowMask={false} 
                                placeholder={'00:00'} 
                                {...field} 
                              >
                                <Input />
                              </InputMask2>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name='configuration.scheduleTimeEnd'
                        render={({ field }) => (
                          <FormItem className='space-y-1'>
                            <FormLabel>{PC_CONFIG.labels.configuration.scheduleTimeEnd}</FormLabel>
                            <FormControl className='h-9'>
                              {/* prettier-ignore */}
                              <InputMask2 
                                mask='99:99' 
                                maskPlaceholder='--:--' 
                                alwaysShowMask={false} 
                                placeholder={'00:00'} 
                                {...field} 
                              >
                                <Input />
                              </InputMask2>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Schedule time slot unavailable init and end */}
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <FormField
                        control={createForm.control}
                        name='configuration.unavailableTimeSlot.timeSlotUnavailableInit'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.configuration.timeSlotUnavailableInit}</FormLabel>
                            <FormControl className='h-9'>
                              {/* prettier-ignore */}
                              <InputMask2 
                                mask='99:99' 
                                maskPlaceholder='--:--' 
                                alwaysShowMask={false} 
                                placeholder={'00:00'} 
                                {...field} 
                              >
                                <Input />
                              </InputMask2>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name='configuration.unavailableTimeSlot.timeSlotUnavailableEnd'
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>{PC_CONFIG.labels.configuration.timeSlotUnavailableEnd}</FormLabel>
                            <FormControl className='h-9'>
                              {/* prettier-ignore */}
                              <InputMask2 
                                mask='99:99' 
                                maskPlaceholder='--:--' 
                                alwaysShowMask={false} 
                                placeholder={'00:00'} 
                                {...field} 
                              >
                                <Input />
                              </InputMask2>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                {/* Buttons */}
                <div className='grid grid-cols-1 space-y-2 pt-6 md:flex md:justify-end md:gap-6 md:space-y-0'>
                  <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                    {PC_CONFIG.buttons.create}
                  </Button>
                  <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                    {PC_CONFIG.buttons.cancel}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
