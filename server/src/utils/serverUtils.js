// eslint-disable-next-line import/prefer-default-export
export const normalizePort = val => {
  const newPort = parseInt(val, 10);

  if (Number.isNaN(newPort)) {
    return val;
  }

  if (newPort >= 0) {
    return newPort;
  }

  return false;
};
