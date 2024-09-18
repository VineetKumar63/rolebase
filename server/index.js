require('dotenv').config();

const express = require ('express')
const app = express();
app.use(express.json());

const cors = require('cors')
const corsOrigin = {
    origin:'http://localhost:3000'||process.env.HOST,
    credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOrigin));

const cookieParser = require('cookie-parser');
const { Login } = require('./routes');
app.use(cookieParser());

app.use('/', Login)

const PORT = 8000 || process.env.PORT

app.listen(PORT, ()=>{
    try {
        console.log("server is running...........")
    } catch (error) {
        console.error("server error")
        
    }
})