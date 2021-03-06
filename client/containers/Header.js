import React from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import activeComponent from 'react-router-active-component';
import { Container } from '../components/Grid';


const NavBarLinkContainer = activeComponent('li', { linkClassName: 'nav-link' });
const NavBarLink = (props) => <NavBarLinkContainer className="nav-item" {...props}>{props.children}</NavBarLinkContainer>

function Header({ loading, isLoggedIn, user }) {
  return (
    <nav className="navbar navbar-toggleable-md navbar-inverse bg-primary">
      <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <Link className="navbar-brand" to="/">
        <img
          style={{
            width: '200px'
          }}
          className="mr-1"
          src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg" />
        <b>- Book Club</b>
      </Link>

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav ml-auto mt-2 mt-md-0">
          {isLoggedIn && user
            ? (
              <span style={{ display: 'inherit' }}>
                <NavBarLink to="/" onlyActiveOnIndex>Submitted Books</NavBarLink>
                <NavBarLink to="/my-books" onlyActiveOnIndex>My Books</NavBarLink>
                <NavBarLink to="/trades" onlyActiveOnIndex>Trades</NavBarLink>
                <NavBarLink to="/submit-book" onlyActiveOnIndex>Submit Book</NavBarLink>
                <li className="mx-3"></li>
                <NavBarLink to="/settings" onlyActiveOnIndex>Settings</NavBarLink>
              </span>
            )
            : ''
          }

          {loading
            ? <li><a className="nav-link">Loading...</a></li>
            : (
              isLoggedIn
                ? <li>
                    <a
                      className="nav-link"
                      href="/auth/logout">
                      Logout
                    </a>
                  </li>
                : <li>
                    <a
                      className="btn btn-outline-secondary my-2 my-sm-0"
                      href="/auth/twitter">
                      Login with Twitter
                    </a>
                  </li>
            )
          }
        </ul>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => {
  console.log('state', state);
  return {
    user: state.auth.user,
    isLoggedIn: state.auth.isLoggedIn,
    loading: state.loading > 0
  };
};

export default connect(mapStateToProps)(Header);
