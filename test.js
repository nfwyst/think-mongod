const db = require('./index.js');

(async () => {
  const ins = await db.insert('user', {username: 'goodboy', age: 12});
  const res = await db.find('user', {});
  console.log(res);
  console.log('=======================\n');
  console.log(ins);

  const res1 = await db.update('user', {username: 'goodboy'}, {username: 'goodboy', age: 99});
  console.log(res1);
})();
