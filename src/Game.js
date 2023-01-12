import "./Game.css";
import { useReducer, useState } from "react";
import { gameplayReducer as reducer } from "./reducers";
import { Button, Col, Container, Row } from "react-bootstrap";
import PlayerPanel from "./PlayerPanel";
import { CardComponent } from "./Card";
import Quips from "./Quips";

function Game() {
  const [state, dispatch] = useReducer(reducer, {});
  const [buttonState, setButtonState] = useState({ type: "GET_PLAYERS" });

  const dispatchAction = {
    ...buttonState,
    payload: { buttonSetter: setButtonState },
  };
  return (
    <Container className="Game">
      <Quips {...state} />
      <Community {...state} />
      <Container>
        <Row>
          <PlayerPanel {...state} />
        </Row>
        <Button onClick={() => dispatch(dispatchAction)}>
          {dispatchAction.type.replace("_", " ")}
        </Button>
      </Container>
    </Container>
  );
}

function Community({ community }) {
  if (!community) return null;

  const { flop, turn, river } = community;
  const cards = [flop, turn, river];
  var renderableCards = [];
  cards.forEach((x) => {
    if (x) renderableCards = [...renderableCards, ...x];
  });

  return (
    <Col className="align-items-center">
      <Row className="community" xs={5}>
        {renderableCards.map((x, i) => {
          return <CardComponent card={x} key={i} />;
        })}
      </Row>
    </Col>
  );
}

export default Game;
