import { useState } from 'react';
import './styles/App.css';
import { calculateValues } from './services/localApiCall';
import { CalculatorForm } from './components/calculatorForm';

interface CalcInput {
  expression: string;
  x?: string;
}

function App() {
  const [input, setInput] = useState<CalcInput>({
    expression: '',
    x: '',
  });
  const [calcResult, setCalcResult] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Getting values from name param Input and save in input useState
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleCalc = async (): Promise<void> => {
    const result = await calculateValues(input.expression, input.x);
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
      </div>
    </>
  );
}

export default App;
