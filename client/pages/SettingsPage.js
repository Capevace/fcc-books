import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { browserHistory } from 'react-router';

import AlertBox from '../components/AlertBox';
import { Container, Row, Col } from '../components/Grid';
import Loader from '../components/Loader';

class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props.user);

    this.state = {
      loading: false,
      error: false,
      errorMessage: '',
      formData: {
        name: this.props.user.displayName,
        city: this.props.user.city,
        state: this.props.user.state
      }
    };

    this.submitForm = this.submitForm.bind(this);
    this.updateForm = this.updateForm.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.user !== newProps.user) {
      this.setState({
        formData: {
          name: newProps.user.displayName,
          city: newProps.user.city,
          state: newProps.user.state
        }
      });
    }
  }

  submitForm(event) {
    event.preventDefault();

    this.setState({
      loading: true
    });

    axios
      .post('/auth/user/settings', {
        displayName: this.state.formData.name,
        city: this.state.formData.city,
        state: this.state.formData.state
      })
      .then(result => {
        if (result.data.user) {
          this.props.updateUser(result.data.user);
          this.setState({
            loading: false,
            error: false
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          loading: false,
          error: true,
          errorMessage: error.response && error.response.data
            ? error.response.data.message
            : 'Unknown error.',
          formData: {
            title: ''
          }
        });
      });
  }

  updateForm(key, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        [key]: value
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
                <label htmlFor="name">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="nameHelp"
                  placeholder="Enter your name"
                  value={this.state.formData.name}
                  required
                  onChange={e => this.updateForm('name', e.target.value)} />
                <small
                  id="nameHelp"
                  className="form-text text-muted">
                  Your Name will be displayed to users you initiate trades with.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  placeholder="Enter your city"
                  value={this.state.formData.city}
                  onChange={e => this.updateForm('city', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  className="form-control"
                  id="state"
                  placeholder="Enter your city"
                  value={this.state.formData.state}
                  onChange={e => this.updateForm('state', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary mt-2">Save Settings</button>
            </form>
          </Col>
          <Col xs="4">
            <p><small>
              The City and the State are private data. It will not be shown to other users.
            </small></p>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.state.loading
          ? <Loader label="Saving Settings..." />
          : this.renderForm()
        }
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: user => {
      dispatch({
        type: 'LOGIN_STATUS_CHANGE',
        user
      });
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
