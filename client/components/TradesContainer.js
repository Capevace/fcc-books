import React from 'react';
import axios from 'axios';
import { Link, browserHistory } from 'react-router';

import { Row, Col } from './Grid';
import AlertBox from './AlertBox';
import BookBox from './BookBox';
import Loader from './Loader';
import TradeBox from './TradeBox';

class TradesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      trades: {
        byUser: [],
        toUser: [],
        accepted: []
      },
      error: false,
      message: ''
    };

    this.acceptTrade = this.acceptTrade.bind(this);
    this.cancelTradeRequest = null;
  }

  componentDidMount() {
    axios
      .get('/api/trades', {
        cancelToken: new axios.CancelToken((cancelFunction) => {
          this.cancelTradeRequest = () => {
            this.cancelTradeRequest = null;
            cancelFunction();
          };
        })
      })
      .then(result => {
        this.setState({
          loading: false,
          trades: {
            byUser: result.data['trades-by-user'],
            toUser: result.data['trades-to-user'],
            accepted: result.data['accepted-trades']
          },
          error: false
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error);
          this.setState({
            loading: false,
            trades: {
              byUser: [],
              toUser: [],
              accepted: []
            },
            error: true,
            message: error.response && error.response.data
              ? error.response.data.message
              : ''
          });
        }
      });
  }

  componentWillUnmount() {
    if (this.cancelTradeRequest)
      this.cancelTradeRequest();
  }

  acceptTrade(tradeId) {
    console.log(tradeId);
    axios
      .post(`/api/trade/${tradeId}`)
      .then(result => {
        console.log(result);
        browserHistory.push('/my-books');
      })
      .catch(error => {
        console.error(error);
        this.setState({
          loading: false,
          error: true,
          message: error.response && error.response.data
            ? error.response.data.message
            : ''
        });
      });
  }

  renderError() {
    return (
      <Row>
        <Col xs={12}>
          <AlertBox type={this.state.error ? 'danger' : 'info'}>
            {this.state.message}
          </AlertBox>
        </Col>
      </Row>
    );
  }

  renderTrades() {
    return (
      <div>
        {/* By User */}
        <Row>
          <Col xs={12}>
            <h3 className="mb-4">Trades By User</h3>
          </Col>
        </Row>
        <Row>
          {this.state.trades.byUser.length === 0 &&
            <Col xs={12}><p>No Trades yet</p></Col>
          }
          {this.state.trades.byUser.map((trade, index) =>
            <Col xs={3} key={index}>
              <TradeBox trade={trade} isByUser />
            </Col>
          )}
        </Row>

        {/* To User */}
        <Row>
          <Col xs={12}>
            <h3 className="mb-4">Trades To User</h3>
          </Col>
        </Row>
        <Row>
          {this.state.trades.toUser.length === 0 &&
            <Col xs={12}><p>No Trades yet</p></Col>
          }
          {this.state.trades.toUser.map((trade, index) =>
            <Col xs={3} key={index}>
              <TradeBox trade={trade} onAccept={() => this.acceptTrade(trade._id)} />
            </Col>
          )}
        </Row>

        {/* Accepted */}
        <Row>
          <Col xs={12}>
            <h3 className="mb-4">Accepted Trades</h3>
          </Col>
        </Row>
        <Row>
          {this.state.trades.accepted.length === 0 &&
            <Col xs={12}><p>No Trades yet</p></Col>
          }
          {this.state.trades.accepted.map((trade, index) =>
            <Col xs={3} key={index}>
              <TradeBox trade={trade} />
            </Col>
          )}
        </Row>
      </div>
    );
  }

  render() {
    return this.state.loading
      ? <Loader loading />
      : this.state.message
        ? this.renderError()
        : this.renderTrades();
  }
}

export default TradesContainer;
