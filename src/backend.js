import { Card } from "./Card";

const suits  = [
  'Spades', 
  'Diamonds', 
  'Clubs', 
  'Hearts'
];
const values = [
  'Ace', 
  '2', 
  '3', 
  '4', 
  '5', 
  '6', 
  '7', 
  '8', 
  '9', 
  '10', 
  'Jack',
  'Queen',
  'King'
];
const quants = {
  'Ace': 13, 
  '2': 1, 
  '3': 2, 
  '4': 3, 
  '5': 4, 
  '6': 5, 
  '7': 6, 
  '8': 7, 
  '9': 8, 
  '10': 9, 
  'Jack': 10, 
  'Queen': 11, 
  'King': 12
};
export const symbols = {
  'Spades': `\u2660`, 
  'Diamonds': `\u2666`, 
  'Clubs': `\u2663`, 
  'Hearts':`\u2665`
};
const hands = [
  'straight flush', 
  'wheel flush', 
  'four of a kind', 
  'full house', 
  'flush', 
  'straight', 
  'three of a kind', 
  'two pair', 
  'one pair', 
  'high card'
];

export const characters = [
  {
    name: 'Alex Trebek',
    url: '/images/alexTrebek.jpg'
  },
  {
    name: 'Buddy "The Elf"',
    url: '/images/buddyTheElf.jpg'
  },
  {
    name: 'Brennan Huff',
    url: '/images/brennanHuff.jpg'
  },
  {
    name: 'Chazz Michael Michaels',
    url: '/images/chazzMichaelMichaels.jpg'
  },
  {
    name: 'Chad Smith',
    url: '/images/chadSmith.jpg'
  },
  {
    name: 'Detective Allen Gamble',
    url: '/images/detectiveAllenGamble.jpeg'
  },
  {
    name: 'Frank "The Tank" Richard',
    url: '/images/frankTheTank.jpg'
  },
  {
    name: 'Gator',
    url: '/images/gator.jpg'
  },
  {
    name: 'Harold Crick',
    url: '/images/haroldCrick.jpg'
  },
  {
    name: 'Jackie Moon',
    url: '/images/jackieMoon.jpg'
  },
  {
    name: 'Jacobim Mugatu',
    url: '/images/jacobimMugatu.jpg'
  },
  {
    name: 'Janet Reno',
    url: '/images/janetReno.jpg'
  },
  {
    name: 'Lars Erickssong',
    url: '/images/larsErickssong.jpg'
  },
  {
    name: 'Mustafa',
    url: '/images/mustafa.jpg'
  },
  {
    name: 'Ricky Bobby',
    url: '/images/rickyBobby.jpg'
  },
  {
    name: 'Ron Burgundy',
    url: '/images/ronBurgundy.jpeg'
  }
];

class Player {
  constructor(position, character) {
    this.name = character.name;
    this.imgUrl = character.url;
    this.wallet = 5000;
    this.hand = new Hand();
    this.position = position;
  }

  bestHand(communityCards) {
    if (this.hand.pocket === undefined) throw new Error('Player not dealt');

    const pocket = this.hand.pocket;
    const availableCards = [...pocket, ...communityCards];
    const sortedCards    = this.sortThese(availableCards);
    const iterations     = this.iterator(sortedCards);
    iterations.forEach(x=>x.evaluate());
    iterations.sort(rankHands);
    const bestIteration = iterations.shift();
    
    this.hand = {...bestIteration,pocket};
    this.hand.pocket = pocket;
  }

  sortThese(cards) {
    //Sorts High to Low
    const sortedCards = cards.sort(this.cardSort);

    return sortedCards;
  }

  cardSort(a,b) {
    const compare = quants[b.value] - quants[a.value];
    const suitCompare = suits.indexOf(b.suit) - suits.indexOf(a.suit);

    if (compare) return compare;
    
    return suitCompare;
  }

  iterator(availableCards) {
    let list = [];

    for (let i = 0; i < availableCards.length; i++) {
      for (let j = 0; j < availableCards.length; j++) {
        if (i >= j) {
          continue;
        }
        let version = availableCards.slice();
        version.splice(j, 1);
        version.splice(i, 1);

        list.push(new Hand(version));
      }
    }

    return list;
  }
}

