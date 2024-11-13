// External components: https://ui.shadcn.com/docs/components
import { Card, CardHeader, CardTitle } from '@core/components/ui/card';
// External imports
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
// Imports
import type { IStatisticChart, IChartData, IChartDataProcessed, IChartMargin } from '@dashboard/interfaces/statistic.interface';
// React component
export function StatisticChart({ title }: IStatisticChart) {
  const lineChartRef = useRef<HTMLDivElement>(null);

  const data: IChartData[] = [
    { date: '2024-05-01', value: 139.89 },
    { date: '2024-05-02', value: 125.6 },
    { date: '2024-05-03', value: 108.13 },
    { date: '2024-05-04', value: 115 },
    { date: '2024-05-05', value: 118.8 },
    { date: '2024-05-06', value: 124.66 },
    { date: '2024-05-07', value: 113.44 },
    { date: '2024-05-08', value: 115.78 },
    { date: '2024-05-09', value: 122 },
    { date: '2024-05-10', value: 135.98 },
    { date: '2024-05-11', value: 147.49 },
  ];

  const processedData: IChartDataProcessed[] = data.map((d) => ({
    date: new Date(d.date),
    value: d.value,
  }));

  const minRange: number = d3.min(data, (d) => d.value) || 0;
  const margin: IChartMargin = { top: 10, right: 20, bottom: 20, left: 20 };
  const height: number = 80 - margin.top - margin.bottom;

  useEffect(() => {
    const y = d3.scaleLinear().range([height, 0]);
    y.domain([minRange ? minRange - margin.bottom : 0 - margin.bottom, d3.max(processedData, (d) => d.value) ?? 0]);

    function drawChart(): void {
      const lineChart = lineChartRef.current;

      if (lineChart) {
        const svgElement = lineChart.querySelector('svg');
        if (svgElement) svgElement.remove();
      }

      const currentWidth: number = parseInt(d3.select('#line-chart').style('width'), 10) - margin.left - margin.right;

      const x = d3.scaleTime().range([0, currentWidth]);

      x.domain(d3.extent(processedData, (d) => d.date) as [Date, Date]);

      const svg = d3
        .select('#line-chart')
        .append('svg')
        .attr('width', currentWidth + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('stroke-width', 1.5)
        .attr('color', '#6ee7b7')
        .call(d3.axisBottom(x).ticks(0).tickSizeOuter(0));

      svg.append('g').attr('stroke-width', 1.5).attr('color', '#6ee7b7').call(d3.axisLeft(y).ticks(0).tickSizeOuter(0));

      svg
        .append('text')
        .attr('x', currentWidth - margin.right / 2)
        .attr('y', height - 5)
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#6ee7b7')
        .text('F');

      svg
        .append('text')
        .attr('x', 10)
        .attr('y', 5)
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#6ee7b7')
        .text('T');

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
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', valueLine);
    }

    drawChart();

    addEventListener('resize', drawChart);

    return () => removeEventListener('resize', drawChart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animation = {
    item: {
      initial: { scale: 1 },
      animate: { scale: 1.05, transition: { type: 'spring', stiffness: 800, damping: 20, duration: 0.2, delay: 0 } }, // slate-200
    },
  };

  return (
    <motion.button
      className='rounded-lg border border-transparent'
      initial='initial'
      animate='initial'
      whileHover='animate'
      variants={animation.item}
    >
      <Card className='bg-emerald-500'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='flex bg-emerald-600 px-2 py-1 text-primary-foreground'>
            <span className='text-xsm font-medium'>{title}</span>
          </CardTitle>
        </CardHeader>
        <section id='line-chart' ref={lineChartRef}></section>
      </Card>
    </motion.button>
  );
}
