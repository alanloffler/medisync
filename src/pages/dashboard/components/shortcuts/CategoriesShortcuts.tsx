// Icons: https://lucide.dev
import { ChevronLeft, ChevronRight } from 'lucide-react';
// External components: http://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { IconShortcut } from '@dashboard/components/shortcuts/IconShortcut';
// External imports
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { SpecializationService } from '@core/services/specialization.service';
import { cn } from '@lib/utils';
// React component
export function CategoriesShortcuts({ className }: { className?: string }) {
  const [areaSelected, setAreaSelected] = useState<string>('');
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [reachedLeftEdge, setReachedLeftEdge] = useState<boolean>(true);
  const [reachedRightEdge, setReachedRightEdge] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: specializations } = useQuery<IResponse>({
    queryKey: ['specializations'],
    queryFn: async () => await SpecializationService.findAll(),
  });

  useEffect(() => {
    if (!scrollRef.current) return;

    let isDown: boolean = false;
    let startX: number = 0;
    let scrollLeft: number = 0;

    function handleMouseDown(e: MouseEvent): void {
      isDown = true;
      startX = e.pageX - scrollRef.current!.offsetLeft;
      scrollLeft = scrollRef.current!.scrollLeft;
    }

    function handleMouseMove(e: MouseEvent): void {
      if (!isDown) return;
      e.preventDefault();

      const x: number = e.pageX - scrollRef.current!.offsetLeft;
      const walk: number = (x - startX) * 2;

      scrollRef.current!.scrollLeft = scrollLeft - walk;
      updateScrollEdges();
    }

    function handleTouchStart(e: TouchEvent): void {
      isDown = true;
      startX = e.touches[0].pageX - scrollRef.current!.offsetLeft;
      scrollLeft = scrollRef.current!.scrollLeft;
    }

    function handleTouchMove(e: TouchEvent): void {
      if (!isDown) return;

      const x = e.touches[0].pageX - scrollRef.current!.offsetLeft;
      const walk = (x - startX) * 2;

      scrollRef.current!.scrollLeft = scrollLeft - walk;
      updateScrollEdges();
    }

    function handleScrollStop(): void {
      isDown = false;
    }

    const reference = scrollRef.current!;

    reference.addEventListener('mousedown', handleMouseDown);
    reference.addEventListener('mouseup', handleScrollStop);
    reference.addEventListener('mousemove', handleMouseMove);
    reference.addEventListener('mouseleave', handleScrollStop);
    reference.addEventListener('touchstart', handleTouchStart);
    reference.addEventListener('touchend', handleScrollStop);
    reference.addEventListener('touchmove', handleTouchMove);

    return () => {
      reference.removeEventListener('mousedown', handleMouseDown);
      reference.removeEventListener('mouseup', handleScrollStop);
      reference.removeEventListener('mousemove', handleMouseMove);
      reference.removeEventListener('mouseleave', handleScrollStop);
      reference.removeEventListener('touchstart', handleTouchStart);
      reference.removeEventListener('touchend', handleScrollStop);
      reference.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  function checkOverflow(): void {
    if (scrollRef.current) {
      const hasOverflow = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
      setIsOverflowing(hasOverflow);

      setReachedLeftEdge(true);
      setReachedRightEdge(!hasOverflow);
    }
  }

  function updateScrollEdges(): void {
    if (scrollRef.current) {
      const maxScrollLeft: number = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      setReachedRightEdge(scrollRef.current.scrollLeft >= maxScrollLeft);
      setReachedLeftEdge(scrollRef.current.scrollLeft <= 0);
    }
  }

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, [specializations]);

  useEffect(() => {
    console.log('Area selected: ', areaSelected);
  }, [areaSelected]);

  return (
    <main className='space-y-2'>
      <h2 className='text-xl font-medium text-dark-default'>{DASHBOARD_CONFIG.categoriesShortcuts.title}</h2>
      <Card className={cn('space-y-2 p-4', className)}>
        {/* Section: Specializations shortcuts */}
        <section className='flex flex-row justify-start space-x-4 overflow-x-hidden' ref={scrollRef}>
          {specializations?.data.map((specialization: ISpecialization) => (
            <IconShortcut
              icon={specialization.icon}
              iconSize={24}
              itemSize={95}
              key={crypto.randomUUID()}
              label={specialization.name}
              setAreaSelected={setAreaSelected}
            />
          ))}
        </section>
        {/* Section: Chevrons icons */}
        <section className={`flex flex-row ${reachedLeftEdge ? 'justify-end' : 'justify-between'}`}>
          {isOverflowing && reachedLeftEdge && <ChevronRight size={20} strokeWidth={2} />}
          {isOverflowing && reachedRightEdge && <ChevronLeft size={20} strokeWidth={2} />}
          {isOverflowing && !reachedLeftEdge && !reachedRightEdge && (
            <>
              <ChevronLeft size={20} strokeWidth={2} />
              <ChevronRight size={20} strokeWidth={2} />
            </>
          )}
        </section>
      </Card>
    </main>
  );
}
