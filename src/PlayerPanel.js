import { Container, Row } from 'react-bootstrap';
import Avatar from './Avatar';

export default function PlayerPanel({players}) {
  if (!players) return null;

  const rowClass = "align-items-center justify-content-between";
  
  function Avatars() {
    return (
      players?.map((x,i)=>{
        return (
          <div key={i}>
            <Row className={rowClass}>
              <Avatar {...x}/>
            </Row>
          </div>
        )
      })
    )
  }

  return (
    <Container style={{padding: "15px"}} className="player-panel">
      <Avatars/>
    </Container>
  )
}