import React from 'react';
import { Row, Col } from '../components/Grid';

function LoginContainer() {
  return (
    <div>
      <Row className="mb-5">
        <Col xs={12}>
          <h2>Login</h2>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col
          xs={12}
          className="d-flex justify-content-center align-items-center align-content-center"
          style={{ height: '100px' }}>
          <a
            className="btn btn-primary"
            href="/auth/twitter">
            Login with Twitter
          </a>
        </Col>
      </Row>
    </div>
  );
}

export default LoginContainer;
