const socketIO = require('socket.io');
const app = require('http').createServer()
app.listen(4622);
const onlineUser = {};

const io = socketIO(app);
io.on('connection', socket => {
    try {
        socket.on('regisiter', data => {
            console.log('注册')
            onlineUser[data.id] = socket
        })
        socket.on('getOnlineUser', send => {
            console.log('在线人数')
           send(Object.keys(onlineUser))
        })
        socket.on('send-local-candidate', data => {
            onlineUser[data.target].emit('save-local-candidate', data)
        })
        socket.on('send-remote-candidate', data => {
            onlineUser[data.target].emit('save-remote-candidate', data)
        })
    
        // desc交换
        socket.on('desc', data => {
            onlineUser[data.target].emit('save-desc', data)
        })
    } catch (error) {
        console.log(error)
    }
})