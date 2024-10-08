import express from "express";
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/employee_login', (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = ?";  // Fixed the table name

    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query Error" });

        if (result.length > 0) {
            // Compare the provided password with the hashed password from the database
            bcrypt.compare(req.body.password, result[0].password, (err, response) => {
                if (err) return res.json({ loginStatus: false, Error: "Password Error" });

                if (response) {
                    // Create JWT token after successful login
                    const email = result[0].email;
                    const token = jwt.sign({ role: "employee", email: email, id: result[0].id}, "jwt_secret_key", { expiresIn: '1d' });

                    // Set the token as a cookie
                    res.cookie('token', token, { httpOnly: true, secure: true });  // Secure the cookie
                    return res.json({ loginStatus: true,id:result[0].id });
                } else {
                    return res.json({ loginStatus: false, Error: "Incorrect Password" });
                }
            });
        } else {
            return res.json({ loginStatus: false, Error: "Email not found" });
        }
    });
});

router.get('/detail/:id',(req,res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql,[id],(err,result) =>{
       if(err) return res.json({Status: false}) 
        return res.json(result)
    })
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({Status: true})
    
})

export { router as EmployeeRouter };
