import React from 'react';
import { Row, Col } from '../components/Grid';
import TradeCreator from '../components/TradeCreator';

function TradesPage({ params }) {
  return (
    <div>
      <Row className="mb-4">
        <Col xs={12}>
          <h2>Request Trade</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <TradeCreator bookId={params.id} />
        </Col>
      </Row>
    </div>
  );
}

export default TradesPage;
