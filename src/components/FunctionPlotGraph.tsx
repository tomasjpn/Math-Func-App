import functionPlot from 'function-plot';
import React, { useEffect, useRef } from 'react';

interface FunctionPlotGraphProps {
  expression: string;
}

const FunctionPlotGraph: React.FC<FunctionPlotGraphProps> = ({
  expression,
}) => {
  // rootElement for the destination div container
  const rootElm = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensures that a valid expression and a destination div exists
    if (!expression || !rootElm.current) return;

    try {
      functionPlot({
        target: rootElm.current,
        width: 800,
        height: 400,
        yAxis: { domain: [-10, 10] },
        grid: true,
        data: [
          {
            fn: expression,
            color: 'blue',
          },
        ],
      });
    } catch (err) {
      console.error('Error plotting function:', err);
    }
  }, [expression]);

  return <div ref={rootElm} />;
};

export default FunctionPlotGraph;
