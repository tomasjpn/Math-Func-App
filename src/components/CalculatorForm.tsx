import styles from '../styles/CalculatorForm.module.css';

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
  calcResult: string;
}

export const CalculatorForm: React.FC<CalcFormProperties> = ({
  input,
  handleInputChange,
  handleCalc,
  calcResult,
}) => {
  return (
    <div>
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
      <p>{calcResult}</p>
    </div>
  );
};

export default CalculatorForm;
