const app = require('./src/index')

const port = 8000;
app.listen(port,()=> {
    console.log(`Application started on ${port}`);
})