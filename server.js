const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const {MONGO_URI} = require('./config');
const cors = require('./cors');
const fileupload = require("express-fileupload");
const bodyParser = require('body-parser'); 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'mohammedyaseer1771@gmail.com',
		pass: 'n@n0@313'
	}
});

const app = express();
cors(app); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sendMail", (req,res,next) => {
	try {
        transporter.sendMail(req.body , function(error , info ){
        	res.status(200).json({ 
				success:true,
				msg:"OTP sent successfully"
			});
        });  
    }catch(err){
        res.status(400).json({msg :err}); 
    }
})

mongoose.connect(MONGO_URI , {
    useNewUrlParser :true ,
    useUnifiedTopology : true,
    useFindAndModify: false
})
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000 ;

app.listen(PORT, () => console.log(`server runs in Port ${PORT}`));