const SHA512 = require('crypto-js/sha512');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

var dt = new Date();
var utcDate = dt.toUTCString();

class Block {
    constructor(timestamp, data, previousHash = '') {
        
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;

    }

    calculateHash() {
      return SHA512(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();

    }

    signTransaction(signingKey){
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx,'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){

        if(this.data === null()) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error("No Signature in this Block");
        }

        const publicKey = ec.keyFromPublic(this.data, 'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }

    mineBlock(difficulty){
      while(this.hash.substring(0,difficulty)!=Array(difficulty+1).join("0")){
        this.nonce++;
        this.hash=this.calculateHash();
      }
      console.log("Block Mined: "+this.hash+"\n")
    }

}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty=2;
  }

  createGenesisBlock(){
    return new Block(utcDate,"Genesis Block","0");
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    //newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];


      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }


}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
