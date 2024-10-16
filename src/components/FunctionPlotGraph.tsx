import functionPlot, { FunctionPlotOptions } from 'function-plot';
import React, { useEffect, useRef, useState } from 'react';

interface FunctionPlotGraphProps {
  expression: string;
}

const FunctionPlotGraph: React.FC<FunctionPlotGraphProps> = ({
  expression,
}) => {
  // rootElement for the destination div container
  const rootElm = useRef<HTMLDivElement>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Ensures that a valid expression and a destination div exists
    if (!rootElm.current) return;

    const options: FunctionPlotOptions = {
      target: rootElm.current,
      width: 600,
      height: 400,
      yAxis: { domain: [-10, 10] },
      grid: true,
      data: [
        {
          fn: expression || '0',
          color: '#3f86ff',
        },
      ],
    };

    // Clearing previous graph -> creates a new one -> force re-render
    try {
      rootElm.current.innerHTML = '';
      functionPlot(options);
      forceUpdate({});
    } catch (err) {
      console.error('Error plotting function!: ', err);
    }
  }, [expression]);

  return (
    <div
      ref={rootElm}
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '800px',
        height: '400px',
      }}
    />
  );
};

export default FunctionPlotGraph;
