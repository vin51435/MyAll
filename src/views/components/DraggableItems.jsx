import React, { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { itemStyleTemplates } from '../ItemStyles';

const DraggableItem = ({ component, index, onDrag, onDelete }) => {
  const dragRef = useRef(null);
  const leftConnectorRef = useRef(null);
  const rightConnectorRef = useRef(null);
  const monitorRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type: component.type, index },
    collect: (monitor) => {
      monitorRef.current = monitor;
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
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

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (isDragging) {
        const leftConnectorPosition = getPosition(leftConnectorRef.current);
        const rightConnectorPosition = getPosition(rightConnectorRef.current);

        console.log(`${index}_${component.type}_item_left_connector`, leftConnectorPosition);
        console.log(`${index}_${component.type}_item_right_connector`, rightConnectorPosition);

        // Perform any other logic with the continuous positions here

        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (isDragging) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging]);

  drag(dragRef);

  const getPosition = (element) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollX = window.scrollX !== undefined ? window.scrollX : window.pageXOffset;
      const scrollY = window.scrollY !== undefined ? window.scrollY : window.pageYOffset;
  
      return {
        x: rect.left + scrollX,
        y: rect.top + scrollY,
      };
    }
    return null;
  };

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
        ref={(node) => (dragRef.current = node)}
        style={{
          width: dynamicStyles.width,
          height: dynamicStyles.height,
          background: isDragging ? '#87CEEB' : '#e0e0e0',
          cursor: 'move',
          opacity: isDragging ? 0 : 1,
        }}
      >
        {renderItemContent(component)}
        <div
          ref={(node) => (leftConnectorRef.current = node)}
          className="connector left"
          id={`${index}_${component.type}_item_left_connector`}
        ></div>
        <div
          ref={(node) => (rightConnectorRef.current = node)}
          className="connector right"
          id={`${index}_${component.type}_item_right_connector`}
        ></div>
        <button
          onClick={() => onDelete(index)}
          style={{ position: 'absolute', top: '-10px', right: '-10px' }}
        >
          Delete
        </button>
      </div>
        <div>
          0
        </div>
    </div>
  );
};

export default DraggableItem;
