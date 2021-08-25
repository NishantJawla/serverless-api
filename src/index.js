const {express,cors,passport} = require('./utils/required')
const app = express();
require('./config/passport')(passport)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/auth',require('./routes/auth'));

app.get("/", (req, res) => {
  res.status(200).send("Hi Welcome to the API");
});

app.get('/failurejson', function(req, res) {
  res.status(400).json({
      status: 400,
      msg:  "Authentication Failed Login Again",
      error: "Authentication Failed Login Again"
  });
});

app.get('/private',passport.authenticate('jwt',{session: false,failureRedirect : '/failurejson',}),(req,res)=> {
  console.log("Request is here")
  console.log(req.user)
  return res.send("Welcome to the private route")
})
module.exports = app;
