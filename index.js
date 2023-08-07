import express from 'express';
import bodyParser from "body-parser"
import * as fs from 'node:fs';

const app = express();
const port = 3000;

const readFileLines = filename => fs.readFileSync(filename).toString('UTF-8').split('\n');


function loadTodos (filename) {
    let arr = readFileLines(filename);
    return arr;
}


function removeBtn (number, filePath) {
    console.log("remove item: " + number);
    var arr = loadTodos(filePath)
    arr.splice(number, 1)
    const fileContent = arr.join('\n');
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Array written to file successfully.');
        }
    });
    return arr
}


function addBtn (body, filepath) {
    console.log("add item: " + body);
    fs.appendFileSync(filepath, (body + "\n"));
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs",
    {array: loadTodos('todos.txt')});
});

app.get("/work", (req, res) => {
    res.render("work.ejs",
    {array: loadTodos('work.txt')});
});

app.post("/submitDailyAdd", (req, res) => {
    addBtn(req.body.dTodo, 'todos.txt');
    res.redirect("/");
});

app.post("/submitDailyDelete", (req, res) => {
    if (req.body.checkbox) {
        var chBox = (req.body.checkbox);
        var number = parseInt(chBox.split("_")[1]);
        // console.log(typeof(number) + " " + number);
        var arr = removeBtn(number, 'todos.txt')
    }
    console.log(arr)
    res.redirect("/")
});

app.post("/submitWorkAdd", (req, res) => {
    addBtn(req.body.wTodo, 'work.txt');
    res.redirect("/work");
});

app.post("/submitWorkDelete", (req, res) => {
    if (req.body.checkbox) {
        var chBox = (req.body.checkbox);
        var number = parseInt(chBox.split("_")[1]);
        // console.log(typeof(number) + " " + number);
        var arr = removeBtn(number, 'work.txt')
    }
    console.log(arr)
    res.redirect("/work")
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
