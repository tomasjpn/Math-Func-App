export const extractXValueFromUrl = (url: string): string | undefined => {
  try {
    const urlObj = new URL(url);
    console.log(urlObj);
    return urlObj.searchParams.get('x') || undefined;
  } catch (err) {
    console.error('Error parsing URL: ', err);
    return undefined;
  }
};
