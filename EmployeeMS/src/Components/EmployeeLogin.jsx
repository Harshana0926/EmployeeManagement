import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeLogin = () => {

    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const [error,setError] = useState(null)
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!values.email || !values.password) {
            alert('Please fill in all fields.');
            return;
        }
        
        axios.post('http://localhost:3000/employee/employee_login', values, {
            withCredentials: true, // Ensure cookies are sent with the request
        })
        .then(result => {
            if(result.data.loginStatus){
                localStorage.setItem("valid",true)
                navigate('/employee_detail/'+result.data.id);
            }else{
                setError(result.data.Error)
            }
           
        })
        .catch(err => {
            console.log(err);
            alert('Login failed! Please check your credentials.');
        });
    };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
    <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-warning'>
            {error && error}
        </div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3 '>
                <label htmlFor="email"><strong>Email:</strong></label>
                <input
                    type="email"
                    name="email"
                    autoComplete='off'
                    placeholder='Enter Email'
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    className='form-control rounded-2 '
                />
            </div>
            <div className='mb-3'>
                <label htmlFor="password"><strong>Password:</strong></label>
                <input
                    type="password"
                    name="password"
                    placeholder='Enter Password'
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    className='form-control rounded-2 '
                />
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-success w-100 rounded-3 mb-2">Log in</button>
            </div>
        </form>
    </div>
</div>
  )
}

export default EmployeeLogin