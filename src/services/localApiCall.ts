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

const calculateValues = async (
  operation: string,
  expression: string,
  x?: string
): Promise<ApiResponseOption | undefined> => {
  try {
    // Fetching from Fastify-Server
    const response = await axios.get(`http://localhost:3000/v1/${operation}`, {
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
    const response = await axios.get(
      'http://localhost:3000/calculationHistory'
    );
    return response.data;
  } catch (err) {
    console.error('Error fetching calculation history', err);
    throw err;
  }
};

export { calculateValues, fetchCalculationHistory };
export type {
  ASTData,
  ApiResponseOption,
  CalcResult,
  CalculationRecord,
  TokenizeData,
};
