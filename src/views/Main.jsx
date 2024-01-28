import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DraggableItem from './components/DraggableItems';
import { useDrop } from 'react-dnd';
import { itemStyleTemplates } from './ItemStyles';
import ConnectionLine from './components/ConnectionLine';

const Main = () => {
  const [draggedComponents, setDraggedComponents] = useState([]);
  const [connections, setConnections] = useState([])
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 600 });

  const [, drop] = useDrop({
    accept: 'SIDEBAR_ITEM',
    drop: (item, monitor) => handleDropFromSidebar(item, monitor)
  });

  console.log(draggedComponents, 'draggedComponents');

  const parsePixel = value => {
    return parseInt(value.slice(0, -2), 10);
  };

  const handleDelete = (index) => {
    setDraggedComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSidebarItemClick = (componentType) => {
    const newItem = {
      type: componentType,
      positions: {
        top: 100,
        left: 100,
        bottom: 100 + parsePixel(itemStyleTemplates[componentType].height),
        right: 100 + parsePixel(itemStyleTemplates[componentType].width),
      },
      dimensions: {
        width: parsePixel(itemStyleTemplates[componentType].width),
        height: parsePixel(itemStyleTemplates[componentType].height)
      }
    };

    setDraggedComponents((prev) => [...prev, newItem]);
  };

  const handleDrag = (index, delta, item) => {
    setDraggedComponents((prev) => {
      const updatedComponents = [...prev];
      const item = updatedComponents[index];

      item.positions.top += delta.y;
      item.positions.bottom += delta.y;
      item.positions.left += delta.x;
      item.positions.right += delta.x;

      const canvasWidth = canvasSize.width;
      const canvasHeight = canvasSize.height;

      const itemWidth = (updatedComponents[index].dimensions.width);
      const itemHeight = (updatedComponents[index].dimensions.height);

      // Boundary checks
      item.positions.left = Math.max(0, Math.min(item.positions.left, canvasWidth - itemWidth));
      item.positions.right = item.positions.left + itemWidth;

      item.positions.top = Math.max(0, Math.min(item.positions.top, canvasHeight - itemHeight));
      item.positions.bottom = item.positions.top + itemHeight;

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
          bottom: dropResult.y + parsePixel(itemStyleTemplates[item.type].height),
          right: dropResult.x + parsePixel(itemStyleTemplates[item.type].width),
        },
        dimensions: {
          width: parsePixel(itemStyleTemplates[item.type].width),
          height: parsePixel(itemStyleTemplates[item.type].height),
        },
      };

      if (item.positions) {
        newItem.positions.bottom = dropResult.y - 25 + (item.positions.bottom - item.positions.top);
        newItem.positions.right = dropResult.x - 200 + (item.positions.right - item.positions.left);
      }

      setDraggedComponents((prev) => [...prev, newItem]);
    }
  };

  const handleConnect = (sourceIndex, connection) => {
    // Add the connection to the state
    console.log(`Connecting item ${connection.from} to ${connection.to}`)
    setConnections((prev) => [...prev, connection]);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onSidebarItemClick={handleSidebarItemClick} />
      <div
        ref={drop}
        style={{
          padding: '5px',
          position: 'relative',
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          border: '1px solid #ccc',
          overflow: 'hidden'
        }}
      >
        {draggedComponents.map((component, index) => (
          <DraggableItem
            key={index}
            index={index}
            component={component}
            onDrag={handleDrag}
            onDelete={handleDelete}
            onConnect={handleConnect}
            setDraggedComponents={setDraggedComponents}
            draggedComponents={draggedComponents}
          />
        ))}
        {/* Render lines for connections */}
        {connections.map((connection, idx) => (
          <ConnectionLine key={idx} from={connection} to={connections[idx + 1]} draggedComponents={draggedComponents} />
        ))}
      </div>
    </div>
  );
};

export default Main;