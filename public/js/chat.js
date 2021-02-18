const socket = io()

const $msgs = document.querySelector('#messages')
const $loc = document.querySelector('#location')
// templates
const msg_temp = document.querySelector('#message-template').innerHTML
const loc_temp = document.querySelector('#location-temp').innerHTML
const sidebar = document.querySelector('#sidebar_template').innerHTML
// options

// autoscroll

const autoscroll = () => {
    // New message element
    const $newMessage = $msgs.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $msgs.offsetHeight

    // Height of messages container
    const containerHeight = $msgs.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $msgs.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $msgs.scrollTop = $msgs.scrollHeight
    }
}

const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix : true })



socket.on('messages',(msg)=>{
    // console.log(msg)
    const html = Mustache.render(msg_temp,{
     username : msg.username,
     msg : msg.text,
     created_at : moment(msg.created_at).format("h:mmA"),
 
    })
    $msgs.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('location',(url)=>{
//  console.log(url)
 const html = Mustache.render(loc_temp,{
     username:url.username,
     url : url.loc,
     created_at : moment(url.created_at).format("h:mmA"),
   
 })

 $msgs.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('roomdata',({room,users})=>{
    const html = Mustache.render(sidebar,{
        room,
        users,

    })
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#send').addEventListener('click',(b)=>{
    b.preventDefault()
    // disable
    const info = document.querySelector('#message')
    if(info.value == ''){
        return ''
    }
    socket.emit('sendmessage',info.value,(error)=>{
        // re-enable
        if(error){
            return console.log(error)
        }
        console.log('Message was delevered')

    })

    info.value = ''

})


document.querySelector('#shareloc').addEventListener('click',()=>{
    // geocode api 
    if(!navigator.geolocation){
        alert("Your browser doesnt support sharing location")
    }
   
    navigator.geolocation.getCurrentPosition((position)=>{
    //    console.log(position)
    socket.emit('sendloc',{
        latitude : position.coords.latitude,
        longitude : position.coords.longitude,

    },()=>{
        
         console.log('Sucessfully sahred your location')
    })


    })
})

socket.emit('join',{username , room},(error)=>{
        if(error){
            alert(error)
            location.href = '/'
        }
})