// External components: https://ui.shadcn.com/docs/components
import { Card, CardHeader, CardTitle } from '@core/components/ui/card';
// Components
import { InfoCard } from '@core/components/common/InfoCard';
import { LoadingDB } from '@core/components/common/LoadingDB';
// External imports
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
// Imports
import type { IStatisticChart, IChartDataProcessed, IChartMargin, IChartData, IChartDays } from '@dashboard/interfaces/statistic.interface';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
// Constants
const days: IChartDays[] = DASHBOARD_CONFIG.statisticGroup.charts[0].days;
// React component
export function StatisticChart({ fetchChartData, height, labels, margin, options, path, title }: IStatisticChart) {
  const [daysAgo, setDaysAgo] = useState<number>(handleDaysAgo());
  const navigate = useNavigate();
  const lineChartRef = useRef<HTMLDivElement>(null);

  function handleDaysAgo(): number {
    if (days.length > 0) {
      return days.find((d) => d.default)?.value || days[0].value;
    } else {
      return 7;
    }
  }

  const { data, isError, isLoading, isSuccess, error } = useQuery({
    queryKey: ['dashboard', 'appos-chart', daysAgo],
    queryFn: () => fetchChartData(daysAgo),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const processedData: IChartDataProcessed[] = Array.isArray(data?.data)
    ? data.data.map((d: IChartData) => ({
        date: new Date(d.date),
        value: d.value,
      }))
    : [];

  const _margin: IChartMargin = margin || { top: 20, right: 20, bottom: 20, left: 20 };
  const _height: number = (height ? height : 130) - _margin.top - _margin.bottom;

  const minRange: number = d3.min(processedData, (d) => d.value) || 0;

  if (title) _margin.top = 10;

  if (!labels) labels = { x: '', y: '' };

  useEffect(() => {
    if (!processedData || (processedData.length === 0 && !isSuccess)) return;

    const y = d3.scaleLinear().range([_height, 0]);
    y.domain([minRange ? minRange - minRange / 2 : 0 - _margin.bottom, d3.max(processedData, (d) => d.value) ?? 0]);

    function drawChart(): void {
      const lineChart = lineChartRef.current;
      if (lineChart) {
        const svgElement = lineChart.querySelector('svg');
        if (svgElement) svgElement.remove();
      }

      const currentWidth: number = parseInt(d3.select('#line-chart').style('width'), 10) - _margin.left - _margin.right;

      const x = d3.scaleTime().range([0, currentWidth]);
      x.domain(d3.extent(processedData, (d) => d.date) as [Date, Date]);

      const svg = d3
        .select('#line-chart')
        .append('svg')
        .attr('width', currentWidth + _margin.left + _margin.right)
        .attr('height', _height + _margin.top + _margin.bottom)
        .append('g')
        .attr('transform', `translate(${_margin.left}, ${_margin.top})`);

      if (options && options.axisY)
        svg
          .append('g')
          .attr('transform', `translate(0, ${_height})`)
          .attr('stroke-width', 1.5)
          .attr('color', '#6ee7b7')
          .call(d3.axisBottom(x).ticks(0).tickSizeOuter(0));

      if (options && options.axisX) svg.append('g').attr('stroke-width', 1.5).attr('color', '#6ee7b7').call(d3.axisLeft(y).ticks(0).tickSizeOuter(0));

      if (labels) {
        svg
          .append('text')
          .attr('x', currentWidth - 5)
          .attr('y', _height - 5)
          .style('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('font-weight', '600')
          .style('fill', '#6ee7b7')
          .text(labels.x);

        svg
          .append('text')
          .attr('x', 10)
          .attr('y', 5)
          .style('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('font-weight', '600')
          .style('fill', '#6ee7b7')
          .text(labels.y);
      }

      const valueLine = d3
        .line<{ date: Date; value: number }>()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      svg
        .append('path')
        .datum(processedData)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#a3e635')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', valueLine);
    }

    drawChart();

    addEventListener('resize', drawChart);

    return () => removeEventListener('resize', drawChart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const animation = {
    item: {
      initial: { scale: 1 },
      animate: { scale: 1.05, transition: { type: 'spring', stiffness: 800, damping: 20, duration: 0.2, delay: 0 } },
    },
  };

  if (isLoading) {
    return (
      <Card className='flex flex-col items-center justify-center p-3'>
        <LoadingDB size='box' iconSize={32} empty />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className='flex flex-col items-center justify-center p-3'>
        <InfoCard text={error.name} type='error' />
      </Card>
    );
  }

  return (
    data &&
    data?.data?.length > 0 && (
      <motion.section
        className='rounded-lg border border-transparent'
        initial='initial'
        animate='initial'
        variants={animation.item}
        whileHover='animate'
      >
        <Card className='h-full bg-emerald-500'>
          {title && (
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='flex bg-emerald-600 px-2 py-1 text-primary-foreground'>
                <span className='text-xsm font-medium'>{title}</span>
              </CardTitle>
              <section className='flex flex-row space-x-1 text-[11px] font-normal text-lime-400'>
                {days.length > 0 &&
                  days.map((day) => (
                    <button
                      className={`rounded-sm p-1 leading-none ${daysAgo === day.value && 'bg-emerald-600'}`}
                      onClick={() => setDaysAgo(day.value)}
                    >
                      {day.text}
                    </button>
                  ))}
              </section>
            </CardHeader>
          )}
          <motion.section
            className='cursor-pointer'
            id='line-chart'
            ref={lineChartRef}
            onClick={() => path && path !== '' && navigate(path)}
          ></motion.section>
        </Card>
      </motion.section>
    )
  );
}
