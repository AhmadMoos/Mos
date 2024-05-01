const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Route to insert a user into the database
router.post("/add", async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            email: req.body.email,
            department: req.body.department
        });

        // Save the user to the database
        await newUser.save();
        
        req.session.message = {
            type: "success",
            message: "Student added successfully",
        };
        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message, type: "danger" });
    }
});

router.get("/", (req, res) => {
    User.find().exec((err, users) => {
        if(err) {
            res.json({ message: err.message});
        } else {
            res.render("index", {
                title: "Home Page",
                users: users,
            });
        }
    });
});

router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Student" });
});

// Edit user
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if(err) {
            res.redirect("/");
        } else {
            if(user == null) {
                res.redirect("/");
            } else {
                res.render("edit_users", {
                    title: "Edit Student",
                    user: user,
                });
            }
        }
    });
});

// Update user
router.post("/update/:id", (req, res) => {
    let id = req.params.id;
    User.findByIdAndUpdate(id, {
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        email: req.body.email,
        department: req.body.department,
    }, (err, result) => {
        if(err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "User updated successfully"
            };
            res.redirect("/");
        }
    });
});

// Delete user
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        if(err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "success",
                message: "User deleted successfully"
            };
            res.redirect("/");
        }
    });
});

module.exports = router;
