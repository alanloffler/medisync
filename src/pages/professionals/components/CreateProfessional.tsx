// Icons: https://lucide.dev/icons/
import { ArrowLeft, FilePlus, Mail, Menu, Phone } from 'lucide-react';
// Components: https://ui.shadcn.com/docs/components
import { Badge } from '@/core/components/ui/badge';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/core/components/ui/dropdown-menu';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import { Label } from '@/core/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { Switch } from '@/core/components/ui/switch';
// App components
import { PageHeader } from '@/core/components/common/PageHeader';
// App
import { AreaService } from '@/core/services/area.service';
import { IArea } from '@/core/interfaces/area.interface';
import { ISpecialization } from '@/core/interfaces/specialization.interface';
import { Link, useNavigate } from 'react-router-dom';
import { Loading } from '@/core/components/common/Loading';
import { PROF_CREATE_CONFIG as PC_CONFIG } from '../config/professionals.config';
import { ProfessionalApiService } from '../services/professional-api.service';
import { professionalSchema } from '../schemas/professional.schema';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useEffect, useState, MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateProfessional() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showProfessionalCard, setShowProfessionalCard] = useState<boolean>(false);
  const [specializations, setSpecializations] = useState<ISpecialization[]>([]);
  
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  // #region Load data
  useEffect(() => {
    setIsLoading(true);
    AreaService.findAll().then((response) => {
      if (!response.statusCode) {
        setAreas(response);
        setDisabledSpec(false);
        addNotification({ type: 'success', message: 'Areas y especialidades cargadas' });
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor buscando areas' });
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion
  // #endregion
  // #region Form config and actions
  const defaultValues = {
    area: '',
    available: true,
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    titleAbbreviation: '',
  };

  const createForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    const isDirty = createForm.formState.isDirty;
    if (isDirty) setShowProfessionalCard(true);
    if (!isDirty) setShowProfessionalCard(false);
  }, [createForm.formState.isDirty, showProfessionalCard]);

  function handleCreateProfessional(data: z.infer<typeof professionalSchema>) {
    ProfessionalApiService.create(data).then((response) => {
      if (response.statusCode === 200) {
        setDisabledSpec(true);
        addNotification({ type: 'success', message: response.message });
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor creando el profesional' });
      createForm.reset(defaultValues);
      setShowProfessionalCard(false);
    });
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLInputElement>) {
    event.preventDefault();
    createForm.reset(defaultValues);
    setDisabledSpec(true);
    setShowProfessionalCard(false);
  }

  function handleChangeArea(event: string) {
    const specializations = areas.find((area) => area._id === event)?.specializations || [];
    setSpecializations(specializations);
    setDisabledSpec(false);
    createForm.setValue('specialization', '');
  }
  // #endregion
  return (
    <main className='flex flex-1 flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <PageHeader title={''} breadcrumb={PC_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>
      </div>
      {isLoading && <Loading text='Bajando datos' size={30} duration={0.35} className='gap-8 bg-background fill-indigo-500 p-8' />}
      {!isLoading && <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2 lg:gap-6'>
        <Card className='w-full md:grid-cols-2'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FilePlus className='h-4 w-4' strokeWidth={2} />
                <span>{PC_CONFIG.formTitle}</span>
              </div>
              {/* Dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'tableHeader'} size={'miniIcon'}>
                    <Menu className='h-4 w-4' strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-fit' align='center'>
                  <DropdownMenuItem>
                    <Link to='/'>Agregar área</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to='/'>Agregar especialidad</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
            <CardDescription>{PC_CONFIG.formDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateProfessional)} className='space-y-4'>
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
                    control={createForm.control}
                    name='specialization'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{PC_CONFIG.labels.specialization}</FormLabel>
                        <Select 
                          defaultValue={field.value} 
                          disabled={disabledSpec || specializations.length < 1} 
                          onValueChange={(event) => field.onChange(event)} 
                          value={field.value}>
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
                    name='titleAbbreviation'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>{PC_CONFIG.labels.titleAbbreviation}</FormLabel>
                        <FormControl className='h-9'>
                          <Input placeholder={PC_CONFIG.placeholders.titleAbbreviation} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name='available'
                    render={({ field }) => (
                      <FormItem className=''>
                        {/* <FormLabel>{}</FormLabel> */}
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
                {/* Buttons */}
                <div className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
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
        {showProfessionalCard && (
          <div className='mx-auto w-full animate-fadeIn justify-items-center md:grid-cols-1 lg:grid-cols-1'>
            <div className='mx-auto flex h-full items-center justify-center'>
              <Card className='w-full md:w-2/3 lg:w-2/3'>
                <CardHeader>
                  <div className='flex justify-center p-4 text-3xl font-semibold leading-none tracking-tight'>
                    {createForm.watch('titleAbbreviation')} {createForm.watch('lastName')} {createForm.watch('firstName')}
                  </div>
                  <CardContent className='space-y-2 px-6 py-0 pt-2 text-lg'>
                    {createForm.watch('email') !== '' && (
                      <div className='flex animate-fadeIn items-center gap-4 italic'>
                        <Mail className='h-4 w-4' />
                        {createForm.watch('email')}
                      </div>
                    )}
                    {createForm.watch('phone') !== 0 && (
                      <div className='flex items-center gap-4'>
                        <Phone className='h-4 w-4' />
                        {createForm.watch('phone')}
                      </div>
                    )}
                  </CardContent>
                  <div className='flex justify-end space-x-4 pt-4'>
                    {createForm.watch('area') !== '' && (
                      <Badge variant={'secondary'} className='animate-fadeIn'>
                        {capitalize(areas.find((area) => area._id === createForm.watch('area'))?.name)}
                      </Badge>
                    )}
                    {createForm.watch('specialization') !== '' && (
                      <Badge variant={'secondary'} className='animate-fadeIn'>
                        {capitalize(areas.find((area) => area._id === createForm.watch('area'))?.specializations.find((spec) => spec._id === createForm.watch('specialization'))?.name || '')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        )}
      </div>}
    </main>
  );
}
