const express = require("express")
const {createServer} = require("http")
const {Server} = require("socket.io")
const port = 5000

const app = express()
app.use(express.static(__dirname + "/public"))

const httpServer = createServer(app)

const io = new Server(httpServer)

app.get("/", (request, response) => {
    response.render("index.html")
})


io.on("connection", (socket) => {
    console.log(`user ${socket.id} got connected!`)
    socket.on("user-message", (message) => {
        socket.broadcast.emit("message", message)
    })

    socket.on("disconnect", () => {
        console.log("1 disconnection happened", socket.id)
    })
    
})

httpServer.listen(port, (error) =>{
    if(!error){
        console.log(`server is live at port ${port}`)
    }
    console.log(error)
})