export class User extends Player {
}

export function getPlayers(numOfPlayers = 5) {
  let players = [];
  const indexOfUser = Math.floor(Math.random() * numOfPlayers);

  const fetchCharacter = ()=>{
    let index = Math.floor(Math.random() * characters.length);
    return characters[index];
  };

  const playerOrUser = (index,character)=>{
    var Type;
    (index === indexOfUser) ? Type = User : Type = Player;

    return new Type(index, character);
  }

  for (let i = 0; i < numOfPlayers; i++) {
    let target;
    while (!target) {
      let x = fetchCharacter();
      if (players.every(y=>y.name !== x.name)) {
        target = playerOrUser(i,x);
      }
    }
    players.push(target);
  }


  return [players, players[indexOfUser].name];
}

export function dealPocket(gameState) {
  const deck = createDeck();
  const state = {...gameState};

  const pockets = state.players.map(x=>[]);

  for (let i = 0; i < 2; i++) {
    pockets.forEach(x=>x.push(deck.pop()));
  }
  
  state.players.forEach((x,i)=>{
    x.hand.pocket = pockets[i];
  });

  return {...state,deck};
}

export function dealFlop(gameState) {
  const state = {...gameState};
  const deck = [...state.deck];
  const flop = [];
  for (let i = 0; i < 3; i++) {
    flop.push(deck.pop())
  }

  return {...state,deck,community: {flop}}
}

export function dealTurnOrRiver(gameState,turnOrRiverString) {
  const state = {...gameState};
  const deck = [...state.deck];
  const holder = [deck.pop()]
  const community = {...state.community, [turnOrRiverString]: holder};

  return {...state,deck,community}

}

export function evaluateGame(gameState) {
  const state = {...gameState};
  const {flop,turn,river} = state.community;
  const community = [...flop,...turn,...river];
  // evaluation is buggy always evaluating to high card
  state.players.forEach(x=>x.bestHand(community));
  const playerList = [...state.players]
  const ranking = playerList.sort(rankExtractedHands)
  const roundRank = ranking.map(x=>{
    return (
      {
        name: x.name,
        cards: x.hand[0].map(x=>x.name),
        hand: x.hand.hand
      }
    );
  });
  return {...state,roundRank};
}

export function nextRound(gameState) {
  const state = {...gameState};
  const winner = state.roundRank[0];
  (state.records) ? state.records = [...state.records,winner] : state.records = [winner];
  const propsForDeletion = ["deck", "community", "roundRank"];
  propsForDeletion.forEach(x=>{delete state[x];});
  state.players.forEach(x=>{
    x.hand = new Hand();
  });
  console.log(state);
  return state;
}
function rankExtractedHands(playerA,playerB) {
  return rankHands(playerA.hand,playerB.hand)
}

function rankHands(handA,handB) {
  const handComparison = hands.indexOf(handA.hand) - hands.indexOf(handB.hand);
  
  if (handComparison !== 0) return handComparison;

  let cardComparison = 0;
  let i = 0;

  while (i < 4 && cardComparison === 0) {
    cardComparison = quants[handB[0][i].value] - quants[handA[0][i].value];
    i++;
  }   
      
  return cardComparison;
}

function createDeck() {
  const unshuffled = [];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      unshuffled.push(new Card(values[j],suits[i]));
    }
  }
  const unshuffledDeck = (new Deck(...unshuffled));

  return unshuffledDeck.shuffle();
}

function randNumInRange(range) {
  return Math.floor(Math.random() * range);
}

export class Deck extends Array {
  shuffle() {
    this.washFiveTimes()
        .cut()
        .riffle()
        .box()
        .washFiveTimes()
        .cut()
        .riffle();
    
    return this;
  }

  wash() {
    const original = [];
    const clean = [];
    while (this.length > 0) {
      original.push(this.pop());
    }
    while (original.length > 0) {
      let randomIndex = Math.floor(Math.random() * original.length);
      clean.push(original.splice(randomIndex,1)[0]);
    }
    while (clean.length > 0) {
      this.push(clean.pop());
    }
    return this;
  }

