// Helper function to ensure environment variables are defined
export const getEnvVariable = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
};

// function parse the value to integer  and return it
export const parseEnvVariableInt = (value: string): number => {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new Error(`Environment variable ${value} must be a valid number`);
  }
  return parsedValue;
};
