//Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var data = document.getElementById('data'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

var hash = function(data) {
  return sjcl.hash.sha256.hash(data)
};

var timestamp = function() {
  ts = new Date().getTime();
  return ts
};

var verify = function() {

};

//Emit events
btn.addEventListener('click', function(){
  socket.emit('send', {
    data: data.value,
    user: socket.id,
    time: timestamp()

  });
  console.log(`emit: ${data.value} by ${socket.id}`);
  data.value = '';
});

//Listen for events
socket.on('add_block', function(data){
  feedback.innerHTML = '';
  output.innerHTML += '<p><strong>' + data.id + ':</strong>' + data.data + ' at ' + data.time + '</p>';
});

socket.on('verify', function(data){

  socket.emit('verify', {
    id : data.id,
    data: data.data,
    time: data.time,
    user: data.user,
    prev_hash: data.prev_hash,
    hash: hash(data.id + data.user + data.time + data.data + data.prev_hash).toString(),
    auth_user: socket.id
  });
});

// socket.on('typing', function(data){
//   feedback.innerHTML = '<p><em>' + data + 'is typing...</em></p>'
// });
