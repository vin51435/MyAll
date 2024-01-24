/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DraggableItem from './components/DraggableItems';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const MainPage = () => {
  const [draggedComponents, setDraggedComponents] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const handleSidebarItemClick = (componentType) => {
    setDraggedComponents((prev) => [...prev, { type: componentType, position: { x: 0, y: 0 } }]);
  };

  const handleDrag = (index, delta) => {
    setDraggedComponents((prev) => {
      const updatedComponents = [...prev];
      updatedComponents[index].position.x += delta.x;
      updatedComponents[index].position.y += delta.y;

      const canvasWidth = canvasSize.width;
      const canvasHeight = canvasSize.height;

      if (updatedComponents[index].position.x < 0) {
        updatedComponents[index].position.x = 0;
      } else if (updatedComponents[index].position.x + 100 > canvasWidth) {
        updatedComponents[index].position.x = canvasWidth - 100;
      }

      if (updatedComponents[index].position.y < 0) {
        updatedComponents[index].position.y = 0;
      } else if (updatedComponents[index].position.y + 50 > canvasHeight) {
        updatedComponents[index].position.y = canvasHeight - 50;
      }

      return updatedComponents;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex' }}>
        <Sidebar onItemClick={handleSidebarItemClick} />
        <div style={{ flex: 1, padding: '20px', position: 'relative', width: canvasSize.width, height: canvasSize.height, border: '1px solid #ccc', overflow: 'hidden' }}>
          {draggedComponents.map((component, index) => (<>
            <DraggableItem key={index} index={index} component={component} onDrag={handleDrag} />
          </>))}
        </div>
      </div>
    </DndProvider>
  );
};

export default MainPage;