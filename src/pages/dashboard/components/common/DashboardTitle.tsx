interface IDashboardTitle {
  title: string;
}

export function DashboardTitle({ title }: IDashboardTitle) {
  return <h2 className='text-xl font-medium text-dark-default'>{title}</h2>;
}
