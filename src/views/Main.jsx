import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DraggableItem from './components/DraggableItems';
import { useDrop } from 'react-dnd';

const Whatsapp = () => {
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

  const handleDropFromSidebar = (item, monitor) => {
    console.log('handleDropFromSidebar ran', monitor, monitor.getClientOffset());
    const dropResult = monitor.getClientOffset();

    if (dropResult) {
      const newItem = {
        type: item.type,
        position: {
          x: dropResult.x - 200,
          y: dropResult.y - 25,
        },
      };

      setDraggedComponents((prev) => [...prev, newItem]);
    }
  };

  const [, drop] = useDrop({
    accept: 'SIDEBAR_ITEM',
    drop: (item, monitor) => handleDropFromSidebar(item, monitor)
  });

  const handleDelete = (index) => {
    setDraggedComponents((prev) => prev.filter((_, i) => i !== index));
  }
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onSidebarItemClick={handleSidebarItemClick} />
      <div
        ref={drop}
        style={{
          flex: 1,
          padding: '20px',
          position: 'relative',
          width: canvasSize.width,
          height: canvasSize.height,
          border: '1px solid #ccc',
          overflow: 'hidden'
        }}
      >
        {draggedComponents.map((component, index) => (
          <DraggableItem key={index} index={index} component={component} onDrag={handleDrag} onDelete={handleDelete}/>
        ))}
      </div>
    </div>
  );
};

export default Whatsapp;