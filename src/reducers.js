import {getPlayers,dealPocket,dealFlop,dealTurnOrRiver,evaluateGame,nextRound} from './backend';

export function gameplayReducer(state,action) {
  const buttonSetter = action.payload.buttonSetter;
  const payload = {buttonSetter};
  switch (action.type) {
    case "GET_PLAYERS":
      const [playerList, user] = getPlayers();
      buttonSetter({type:"DEAL_POCKET", payload});
      return {players: playerList, user};
    case "DEAL_POCKET":
      const pocketState = dealPocket(state);
      buttonSetter({type:"DEAL_FLOP", payload});
      return pocketState;
    case "DEAL_FLOP":
      const flopState = dealFlop(state);
      buttonSetter({type:"DEAL_TURN", payload});
      return flopState;
    case "DEAL_TURN":
      const turnState = dealTurnOrRiver(state, "turn");
      buttonSetter({type:"DEAL_RIVER", payload});
      return turnState;
    case "DEAL_RIVER":
      const riverState = dealTurnOrRiver(state, "river");
      buttonSetter({type:"EVALUATE_GAME", payload});
      return riverState;
    case "EVALUATE_GAME":
      const evaluatedState = evaluateGame(state);
      buttonSetter({type:"NEXT_ROUND", payload});
      return evaluatedState;
    case "NEXT_ROUND":
      const roundState = nextRound(state);
      buttonSetter({type:"DEAL_POCKET", payload});
      return roundState;
    default:
      return state;
  }
}