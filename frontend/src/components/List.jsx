import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import api from '../api'
import Card from './Card'

export default function List({ list, onUpdate }) {
  const [newCardTitle, setNewCardTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const createCard = async (e) => {
    e.preventDefault()
    if (!newCardTitle.trim()) return
    await api.post(`/lists/${list.id}/cards`, { title: newCardTitle })
    setNewCardTitle('')
    setAdding(false)
    onUpdate()
  }

  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.name}</h3>
        <span className="card-count">{(list.cards || []).length}</span>
      </div>
      <Droppable droppableId={`list-${list.id}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`cards ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
          >
            {(list.cards || []).map((card, index) => (
              <Card key={card.id} card={card} index={index} onUpdate={onUpdate} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {adding ? (
        <form onSubmit={createCard} className="new-card-form">
          <input
            autoFocus
            value={newCardTitle}
            onChange={e => setNewCardTitle(e.target.value)}
            placeholder="Card title..."
          />
          <div className="form-actions">
            <button type="submit">Add</button>
            <button type="button" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>+ Add card</button>
      )}
    </div>
  )
}
