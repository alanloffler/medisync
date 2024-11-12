interface IDashboardTitle {
  title: string;
}

export function DashboardTitle({ title }: IDashboardTitle) {
  return <h2 className='text-xl font-semibold text-dark-default'>{title}</h2>;
}
