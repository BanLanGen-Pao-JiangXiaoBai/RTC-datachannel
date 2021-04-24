import io from 'socket.io-client';
const socket = io('http://localhost:4622')
socket.on('connection', () => {
    console.log('socket连接成功')
})
socket.emit('regisiter', { id: 'client-other' })
var receiveChannel;
var remotePeerConnection = new RTCPeerConnection(null);

remotePeerConnection.onicecandidate = function(event) {
console.log('onicecandidate')
  if (event.candidate) {
    // localPeerConnection.addIceCandidate(event.candidate);
    socket.emit('send-remote-candidate', { target: 'client', candidate: event.candidate })
  }
};

remotePeerConnection.ondatachannel = function(event) {
  receiveChannel = event.channel;
  receiveChannel.onmessage = function(event) {
    alert(event.data);
    console.log('receiveChannel', receiveChannel)
    receiveChannel.send('hello client:  ' +new Date())
    // var remote = remotePeerConnection.createDataChannel('remote')
    // remote.onopen=function(e) {
    //   console.log('onopen')
    //   if(remote.readyState == 'open') {
    //     remote.send('hello:  '+new Date())
    //   }
    // }
  };
};
socket.on('save-local-candidate', data => {
    console.log('save-local-candidate',data)
    remotePeerConnection.addIceCandidate(data.candidate)
})
socket.on('save-desc', data => {
    remotePeerConnection.setRemoteDescription(data.desc)
    remotePeerConnection.createAnswer().then(function(desc){
        remotePeerConnection.setLocalDescription(desc)
        socket.emit('desc',{ target: 'client', desc: desc })
    })
})