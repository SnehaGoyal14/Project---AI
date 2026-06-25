import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import dayjs from 'dayjs'
import api from '../api'

export default function Card({ card, index, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')

  const isOverdue = card.due_date && dayjs(card.due_date).isBefore(dayjs())

  const saveEdit = async () => {
    await api.put(`/cards/${card.id}`, { title, description })
    setEditing(false)
    onUpdate()
  }

  const deleteCard = async () => {
    if (!confirm('Delete this card?')) return
    await api.delete(`/cards/${card.id}`)
    onUpdate()
  }

  return (
    <Draggable draggableId={`card-${card.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card ${snapshot.isDragging ? 'dragging' : ''} ${isOverdue ? 'overdue' : ''}`}
          onClick={() => !editing && setExpanded(!expanded)}
        >
          {editing ? (
            <div className="card-edit" onClick={e => e.stopPropagation()}>
              <input value={title} onChange={e => setTitle(e.target.value)} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." />
              <div className="form-actions">
                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="card-title">{card.title}</div>
              {card.tags && card.tags.length > 0 && (
                <div className="card-tags">
                  {card.tags.map(tag => (
                    <span key={tag.id} className="tag" style={{ background: tag.color }}>{tag.name}</span>
                  ))}
                </div>
              )}
              {card.members && card.members.length > 0 && (
                <div className="card-members">
                  {card.members.map(m => (
                    <span key={m.id} className="member-avatar">{m.name[0]}</span>
                  ))}
                </div>
              )}
              {card.due_date && (
                <div className={`due-date ${isOverdue ? 'overdue-label' : ''}`}>
                  📅 {dayjs(card.due_date).format('MMM D')}
                  {isOverdue && ' ⚠️ Overdue'}
                </div>
              )}
              {expanded && (
                <div className="card-actions" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setEditing(true)}>✏️ Edit</button>
                  <button onClick={deleteCard}>🗑️ Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  )
}
