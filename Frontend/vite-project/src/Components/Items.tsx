import { FC, useEffect, useState } from 'react'
import '../App.css'
import './Item.css'
import axios from 'axios'
import { Tasks } from '../App'

type Props = {
  text: string
  id: number
  isСompleted: number
  seTasks: (arg: Tasks[]) => void
}

export const Items: FC<Props> = ({ text, seTasks, id, isСompleted }) => {
  const [isСompletedTodo, setСompletedTodo] = useState<number>(isСompleted)
  const [isUpdate, setUpdate] = useState(false)
  const [newTodo, setNewTodo] = useState(text)

  const handler = () => {
    setUpdate(!isUpdate)
  }

  const newText = (e: string) => {
    if (e.length > 30) return
    setNewTodo(e.replace(/ +/g, ' '))
  }

  const updateClick = () => {
    if (newTodo.length < 4) return
    editTodo()
    handler()
  }

  const editTodo = () => {
    axios
      .post(
        `http://localhost:5000/editTodo/?text=${newTodo}&id=${id}&isСompleted=${isСompletedTodo}`
      )
      .then(response => {
        if (response.data[0]) seTasks(response.data.reverse())
        else {
          seTasks([])
        }
      })
  }

  const deleteTodo = () => {
    axios
      .delete(`http://localhost:5000/deleteTodo/?id=${id}`)
      .then(response => {
        if (response.data[0]) seTasks(response.data.reverse())
        else {
          seTasks([])
        }
      })
  }

  const completed = () => {
    setСompletedTodo(isСompletedTodo ? 0 : 1)
  }

  useEffect(() => {
    setNewTodo(text)
  }, [text])

  return (
    <div className='itemContainer'>
      <div className='text__container'>
        {isUpdate ? (
          <>
            <input
              className='input'
              value={newTodo}
              autoFocus={true}
              onChange={e => newText(e.currentTarget.value)}
            />
          </>
        ) : !isСompletedTodo ? (
          <div className='text' onClick={completed}>
            {text}
          </div>
        ) : (
          <del className='text' onClick={completed}>
            {text}
          </del>
        )}
      </div>
      <div className='btn__container'>
        {!isUpdate ? (
          <button className='btn btn__edit' onClick={handler}>
            Edit
          </button>
        ) : (
          <button className='btn btn__edit' onClick={updateClick}>
            Save
          </button>
        )}

        <button className='btn btn__delete' onClick={deleteTodo}>
          Delete
        </button>
      </div>
    </div>
  )
}
