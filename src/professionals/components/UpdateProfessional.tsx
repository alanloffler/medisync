// App
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProfessionalApiService } from '../services/professional-api.service';
import { useEffect, useState, MouseEvent, useRef } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/core/components/ui/form';
import { PageHeader } from '@/core/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Input } from '@/core/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/core/components/ui/dropdown-menu';
import { Label } from '@/core/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/core/components/ui/select';
import { Switch } from '@/core/components/ui/switch';
import { ArrowLeft, FilePlus, Menu } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { PROF_UPDATE_CONFIG as PU_CONFIG } from '../config/update-professional.config';
import { AreaService } from '@/core/services/area.service';
import { IArea } from '@/core/interfaces/area.interface';
import { useNotificationsStore } from '@/core/stores/notifications.store';
import { useCapitalize } from '@/core/hooks/useCapitalize';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { professionalSchema } from '../schemas/professional.schema';
import { ISpecialization } from '@/core/interfaces/specialization.interface';
import { IProfessional, IProfessionalForm } from '../interfaces/professional.interface';
import { Loading } from '@/core/components/common/Loading';

export default function UpdateProfessional() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasLoading, setAreasLoading] = useState<boolean>(true);
  const [disabledSpec, setDisabledSpec] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [professional, setProfessional] = useState<IProfessional>({} as IProfessional);
  const [professionalLoading, setProfessionalLoading] = useState<boolean>(true);
  const [specKey, setSpecKey] = useState<string>('');
  const [specializations, setSpecializations] = useState<ISpecialization[]>();

  const { id } = useParams();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const capitalize = useCapitalize();
  const navigate = useNavigate();
  const valuesRef = useRef<IProfessionalForm>({} as IProfessionalForm); // Used to reset form to stored values on db
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
    _id: '',
  };

  const createForm = useForm<z.infer<typeof professionalSchema>>({
    resolver: zodResolver(professionalSchema),
    defaultValues: defaultValues,
  });
  // #endregion
  // #region Load data
  useEffect(() => {
    setIsLoading(true);
    AreaService.findAll().then((response) => {
      if (!response.statusCode) {
        setAreas(response);
        setAreasLoading(false);
        addNotification({ type: 'success', message: 'Areas y especialidades cargadas' });
        console.log('Areas charged', response);
      }
      if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
      if (response instanceof Error) addNotification({ type: 'error', message: 'Error en el servidor buscando areas' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id && !areasLoading) {
      ProfessionalApiService.findOne(id).then((response) => {
        setProfessional(response);
        setProfessionalLoading(false);
        console.log('professional data loaded', response);
        setIsLoading(false);
      });
    }
  }, [areasLoading, id]);

  useEffect(() => {
    if (!areasLoading && !professionalLoading) {
      console.log('areas and professional data loaded, then do something');
      // set area value, update specs for select then force specs select re-render
      createForm.setValue('area', professional.area._id);
      handleChangeArea(professional.area._id);
      setSpecKey(crypto.randomUUID());
      createForm.setValue('specialization', professional.specialization._id);
      createForm.setValue('titleAbbreviation', capitalize(professional.titleAbbreviation) || '');
      createForm.setValue('firstName', capitalize(professional.firstName) || '');
      createForm.setValue('lastName', capitalize(professional.lastName) || '');
      createForm.setValue('email', professional.email);
      createForm.setValue('phone', professional.phone);
      createForm.setValue('available', professional.available);
      valuesRef.current = createForm.getValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areasLoading, professionalLoading]);

  function handleChangeArea(event: string) {
    const specializations = areas.find((area) => area._id === event)?.specializations || [];
    setSpecializations(specializations);
    setDisabledSpec(false);
    createForm.setValue('specialization', '');
  }
  // #endregion
  // #region Form actions
  function handleUpdateProfessional(data: z.infer<typeof professionalSchema>) {
    if (id) {
      ProfessionalApiService.update(id, data).then((response) => {
        if (response.statusCode === 200) addNotification({ type: 'success', message: response.message });
        if (response.statusCode > 399) addNotification({ type: 'error', message: response.message });
        if (response instanceof Error) addNotification({ type: 'error', message: 'Internal Server Error' });
      });
    }
  }

  function handleCancel(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    createForm.reset(valuesRef.current);
    setDisabledSpec(true);
  }
  // #endregion
  return (
    <main className='flex flex-col gap-2 p-4 md:gap-2 md:p-6 lg:gap-2 lg:p-6'>
      {/* Page Header */}
      <div className='flex h-fit items-center justify-between'>
        <PageHeader title={''} breadcrumb={PU_CONFIG.breadcrumb} />
        <Button variant={'outline'} size={'sm'} className='gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>
      </div>
      {isLoading && <Loading text='Bajando datos' size={30} duration={0.35} className='gap-8 bg-background fill-indigo-500 p-8' />}
      {!isLoading && (
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
                    <DropdownMenuItem>
                      <Link to='/'>Agregar área</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to='/'>Agregar especialidad</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
              <CardDescription>{PU_CONFIG.formDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleUpdateProfessional)} className='space-y-4'>
                  {/* Form fields: area and specialization */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={createForm.control}
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
                      control={createForm.control}
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
                      control={createForm.control}
                      name='titleAbbreviation'
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
                      control={createForm.control}
                      name='available'
                      render={({ field }) => (
                        <FormItem className=''>
                          {/* <FormLabel>{}</FormLabel> */}
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                  {/* Form fields: email and phone */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                      control={createForm.control}
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
                      control={createForm.control}
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
                  {/* Buttons */}
                  <div className='grid grid-cols-1 space-y-2 pt-2 md:flex md:justify-end md:gap-6 md:space-y-0'>
                    <Button type='submit' className='order-1 md:order-2 lg:order-2'>
                      {PU_CONFIG.buttons.create}
                    </Button>
                    <Button variant={'ghost'} onClick={handleCancel} className='order-2 md:order-1 lg:order-1'>
                      {PU_CONFIG.buttons.cancel}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
