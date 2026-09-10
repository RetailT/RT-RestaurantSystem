const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === 'true',
    trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERTIFICATE).toLowerCase() === 'true'
  },
  pool: {
    // CHANGED: lowered from 10. On Vercel, each serverless invocation is its
    // own isolated container — it does NOT share this pool with other
    // concurrent invocations the way one long-running server does. A high
    // max here just means every cold container can independently try to
    // open up to that many connections, and a traffic spike with several
    // cold starts firing at once adds those up fast against your SQL
    // Server's real connection limit. Keeping this small caps the damage
    // any single container can do.
    max: 3,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolPromise = null;

async function getPool() {
  // CHANGED: verify the cached pool is still actually connected before
  // reusing it. A "warm" Vercel container can sit paused between requests
  // for a while, and it's possible for the underlying TCP connection to get
  // quietly dropped in that gap (by a firewall or load balancer along the
  // way to a remote DB). Reusing a pool object that looks cached but isn't
  // really connected anymore would make every query fail until the
  // container eventually gets recycled.
  if (poolPromise) {
    const existingPool = await poolPromise.catch(() => null);
    if (existingPool && existingPool.connected) {
      return existingPool;
    }
    poolPromise = null;
  }

  poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
      console.log(`Connected to SQL Server at ${config.server}:${config.port}/${config.database}`);
      return pool;
    })
    .catch((err) => {
      poolPromise = null;
      console.error('SQL Server connection failed:', err.message);
      throw err;
    });

  return poolPromise;
}

module.exports = { sql, getPool };