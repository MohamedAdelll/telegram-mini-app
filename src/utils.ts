export function decodeQueryString(
  queryString: string
): Record<string, unknown> {
  // Create a URLSearchParams object to parse the query string
  const params = new URLSearchParams(queryString);

  // Create an object to store the decoded values
  const result: Record<string, unknown> = {};

  // Iterate through each entry
  for (const [key, value] of params.entries()) {
    try {
      // Try to parse JSON if the value looks like JSON
      result[key] = JSON.parse(decodeURIComponent(value));
    } catch {
      // Otherwise, just decode the value as a string
      result[key] = decodeURIComponent(value);
    }
  }

  return result;
}
