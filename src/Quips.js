export default function Quips(props) {
  return (
    <div>
      <p>
        {phrase(props)}
      </p>
    </div>
  );
}

function phrase(props) {
  const {players,community,roundRank,records,user} = props;

  var content = "Click the button below to play Ferrel Poker!";

  if (players && !records) {
    content = `${user}, click the button below to be dealt in.`;
  } 

  if (players && community && !roundRank) {
    const userObject = players.find(x=>x.name === user);
    const [card1,card2] = userObject.hand.pocket;
    content = `Hopefully ${card1.name} and ${card2.name} will be enough to win, ${user}...`;
  }

  if (roundRank) {
    const winner = roundRank[0].name;
    const winningHand = roundRank[0].hand;
    content = (winner === user) ?  (
      `Congratulations ${user}! You won with ${winningHand}!`
    ) : (
      `Better luck next time... ${winner} won with ${winningHand}.`
    );
  }


  return content;
}