  washFiveTimes() {
    for (let i = 0; i < 5; i++) {
      this.wash();
    }

    return this;
  }

  cut() {
    const randSplit = (this.length / 2) - 2 + randNumInRange(5);

    for (let i = 0; i < randSplit; i++) {
      this.push(this.shift());
    }
    if (this.length > 52 || this.length < 52) throw new Error(`cut ${this.length}`);

    return this;
  }

  //Empties deck array into two halves with split(), they are poured back 
  //into the deck with varying degrees of slop. Returns 'this'
  riffle() {
    let [firstHalf, secondHalf] = this.split();

    while (this.length < 52) {
      this.riffler(firstHalf);
      this.riffler(secondHalf);
    }

    if (this.length > 52 || this.length < 52) throw new Error(`riffle ${this.length}`);

    return this;
  }

  //deck divided out into two new arrays and returned in an array container
  split() {
    let randSplit = 24 + Math.floor(Math.random() * 5);
    let otherHalf = [];

    for (let i = 0; i < randSplit; i++) {
      otherHalf.push(this.shift());
    }
    
    let clean = [];
    while (this.length > 0) {
      clean.push(this.pop());
    }
    
    return [otherHalf, clean];
  }

  riffler(half) {
    if (half.length > 0) {
      this.push(half.pop());
      const probability = Math.random();

      if (probability > 0.9 && half.length > 1) {
        this.push(half.pop());
        this.push(half.pop());
      } 
      else if (probability > 0.75 && half.length > 0) {
        this.push(half.pop());
      } 
    }
  }

  // Performs box shuffle. Returns 'this'
  box() {
    let deck = this;
    let temp = [];

    while(deck.length > 0) {
      const max = deck.length;
      let randLength = Math.floor(Math.random() * 7) + 10;
    
      if (max < randLength) randLength = max;
    
      let target = deck.length - randLength;        
      
      for (let i = 0; i < randLength; i++) {
        temp.push(deck.splice(target, 1)[0]);
      }
    }
    
    while (temp.length > 0) deck.push(temp.shift());
    if (this.length > 52 || this.length < 52) throw new Error(`box ${this.length}`);
    return this;
  }
}

class Hand extends Array{
  //Evaluates sorted hand and formats appropriately
  evaluate() {
    const SWF = this.straightWheelFlush();

    if (SWF) {
      this.hand = SWF;
      return;
    };

    const multi = this.tupler();

    if (multi) {
      this.hand = multi;
      return;
    }

    throw new Error(`Evaluator failed: ${this}`);
  }

  //Evaluates straight/wheel/flush and outputs result/formats hand
  straightWheelFlush() {
    const hand = this[0];
    const isFlush = hand.every(this.flush);
    const ruler = hand.map(this.straight);
    const isStraight = ruler.every(x=>x);
    let isWheel;

    (isStraight) ? isWheel = false : isWheel = this.wheel(ruler);

    if (isFlush) {
      if (isStraight) return 'straight flush';
      if (isWheel)    return 'wheel flush'

      return 'flush';
    }

    if (isStraight) return 'straight';
    if (isWheel)    return 'wheel';
    
    return false;
  }

  //checks that the next array item is of the same suit
  flush(x, index, arr) {
    const bounds = arr.length - 2;

    if (index <= bounds) {
      return (x.suit === arr[index + 1].suit);
    }
        
    return true;
  }

  //Evaluates for our definition of straight for '.every()' of an array
  straight(x, index, arr) {
    const bounds = arr.length - 2;            //index of next to last value

    if (index > bounds) {
      return true;
    }

    const a = quants[x.value];
    const b = arr[index + 1];
    const c = quants[b.value];

    return (a === (c + 1));
  }

  // Returns boolean if hand is a wheel and reorders hand if true
  wheel(ruler) {
    let isWheel;
    const hand = this[0];
    const possible = ((hand[0].value === 'A') && (hand[1].value === '5'));
    
    if (possible) {
      ruler.shift();
      isWheel = ruler.every(x=>x);

      if (isWheel) {
        hand.push(hand.shift());
        
        return true;
      }
    }

    return false;
  }

