import React from 'react';
import Split from 'react-split'
import Sidebar from './component/Sidebar';
import Editor from './component/Editor';

import './App.css'



export default function App() {

  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState("")
  const [tempNoteText, setTempNoteText] = React.useState("")
  const [noteLabel, setNoteLabel] = React.useState("")

  const fetchNotes = () => {
    fetch('http://127.0.0.1:8000/notesapi/notes/')
      .then((response) => response.json())
      .then((data) => setNotes(data))
  }

  React.useEffect(function () {
    fetchNotes()
  }, [])

  const addNote = () => {
    const note = {
      "title": "Some Title",
      "body": "# Write some text here"
    };
    fetch('http://127.0.0.1:8000/notesapi/notes/', {
      method: 'POST',
      body: JSON.stringify(note),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then((response) => response.json())
      .then((data) => (setNotes(prevNotes => [data, ...prevNotes])))
  }

  function updateNote(text) {
    const colonIndex = text.indexOf(':');
    const slicedTitle = text.slice(0, colonIndex);
    const bodyText = text.slice(colonIndex + 1,)
    fetch(`http://127.0.0.1:8000/notesapi/notes/${currentNoteId}/`, {
      method: 'PUT',
      body: JSON.stringify({
        title: slicedTitle,
        body: text
      }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then((response) => response.json())
      .then((updatedNote) => (setNotes(prevNotes => prevNotes.map(note => note.id === currentNoteId ? updatedNote : note))))
  }

  function deleteNote(event, noteId) {
    event.stopPropagation()
    fetch(`http://127.0.0.1:8000/notesapi/notes/${noteId}/`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.status === 204) {
          setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
        }
      })
  }
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText)
      }
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [tempNoteText])

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id)
    }
  }, [notes])
  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body)
    }
  }, [currentNote])

  function fetchPred(text){
    fetch(`http://127.0.0.1:8000/notesapi/notes/predict/`, {
      method: 'POST',
      body: JSON.stringify({
        "text": text
      }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then(resp => resp.json())
      .then(data => setNoteLabel(data['prediction']))
  }
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPred(currentNote.body)
    }, 1000)
    return () => clearTimeout(timeoutId)
  },
    [currentNote])
  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[25, 75]}
            direction='horizontal'
            className='split'
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={addNote}
              deleteNote={deleteNote}
            />
            {/* {
              currentNoteId &&
              notes.length>0 &&
              <Editor currentNote={tempNoteText} setTempNoteText={setTempNoteText} /> 
            } */}
            {currentNoteId && notes.length > 0 && tempNoteText && <Editor tempNoteText={tempNoteText} setTempNoteText={setTempNoteText} noteLabel={noteLabel} />}
          </Split>
          :
          <div className='no-notes'>
            <h1>You have no notes</h1>
            <button className='first-note' onClick={addNote}>
              Create New Note
            </button>
          </div>

      }
    </main>
  )
}