import { useState } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import FunctionPlotGraph from './components/FunctionPlotGraph';
import { calculateValues } from './services/localApiCall';
import './styles/App.css';

interface CalcInput {
  operation: string;
  expression: string;
  x?: string;
}

function App() {
  const [input, setInput] = useState<CalcInput>({
    operation: 'calc',
    expression: '',
    x: '',
  });
  const [calcResult, setCalcResult] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    // Getting values from name param Input and save in input useState
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleCalc = async (): Promise<void> => {
    const result = await calculateValues(
      input.operation,
      input.expression,
      input.x
    );
    setCalcResult(result ?? '');
  };

  return (
    <>
      <div>
        <CalculatorForm
          input={input}
          handleInputChange={handleInputChange}
          handleCalc={handleCalc}
          calcResult={calcResult}
        />
        {input.operation === 'calc' && (
          <FunctionPlotGraph expression={input.expression} />
        )}
      </div>
    </>
  );
}

export default App;
