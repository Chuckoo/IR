import shiva from "./assets/Shiva.png";
import React from "react";
import { Col, Row } from "antd";
import { Card } from "antd";
const { Meta } = Card;

function MyCard(props) {
  return (
    <>
      <Row>
        <Card
          hoverable
          style={{
            width: 1000,
          }}
        >
          <Col span={12}>
            <img
              alt="image not found"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              width={240}
            />
          </Col>
          <Col span={12}>
            <Meta title={props.title} description={props.content} />
          </Col>
        </Card>
      </Row>
    </>
  );
}

export default MyCard;
