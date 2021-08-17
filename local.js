const app = require('./src/index')
require('dotenv').config();
const port = process.env.PORT || 8000;
app.listen(port,()=> {
    console.log(`Application started on ${port}`);
})