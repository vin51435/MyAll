// DraggableItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ component, index, onDrag, onDelete }) => {
  console.log(component, 'component');

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type: component.type, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        onDrag(index, delta);
      }
    },
  });

  // const dynamicStyles = {
  //   width: component.positions.right - component.positions.left,
  //   height: component.positions.bottom - component.positions.top,
  // };

  const getDynamicStyles = () => {
    switch (component.type) {
      case 'Text':
        return {
          width: component.positions.right - component.positions.left,
          height: component.positions.bottom - component.positions.top,
          fontSize: '16px', fontWeight: 'bold'
        };
      case 'Image':
        return { width: '150px', height: '100px' };
      default:
        return { width: '100px', height: '50px' };
    }
  };

  const dynamicStyles = getDynamicStyles();

  const renderItemContent = (component) => {
    switch (component.type) {
      case 'Text':
        return <span>A Text Item</span>;
      case 'Image':
        return (
          <img
            src="path/to/image.png"
            alt="Image Item"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        );
      default:
        return <span>{component.type}</span>;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: component.positions.left,
        top: component.positions.top,
        border: '1px solid #000',
        ...dynamicStyles,
      }}
    >
      <div
        ref={(node) => drag(node)}
        style={{
          width: dynamicStyles.width,
          height: dynamicStyles.height,
          background: isDragging ? '#87CEEB' : '#e0e0e0',
          cursor: 'move',
          opacity: isDragging ? 0 : 1,
        }}
      >
        {renderItemContent(component)}
      </div>
      <button
        onClick={() => onDelete(index)}
        style={{ position: 'absolute', top: '-10px', right: '-10px' }}
      >
        Delete
      </button>
    </div>
  );
};

export default DraggableItem;
