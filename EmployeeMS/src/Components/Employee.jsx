import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/employee')
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/auth/delete_employee/${id}`)
        .then(result => {
            if (result.data.Status) {
                window.location.reload(); // Use lowercase 'window' here
            } else {
                alert(result.data.Error);
            }
        })
        .catch(err => {
            console.error('Error during deletion:', err);
            alert('An error occurred while deleting the employee.');
        });
};


  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Employee List</h3>
      </div>
      <Link to='/dashboard/add_employee' className='btn btn-success'>
        Add Employee
      </Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}> {/* Use a unique key, assuming 'id' exists */}
                <td>{e.name}</td>
                <td>
                  <img
                    src={
                      e.image
                        ? `http://localhost:3000/Image/${e.image}`
                        : 'https://via.placeholder.com/150' // Placeholder image for missing files
                    }
                    alt={e.name}
                    className='employee_image'
                    style={{ width: '100px', height: '100px' }} // Set image size
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>
                  <Link className='btn btn-info btn-sm me-2' to={`/dashboard/edit_employee/${e.id}`}>
                    Edit
                  </Link>
                  <button className='btn btn-warning btn-sm' onClick={() => handleDelete(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
