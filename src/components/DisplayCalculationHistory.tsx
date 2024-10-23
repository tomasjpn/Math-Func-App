import React, { useEffect, useState } from 'react';
import {
  CalculationRecord,
  deleteCalculationRecord,
  fetchCalculationHistory,
  updateCalculationRecord,
} from '../services/localApiCall';
import { extractXValueFromUrl } from './utils/ExtractXValueFromUrl';

type Operation = 'resolve' | 'tokenize' | 'ast' | 'calc';
const VALID_OPERATIONS: Operation[] = ['resolve', 'tokenize', 'ast', 'calc'];

interface DisplayCalculationHistoryProps {
  onSelect: (record: CalculationRecord) => void;
}

const DisplayCalculationHistory: React.FC<DisplayCalculationHistoryProps> = ({
  onSelect,
}) => {
  const [calculationHistory, setCalculationHistory] = useState<
    CalculationRecord[]
  >([]);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [errorScreen, setErrorScreen] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<CalculationRecord | null>(
    null
  );

  useEffect(() => {
    fetchHistoryRecords();
  }, []);

  const fetchHistoryRecords = async () => {
    try {
      const data = await fetchCalculationHistory();
      setCalculationHistory(data);
      setLoadingScreen(false);
      console.info('Calculation Record history fetched!');
    } catch (err) {
      console.error('Error fetching calculation history', err);
      setErrorScreen('Failed to fetch calculation history');
      setLoadingScreen(false);
    }
  };

  const handleSelect = (record: CalculationRecord) => {
    /**
     *  Shared state between CalculatorForm and DisplayCalculation -> managed by App.tsx
     *  "Select" -> triggered
     *  handleSelect() is called -> onSelect() will be called afterwards
     *  The App.tsx updates input state
     *  CalculatorForm receives the new input values through its props
     */
    onSelect(record);
  };

  const handleDeleteRecord = async (id: number) => {
    if (window.confirm('This calculation record will be deleted? ')) {
      try {
        await deleteCalculationRecord(id); // Delete record by ID
        await fetchHistoryRecords(); // updates the history records
        console.info('Calculation Record deleted!');
      } catch (err) {
        console.error('Error deleting calculation record from database: ', err);
        setErrorScreen('Error deleting calculation record from database: ');
      }
    }
  };

  const handleEditButton = (record: CalculationRecord) => {
    /**
     * If "edit-button" is triggered -> setEditingRecord()
     * reveals editing form UI
     * */
    setEditingRecord(record);
  };

  const handleUpdateRecord = async (record: CalculationRecord) => {
    try {
      await updateCalculationRecord(record.id, {
        expression: record.expression,
        operation: record.operation as Operation,
      });
      setEditingRecord(null); // hides the UI after editing
      await fetchHistoryRecords(); // updates history record
      console.info('Calculation Record updated!');
    } catch (err) {
      console.error('Error updating calculation:', err);
      setErrorScreen('Failed to update calculation');
    }
  };

  const handleOperationChange = (value: string, record: CalculationRecord) => {
    if (VALID_OPERATIONS.includes(value as Operation)) {
      setEditingRecord({
        ...record, // Every parameter besides operation is kept same
        operation: value as Operation, // Only operation is changed as the passed operator value
      });
    }
  };

  const renderEditForm = (record: CalculationRecord) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
      }}
    >
      <input
        type="text"
        value={record.expression}
        onChange={(e) =>
          setEditingRecord({ ...record, expression: e.target.value })
        }
        style={{
          marginRight: '10px',
          padding: '10px',
          backgroundColor: '#156afc3a',
          borderRadius: '15px',
          borderWidth: '1px',
          borderColor: '#156afc',
          outline: 'none',
        }}
      />
      <select
        value={record.operation}
        onChange={(e) => handleOperationChange(e.target.value, record)}
        style={{
          marginRight: '10px',
          padding: '5px',
          background: '#3f86ff',
          borderRadius: '10px',
        }}
      >
        {VALID_OPERATIONS.map((op) => (
          <option key={op} value={op}>
            {op.charAt(0).toUpperCase() + op.slice(1)}
          </option>
        ))}
      </select>
      <button
        onClick={() => handleUpdateRecord(record)}
        style={{
          backgroundColor: '#3f86ff',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '10px',
          marginRight: '5px',
        }}
      >
        Save
      </button>
      <button
        onClick={() => setEditingRecord(null)}
        style={{
          backgroundColor: '#ff3f3f',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '10px',
        }}
      >
        Cancel
      </button>
    </div>
  );

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
        {limitedCalculationHistory.map((record) => (
          <li
            key={record.id}
            style={{
              backgroundColor: '#dfe9ff',
              marginBottom: '10px',
              padding: '8px 15px',
              borderRadius: '15px',
            }}
          >
            {editingRecord?.id === record.id ? (
              renderEditForm(editingRecord)
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#1152c4',
                  }}
                >
                  <p style={{ fontWeight: '600', margin: 0 }}>
                    {record.expression} ({record.operation});
                    {extractXValueFromUrl(record.url) && (
                      <span style={{ marginLeft: '8px', color: '#1152c4' }}>
                        x = {extractXValueFromUrl(record.url)};
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => handleSelect(record)}
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
                    onClick={() => handleEditButton(record)}
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
                    onClick={() => handleDeleteRecord(record.id)}
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayCalculationHistory;
