import './Card.css';
import {symbols} from './backend';

function cardDisplay({value,suit}) {
  let suitSymbol = symbols[suit];
  let className = `card card-${suit}`;
  let cardValue = (value.length < 3) ? value : value[0];
  return {suitSymbol,cardValue,className};
}

export function CardComponent({card}) {
  if (!(card instanceof Card)) throw new Error('not passed a Card object');

  const {suitSymbol, cardValue, className} = cardDisplay(card);

  return (
    <div 
      className={className} 
      // onClick={()=>console.log(suitSymbol,cardValue)}
    >
      {suitSymbol}<br/>
      {cardValue}
    </div>
  )
}

export class Card {
  constructor(value,suit) {
    this.value = value;
    this.suit  = suit;
    this.name = `${value} of ${suit}`;
  }
}



