// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// Components
import { IconShortcut } from '@dashboard/components/shortcuts/IconShortcut';
// External imports
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IResponse } from '@core/interfaces/response.interface';
import type { ISpecialization } from '@core/interfaces/specialization.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { SpecializationService } from '@core/services/specialization.service';
import { cn } from '@lib/utils';
import { ChevronRight } from 'lucide-react';
// React component
export function CategoriesShortcuts({ className }: { className?: string }) {
  const [areaSelected, setAreaSelected] = useState<string>('');
  const [showChevron, setShowChevron] = useState<boolean>(false);
  const [reachedLeftEdge, setReachedLeftEdge] = useState<boolean>(false);
  const [reachedRightEdge, setReachedRightEdge] = useState<boolean>(false);

  const { data: specializations } = useQuery<IResponse>({
    queryKey: ['specializations'],
    queryFn: async () => {
      return await SpecializationService.findAll();
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  function handleDragScroll(): void {
    if (scrollRef.current) {
      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      scrollRef.current.addEventListener('mousedown', (e: MouseEvent) => {
        isDown = true;
        startX = e.pageX - scrollRef.current!.offsetLeft;
        scrollLeft = scrollRef.current!.scrollLeft;
      });

      scrollRef.current.addEventListener('mouseleave', () => {
        isDown = false;
      });

      scrollRef.current.addEventListener('mouseup', () => {
        isDown = false;
      });

      scrollRef.current.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current!.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current!.scrollLeft = scrollLeft - walk;

        if (scrollRef.current!.scrollLeft <= 0) {
          console.log('Reached the left edge, cannot scroll left');
          setReachedLeftEdge(true);
      }
  
      // Check for right edge
      const maxScrollLeft = scrollRef.current!.scrollWidth - scrollRef.current!.clientWidth;
      if (scrollRef.current!.scrollLeft >= maxScrollLeft) {
          console.log('Reached the right edge, cannot scroll right');
          setReachedRightEdge(true);
      }
      });

      scrollRef.current.addEventListener('touchstart', (e: TouchEvent) => {
        isDown = true;
        startX = e.touches[0].pageX - scrollRef.current!.offsetLeft;
        scrollLeft = scrollRef.current!.scrollLeft;
      });

      scrollRef.current.addEventListener('touchend', () => {
        isDown = false;
      });

      scrollRef.current.addEventListener('touchmove', (e: TouchEvent) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - scrollRef.current!.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current!.scrollLeft = scrollLeft - walk;
      });
    }
  }

  const [isOverflowing, setIsOverflowing] = useState(false);

  // Function to check if the container has overflow
  const checkOverflow = () => {
    if (scrollRef.current) {
      setIsOverflowing(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  useEffect(() => {
    console.log('Area selected: ', areaSelected);
  }, [areaSelected]);

  return (
    <Card className={cn('space-y-4 p-4', className)}>
      <h5 className='text-lg font-medium leading-none'>{DASHBOARD_CONFIG.categoriesShortcuts.title}</h5>
      <section
        className='flex flex-row justify-start space-x-4 overflow-x-hidden'
        ref={scrollRef}
        onMouseDown={handleDragScroll}
        onTouchStart={handleDragScroll}
      >
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
      {/* TODO: show or hide if colapse edges, first add a chevronleft */}
      {isOverflowing && (
        <section className='flex justify-end bg-red-500'>
          <ChevronRight size={24} />
        </section>
      )}
    </Card>
  );
}
