const MongoClient = require('mongodb').MongoClient;
const config = require('./config/db.js');

class DB {
  static getInstance() {
    if(!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }
  static stratiges(cols) {
    if (cols) {
      return function(statement, values, db, resolve, reject) {
        values.forEach(value => {
          try {
            db.collection(statement).insertOne(value, (err, { result }) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          } catch (err) {
            reject(err);
          }
        });
      }
    } else {
      return function(statement, values, db, resolve, reject) {
        try {
          db.collection(statement).insertOne(values, (err, { result }) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } catch (err) {
          reject(err);
        }
      };
    }
  }
  constructor() {
    this.db = null;
    this.connect();
  }
  connect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
      } else {
        MongoClient.connect(config.dbUrl, (err, client) => {
          if (err) {
            reject(err);
          } else {
            this.db = client.db(config.dbName);
            resolve(this.db);
          }
        });
      }
    });
  }
  find(statement, where) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.connect();
        db.collection(statement).find(where).toArray((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  insert(statement, values) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      const cols = values instanceof Array;

      DB.stratiges(cols)(statement, values, db, resolve, reject);
    });
  }
  update(statement, where, value) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.connect();
        db.collection(statement).updateOne(where, {
          $set: value,
        }, (err, { result }) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  remove(statement, where) {
    return new Promise((resolve, reject) => {
      try {
        const db = await this.connect();
        db.collection(statement).removeOne(where, (err, { result }) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = DB.getInstance();