  //returns high card, pair, three of a kind, full house, or error. Also formats hand appropriately
  tupler() {
    const hand = this[0];
    const temp = hand.map(this.confirmTuple);
    temp.pop();
    const first = temp.indexOf(true);

    if (first < 0) return 'high card';

    let count = temp.filter((x) => (x === true)).length;

    if (count === 1) {
      const pair = hand.splice(first, 2);
      hand.unshift(pair[1]);
      hand.unshift(pair[0]);

      return 'one pair';
    }
    
    const rev = temp.slice();
    rev.reverse();
    const last = rev.indexOf(true);
    const lastIndex = Math.abs(last - 3);
    
    if (count === 3){
      if (temp[0] && temp[3]){
        if (temp[2]) {
          hand.push(hand.shift());
          hand.push(hand.shift());
        }
        return 'full house';
      }
      
      if (temp[3]) {
        hand.push(hand.shift());
      }

      return 'four of a kind';
    }
     
    if (count === 2) return this.threeOrTwo(temp, first, lastIndex);
    
    return 'Error!';
  }

  //evaluates for tuples
  confirmTuple(x, index, arr) {
    const bounds = (arr.length) - 1;
    const target = arr[index + 1];

    if (index < bounds) return (x.value === target.value);
  
    return false;
  }

  //returns three or 2 pair
  threeOrTwo(temp, firstIndex, lastIndex) {
    let hand = this[0];

    if (this.three(temp)) {
      const mark = temp.indexOf(true);
      if (mark === 2) {
        hand.push(hand.shift());
        hand.push(hand.shift());
      }
      else if (mark === 1) {
        const item = hand.shift();
        hand.splice(3, 0, item);
      }
      return 'three of a kind';
    }
    
    const pair1 = hand.splice(firstIndex, 2);
    const pair2 = hand.splice(lastIndex - 2, 2);
    hand.unshift(pair2[1]);
    hand.unshift(pair2[0]);
    hand.unshift(pair1[1]);
    hand.unshift(pair1[0]);

    return 'two pair';
  }

  //evaluates three of a kind from map of pair locations in array
  three(map) {
    const index = map.indexOf(true);
    if (map[index] === map[index + 1]) {
      return 'three of a kind';
    }

    return null;
  }

  // transfer(donatingArray,thisHand) {
  //   while (this)
  // }
}


// class Deck extends Array {
//   constructor() {
//     this.order = this.freshDeck();
//     this.isShuffled = false;
//     this.isDealt = false;
//   }

//   //Returns a newly generated deck
//   freshDeck() {
//     let deck = [];

//     for (let i = 0; i < suits.length; i++) {
//       for (let j = 0; j < values.length; j++) {
//         deck.push(new Card(values[j],suits[i]));
//       }
//     }

//     return deck;
//   }

//   myShuffle() {
//     const deck = new Shuffle(this.order);
//     deck.shuffle();
//     this.order = deck.deck;
//     this.isShuffled = true;
//   }
// }

// //object for a poker game. Game has players, rounds,
// class Poker {
//   constructor(user = 'User', table = 5) {
//       this.round = [new Round(table)];
//       this.deck = this.round[0].deck;
//       this.table = this.players(user, table);
//       this.tableOrder = this.table.slice();
//       this.blind = 25;
//       this.step = 0;
//   }

//   players(user, count) {
//       let table = [];
//       let player1 = Math.floor(Math.random() * count);

//       while (player1 >= count) {
//           player1--;
//       }

//       this.userIndex = player1;

//       for (let i = 0; i < count; i++) {
//           if (i === player1) {
//               table.push(new User(i, user));
//           }
//           else {
//               table.push(new Player(i));
//           }
//       }

//       return table;
//   }

//   shuffle() {
//       this.deck.myShuffle();

//       while (this.deck.order.length > 52) {
//           console.log('shuffle is busted still...');
//           this.deck.order.splice(this.deck.order.indexOf(x=> (x === undefined)),1);
//       }

//       return this;
//   }

//   deal() {
//       const count = this.tableOrder.length;
//       this.betting(this.blind);

//       if (this.deck.isShuffled) {
//          this.dealing(count);
//       }
//       else {
//           console.log('...Still need to shuffle');
//       }
//       return this;
//   }

