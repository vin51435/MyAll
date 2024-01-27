import React from 'react';
import { useDrag } from 'react-dnd';
import { itemStyleTemplates } from '../ItemStyles';

const DraggableItem = ({ component, index, onDrag, onDelete }) => {

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type: component.type, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    options: {
      dropEffect: 'move',
    },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        onDrag(index, delta, item);
      }
    },
  });

  const dynamicStyles = itemStyleTemplates[component.type];

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
      id={`${index}_${component.type}_item`}
      style={{
        position: 'absolute',
        left: component.positions.left,
        top: component.positions.top,
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
        <div className="connector left" id={`${index}_${component.type}_item_left_connector`}></div>
        <div className="connector right" id={`${index}_${component.type}_item_right_connector`}></div>
        <button
          onClick={() => onDelete(index)}
          style={{ position: 'absolute', top: '-10px', right: '-10px' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DraggableItem;
