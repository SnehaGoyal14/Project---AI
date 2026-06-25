import { useState, useEffect } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import dayjs from 'dayjs'
import api from '../api'

export default function Card({ card, index, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || '')
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('')

  const isOverdue = card.due_date && dayjs(card.due_date).isBefore(dayjs())

  useEffect(() => {
    if (expanded) fetchComments()
  }, [expanded])

  const fetchComments = async () => {
    const res = await api.get(`/cards/${card.id}/comments`)
    setComments(res.data)
  }

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

  const addComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !author.trim()) return
    await api.post(`/cards/${card.id}/comments`, { author, body: newComment })
    setNewComment('')
    fetchComments()
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
              {card.description && expanded && (
                <div className="card-desc">{card.description}</div>
              )}
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
                <div onClick={e => e.stopPropagation()}>
                  <div className="card-actions">
                    <button onClick={() => setEditing(true)}>✏️ Edit</button>
                    <button onClick={deleteCard}>🗑️ Delete</button>
                  </div>
                  <div className="comments-section">
                    <h4>💬 Comments ({comments.length})</h4>
                    {comments.map(c => (
                      <div key={c.id} className="comment">
                        <strong>{c.author}</strong>: {c.body}
                        <span className="comment-time"> · {dayjs(c.created_at).format('MMM D HH:mm')}</span>
                      </div>
                    ))}
                    <form onSubmit={addComment} className="comment-form">
                      <input
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        placeholder="Your name..."
                      />
                      <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      <button type="submit">Post</button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  )
}