//   dealing(count) {
//       while (this.tableOrder[0].hand.cards.length < 2) {
//           this.dealingLoop(count);
//       }

//       this.deck.isDealt = true;
//   }

//   dealingLoop(count) {
//       for (let i = 0; i < count ;i++) {
//           const player = this.tableOrder[i];
//           let current = this.deck.order.pop();

//           while (!current) {
//               current = this.deck.order.pop();
//           } 
          
//           player.hand.cards.push(current);
//           player.hand.pocket.push(current);
//       }
//   }

//   sort() {
//       if (this.deck.isDealt) {
//           this.tableOrder.forEach((x)=>x.hand.sort());
//       }
//       else {
//           console.log('...Still need to deal');
//       }

//       return this;
//   }

//   evaluate() {
//       this.tableOrder.forEach((x)=>x.hand.evaluate());
      
//       return this;
//   }

//   evaluation(x) {
//       let copy = x.hand.cards.slice();
//       let community = this.round[this.round.length - 1].community.slice();
      
//       while (community.length) {
//           copy.push(community.pop());
//       }

//       const variations = this.iterator(copy);
      
//       const hands = [];
//       while (hands.length < variations.length) {
//           hands.push(new Hand());
//       }
//       hands.forEach((x,i) => {
//           x.cards = variations[i];
//       });

//       hands.forEach(x => x.sort());
//       hands.forEach(x => x.evaluate());
//       hands.sort(this.innerCheck);

//       x.hand.cards = hands[0].cards;
//       x.hand.hand = hands[0].hand;
//   }

//   iterator(fullHand) {
//       let list = [];

//       for (let i = 0; i < fullHand.length; i++) {
//           for (let j = 0; j < fullHand.length; j++) {
//               if (i >= j) {
//                   continue;
//               }
//               let version = fullHand.slice();
//               version.splice(j, 1);
//               version.splice(i, 1);
//               list.push(version);
//           }
//       }

//       return list;
//   }

//   innerCheck(a,b) {
//       const rank = hands.indexOf(a.hand) - hands.indexOf(b.hand);
//       let compare = 0;
//       let i = 0;
      
//       if (rank) {
//           return rank;
//       }

//       while (i < 4 && compare === 0) {
//           compare = quants[b.cards[i].value] - quants[a.cards[i].value];
//           i++;
//       }   
          
//       return compare;
//   }
  
//   rank() {
//       let ranking = this.tableOrder.slice();
      
//       ranking.sort(this.compare);
//       this.roundWinner(ranking[0].name);

//       return this.table;
//   }

//   compare(a,b) {
//       const rank = hands.indexOf(a.hand.hand) - hands.indexOf(b.hand.hand);
//       if (rank) {
//           return rank;
//       }

//       let compare = 0;
//       let i = 0;

//       while (i < 4 && compare === 0) {
//           compare = quants[b.hand.cards[i].value] - quants[a.hand.cards[i].value];
//           i++;
//       }   
          
//       return compare;
//   }


//   roundWinner(name) {
//       const winner = this.table.find(x => x.name === name);
//       const user = this.table[this.userIndex];
//       const currentRound = this.round[this.round.length - 1];
//       currentRound.winner = winner;
//       let pot = [];

//       currentRound.userBet = Wallet.chipSum(user.wallet.bet);
//       this.table.forEach(x => {
//           while (x.wallet.bet.length) {
//               pot.push(x.wallet.bet.pop());
//           }
//       });

//       const cash = Wallet.chipSum(pot);
//       currentRound.pot = cash;

//       while (pot.length) {
//           currentRound.winner.wallet.chips.push(pot.pop());
//       }

//       currentRound.winner.wallet.sortWallet();
//   }

//   betting(bet) {
//       this.table.forEach(x => {
//           x.wallet.findBet(bet);

//           this.allIn(x);
//       });
//   }

//   allIn(player) {
//       if (player.wallet.chips.length === 0) {
//           player.allIn = true;
//       }
//       else {
//           player.allIn = false;
//       }

//       return player.allIn;
//   }

