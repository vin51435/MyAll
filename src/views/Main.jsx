import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DraggableItem from './components/DraggableItems';
import { useDrop } from 'react-dnd';

const Whatsapp = () => {
  const [draggedComponents, setDraggedComponents] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const handleSidebarItemClick = (componentType) => {
    const newItem = {
      type: componentType,
      positions: {
        top: 100,    
        left: 100,   
        bottom: 150, 
        right: 200,  
      },
    };
  
    setDraggedComponents((prev) => [...prev, newItem]);
  };

  const handleDrag = (index, delta) => {
    setDraggedComponents((prev) => {
      const updatedComponents = [...prev];
      const item = updatedComponents[index];
  
      // Update all four sides
      item.positions.top += delta.y;
      item.positions.bottom += delta.y;
      item.positions.left += delta.x;
      item.positions.right += delta.x;

      const canvasWidth = canvasSize.width;
      const canvasHeight = canvasSize.height;

       // Boundary checks
       if (item.positions.left < 0) {
        item.positions.left = 0;
        item.positions.right = item.positions.left + (item.positions.right - item.positions.left);
      } else if (item.positions.right > canvasWidth) {
        item.positions.right = canvasWidth;
        item.positions.left = item.positions.right - (item.positions.right - item.positions.left);
      }

      if (item.positions.top < 0) {
        item.positions.top = 0;
        item.positions.bottom = item.positions.top + (item.positions.bottom - item.positions.top);
      } else if (item.positions.bottom > canvasHeight) {
        item.positions.bottom = canvasHeight;
        item.positions.top = item.positions.bottom - (item.positions.bottom - item.positions.top);
      }

      return updatedComponents;
    });
  };

  const handleDropFromSidebar = (item, monitor) => {
    const dropResult = monitor.getClientOffset();
  
    if (dropResult) {
      const newItem = {
        type: item.type,
        positions: {
          top: dropResult.y - 25,
          left: dropResult.x - 200,
          bottom: 0,
          right: 0,
        },
        dimensions: {
          width: 0,
          height: 0,
        },
      };
  
      if (item.positions) {
        newItem.positions.bottom = dropResult.y - 25 + (item.positions.bottom - item.positions.top);
        newItem.positions.right = dropResult.x - 200 + (item.positions.right - item.positions.left);
      }
  
      if (newItem.positions && newItem.positions.top >= 0 && newItem.positions.left >= 0) {
        newItem.dimensions.width = newItem.positions.right - newItem.positions.left;
        newItem.dimensions.height = newItem.positions.bottom - newItem.positions.top;
      }
  
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