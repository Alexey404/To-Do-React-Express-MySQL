import { useEffect, useState } from 'react'
import './App.css'
import { Items } from './Components/Items'
import axios from 'axios'

export type Tasks = {
  id: number
  text: string
  isСompleted: number
}

function App() {
  const [text, setText] = useState('')
  const [tasks, seTasks] = useState<Tasks[]>([])

  const addTodo = () => {
    if (text.length < 4) return
    axios.post(`http://localhost:5000/addTodo/?text=${text}`).then(response => {
      if (response.data[0]) seTasks(response.data.reverse())
      else {
        seTasks([])
      }
    })
    setText('')
  }

  const newText = (e: string) => {
    if (e.length > 30) return
    setText(e.replace(/ +/g, ' '))
  }

  useEffect(() => {
    axios.get('http://localhost:5000/getTodo').then(response => {
      if (response.data[0]) seTasks(response.data.reverse())
      else {
        seTasks([])
      }
    })
  }, [])

  return (
    <div className='container'>
      <h1 className='heading'>To-Do List</h1>
      <div className='inputContainer'>
        <input
          className='input'
          placeholder='What do you have planned?'
          value={text}
          onChange={e => newText(e.target.value)}
        />
        <button className='btn' onClick={addTodo}>
          Add
        </button>
      </div>
      <h1 className='task__heading'>Tasks</h1>
      {tasks.map(task => (
        <Items
          key={task.id}
          id={task.id}
          text={task.text}
          seTasks={seTasks}
          isСompleted={task.isСompleted}
        />
      ))}
    </div>
  )
}

export default App
