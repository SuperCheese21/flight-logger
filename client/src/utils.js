export const getJsonData = async ({ url, defaultValue = null } = {}) => {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (err) {
    console.error(err);
    return defaultValue;
  }
};
