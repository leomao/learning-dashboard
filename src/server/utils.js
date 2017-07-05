export const mapToObject = (map) => {
  let out = Object.create(null);
  for (let [k, v] of map.entries()) {
    out[k] = v;
  }
  return out;
};
