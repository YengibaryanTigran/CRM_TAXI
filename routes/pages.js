const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();

//home page start
router.get('/', authController.isLoggedIn, (req, res)=> {
  res.render('index', {
    user: req.user
  });
});
//home page end

//register page start
router.get('/register', (req, res)=> {
  res.render('register');
});
//register page end

//login page start
router.get('/login', (req, res)=> {
  res.render('login');
});
//login page end

router.get('/driver', (req, res)=> {
  res.render('driver');
});

router.get('/client', (req, res)=> {
  res.render('client');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
  console.log(req.user);
  if( req.user ) {
    res.render('profile', {
      user: req.user
    });
  } else {
    res.redirect('/login');
  }

});

module.exports = router;
