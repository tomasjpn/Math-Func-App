import React, { useEffect, useState } from 'react';
import {
  CalculationRecord,
  fetchCalculationHistory,
} from '../services/localApiCall';

const DisplayCalculationHistory: React.FC = () => {
  const [calculationHistory, setCalculationHistory] = useState<
    CalculationRecord[]
  >([]);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [errorScreen, setErrorScreen] = useState<string | null>(null);

  useEffect(() => {
    const getCalculationHistory = async () => {
      try {
        const data = await fetchCalculationHistory();
        setCalculationHistory(data);
        setLoadingScreen(false);
      } catch (err) {
        console.error('Error fetching calculation history', err);
        setErrorScreen('Failed to fetch calculation history');
        setLoadingScreen(false);
      }
    };
    getCalculationHistory();
  }, []);

  if (loadingScreen) return <div>Loading...</div>;
  if (errorScreen) return <div>Error: {errorScreen}</div>;

  return (
    <div>
      <h2>Calculation History</h2>
      <ul>
        {calculationHistory.map((record) => (
          <li key={record.id}>
            {record.expression} ({record.operation})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayCalculationHistory;
