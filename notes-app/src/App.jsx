import React from 'react';
import Split from 'react-split'
import Sidebar from './component/Sidebar';
import Editor from './component/Editor';
import './App.css'


export default function App(){

  const [notes, setNotes] = React.useState([])
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  )

  const fetchNotes = () => {
    fetch('http://127.0.0.1:8000/notesapi/notes/')
      .then((response) => response.json())
      .then((data) => setNotes(data))
  }

  React.useEffect(function(){
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
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
      .then((response) => response.json())
      .then((data) => (setNotes(prevNotes => [data, ...prevNotes])))
  }

  function updateNote(text){
    fetch(`http://127.0.0.1:8000/notesapi/notes/${currentNoteId}/`, {
      method: 'PUT',
      body: JSON.stringify({
        title: currentNote.title,
        body: text
      }),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
      .then((response) => response.json())
      .then((updatedNote) => (setNotes(prevNotes => prevNotes.map(note => note.id === currentNoteId ? updatedNote : note))))
  }

  function deleteNote(event, noteId){
      event.stopPropagation()
      fetch(`http://127.0.0.1:8000/notesapi/notes/${noteId}/`, {
      method: 'DELETE'
    })
      .then((response) => {
        if(response.status === 204){
          setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
        }
      })
  }
  
  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

  console.log(currentNoteId)
  console.log(currentNote)
  return(
    <main>
      <h2>The app component has been rendered</h2>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30,70]}
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
            {
              currentNoteId &&
              notes.length>0 &&
              <Editor currentNote={currentNote} updateNote={updateNote} /> 
            }
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