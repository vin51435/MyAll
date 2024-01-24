import React from 'react'
import SidebarItem from './SidebarItem'

const Sidebar = ({ onSidebarItemClick  }) => {

  return (
    <div className='side' style={{ width: '200px', background: '#f0f0f0', padding: '20px' }}>
    <SidebarItem type='Text' onSidebarItemClick={onSidebarItemClick}/>
    <SidebarItem type='Image' onSidebarItemClick={onSidebarItemClick}/>
  </div>
  )
}

export default Sidebar