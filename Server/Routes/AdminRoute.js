import express from 'express'
import cors from 'cors'
import con from '../utils/db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path"
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(cors({ origin: 'http://localhost:5173', credentials: true }));


router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin where email =? and password= ?"
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "query error" })
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({ role: "admin", email: email,id: result[0].id }, "jwt_secret_key", { expiresIn: '1d' });
            res.cookie('token',token)
            return res.json({ loginStatus: true})

        }else{
          return res.json({ loginStatus: false, Error: "wrong email or password" })
        }

    })

})

router.get('/category',(req,res)=>{
    const sql = "SELECT * FROM category ";
    con.query(sql, (err,result)=>{
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status:true, Result:result})       
    })
})

router.post('/add_category',(req,res)=>{
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql,[req.body.category],(err,result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status:true})
    })
})

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define the path where the files will be saved
        const uploadPath = path.join(__dirname, '../uploads'); // Ensure this path is correct
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Set the file name with the original extension
        const ext = path.extname(file.originalname);
        const fileName = `${file.fieldname}-${Date.now()}${ext}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });
//end image upload

// Route to handle employee creation
router.post('/add_employee', upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee (name,email,password, address, salary, image, category_id) VALUES (?)`;
    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) return res.json({ Status: false, Error: "Hashing error" });

        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary,
            req.file.filename, // Filename provided by multer after upload
            req.body.category_id
        ];

        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Status: false, Error: err });
            return res.json({ Status: true });
        });
    });
});


router.get('/employee',(req,res)=>{
    const sql = "SELECT * FROM employee";
    con.query(sql, (err,result)=>{
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status:true, Result:result})       
    })
})

router.get('/employee/:id',(req,res) =>{
    const id = req.params.id
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err,result)=>{
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status:true, Result:result})       
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id; // Get the ID from the URL parameters
    const sql = "UPDATE employee SET name = ?, email = ?, salary = ?, address = ?, category_id = ? WHERE id = ?";

    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id, // Use category_id to match the incoming data
        id // Pass the id directly
    ];
    
    con.query(sql, values, (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true });
    });
});

router.delete('/delete_employee/:id',(req,res)=>{
    const id = req.params.id;
    const sql = "delete from employee where id = ?"

    con.query(sql,[id], (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result:result });
    });
})

router.get('/admin_count',(req,res)=>{
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result:result });
    });
})

router.get('/employee_count',(req,res)=>{
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result:result });
    });
})

router.get('/salary_count',(req,res)=>{
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result:result });
    });
})


router.get('/admin_records', (req,res)=>{
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result:result });
    });

})

router.get('/logout',(req,res) =>{
    res.clearCookie('token')
    return res.json({Status:true})
})



export { router as adminRouter }