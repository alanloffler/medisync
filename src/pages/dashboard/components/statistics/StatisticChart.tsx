// Icons: https://lucide.dev
// import { LineChart } from 'lucide-react';
// External components: https://ui.shadcn.com/docs/components
import { Card } from '@core/components/ui/card';
// External imports
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
// React component
export function StatisticChart() {
  const lineChartRef = useRef<HTMLDivElement>(null);

  const data: { date: string; value: number }[] = [
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

  useEffect(() => {
    const lineChart = lineChartRef.current;

    if (lineChart) {
      const svgElement = lineChart.querySelector('svg');
      if (svgElement) svgElement.remove();
    }

    const minRange = d3.min(data, (d) => d.value);

    async function createGraph(): Promise<void> {
      const processedData = data.map((d) => ({
        date: new Date(d.date),
        value: d.value,
      }));

      // TODO: Make chart responsive
      const margin = { top: 20, right: 10, bottom: 10, left: 10 },
        width = 230 - margin.left - margin.right,
        height = 85 - margin.top - margin.bottom;

      const svg = d3
        .select('#line-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleTime().range([0, width]);
      const y = d3.scaleLinear().range([height, 0]);

      x.domain(d3.extent(processedData, (d) => d.date) as [Date, Date]);
      y.domain([minRange ? minRange - margin.bottom : 0 - margin.bottom, d3.max(processedData, (d) => d.value) ?? 0]);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('stroke-width', 1.5)
        .attr('color', '#6ee7b7')
        .call(d3.axisBottom(x).ticks(0).tickSizeOuter(0));

      svg.append('g').attr('stroke-width', 1.5).attr('color', '#6ee7b7').call(d3.axisLeft(y).ticks(0).tickSizeOuter(0));

      svg
        .append('text')
        .attr('x', width - margin.right / 2)
        .attr('y', height - 5)
        .style('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('fill', '#6ee7b7')
        .text('F');

      svg
        .append('text')
        // .attr('transform', 'rotate(-90)')
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
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', valueLine);
    }

    createGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className='bg-emerald-500 p-3'>
      <header className='w-fit rounded-md bg-emerald-600 px-2 py-1 text-left text-xsm font-medium text-emerald-100'>
        <span>Turnos diarios</span>
      </header>
      <section id='line-chart' ref={lineChartRef}></section>
    </Card>
  );
}
