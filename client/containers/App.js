import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import { Container, Col, Row } from '../components/Grid';
import LoginContainer from '../components/LoginContainer';

function App({ children, loading, isLoggedIn }) {
  return (
    <div>
      <Header />
      <Container className="mt-4">
        {loading
          ? 'Loading'
          : isLoggedIn
            ? children
            : <LoginContainer />
        }
      </Container>
      <Container className="mt-5">
        <Row>
          <Col xs={12}>
            <p>
              Made by Lukas von Mateffy (
                <a href="https://twitter.com/Capevace">@Capevace</a>&nbsp;|&nbsp;
                <a href="http://smoolabs.com">smoolabs.com</a>&nbsp;|&nbsp;
                <a href="https://github.com/Capevace">GitHub</a>
              )
            </p>
          </Col>
        </Row>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading > 0,
    isLoggedIn: state.auth.isLoggedIn
  };
};

export default connect(mapStateToProps)(App);
