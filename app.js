const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');
const { url } = require('inspector');
const bodyParser = require('body-parser');
const port = 80;
const Mongo_str = 'mongodb+srv://arnabmondal800:Ioekxtg27LCHJWem@books.gsfhbsy.mongodb.net/';
//Connceting with mongodb
mongoose.set('strictQuery',true);
main().catch(err=>console.log());
async function main(){
    await mongoose.connect(Mongo_str);
}

//Making bookSchema
const bookSchema = new mongoose.Schema({
    Name: String,
    Author: String,
    Type: String,
    Pages: Number,
    ebook: String
})

const Books = new mongoose.model('Books',bookSchema);

//Middleware to parse form data
app.use(bodyParser.urlencoded({extended: true}));
//connceting to the form
app.post('/add_books',(req,res)=>{
    var myData = new Books(req.body);

    myData.save().then(()=>{
        // res.send("This item has been saved");

        //After giving a pop-up it redirect to home page
        res.send(`
            <script>
                alert('Book successfully added!');
                window.location.href = '/';
            </script>
        `);
    }).catch(()=>{
        res.status(400).send("Item is not saved");
    });
});

// To delete books with password protection
app.delete('/delete_books/:Name', (req, res) => {
    const Bookname = req.params.Name;
    const password = req.query.password;

    // Predefined password
    const predefinedPassword = '8017897876@1';

    if (password === predefinedPassword) {
        Books.deleteOne({ Name: Bookname }).then((result) => {
            if (result.deletedCount == 0)
                res.status(404).json({ message: 'Book not found!' });
            else
                res.json({ message: 'Book successfully deleted' });
        }).catch(() => {
            res.status(500).json({ message: 'Error deleting book' });
        });
    } else {
        res.status(403).json({ message: 'Unauthorized: Incorrect password' });
    }
});

//To search Books
app.get('/search_books',(req,res)=>{
    const query = req.query.Name;
    Books.find({Name: new RegExp(query, 'i')}).then((results)=>{
        res.json(results);
    }).catch(()=>{
        res.status(500).json({message: 'Error searching books'});
    });
});

app.get('/available_books', (req, res) => {
    Books.find({}).then((results) => {
        res.json(results);
    }).catch(() => {
        res.status(500).json({message: 'Error fetching books'});
    });
});

app.use(express.static(__dirname))
app.get('/',(req,res)=>{
    // Sending html file to home directory
    res.sendFile(path.join(__dirname,'index.html'));
})
app.listen(port,()=>{
    console.log(`This application is started on ${port}`);
})