//   nextRound() {
//       this.round.push(new Round());
//       this.deck = this.round[this.round.length - 1].deck;
//       this.tableOrder.push(this.tableOrder.shift());

//       this.table.forEach(x => {
//           x.hand = new Hand();
//       })

//       if (this.tableOrder.length < 2 ) {
//           console.log('The Game is over. Only one player remains!')
//       }
//       if (!this.tableOrder.find(x => x instanceof User)) {
//           console.log("The Game is over. You're out of chips!")
//       }

//       this.shuffle().deal();
//       this.step = 0;
//       this.tableOrder.forEach((x, i)=>{
//           if (x.allIn) {
//               this.tableOrder.splice(i, 1);
//           }
//       })
//   }

// }

// class Shuffle {
//   constructor(deck) {
//       this.deck = deck;
//   }

//   //takes an array of cards and shuffles with various methods, returning a shuffled array
//   shuffle() {
//       this.wash()
//           .cut()
//           .riffle()
//           .box()
//           .cut()
//           .riffle()

//       return this;
//   }

//   wash() {
//       let deck = this.deck;

//       for (let i = 0; i < deck.length; i++) {
//           let randomIndex = Math.floor(Math.random() * ((deck.length - 1) - i)) + i;
//           let randCard = deck.splice(randomIndex, 1)[0];
//           deck.unshift(randCard);
//       }
  
//       return this;
//   }

//   //Cuts deck, returns 'this'
//   cut() {
//       let deck = this.deck;
//       const randSplit = (deck.length / 2) - 2 + Math.floor(Math.random()*5);

//       for (let i = 0; i < randSplit; i++) {
//           deck.push(deck.shift());
//       }

//       return this;
//   }

//   //Empties deck array into two halves with split(), they are poured back 
//   //into the deck with varying degrees of slop. Returns 'this'
//   riffle() {
//       const deck = this.deck;
//       let [firstHalf, secondHalf] = this.split(deck);

//       while (deck.length < 52) {
//           this.riffler(firstHalf, deck);
//           this.riffler(secondHalf, deck);
//       }

//       return this;
//   }

//   //deck divided out into two new arrays and returned in an array container
//   split(deck) {
//       let randSplit = 24 + Math.floor(Math.random()*5);
//       let otherHalf = [];
//       let clean = [];
  
//       for (let i = 0; i < randSplit; i++) {
//           otherHalf.push(deck.shift());
//       }
      
//       this.transfer(deck, clean);
      
//       return [otherHalf, clean];
//   }

//   riffler(half, deck) {
//       if (half.length) {
//           deck.push(half.pop());
//           const probability = Math.random();

//           if (probability > 0.9 && half.length > 1) {
//               deck.push(half.pop());
//               deck.push(half.pop());
//           } 
//           else if (probability > 0.75 && half.length) {
//               deck.push(half.pop());
//           } 
//       }
//   }

//   //Performs box shuffle. Returns 'this'
//   box() {
//       let deck = this.deck;
//       let temp = [];

//       while(deck.length) {
//           const max = deck.length;
//           let randLength = Math.floor(Math.random() * 7) + 10;
      
//           (max > randLength) ? {}: randLength = max;
      
//           let target = deck.length - randLength;
      
//           for (let i = 0; i < randLength; i++) {
//                temp.push(deck.splice(target, 1)[0]);
//           }
//       }
      
//       this.transfer(temp, deck);
      
//       return this;
//   }

//   //transfers array(/deck) a to array(/deck) b
//   transfer(a, b) {
//       while (a.length) {
//           b.push(a.shift());
//       }
//   }

// }

// class Round {
//   constructor() {
//       this.deck = new Deck();
//       this.community = [];
//   }

// }



// class Card {
//   constructor(value, suit) {
//       this.value = value;
//       this.suit = suit;
//       this.display = this.cardDisplay();
//       this.element = this.createCard();
//   }

//   cardDisplay() {
//       let display = symbols[this.suit];
//       let conditional = this.value;
//       let value;
      
//       if (conditional.length < 3) {
//           value = conditional;
//       }
//       else {
//           value = conditional[0];
//       }
      
//       display += value;

//       return String(display);
//   }

