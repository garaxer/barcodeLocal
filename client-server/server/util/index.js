Object.filter = (obj, predicate) =>
  Object.fromEntries(Object.entries(obj).filter(predicate));
// https://stackoverflow.com/questions/5072136/javascript-filter-for-objects

Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate([key, obj[key]]))
    .reduce((a, key) => ({ ...a, [key]: obj[key] }), {});

// seperate search filters and in filters e.g. {"id":[1,20],"name":"Gary"} => {"id":[1,20]}
// The sql will be different depending on whether it is an array or not
//  where id in $1 or where id = $1
/**
 * Takes in a filter object and returns the sql string and parameters
 * @param {Filter obect} f :object {"id":[1,20],"name":"Gary"}
 */
const parseFilter = (f) => {
  const inFilters = Object.filter(f, ([, v]) => Array.isArray(v));
  const searchFilters = Object.filter(f, ([, v]) => !Array.isArray(v));

  // {"name":"Gary"} becomes name = $1
  const searchString =
    searchFilters &&
    Object.keys(searchFilters)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' and ');

  const searchParams = searchFilters ? Object.values(searchFilters) : [];
  const searchSql = searchParams.length ? `WHERE ${searchString}` : '';

  // {"id":[1,20]} becomes 'id in ($2,$3)'
  const inString =
    inFilters &&
    Object.keys(inFilters)
      .map(
        (key) =>
          `${key} in (${inFilters[key]
            .map((_, i) => `$${i + 1 + searchParams.length}`) // Make sure the parameter sequence is continued
            .join(',')})`
      )
      .join(' and ');

  const inParams = inFilters ? Object.values(inFilters) : [];
  // Contruct the SQL from the array filters, use AND instead of where if there are also standard filters
  const inSql = inParams.length
    ? `${searchParams.length ? ' AND' : 'WHERE'} ${inString}`
    : '';

  // WHERE name = $1 AND id in ($2,$3) , [ 'Gary', 1, 20 ]
  return [searchSql + inSql, [...searchParams, ...inParams.flat()]];
};

module.exports = {
  parseFilter,
};
