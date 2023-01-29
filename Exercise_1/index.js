const prompts = require('prompts');

// Class and creating constructor and their properties:
class Game {
  constructor(gameName, hitPoints, attackDamagePoints, chanceOfAttackHits) {
      this.gameName = gameName;
      this.hitPoints = hitPoints;
      this.attackDamagePoints = attackDamagePoints;
      this.chanceOfAttackHits = chanceOfAttackHits;
  }
  // To check attack chances is under hit.
  hit() {
    if(Math.floor(Math.random()* 100) < this.chanceOfAttackHits){
      return true
    }
    else{
      return false
    }
}
//Attack and hits points and remaining points:
attack(oposite) {
    if (this.hit()) {
      oposite.hitPoints = oposite.hitPoints - this.attackDamagePoints
      console.log(this.gameName + 'hits points' + oposite.gameName + 'with' + this.attackDamagePoints + 'points.')
      console.log(oposite.gameName + ' is hit and has ' + oposite.hitPoints + ' remaining points.')
    }
      else{
        console.log(this.gameName + ' attack skips');
      }
  }
}
// created new class, constructor and their properties:
class Room {
  constructor(roomName, roomDetail){
    this.roomName = roomName;
    this.roomDetail = roomDetail;
    this.roomEnemy = [];
    this.connectedRooms = [];
  }
getOpponent(){
  return this.roomEnemy;
}
 // The generic push() method is used for Only the length and integer-keyed characteristics are required for (this)value.
connectRoom(room){
  this.connectedRooms.push(room);
  room.connectedRooms.push(this)
}
addOpponent(opponent) {
  this.roomEnemy.push(opponent)
}
damageOpponent(opponent){
const index = this.roomEnemy.indexOf(opponent);
if (index > -1){
  this.roomEnemy.splice(index, 1);
  console.log(opponent.gameName + 'is damaged')
}
}
showConnectedRooms(){
  if(this.connectedRooms.length > 0){
    console.log('There are doorways leading to:\n');
    for(let j = 0; j < this.connectedRooms.length; j++){
      console.log(this.connectedRooms[j].roomName);
    }
  }
}
getConnectedRooms(){
  return this.connectedRooms;
}
}

// Created a class named "Player" which will inherit the methods from the "Game" class.
// by calling super method we  call the parent's constructor method and gets access to the parent's properties and methods.
class Player extends Game {
  constructor(gameName, hitPoints, attackDamagePoints, chanceOfAttackHits) {
      super(gameName, hitPoints, attackDamagePoints, chanceOfAttackHits)
  }

moveToRoom(room) {
      this.room = room;
      this.lookAround();
  }
lookAround(){
    console.log('You looked Around')
    console.log(this.room.roomDetail)
    let roomEnemy = this.room.getOpponent()
    if (this.room.getConnectedRooms().length > 0) {
      this.room.showConnectedRooms()
    }
    if (roomEnemy.length > 0){
      console.log('\nYou Watch: \n');
      for (let j = 0; j < roomEnemy.length; j++) {
        console.log('a ' + roomEnemy[j].gameName);
        roomEnemy[j].attack(this)
      }
    }
  }
}

// Created a class named "Opponent" which will inherit the methods from the "Game" class.
// by calling super method we  call the parent's constructor method and gets access to the parent's properties and methods.
class Opponent extends Game {
  constructor(gameName, hitPoints, attackDamagePoints, chanceOfAttackHits) {
  super(gameName, hitPoints, attackDamagePoints, chanceOfAttackHits)
  }
}

// creating objects:
let dungeon = new Room(roomName = 'Dungeon', roomDetail= 'You are in The dungeon and it is a big and damp room with broken statues all around')
let hallway = new Room(roomName = 'Hallway', roomDetail= 'You are in Hallway and it is a long and dark hallway with dark pools of water on the floor and some fungus growing on the walls')
let chamber = new Room(roomName = 'Chamber', roomDetail = 'You are in the Chamber and it is a small chamber, which is illuminated by a portal of somekind')
let portal = new Room(roomName = 'Portal', roomDetail = 'You are in The dungeon and it is a big and damp room with broken statues all around')

// creating Objects:
let player = new Player(gameName = "Player", hitPoints = 10, attackDamagePoints = 2, chanceOfAttackHit = 75);
let sewerRat = new Opponent(gameName = "Small Sewer Rat", hitPoints = 2, attackDamagePoints = 1, chanceOfAttackHit = 50);
let giantDragon = new Opponent(gameName = "Giant Dragon", hitPoints = 4, attackDamagePoints = 8, chanceOfAttackHit = 90);

// Connecting room with each other:
dungeon.connectRoom(hallway)
hallway.connectRoom(chamber)
chamber.connectRoom(portal)

//Adding Opponent to the room:
hallway.addOpponent(sewerRat)
chamber.addOpponent(giantDragon)

// Player first enter in dungeon room:
player.moveToRoom(dungeon);


/* Above the same code what was used for class inheritance demonstratino
   with Car and RaceCar classes and objects created from those two. 
   Your task is to implement the dungeon adventure. The above is just an example.*/

   async function gameLoop() {
    let continueGame = true;
    const initialActionChoices = [
        { title: 'Look Around', value: 'Look Around' },
        { title: 'Go to room', value: 'Go to Room' },
        { title: 'Attack', value: 'Attack'},
        { title: 'Exit game', value: 'Exit'}
    ];

    // Show the list of options for the user.
    // The execution does not proceed from here until the user selects an option.
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });

    // Deal with the selected value
    console.log('You pick ' +response.value);
    switch(response.value) {
      case 'Look Around':
        player.lookAround();
        if(player.hitpoints <= 0){
          console.log('Player Died Game Ends');
          continueGame = false;
        }
        break;

      case 'Go to Room':
        gotoRoom();
        continueGame= false;
        break;

      case 'Exit':
        continueGame = false;
        break;
    }
    
    if(continueGame) {
      gameLoop();
    }    
}

// This function always return something, here it will return roomchoices:
async function gotoRoom() {
  const roomChoices = []
  for(let j = 0; j < player.room.connectedRooms.length; j++){
    roomChoices.push({title: player.room.connectedRooms[j].roomName, value: player.room.connectedRooms[j].roomName});
  }
  const response = await prompts({
  type: 'select',
  name: 'value',
  message: 'Which room you want to go?',
  choices: roomChoices
  });

// Using a switch statement, different actions can be taken in response to various circumstances.
console.log('You pick ' + response.value);
switch (response.value) {

case 'Dungeon' :
player.moveToRoom(dungeon);
if (player.hitPoints <= 0) {
console.log('Player Died Game Ends')
break;
}
gameLoop();
break;

case 'Hallway':
player.moveToRoom(hallway);
if(player.hitPoints <=0){
console.log('Player Died Game Ends')
break;
}
gameLoop();
break;
        
case 'Chamber':
player.moveToRoom(chamber);
if(player.hitPoints <= 0){
console.log('Player Died Game Ends')
break;
}
gameLoop();
break;

case 'Portal':
player.moveToRoom(portal);
console.log('you made through the dungeon, Congratulations.')
break;

  }
}

process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();