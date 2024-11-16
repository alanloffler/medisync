interface IDashboardTitle {
  title: string;
}

export function DashboardTitle({ title }: IDashboardTitle) {
  return <h2 className='text-lg font-semibold leading-none tracking-normal'>{title}</h2>;
}
