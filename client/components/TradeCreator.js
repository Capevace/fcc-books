import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

import { Row, Col } from './Grid';
import AlertBox from './AlertBox';
import BookBox from './BookBox';
import Loader from './Loader';

class TradeCreator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creating: false,
      book: {},
      error: false,
      message: ''
    };

    this.submitRequest = this.submitRequest.bind(this);
    this.cancelTradeRequest = null;
  }

  componentDidMount() {
    console.info(this.props.bookId);
    axios
      .get(`/api/book/${this.props.bookId}`, {
        cancelToken: new axios.CancelToken((cancelFunction) => {
          this.cancelTradeRequest = () => {
            this.cancelTradeRequest = null;
            cancelFunction();
          };
        })
      })
      .then(result => {
        console.info(result);
        this.setState({
          loading: false,
          book: result.data.book,
          error: false,
          message: ''
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error);
          this.setState({
            loading: false,
            book: {},
            error: true,
            message: error.response && error.response.data
              ? error.response.data.message
              : 'Unknown error.'
          });
        }
      });
  }

  componentWillUnmount() {
    if (this.cancelTradeRequest)
      this.cancelTradeRequest();
  }

  submitRequest() {
    axios
      .post('/api/trade', {
        book: this.props.bookId
      })
      .then(result => {
        browserHistory.push('/trades');
      })
      .catch(error => {
        console.error(error);
        this.setState({
          loading: false,
          book: {},
          error: true,
          message: error.response && error.response.data
            ? error.response.data.message
            : 'Unknown error.'
        });
      })
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

  renderForm() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <h5>Book</h5>
                  </td>
                  <td>
                    <h5><small>{this.state.book.title}</small></h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Current Owner</h5>
                  </td>
                  <td>
                    <h5><small>{this.state.book.ownerDisplayName}</small></h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={12}>
            <button
              onClick={this.submitRequest}
              className="btn btn-primary">
              Submit Trade Requests
            </button>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return this.state.loading
      ? <Loader loading />
      : this.state.message
        ? this.renderError()
        : this.renderForm();
  }
}

export default TradeCreator;
