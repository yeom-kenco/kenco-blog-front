// src/components/layout/Layout.jsx
import Header from './Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
