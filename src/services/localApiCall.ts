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

export { calculateValues };
export type { ASTData, ApiResponseOption, CalcResult, TokenizeData };
