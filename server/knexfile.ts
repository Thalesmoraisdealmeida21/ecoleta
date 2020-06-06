import path from 'path'

module.exports = {
  client: 'postgresql',
  connection: {
    database: 'ecoletadb',
    user: 'postgres',
    password: 'pg123',
  },
  migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
},
  useNullAsDefault: false,
};