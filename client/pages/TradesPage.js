import React from 'react';
import { Row, Col } from '../components/Grid';
import TradesContainer from '../components/TradesContainer';

function TradesPage() {
  return (
    <div>
      <Row className="mb-4">
        <Col xs={12}>
          <h2>Trades</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TradesContainer />
        </Col>
      </Row>
    </div>
  );
}

export default TradesPage;
