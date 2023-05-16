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

router.get('/', authController.isLoggedIn, (req, res)=> {
  res.render('index', {
    user: req.user
  });
});


//login page start
router.get('/login', (req, res)=> {
  res.render('login');
});
//login page end


/*
router.get('/driver', (req, res)=> {
  res.render('driver');
});*/
/*
router.get('/client', (req, res)=> {
  res.render('client');
});
*/
/*
router.get('/redirect', (req, res)=> {
  res.render('redirect');
});
*/
router.get('/redirect', authController.isLoggedIn, (req, res) => {

  if( req.user ) {
    res.render('redirect', {
      user: req.user
    });
  } else {
    res.redirect('/');
  }
});


//profile
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
//profile

//cleint
router.get('/client', authController.isLoggedIn, (req, res) => {
//  console.log("my user role:" + req.user.role + " ," + typeof(req.user.role));
  if( req.user && req.user.role == "client") {   // ete user ka(login exaca) ev useri role == client, apa

    res.render('client', {
      user: req.user
    });
  } else if( req.user && req.user.role == "driver") {
    res.redirect('/redirect');
  } else {
    res.redirect('/login');
  }

});
//client

//driver
router.get('/driver', authController.isLoggedIn, (req, res) => {
  //console.log("my user role:" + req.user.role + " ," + typeof(req.user.role));
  if( req.user && req.user.role == "driver") {
    res.render('driver', {
      user: req.user
    });
  } else if( req.user && req.user.role == "client") {
    res.redirect('/redirect');
  } else {
    res.redirect('/login');
  }
});
//driver






module.exports = router;
