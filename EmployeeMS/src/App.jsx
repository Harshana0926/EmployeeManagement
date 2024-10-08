
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Category from './Components/Category'
import Profile from './Components/Profile'
import AddCategory from './Components/AddCategory'
import Addemployee from './Components/Addemployee'
import EditEmployee from './Components/EditEmployee'
import Start from './Components/Start'
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetail from './Components/EmployeeDetail'
import { useEffect } from 'react'
import PrivateRoute from './Components/PrivateRoute'

function App() {

 
  

  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start/>}></Route>
      <Route path='/adminlogin' element={<Login/>}></Route>
      <Route path='/employee_login' element={<EmployeeLogin/>}></Route>
      <Route path='/employee_detail/:id' element={<EmployeeDetail/>}></Route>

      <Route path='/dashboard' element={
        <PrivateRoute>
           <Dashboard/>
        </PrivateRoute>
        
        }>
        <Route path='' element={<Home/>}></Route>
        <Route path='/dashboard/employee' element={<Employee/>}></Route>
        <Route path='/dashboard/category' element={<Category/>}></Route>
        <Route path='/dashboard/profile' element={<Profile/>}></Route>
        <Route path='/dashboard/add_category' element={<AddCategory/>}></Route>
        <Route path='/dashboard/add_employee' element={<Addemployee/>}></Route>
        <Route path='/dashboard/edit_employee/:id' element={<EditEmployee/>}></Route>
        

      </Route>
     
    </Routes>
   </BrowserRouter>
  )
}

export default App
