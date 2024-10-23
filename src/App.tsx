import { useState } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import DisplayCalculationHistory from './components/DisplayCalculationHistory';
import FunctionPlotGraph from './components/FunctionPlotGraph';
import { extractXValueFromUrl } from './components/utils/ExtractXValueFromUrl';
import {
  ApiResponseOption,
  calculateValues,
  CalculationRecord,
} from './services/localApiCall';
import './styles/App.css';
import styles from './styles/App.module.css';

interface CalcInput {
  operation: string;
  expression: string;
  x?: string;
  url?: string;
}

function App() {
  const [input, setInput] = useState<CalcInput>({
    operation: 'calc',
    expression: '',
    x: '',
    url: '',
  });
  const [calcResult, setCalcResult] = useState<ApiResponseOption | null>(null);

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): Promise<void> => {
    // Getting values from name param Input and save in input useState
    const { name, value } = e.target;
    const newInput = {
      ...input,
      [name]: value,
    };
    setInput(newInput);

    // Ensures, that changing the operation will also update the renderResponse
    if (name === 'operation' && newInput.expression) {
      const result = await calculateValues(
        newInput.operation,
        newInput.expression,
        newInput.x
      );
      setCalcResult(result || null);
    }
  };

  const handleCalc = async (): Promise<void> => {
    const result = await calculateValues(
      input.operation,
      input.expression,
      input.x
    );
    setCalcResult(result || null);
  };

  const handleHistorySelect = (record: CalculationRecord) => {
    const xValue = extractXValueFromUrl(record.url);
    setInput({
      expression: record.expression,
      operation: record.operation,
      x: xValue || '',
      url: record.url,
    });
    setCalcResult(null); // Reset the result when selecting new expression
  };

  return (
    <>
      <div className={styles.rootDiv}>
        <div className={styles.titleDiv}>
          <h1 style={{ color: '#1349a7' }}>Math Function Calculator</h1>
        </div>
        <div className={styles.mainDiv}>
          <div className={styles.calcFormDiv}>
            <CalculatorForm
              input={input}
              handleInputChange={handleInputChange}
              handleCalc={handleCalc}
              calcResult={calcResult}
            />
          </div>
          <div className={styles.funcGraphDiv}>
            <h2>Function Plot Graph</h2>
            <div className={styles.funcGraphRenderDiv}>
              <FunctionPlotGraph expression={input.expression} />
              <div>
                <DisplayCalculationHistory onSelect={handleHistorySelect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
