var express = require('express');
var socket = require('socket.io');


// model
class UserResult {
  constructor(user, hash, block) {
    this.user = user;
    this.hash = hash;
    this.block = block;
  }
}

class UserResults {
  constructor() {
    this.users_map = new Map();
    this.hashes = new Map();
    this.not_empty = new Set();
  }

  addUser(user) {
    this.users_map.set(user.user, [user.hash, user.block])
  }

  updateUser(user, hash, block) {
    this.users_map.set(user, [hash, block]);

    if (this.hashes.has(hash)) {
      this.hashes.set(hash, this.hashes.get(hash) + 1)
    } else {
      this.hashes.set(hash, 1)
    }

  }

  reset() {
    let users_new = new Map();
    this.users_map.forEach(function (v, k, m) {
      users_new.set(k, [undefined, undefined])
    });
    this.users_map = users_new;
    this.hashes = new Map();
    this.not_empty = new Set();
  }

  verify() {
    for (const [user, value] of this.users_map) {
      if (value[0] !== undefined && value[1] !== undefined) {
        this.not_empty.add(user);
      }
    }

    if (this.not_empty.size >= (this.users_map.size / 2)) {
      for (let key of this.hashes.keys()) {
        let value = this.hashes.get(key);
        if (value >= this.users_map.size / 2) {
          return key
        }
      }
    }
  }

  getBlockByHash(hash) {
    for (let key of this.users_map.keys()) {
      let v = this.users_map.get(key);
      if (v[0] === hash) {
        return v[1]
      }
    }
  }
}


class Block {
  constructor(data) {
    this.id = data.id;
    this.user = data.user;
    this.time = data.time;
    this.data = data.data;
    this.prev_hash = data.prev_hash;
    this.hash = data.hash;
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock ()];
  }

  createGenesisBlock(){
    return new Block({
      id: 0,
      prev_hash: '0'
    })
  }

  getLatestBlock(){
    return this.chain[this.chain.length -1];

  }

  getLatestHash(){
    return this.getLatestBlock().hash;
  }

  getLatestId(){
    return this.getLatestBlock().id;
  }

  addBlock(newBlock){
    this.chain.push(newBlock);
  }
}
var blockchain = new Blockchain();
var users = new UserResults();


// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening to request on port 4000');
});

// Static files
app.use(express.static('public'));


// Socket setup
var io = socket(server);
io.on('connection', function(socket){
  user = new UserResult(socket.id, undefined, undefined);
  users.addUser(user);
  console.log('made socket connection', socket.id);

  // Handle chat event
  socket.on('send', function(data){

    io.sockets.emit('verify', {
      data: data.data,
      time: data.time,
      user: data.user,
      prev_hash: blockchain.getLatestHash(),
      id: blockchain.getLatestId() + 1
    })
  });

  socket.on('verify', function(data){
    block = {
      id : data.id,
      data: data.data,
      time: data.time,
      user: data.user,
      prev_hash: data.prev_hash,
      hash: data.hash,
      auth_user: data.auth_user
    };
    user = data.auth_user;
    hash = data.hash;

    if (data.user !== user) {
      users.updateUser(user, hash, block);
      v_hash = users.verify();
      if (v_hash !== undefined) {
        v_block = users.getBlockByHash(v_hash);
        v_block_data = {
          id : v_block.id,
          data: v_block.data,
          time: v_block.time,
          user: v_block.user,
          prev_hash: v_block.prev_hash,
          hash: v_block.hash,
        };
        blockchain.addBlock(v_block_data);
        users.reset();
        console.log(blockchain);
        io.sockets.emit('add_block', v_block_data)
      }
    }
  });
  // socket.on('typing', function(data){
  //   socket.broadcast.emit('typing', data);
  // });
});
