import React from 'react';
import { useDrag } from 'react-dnd';

const SidebarItem = ({ type, onSidebarItemClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'SIDEBAR_ITEM', 
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  const handleClick = () => {
    onSidebarItemClick(type);
  }

    return (
      <div
        onClick={handleClick}
        ref={drag}
        className='m-1 bg-success cursor-pointer'
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {type}
      </div>
    );
  };

  export default SidebarItem;