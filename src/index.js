const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')
const { callbackify } = require('util')
const {generatemsg,locgen} = require('./utlis/msgs')

const {adduser,removeuser,getuser,getusersinroom} = require('./utlis/users')

const port = process.env.PORT || 3000

const public_files = path.join(__dirname,'../public')

app.use(express.static(public_files))

let count = 0
// when client connects

io.on('connection',(socket)=>{
    console.log('New web socket connection Succesful')
    // socket is an object that contains all data of new connection 
    // we send and receive events 

    // socket.emit('countUpdated',count)
    // socket.on('increament',()=>{
    //     count++
    //     // socket.emit('countUpdated',count)
    //     io.emit('countUpdated',count)
    //     // io.emmit  emits event for all servers while socket for one
    // })

      // join
      socket.on('join',({id ,username,room},cb )=>{
     const {error ,user } =    adduser({id : socket.id , username ,room })
     if(error){
      return   cb(error)
     }
     socket.join(user.room)
        
    socket.emit('messages',generatemsg('Admin ','welcome !'))
    socket.broadcast.to(room).emit('messages',generatemsg('Admin',' '+ user.username + ' has joined'))
    io.to(user.room).emit('roomdata',{
        room : user.room,
        users : getusersinroom(user.room)
    })
    cb()
    // broadcast sends message to everyone except the user  


        // io.to().emit -> emits  every one in a  specific room
        // socket.broadcast.to().emit -> everyone in a room  except the user 
    
    })
     socket.on('sendmessage',(msg,cb)=>{
      const user = getuser(socket.id)
         const filter = new Filter()
         if(filter.isProfane(msg)){
              return cb('Bad words not allowed')
         }
         io.to(user.room).emit('messages',generatemsg(user.username,msg))
         cb()
      
     })

    socket.on('disconnect',()=>{
       const user =  removeuser(socket.id)

       if(user){
        io.to(user.room).emit('messages',generatemsg('Admin',' ' + user.username+' has left'))
        io.to(user.room).emit('roomdata',{
            room : user.room,
            users : getusersinroom(user.room)
        })  
    }
        
      
    })

    socket.on('sendloc',(coords,cb)=>{
      const user = getuser(socket.id)
        // io.emit('messages','Location :'+ coords.latitude + ','+ coords.longitude)
        io.to(user.room).emit('location',locgen(user.username,coords))
        cb()
    })

})

 
 

server.listen(port,()=>{
    console.log('On PORT',port)
})