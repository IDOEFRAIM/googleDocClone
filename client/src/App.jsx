import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style.css'
import TextEditor from './TextEditor'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  NavLink
} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' >
      <Route index element={<NavLink to={`/documents/${uuidV4()}`}> Create Document </NavLink>}></Route>
      <Route path='documents'  >
        <Route path=':id' element={<TextEditor/>}></Route>
      </Route>
    </Route>
  )
);
function App() {

  return (
   <>
     <RouterProvider router={router} />

   </>
  )
}

export default App
