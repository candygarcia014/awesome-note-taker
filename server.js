const express = require("express");
const path = require("path")
const fs = require("fs");
const { Recoverable } = require("repl");
const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//configuring app 
app.use(express.static("public"))
const dbData = JSON.parse(fs.readFileSync("db/db.json", "utf8"))
let currentId = 2

//Data/API routes
app.get("/api/notes", function(req, res) {
    res.send(dbData)
});

app.post("/api/notes", function(req, res) {
    dbData.push({
        ...req.body,
        id: currentId
    })
    currentId++
    fs.writeFileSync("db/db.json", JSON.stringify(dbData), "utf8")
    res.send(dbData)
});


//Delete route
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    const dbDataTemp = dbData.findIndex(p => p.id == id);
    dbData.splice(dbDataTemp, 1);
    fs.writeFile("./db/db.json", JSON.stringify(dbData), err => {
        if (err) throw err
        res.json(dbData)
    })
    res.sendFile(path.join(__dirname, "public/notes.html"));
})


//HTML Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

//* must be the last route
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});




app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});