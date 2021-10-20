import { Col, Row } from 'react-bootstrap';
import {CardComponent} from './Card';
import {User} from './backend';
import Image from './Image';

export default function Avatar(props) {
  const {imgUrl,name,hand} = props;

  const userClass = "avatar-" + ((props instanceof User) ? "user" : "opponent");

  const imageProp = {userClass,imgUrl};
  
  return (
    <>
      <Col className="align-self-start">
        <Row>
          <Image {...imageProp}/>
          <Col>
            <Row xs={2}>
              {hand.pocket && hand.pocket.map((x,i)=>{
                return (<CardComponent card={x} key={i}/>)
              })}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs="auto" className="align-self-end">
        <h5 >{name}</h5>
      </Col>
    </>
  );
}