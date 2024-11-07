// Icons: https://lucide.dev
import { ChevronLeft, ChevronRight } from 'lucide-react';
// External components: http://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { IconShortcut } from '@dashboard/components/shortcuts/IconShortcut';
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import { motion } from 'framer-motion';
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

  const {
    data: specializations,
    error,
    isLoading,
  } = useQuery<IResponse>({
    queryKey: ['specializations'],
    queryFn: async () => await SpecializationService.findAll(),
    retry: 1,
  });

  const animation = {
    chevron: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 0.1, delay: 0.3 } },
    },
  };

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
      setReachedRightEdge(scrollRef.current.scrollLeft >= maxScrollLeft - 1);
      setReachedLeftEdge(scrollRef.current.scrollLeft <= 1);
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
      <Card className={cn('relative flex items-center p-4', className)}>
        {/* Section: Specializations shortcuts */}
        <section className='flex flex-row justify-start space-x-4 overflow-x-hidden' ref={scrollRef}>
          {isLoading && <LoadingDB text={DASHBOARD_CONFIG.categoriesShortcuts.loadingText} variant='default' />}
          {error && <InfoCard text={error.message} type='error' className='mx-auto' />}
          {specializations?.data.map((specialization: ISpecialization) => (
            <IconShortcut
              icon={specialization.icon}
              iconSize={28}
              itemHeight={80}
              itemWidth={120}
              key={crypto.randomUUID()}
              label={specialization.name}
              setAreaSelected={setAreaSelected}
            />
          ))}
          {isOverflowing && reachedLeftEdge && (
            <>
              <div className='absolute -right-0 top-0 flex h-full w-12 rounded-r-lg bg-gradient-to-l from-white to-white/30'></div>
              <motion.div
                variants={animation.chevron}
                animate='animate'
                initial='initial'
                className='absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-dark-bg p-1 text-dark-default shadow-sm'
              >
                <ChevronRight size={20} strokeWidth={2} />
              </motion.div>
            </>
          )}
          {isOverflowing && reachedRightEdge && (
            <>
              <div className='absolute -left-0 top-0 flex h-full w-12 rounded-l-lg bg-gradient-to-r from-white to-white/30'></div>
              <motion.div
                variants={animation.chevron}
                animate='animate'
                initial='initial'
                className='absolute -left-7 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-dark-bg p-1 text-dark-default shadow-sm'
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </motion.div>
            </>
          )}
          {isOverflowing && !reachedLeftEdge && !reachedRightEdge && (
            <>
              <div className='absolute -right-0 top-0 flex h-full w-12 rounded-r-lg bg-gradient-to-l from-white to-white/30'></div>
              <div className='absolute -left-0 top-0 flex h-full w-12 rounded-l-lg bg-gradient-to-r from-white to-white/30'></div>
              <motion.div
                variants={animation.chevron}
                animate='animate'
                initial='initial'
                className='absolute -left-7 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-dark-bg p-1 text-dark-default shadow-sm'
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </motion.div>
              <motion.div
                variants={animation.chevron}
                animate='animate'
                initial='initial'
                className='absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full bg-dark-bg p-1 text-dark-default shadow-sm'
              >
                <ChevronRight size={20} strokeWidth={2} />
              </motion.div>
            </>
          )}
        </section>
      </Card>
    </main>
  );
}
