import React from 'react'
import AdminBar from './AdminBar'


export default function AdminLayout(props) {
  return (
    <>
        <AdminBar/>
        {props.children}
    </>
  )
}
