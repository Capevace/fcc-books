import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { Row, Col } from '../components/Grid';
import AlertBox from '../components/AlertBox';
import BookBox from '../components/BookBox';
import Loader from '../components/Loader';

class BookGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      books: [],
      error: false
    };

    this.cancelBookRequest = null;
  }

  componentDidMount() {
    axios
      .get('/api/books', {
        cancelToken: new axios.CancelToken((cancelFunction) => {
          this.cancelBookRequest = () => {
            this.cancelBookRequest = null;
            cancelFunction();
          };
        }),
        params: {
          user: this.props.showBooksByUser ? this.props.user._id : null
        }
      })
      .then(result => {
        console.log(result);
        this.setState({
          loading: false,
          books: result.data.books,
          error: false
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error);
          this.setState({
            loading: false,
            books: [],
            error: true
          });
        }
      });
  }

  componentWillUnmount() {
    if (this.cancelBookRequest)
      this.cancelBookRequest();
  }

  trade(id) {
    axios
      .post('/api/trade', {
        cancelToken: new axios.CancelToken((cancelFunction) => {
          this.cancelBookRequest = () => {
            this.cancelBookRequest = null;
            cancelFunction();
          };
        }),
        params: {
          user: this.props.user || null
        }
      })
      .then(result => {
        console.log(result);
        this.setState({
          loading: false,
          books: result.data.books,
          error: false
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error);
          this.setState({
            loading: false,
            books: [],
            error: true
          });
        }
      });
  }

  renderError() {
    return (
      <Row>
        <Col xs={12}>
          <AlertBox type="danger">
            <strong>Error fetching polls.</strong> Please try again later.
          </AlertBox>
        </Col>
      </Row>
    );
  }

  renderBooks() {
    return (
      <Row>
        {this.state.books.length === 0 && <Col xs={12}>No Books found</Col>}

        {this.state.books.map((book, index) => {
          return (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}>
              <BookBox book={book} user={this.props.user} />
            </Col>
          );
        })}
      </Row>
    );
  }

  render() {
    return this.state.loading
      ? <Loader loading />
      : this.state.error
        ? this.renderError()
        : this.renderBooks();
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(BookGrid);
