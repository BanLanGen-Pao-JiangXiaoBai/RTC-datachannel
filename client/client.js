import io from 'socket.io-client';
const socket = io('http://localhost:4622')
socket.on('connection', () => {
    console.log('socket连接成功')
})
socket.emit('regisiter', { id: 'client' })
var localPeerConnection, remotePeerConnection, sendChannel, receiveChannel;

localPeerConnection = new RTCPeerConnection();

localPeerConnection.onicecandidate = function(event) {
    console.log('onicecandidate')
  if (event.candidate) {
    console.log('e',event.candidate)
    // remotePeerConnection.addIceCandidate(event.candidate);
    // 发送candidate给remote去add
    socket.emit('send-local-candidate', { target: 'client-other', candidate: event.candidate })
  }
};

localPeerConnection.ondatachannel = function(event) {
    // receiveChannel = event.channel;
    event.channel.onmessage = function(event) {
      alert(event.data);
    };
  };

sendChannel = localPeerConnection.createDataChannel("CHANNEL_NAME");
sendChannel.onmessage = function(e) {
    console.log(e)
}
sendChannel.onopen = function(event) {
  var readyState = sendChannel.readyState;
  if (readyState == "open") {
    sendChannel.send("Hello");
  }
};
socket.on('save-remote-candidate', data => {
    console.log('save-remote-candidate', data)
    localPeerConnection.addIceCandidate(data.candidate)
})

socket.on('save-desc', data => {
    localPeerConnection.setRemoteDescription(data.desc)
})

setTimeout(function(){
    console.log('开始')
    localPeerConnection.createOffer().then(
        function(desc) {
            console.log('offer')
            localPeerConnection.setLocalDescription(desc);
            socket.emit('desc', {target: 'client-other', desc: desc})
        //   remotePeerConnection.setRemoteDescription(desc);
        //   remotePeerConnection.createAnswer().then(
        //     function(desc) {
        //     remotePeerConnection.setLocalDescription(desc);
        //     localPeerConnection.setRemoteDescription(desc);
        //   }
        //   )
        }
        )
}, 1000*10)