//   // //Updated cardDisplay
//   // cardDisplay() {
//   //     let abbrv = symbols[this.suit];
//   //     let temp = this.value;
//   //     let value;

//   //     abbrv += temp.length < 3 ? value = temp : value = temp[0] 

//   //     return String(abbrv);
//   // }

//   createCard() {
//       const idString = `${this.suit}${this.value}`;
//       const myCard = document.createElement('div');
//       const text = document.createElement('span');
//       this.id = idString;
      
//       myCard.className = 'card';
//       myCard.id = idString;
//       text.innerText = this.display;
//       myCard.appendChild(text);

//       if ((this.suit[0]==='D') || (this.suit[0]==='H')) {
//           myCard.style = 'color: red';
//       }
      
//       return myCard;
//   }

// }

// class Wallet {
//   constructor() {
//       this.chips = this.buildWallet();
//       this.bet = [];
//   }
  
//   buildWallet() {
//       const wallet = [];
//       const looper = (x, y) => {
//           for (let i = 0; i < y; i++) {
//               wallet.push(x);
//           }
//       }

//       looper(new White(), 8);
//       looper(new Red(), 6);
//       looper(new Blue(), 5);
//       looper(new Green(), 4);
//       looper(new Black(), 2);

//       return wallet;
//   }

//   findBet(target) {
//       this.sortWallet();
//       const wallet = this.chips;
//       let bet = this.bet;

//       if (!this.length()) return bet;

//       bet = this.lowestPossible(target);

//       if (this.remainder(target, bet) < 0 && this.length()) {
//           const safety = wallet.findIndex(x => x.value > target);
//           const difference = (wallet[safety].value - target) <= this.remainder(target, bet);

//           if (difference) {
//               bet.unshift(wallet.splice(safety, 1)[0]);

//               while (bet.length > 1) {
//                   wallet.push(bet.pop());
//               }
//           }
//       }

//       this.sortWallet();
//       this.bet = bet;
//   }

//   remainder(target, bet) {
//       return (target - Wallet.chipSum(bet));
//   }

//   length() {
//       return this.chips.length;
//   }

//   lowestPossible(target) {
//       const bet = [];

//       for (let i = this.chips.length - 1; i > 0; i--) {
//           if (this.chips[i].value <= this.remainder(target, bet)) {
//               bet.push(this.chips.splice(i, 1)[0]);     
//           }
//           if (this.remainder(target, bet) === 0) break;
//       }   

//       return bet;
//   }

//   sortWallet() {
//       this.chips.sort((a, b)=>a.value - b.value);

//       return this;
//   }

//   static chipSum(chips) {
//       let sum = 0;
//       chips.forEach(x => {sum += x.value;});

//       return sum;
//   }
// }

// class Chip {
//   constructor() {
//       this.value;
//   }

// }
// class White extends Chip {
//   constructor() {
//       super();
//       this.value = 25;
//   }
// }
// class Red extends Chip {
//   constructor() {
//       super();
//       this.value = 50;
//   }
// }
// class Blue extends Chip {
//   constructor() {
//       super();
//       this.value = 100;
//   }
// }
// class Green extends Chip {
//   constructor() {
//       super();
//       this.value = 500;
//   }
// }
// class Black extends Chip {
//   constructor() {
//       super();
//       this.value = 1000;
//   }
// }

// class Pot extends Wallet {
//   constructor() {
//       this.pot = [];
//   }
// }


// class Quips {
//   constructor(round) {
//       this.round = round;
//       this.msg = this.winOrLose();
//   }

//   winOrLose() {
//       if (this.round.winnerIsUser) {
//           return this.winningQuip();
//       }
//       else {
//           return this.losingQuip();
//       }
//   }

//   winningQuip() {
//       let x = this.round;
//       let msg = `Congratulations! You won a pot of $${x.pot} with your ${x.userHand}! Get ready for the next round!`;
//       return msg;
//   }

//   losingQuip() {
//       let x = this.round;
//       let msg = `Ouch! Your ${x.userHand} was lower than ${x.winner.name}'s ${x.winningHand}! Fork over your $${x.userBet}!`;
//       return msg;
//   }

//   static statusQuip() {
//       return `Let's see who wins this round!`;
//   }
// }