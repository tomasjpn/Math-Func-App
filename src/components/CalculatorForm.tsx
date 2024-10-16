import { ApiResponseOption } from '../services/localApiCall';
import styles from '../styles/CalculatorForm.module.css';
import DisplayMathRes from './utils/DisplayMathRes';
import RenderMathExpression from './utils/RenderMathExpression';

interface CalcInput {
  operation: string;
  expression: string;
  x?: string;
}

interface CalcFormProperties {
  input: CalcInput;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleCalc: () => void;
  calcResult: ApiResponseOption | null;
}

export const CalculatorForm: React.FC<CalcFormProperties> = ({
  input,
  handleInputChange,
  handleCalc,
  calcResult,
}) => {
  const renderResponse = () => {
    if (!calcResult) return null;

    return (
      <DisplayMathRes
        data={calcResult}
        operation={input.operation as 'tokenize' | 'ast' | 'calc'}
      />
    );
  };
  return (
    <div>
      {input.expression && (
        <div>
          <h3>Mathematical Expression:</h3>
          <h2>
            <RenderMathExpression expression={input.expression} />
          </h2>
        </div>
      )}
      <div className={styles.mainDiv}>
        <input
          type="text"
          name="expression"
          value={input.expression}
          onChange={handleInputChange}
          placeholder="expression"
        />
        <input
          type="text"
          name="x"
          value={input.x}
          onChange={handleInputChange}
          placeholder="x"
        />
        <select
          name="operation"
          value={input.operation}
          onChange={handleInputChange}
        >
          <option value="resolve">resolve</option>
          <option value="tokenize">tokenize</option>
          <option value="ast">ast</option>
          <option value="calc">calculate</option>
        </select>
        <button onClick={handleCalc}>Enter</button>
      </div>
      <div>{renderResponse()}</div>
    </div>
  );
};

export default CalculatorForm;
