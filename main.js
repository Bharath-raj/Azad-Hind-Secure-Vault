const {Blockchain,Block} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fs = require('fs');

const myKey = ec.keyFromPrivate('5d5826528e928d7724b3746bdf10a021b812503578e306b52027530ddddbd3c3');
const mySecretKey = myKey.getPublic('hex');

let pwdMgr = new Blockchain();
var dt = new Date();
var utcDate = dt.toUTCString();

// Installing package 
const express = require('express') 
const path = require('path') 
const app = express() 

const PORT = process.env.PORT || 3000 

// Middleware function 
const parseData = (req, res, next) => { 
  if (req.method === 'POST') { 
    const formData = {} 
    req.on('data', data => { 

      // Decode and parse data 
      const parsedData = 
        decodeURIComponent(data).split('&') 

      for (let data of parsedData) { 

        decodedData = decodeURIComponent( 
            data.replace(/\+/g, '%20')) 

        const [key, value] 
          = decodedData.split('=') 

        // Accumulate submitted data 
        // in an object 
        formData[key] = value 
      } 

      // Attach form data in request object 
      req.body = formData 
      next() 
    }) 
  } else { 
    next() 
  } 
} 

// View engine setup 
app.set("views", path.join(__dirname)) 
app.set("view engine", "ejs") 

// Render Login form page 
app.get('/', (req, res) => { 
  res.render('index') 
}) 

// Creating Post Route for login 
app.post('/information', parseData, (req, res) => { 

  // Retrive form data from request object 
  const data = req.body 
  const { website_url, 
    email, 
    password, 
     
  } = data 

  
//console.log("Initialization of Secret Key for Blockchain: \n");
const pwd1 = new Block(utcDate,{website_url, email, password,});
pwd1.signTransaction(myKey);
pwdMgr.addBlock(pwd1);

//Fetch's the Data Entered by User
console.log(JSON.stringify(pwdMgr,null,4));


//Show's whether the Block is Valid or Not
console.log('Is Block is valid? ' +pwdMgr.isChainValid());

// write to file
fs.writeFile(`${__dirname}/Blockchain_Imported.json`, JSON.stringify(pwdMgr,null,4), (err) => {
  if (err) {
    console.log('Error occured, exiting...');
    process.exit(-1);
  }

  console.log('Block Generated...');
  //process.exit(0);
});

}) 

// Setting up listener 
app.listen(PORT, () => { 
  console.log(`Server start on port ${PORT}`) 
}) 



