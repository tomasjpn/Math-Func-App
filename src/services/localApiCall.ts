import axios from 'axios';

const calculateValues = async (
  operation: string,
  expression: string,
  x?: string
): Promise<string | undefined> => {
  try {
    // Fetching from Fastify-Server
    const response = await axios.get(`http://localhost:3000/v1/${operation}`, {
      params: {
        expression,
        x,
      },
    });
    return JSON.stringify(response.data);
  } catch (err) {
    console.error('Error calculating', err);
  }
};

export { calculateValues };
