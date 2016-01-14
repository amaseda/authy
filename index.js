module.exports = function( db ){
  var hbs = require( "hbs" );

  // Create User model
  var User = db.model( "User", {
    username: String,
    password: String
  })

  return function( req, res, next ){
    req.app.set( "view engine", "hbs" );

    // Sign up form
    if(req.path == "/sign_up" && req.method == "GET"){
      return res.render( "/sign_up" );
      // return res.sendFile( __dirname + "/views/sign_up.html" );
    }
    // Sign up post
    if(req.path == "/sign_up" && req.method == "POST"){
      return User.findOne({ username: req.body.username }, function( err, doc ){
        console.log( "DA DOC IS: ", doc );
        if( !doc ){
          User.create({
            username: req.body.username,
            password: req.body.password
          }, function( err, doc ){
            req.session.currentUser = doc;
            res.redirect( "/" );
          })
        } else {
          res.redirect( "/sign_up" );
        }
      })
    }
    // Sign in form
    if(req.path == "/sign_in" && req.method == "GET"){
      return res.sendFile( __dirname + "/views/sign_in.html" );
    }
    // Sign in post
    if(req.path == "/sign_in" && req.method == "POST"){
      return User.find({
        username: req.body.username,
        password: req.body.password
      }, function( err, doc ){
        if( doc ){
          req.session.currentUser = doc
        } else {
          res.redirect("/sign_in")
        }
      })
    }
    // Sign out
    if(req.path == "/sign_out"){
      req.session.currentUser = null;
      res.redirect("/");
      return;
    }
    next();
  }

}


// Sign up
  // Hash password - node bcrypt dependency
// Attach session variables to req
