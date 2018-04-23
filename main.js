const express = require('express');
const bodyParser = require('body-parser');
const hash = require('password-hash');
const app = express();
const PORT = process.env.PORT || 4000;
const path = require("path");

const aws = require("./data-model");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
app.use( express.static(path.resolve(__dirname, './reflection/build')));
app.use( bodyParser.json({ extended: true, type: '*/*' }) );


app.post('/main/',(req,resp) => {
    const owner = req.body.owner;
    let allNotes = {};
    aws.note.query(owner).loadAll().exec((err, respond) => {
        if (err) {
            console.log('Error running query', err);
        }else{
            // console.log('Found', respond.Count, 'items');
            for (let model of respond.Items) {
                allNotes[model.attrs.created] = model;
            } 

            if (respond.ConsumedCapacity) {
                console.log('Query consumed: ', respond.ConsumedCapacity);
            }
        }
        // console.log("request new data", allNotes);
        resp.send(JSON.stringify({
            allNotes,
        }));
    });
});

app.put('/update',(req,resp) => {
    const updateNotes = req.body.updateNotes;
    // console.log("Receive update request",req.body);
    for(let created in updateNotes){
        const updateNote = updateNotes[created]; 
        if(updateNote.trash === 2){
            aws.note.destroy(updateNote);
        }else{
            aws.note.update(updateNote, (error, note) => error && console.log('updated ', updateNote, error));            
        }
    }
    resp.send("OK");
});

app.post('/login',(req,resp) => {
    const Email = req.body.Email;
    const password = req.body.password;
    // 验证方法，添加 以及获取userID
    aws.user.query(Email).loadAll().exec((err, respond) => {
        if (err) {
            console.log('Error running query', err);
        }
        //console.log("login query",Email, password, respond.Count);
        if(respond.Count === 1 && hash.verify(password, respond.Items[0].attrs.password)) {
            resp.send("OK");
        }else{
            resp.statusMessage = "Wrong email or password";
            resp.status(400).end();
        }
    });
});

app.post('/register', (req,resp) => {
    // console.log("catch register", req.body.userInfo);
    const userInfo = req.body.userInfo;
    aws.user.query(userInfo.email).loadAll().exec((err, respond) => {
        if (err) {
            console.log('Error running query', err);
        }
        if(respond.Count === 0){
            const newUser = {
                "email": userInfo.email,
                "password": hash.generate(userInfo.password), // hash password
                "firstName": userInfo.firstName,
                "lastName": userInfo.lastName,
            }
            aws.user.update(newUser, (error, note) => error && console.log('create usder ', newUser, error)); 
            // aws.user.created(newUser);
            resp.send("OK");
        }else{
            resp.statusMessage = "Already have email as user";
            resp.status(400).end();
        }
    });
    
});



app.listen(PORT, () => {  // this will start the server waiting for incoming requests
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log('use Ctrl-C to stop this server');
  });