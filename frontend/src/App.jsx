import { useState, useEffect } from 'react'
import api from './api'
import Board from './components/Board'
import './App.css'

export default function App() {
  const [boards, setBoards] = useState([])
  const [activeBoard, setActiveBoard] = useState(null)
  const [newBoardName, setNewBoardName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards')
      setBoards(res.data)
      if (res.data.length > 0) setActiveBoard(res.data[0].id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const createBoard = async (e) => {
    e.preventDefault()
    if (!newBoardName.trim()) return
    const res = await api.post('/boards', { name: newBoardName })
    setBoards([...boards, res.data])
    setActiveBoard(res.data.id)
    setNewBoardName('')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="app">
      <header className="header">
        <h1>🗂 KanbanAI</h1>
        <form onSubmit={createBoard} className="new-board-form">
          <input
            value={newBoardName}
            onChange={e => setNewBoardName(e.target.value)}
            placeholder="New board name..."
          />
          <button type="submit">+ Board</button>
        </form>
      </header>

      <nav className="board-tabs">
        {boards.map(b => (
          <button
            key={b.id}
            className={activeBoard === b.id ? 'tab active' : 'tab'}
            onClick={() => setActiveBoard(b.id)}
          >
            {b.name}
          </button>
        ))}
      </nav>

      {activeBoard && <Board boardId={activeBoard} />}
    </div>
  )
}
