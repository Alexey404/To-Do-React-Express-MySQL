const express = require('express')
const mysql = require('mysql2/promise')
const cors = require('cors')

const app = express()

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mybd',
})

app.use(cors())

type dataTodo = {
  id: number
  text: string
  isСompleted: number
}

const getTodo = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM todo').then((data: dataTodo[]) => {
      resolve(data[0])
    })
  })
}

app.get('/getTodo', async (req, res) => {
  res.json(await getTodo())
})

app.post('/addTodo', async (req, res) => {
  pool.query(`INSERT INTO todo (text) VALUES ('${req.query.text}')`).then(() =>
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
    .then(() =>
      setTimeout(async () => {
        res.json(await getTodo())
      }, 10)
    )
})

app.delete('/deleteTodo', async (req, res) => {
  pool.query(`DELETE FROM todo WHERE id = ${req.query.id}`).then(() =>
    setTimeout(async () => {
      res.json(await getTodo())
    }, 10)
  )
})

app.listen(5000, () => {
  console.log('Server started on Port 5000')
})
