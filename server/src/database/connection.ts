import knex from 'knex'
import path from 'path'

const connection =  knex({
  client: 'postgresql',
  
  connection: {
    database: 'ecoletadb',
    user: 'postgres',
    password: 'pg123',
    
  },
  useNullAsDefault: false,
})


export default connection;