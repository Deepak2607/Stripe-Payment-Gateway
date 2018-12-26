const express= require('express');
const stripe= require('stripe')('sk_test_JFyJNPEu7Ld6DOjnMxZU5CTY');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');
const path= require('path');
const methodOverride= require('method-override');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session= require('express-session');
const flash= require('connect-flash');


const app= express();
const port= process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, 'public')));


//database-connection
mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/ebookseller',{ useNewUrlParser: true });


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//View engine-----defaultLayout:home
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout:'layout'}));
app.set('view engine', '.hbs');


//method-override
app.use(methodOverride('_method'));


//session-middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'deepakkumrawat8@gmail.com',
  resave: false,
  saveUninitialized: false
}))


//flash-middleware
app.use(flash());


//below is a way to send some data from controllers(backend) to views(frontend).
//the data(which is passed) can be accessed in all the views.

//another way is- by passing the data as the second argument in res.render('/',{data});
//data can be accessed in that view only to which data is sent.

app.use((req,res,next)=> {

    res.locals.success_message=req.flash('success_message');
    res.locals.error_message=req.flash('error_message');
    next();
});


app.get('/',(req,res)=> {
    res.render('index');
})

app.post('/charge',(req,res)=> {
    

  stripe.charges.create({
  amount: 2500,
  currency: "usd",
  source: req.body.stripeToken, // obtained with Stripe.js
  receipt_email: 'deepakkumrawat8@gmail.com',
  description: "Charge for Ebook"
}, function(err, charge) {
  
      if(err){
          console.log(err);
          req.flash('error_message',err.message);
          return res.redirect('/');
      }
        if(charge){
            
            console.log(charge);
            req.flash('success_message',`You have successfully bought ebook.`);
            return res.redirect('/');
        }
});
    
})



app.listen(port,()=> {
    console.log(`Started on port ${port}`);
})
