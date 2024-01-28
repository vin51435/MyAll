import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { itemStyleTemplates } from '../ItemStyles';

const DraggableItem = ({ component, index, onDrag, onDelete, onConnect, setDraggedComponents, draggedComponents }) => {
  const dragRef = useRef(null);
  const leftConnectorRef = useRef(null);
  const rightConnectorRef = useRef(null);
  const monitorRef = useRef(null);

  const [selectedConnector, setSelectedConnector] = useState(null);

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

  const handleConnect = (targetIndex, connectorType) => {
    if (selectedConnector !== null) {
      const sourceConnector = `${index}_${component.type}_item_${selectedConnector}_connector`;
      const targetConnector = `${targetIndex}_${draggedComponents[targetIndex].type}_item_${connectorType}_connector`;
  
      const connection = {
        from: sourceConnector,
        to: targetConnector,
      };
  
      // Call the onConnect prop to handle the connection logic
      onConnect(index, connection);
  
      // Add the connection to the item's connections property
      setDraggedComponents((prev) =>
        prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              connections: [...(item.connections || []), connection],
            };
          }
          return item;
        })
      );
  
      // Reset selectedConnector after making a connection
      setSelectedConnector(null);
    } else {
      // Set the selected connector when the user clicks on a connector
      setSelectedConnector(connectorType);
    }
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
      className='position-absolute d-flex'
      style={{
        left: component.positions.left,
        top: component.positions.top,
        ...dynamicStyles,
      }}
    >
      <div
        ref={(node) => (dragRef.current = node)}
        className='h-100'
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
          className='h-75'
        >
          <div className='h-100'></div>
          <button
            ref={(node) => (leftConnectorRef.current = node)}
            className="connector left"
            id={`${index}_${component.type}_item_left_connector`}
            onClick={() => handleConnect(index, 'left')}
          ></button>
          <button
            ref={(node) => (rightConnectorRef.current = node)}
            className="connector right"
            id={`${index}_${component.type}_item_right_connector`}
            onClick={() => handleConnect(index, 'right')}
          ></button>
          <button
            onClick={() => onDelete(index)}
            style={{ position: 'absolute', top: '-10px', right: '-10px' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableItem;
