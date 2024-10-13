interface CalcInput {
  expression: string;
  x?: string;
}

interface CalcFormProperties {
  input: CalcInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      {' '}
      <div>
        <h1>Math Function Calculator</h1>
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
        <button onClick={handleCalc}>Calculate</button>
        <p>{calcResult}</p>
      </div>
    </div>
  );
};

export default CalculatorForm;
