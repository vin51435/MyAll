import { useState } from 'react';
import Main from './views/Main';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
    <DndProvider backend={HTML5Backend}>
      <Main />
    </DndProvider>
    </>
  );
}

export default App;
