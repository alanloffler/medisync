interface IDashboardTitle {
  title: string;
}

export function DashboardTitle({ title }: IDashboardTitle) {
  return <h2 className='text-xsm text-slate-500 uppercase font-semibold leading-none tracking-tight'>{title}</h2>;
}
