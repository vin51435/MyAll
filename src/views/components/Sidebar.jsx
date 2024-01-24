import React from 'react'

const Sidebar = ({ onItemClick }) => {
  const handleItemClick = (component) => {
    onItemClick(component)
  }

  return (
    <div className='side' style={{ width: '200px', background: '#f0f0f0', padding: '20px' }}>
      <div className='m-1 bg-success cursor-pointer' onClick={() => handleItemClick('Text')}>Text</div>
      <div className='m-1 bg-success cursor-pointer' onClick={() => handleItemClick('Img')}>Image</div>
    </div>
  )
}

export default Sidebar