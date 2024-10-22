import axios from 'axios';

interface TokenizeData {
  tokens: Array<{ type: string; data: string }>;
}

interface ASTData {
  rootExpression: {
    type: string;
    [key: string]: any;
  };
}

interface CalcResult {
  result: number;
  parsedExpression: string;
  ast: ASTData;
  tokens: Array<{ type: string; data: string }>;
  processingTimeInMicros: number;
}

interface CalculationRecord {
  id: number;
  expression: string;
  operation: string;
  result: string;
  url: string;
  created_at: string;
}

// Specifies the Response with TokenizeData | ASTData | CalcResult
type ApiResponseOption = TokenizeData | ASTData | CalcResult;

const BASE_URL = 'http://localhost:3000/';

const calculateValues = async (
  operation: string,
  expression: string,
  x?: string
): Promise<ApiResponseOption | undefined> => {
  try {
    // Fetching from Fastify-Server
    const response = await axios.get(`${BASE_URL}v1/${operation}`, {
      params: {
        expression,
        x,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error calculating', err);
  }
};

const fetchCalculationHistory = async (): Promise<CalculationRecord[]> => {
  try {
    const response = await axios.get(`${BASE_URL}calculationHistory`);
    return response.data;
  } catch (err) {
    console.error('Error fetching calculation history', err);
    throw err;
  }
};

const deleteCalculationRecord = async (id: number): Promise<void> => {
  try {
    const response = await axios.delete(`${BASE_URL}calculationHistory/${id}`);
    if (response.status !== 200) {
      throw new Error('Failed to delete record from calculation history ');
    }
  } catch (err) {
    console.error('Error deleting calculation record', err);
    throw err;
  }
};

const updateCalculationRecord = async (
  id: number,
  data: {
    expression: string;
    operation: 'resolve' | 'tokenize' | 'ast' | 'calc';
  }
): Promise<void> => {
  try {
    const response = await axios.put(
      `${BASE_URL}calculationHistory/${id}`,
      data,
      {
        headers: {
          // Sending to server as JSON
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status !== 200) {
      throw new Error('Failed to update calculation');
    }
  } catch (err) {
    console.error('Error updating calculation record', err);
    throw err;
  }
};

export {
  calculateValues,
  deleteCalculationRecord,
  fetchCalculationHistory,
  updateCalculationRecord,
};
export type {
  ASTData,
  ApiResponseOption,
  CalcResult,
  CalculationRecord,
  TokenizeData,
};
