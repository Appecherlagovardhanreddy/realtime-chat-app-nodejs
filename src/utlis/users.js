const users = []

// add user ,remove user , getuser , getusersinroom


const adduser = ({ id,username,room })=>{
// clean the data
username = username.trim().toLowerCase()
    room  = room.trim().toLowerCase()

    // validate data
    if(!username|| !room){
          return {
              error :  ' Username and room are required '
          }
    }

    // check for existing user 

    const existing_user = users.find((user)=>{
        return  user.room === room && user.username === username 
    })

    // validate username 
    if(existing_user){
        return {
            error : 'Username in use!',
        }
    }
    // store user 

    const user = { id , username , room }
    users.push(user)
    return {user}

}

// remove user
const removeuser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id 
    })
    if(index !==-1){
        return users.splice(index,1)[0]
    }
}

// getuser 

const getuser = (id)=>{
 return users.find((user)=> user.id === id)

}

// getuserffrom room 

const getusersinroom   = (room)=>{
    
return users.filter((user)=> user.room === room)

}                                                                                                                                                                                                        

// test 

module.exports = {
    adduser,removeuser,getuser,getusersinroom,
}