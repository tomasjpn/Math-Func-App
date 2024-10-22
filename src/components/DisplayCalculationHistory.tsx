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

  const limitedCalculationHistory = calculationHistory.slice(0, 5);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2>Calculation History: </h2>
      <ul
        style={{
          listStyleType: 'none',
          padding: 0,
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {limitedCalculationHistory.map((record, index) => (
          <li
            key={record.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#dfe9ff',
              marginBottom: '10px',
              padding: '8px 15px',
              borderRadius: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                fontSize: '18px',
                color: '#1152c4',
              }}
            >
              <h4 style={{ margin: '0 50px 0 0' }}>{index + 1}.</h4>
              <p style={{ fontWeight: '600', margin: 0 }}>
                {record.expression} ({record.operation})
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                style={{
                  backgroundColor: '#3f86ff',
                  marginLeft: '10px',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  color: '#fff',
                }}
              >
                Select
              </button>
              <button
                style={{
                  backgroundColor: '#3f86ff',
                  marginLeft: '5px',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  color: '#fff',
                }}
              >
                Edit
              </button>
              <button
                style={{
                  backgroundColor: '#3f86ff',
                  marginLeft: '5px',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  color: '#fff',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayCalculationHistory;
