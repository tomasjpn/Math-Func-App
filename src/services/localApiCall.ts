import axios from 'axios';

const calculateValues = async (
  expression: string,
  x?: string
): Promise<string | undefined> => {
  try {
    // Fetching from Fastify-Server
    const response = await axios.get('http://localhost:3000/v1/calc', {
      params: {
        expression,
        x,
      },
    });
    return response.data.result;
  } catch (err) {
    console.error('Error calculating', err);
  }
};

export { calculateValues };
