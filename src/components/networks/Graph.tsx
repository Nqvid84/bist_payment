import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../../hooks/useTheme';

interface Node {
  id: number;
  name: string;
  type: string;
  subType: 'store' | 'organization' | 'connection';
  createdAt: string;
  updatedAt: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  id: number;
  parentNetwork: number;
  childNetwork: number;
  createdAt: string;
  updatedAt: string;
  parentNetworkName: string;
  childNetworkName: string;
  source: number | Node;
  target: number | Node;
  value?: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface GraphProps {
  data: GraphData;
}

const Graph: React.FC<GraphProps> = ({ data }: GraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      d3.select(svgRef.current).selectAll('*').remove();

      const width = window.innerWidth;
      const height = window.innerHeight - 133;

      const color = d3.scaleOrdinal<string, string>().domain(['external', 'internal-store', 'internal-organization']).range(['#FFD700', '#9C27B0', '#2196F3']);

      const simulation = d3
        .forceSimulation<Node>(data.nodes)
        .force(
          'link',
          d3
            .forceLink<Node, Link>(data.links)
            .id((d: Node) => d.id)
            .strength(0.55) // قدرت جذب لینک‌ها (بین 0 و 1)
            .distance(200) // فاصله بین نودها
        )
        .force('charge', d3.forceManyBody().strength(-200))
        .force('x', d3.forceX().strength(0.02))
        .force('y', d3.forceY().strength(0.02))
        .force('collide', d3.forceCollide(70));

      const svg = d3
        .select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .style('max-width', '100%')
        .style('height', 'auto') as d3.Selection<SVGSVGElement, unknown, null, undefined>;

      const g = svg.append('g');

      svg.call(
        d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([0.1, 4])
          .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            g.attr('transform', event.transform.toString());
          })
      );

      const link = g
        .append('g')
        .attr('stroke', theme === 'light' ? '#000' : '#fff')
        .attr('stroke-opacity', 0.5)
        .selectAll<SVGLineElement, Link>('line')
        .data(data.links, (d: Link) => d.id.toString())
        .join('line')
        .attr('stroke-width', (d: Link) => Math.sqrt(d.value || 10));

      const node = g
        .append('g')
        .attr('stroke', theme === 'light' ? '#000' : '#fff')
        .attr('stroke-width', 0.85)
        .selectAll<SVGCircleElement, Node>('circle')
        .data(data.nodes, (d: Node) => d.id.toString())
        .join('circle')
        .attr('r', (d: Node) => {
          if (d.type === 'external') return 13;
          switch (d.subType) {
            case 'store':
              return 12;
            case 'organization':
              return 11;
            case 'connection':
              return 10;
            default:
              return 11;
          }
        })
        .style('fill', (d: Node) => {
          if (d.type === 'external') return color('external');
          return color(`internal-${d.subType}`);
        });

      node.call(d3.drag<SVGCircleElement, Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended));

      const labels = g
        .append('g')
        .selectAll<SVGTextElement, Node>('text')
        .data(data.nodes)
        .join('text')
        .text((d: Node) => d.name)
        .style('text-anchor', 'middle')
        .style('fill', theme === 'light' ? '#000' : '#fff')
        .style('font-family', 'Arial')
        .style('font-size', 16)
        .style('font-weight', 'semibold');

      simulation.on('tick', () => {
        link
          .attr('x1', (d: Link) => (d.source as Node).x!)
          .attr('y1', (d: Link) => (d.source as Node).y!)
          .attr('x2', (d: Link) => (d.target as Node).x!)
          .attr('y2', (d: Link) => (d.target as Node).y!);

        labels.attr('x', (d: Node) => d.x!).attr('y', (d: Node) => (d.type === 'external' ? d.y! - 20 : d.y! + 25));

        node.attr('cx', (d: Node) => d.x!).attr('cy', (d: Node) => d.y!);
      });

      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return () => {
        simulation.stop();
      };
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [data, theme]);

  return (
    <>
      <legend className="space-y-2 p-4 light:text-black dark:text-white">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
          <p>شبکه خارجی</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <p>سازمان داخلی</p>
        </div>
        {/* <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <p>اتصال داخلی</p>
        </div> */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-purple-500"></div>
          <p>فروشگاه داخلی</p>
        </div>
      </legend>
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg"></svg>
    </>
  );
};

export default Graph;
