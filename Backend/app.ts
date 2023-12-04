const express = require('express')
const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({ path: './.env' })

const app = express()

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
})

app.use(cors())

const getTodo = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM todo').then(data => {
      resolve(data[0])
    })
  })
}

app.get('/getTodo', async (req, res) => {
  res.json(await getTodo())
})

app.post('/addTodo', async (req, res) => {
  pool.query(`INSERT INTO todo (text) VALUES ('${req.query.text}')`).then(
    setTimeout(async () => {
      res.json(await getTodo())
    }, 10)
  )
})

app.post('/editTodo', async (req, res) => {
  pool
    .query(
      `UPDATE todo SET text = '${req.query.text}', isСompleted = '${req.query.isСompleted}' WHERE id = ${req.query.id}`
    )
    .then(
      setTimeout(async () => {
        res.json(await getTodo())
      }, 10)
    )
})

app.delete('/deleteTodo', async (req, res) => {
  pool.query(`DELETE FROM todo WHERE id = ${req.query.id}`).then(
    setTimeout(async () => {
      res.json(await getTodo())
    }, 10)
  )
})

app.listen(5000, () => {
  console.log('Server started on Port 5000')
})
