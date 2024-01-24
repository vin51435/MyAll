import { useState } from 'react';
import Main from './views/Main';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

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
