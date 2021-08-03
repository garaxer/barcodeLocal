export const mapKeys = (property) => (obj) =>
  obj.reduce(
    (acc, cur) => ({
      ...acc,
      [cur[property]]: cur,
    }),
    {}
  );

export const mapWithTwoKeys = (propertyOne, propertyTwo) => (obj) =>
  obj.reduce(
    (acc, cur) => ({
      ...acc,
      [cur[propertyOne] + cur[propertyTwo]]: cur,
    }),
    {}
  );

export const omitSingle = (key, { [key]: _, ...obj }) => obj;

export const groupKeys = (property) => (obj) =>
  obj.reduce(
    (acc, cur) => ({
      ...acc,
      [cur[property]]: { ...(acc[cur[property]] || []), cur },
    }),
    {}
  );

export const omit = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

export const pick = (keys, obj) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));

export const getFormattedDate = (date = new Date()) => {
  let dateTimeFormat = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  let [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
  ] = dateTimeFormat.formatToParts(date);
  return `${day}-${month}-${year}`;
};

/*  const compose = (...fns) => x => fns.reduce((a,c) => c(a), x)
  const get = key => obj => obj[key];
  const unique = arr => [...new Set(arr)];
  const map = fn => x => fn(x);
  // const log = x => console.log(x)
  compose(
    x=>x.map(get('userId')), // get can be replace by x=>x.userId// same as map(get('a'))(b)  // when composed it will be passed key first, it is critical to think this way
    unique,
    map(x=>x.map(id => dispatch(fetchUser(id)))) // can just remove map its fine
  )(getState().posts)

  const composeM = chainMethod => (...ms) => (
  ms.reduce((f, g) => x => g(x)[chainMethod](f))
  );
  const composePromises = composeM('then');
*/
