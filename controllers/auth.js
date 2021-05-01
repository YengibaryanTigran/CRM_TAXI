const mysql = require("mysql"); //MySQL
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {promisify} = require('util');

// MySql connect start
const db = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : 'NodeUser',
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE
});
//login function
exports.login = async(req,res) => {
    try {
      const { email, password} = req.body;

      if(!email || !password)
        {
          return res.status(400).render('login', {
            message: 'Введите данные'
          });
        }

        db.query('SELECT * FROM users WHERE email =?', [email], async(error, results) => {
            console.log(results);
            if( !results || !(await bcrypt.compare(password, results[0].password)))
            {
              res.status(401).render('login',{
                message:'Неправильный логин или пароль'
              });
            }
              else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                  expiresIn: process.env.JWT_EXPIRES_IN
                }); //generaciya tokena sessii

                console.log("Token: " + token);

                const cookieOptions = {
                    expires: new Date(
                      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                //console.log(results[0].role);
                res.cookie('jwt', token, cookieOptions);
                if(results[0].role == 'driver')
                  {
                    res.status(200).redirect('/driver');
                  }else if (results[0].role == 'client' || results[0].role == null ) {
                    res.status(200).redirect('/client');
                  }


                //res.status(200).redirect('/');
              }
        });
    } catch (error) {
      console.log(error);
    }
}

//register function
exports.register = (req,res) => {
    console.log(req.body);

/*  const fname           = req.body.fname;
    const email           = req.body.email;
    const phone           = req.body.phone;
    const date            = req.body.date;
    const gender          = req.body.gender;
    const country         = req.body.country;
    const city            = req.body.city;
    const password        = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
*/
    const {name, fname, email, phone,
          bdate, gender, country, city,
          password, passwordConfirm, role} = req.body;

console.log(role);

db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => //dobavit syuda telefon Select email, phone Frome users Where email =? or phone =?
{
    if(error)
      {
        console.log(error);
      }
    if(results.length > 0)
      {
        return res.render('register', {
          message: 'The email is already un use'
        });
      }
    else if(password !== passwordConfirm)
      {
        return res.render('register', {
          message: 'Пароли не совпадают, попробуйте еще раз'
        });
      }

      var reg_date= new Date();
      var regDate=reg_date.getFullYear()+"-"+(reg_date.getMonth()+1)+"-"+reg_date.getDate();

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      console.log(regDate);

    db.query('INSERT INTO users SET ?',{name: name, fname: fname, email: email, phone: phone
                                        , bdate: bdate, gender: gender, country: country, city: city
                                        , regdate: regDate, role: role, password: hashedPassword}, (error, results) => {

                                          if(error){
                                              console.log(error);
                                            }else {
                                             console.log(results);
                                             return res.render('register', {
                                             message: 'Регистрация прошла успешно'
                                            });
                                          }
                                        });
  });
}

//NEW



exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies);
  if( req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,
      process.env.JWT_SECRET
      );

      console.log(decoded);

      //2) Check if the user still exists
      db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result);

        if(!result) {
          return next();
        }

        req.user = result[0];
        return next();

      });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}
