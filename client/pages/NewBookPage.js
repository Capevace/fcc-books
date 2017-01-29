import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

import AlertBox from '../components/AlertBox';
import { Container, Row, Col } from '../components/Grid';
import Loader from '../components/Loader';

class NewBookPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creating: false,
      error: false,
      errorMessage: '',
      formData: {
        question: '',
        options: []
      }
    };

    this.submitForm = this.submitForm.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
  }

  submitForm(event) {
    event.preventDefault();

    this.setState({
      creating: true
    });

    axios
      .post('/api/book', {
        title: this.state.formData.title
      })
      .then(result => {
        browserHistory.push('/my-books');
      })
      .catch(error => {
        console.error(error);
        this.setState({
          creating: false,
          error: true,
          errorMessage: error.response.data
            ? error.response.data.message
            : 'Unknown error.',
          formData: {
            title: ''
          }
        });
      });
  }

  updateTitle(event) {
    this.setState({
      formData: {
        ...this.state.formData,
        title: event.target.value
      }
    });
  }

  renderForm() {
    return (
      <div>
        {this.state.error &&
          <Row>
            <Col xs="12">
              <AlertBox type="danger">{this.state.errorMessage}</AlertBox>
            </Col>
          </Row>
        }
        <Row>
          <Col xs="8">
            <form method="post" onSubmit={this.submitForm}>
              <div className="form-group">
                <label htmlFor="title">Book Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  aria-describedby="titleHelp"
                  placeholder="Enter your book title"
                  value={this.state.formData.title}
                  onChange={this.updateTitle} />
                <small
                  id="titleHelp"
                  className="form-text text-muted">
                  Book Titles can also contain an autor (e.g. "Harry Potter J.K. Rowling").
                </small>
              </div>
              <button type="submit" className="btn btn-primary mt-2">Submit Book</button>
            </form>
          </Col>
          <Col xs="4">
            <p><small>
              When you submit a book, we try to find it in the <a href="https://openlibrary.org">Open Library</a> API,
              to be able to serve metadata. This includes data like the
              book's cover and a better title. Please be aware that for that
              reason, we can only accept the books that are represented in the
              Open Library.
            </small></p>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.state.creating
          ? <Loader label="Submitting Book..." />
          : this.renderForm()
        }
      </Container>
    );
  }
}

export default NewBookPage;
