const { Client } = require('pg');

class DatabaseHelper {
  constructor(connectionString) {
    this.client = new Client({ connectionString });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  async query(sql, params = []) {
    const res = await this.client.query(sql, params);
    return res.rows;
  }

  async insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`);
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')})`;
    await this.client.query(sql, values);
  }

  async update(table, data, whereClause, whereParams) {
    const keys = Object.keys(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    await this.client.query(sql, [...Object.values(data), ...whereParams]);
  }

  async select(table, whereClause = '', params = []) {
    const sql = `SELECT * FROM ${table} ${whereClause ? 'WHERE ' + whereClause : ''}`;
    return await this.query(sql, params);
  }
}

module.exports = DatabaseHelper;