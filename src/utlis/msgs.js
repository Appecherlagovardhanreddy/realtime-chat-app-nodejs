const generatemsg = (username,text) =>{
    return {
        username,
        text,
        created_at : new Date().getTime(),
    }
}

const locgen   =  (username, coords) =>{
    return {
    username,
    loc : 'http://google.com/maps?q='+ coords.latitude + ',' + coords.longitude ,
    created_at : new Date().getTime()
}
}
module.exports = {
    generatemsg,locgen

}