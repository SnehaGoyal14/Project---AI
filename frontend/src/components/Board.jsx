import { useState, useEffect } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import api from '../api'
import List from './List'

export default function Board({ boardId }) {
  const [board, setBoard] = useState(null)
  const [newListName, setNewListName] = useState('')

  useEffect(() => {
    fetchBoard()
  }, [boardId])

  const fetchBoard = async () => {
    const res = await api.get(`/boards/${boardId}`)
    setBoard(res.data)
  }

  const createList = async (e) => {
    e.preventDefault()
    if (!newListName.trim()) return
    const res = await api.post(`/boards/${boardId}/lists`, { name: newListName })
    setBoard({ ...board, lists: [...(board.lists || []), { ...res.data, cards: [] }] })
    setNewListName('')
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const cardId = draggableId.replace('card-', '')
    const destListId = destination.droppableId.replace('list-', '')

    await api.post(`/cards/${cardId}/move`, {
      list_id: parseInt(destListId),
      position: destination.index
    })

    fetchBoard()
  }

  if (!board) return <div className="loading">Loading board...</div>

  return (
    <div className="board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="lists-container">
          {(board.lists || []).map(list => (
            <List key={list.id} list={list} onUpdate={fetchBoard} />
          ))}

          <div className="new-list">
            <form onSubmit={createList}>
              <input
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                placeholder="Add a list..."
              />
              <button type="submit">+ Add List</button>
            </form>
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
