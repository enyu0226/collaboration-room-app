import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class WelcomePage extends Component {
  state = {
    loginUserName: ""
  };

  redirectAfterLoginNameDisplay() {
    setTimeout(() => {
      this.props.history.push("/");
    }, 3000);
  }
  delayDisplayLoginUserName = ({ firstName, lastName }) => {
    setTimeout(() => {
      let loginUserName;
      if (firstName !== undefined && lastName !== undefined) {
        loginUserName = `${firstName} ${lastName}`;
      }
      this.setState({ loginUserName }, () =>
        this.redirectAfterLoginNameDisplay()
      );
    }, 2000);
  };

  render() {
    const { auth, profile } = this.props;
    const { loginUserName } = this.state;
    if (!auth.uid) return <Redirect to="/signin" />;
    this.delayDisplayLoginUserName(profile);
    return (
      <div className="container">
        <div className="row">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="blue-text text-darken-3 center-align">
            <h3>
              Welcome to Collab Room
              {loginUserName && loginUserName !== "undefined undefined"
                ? `, ${loginUserName}`
                : ""}
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(WelcomePage);
