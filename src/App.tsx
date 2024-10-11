import { useState } from 'react';
import './styles/App.css';
import axios from 'axios';

interface CalcInput {
  expression: string;
  x?: string;
}

function App() {
  const [input, setInput] = useState<CalcInput>({
    expression: '',
    x: '',
  });
  const [result, setResult] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Getting values from name param Input and save in input useState
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleCalc = async (): Promise<void> => {
    try {
      // Fetching from Fastify-Server
      const response = await axios.get('http://localhost:3000/v1/calc', {
        params: {
          expression: input.expression,
          x: input.x,
        },
      });
      setResult(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error calculating', err);
      setResult('Error fetching data');
    }
  };
  return (
    <>
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
      </div>
    </>
  );
}

export default App;
