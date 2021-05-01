const express = require('express'); //connect express
const path = require('path');
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

const app = express(); //our application

//Handlebars setup
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine); //registering the engine
app.set('view engine', 'hbs'); //setting up the engine
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public'))); //add static folder for css files
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(varMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

//mongo & local connection
async function start() {
  try {
    const url =
      'mongodb+srv://hulchenko:Qfq7Z6lPeT0knZmg@cluster0.27fbk.mongodb.net/shop';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
