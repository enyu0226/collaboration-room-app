import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import UserListItem from "./UserListItem";

import "../../styles/UsersModal.css";

class UsersModal extends Component {
  render() {
    console.log(this.props.users);
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        contentLabel="UsersModal"
        style={this.getCustomStyles()}
      >
        <div className="UsersModal__following-content">
          <header className="UsersModal__header">
            <h5 className="UsersModal__heading">{this.props.heading}</h5>
          </header>
          <div className="UsersModal__list-container">
            {this.props.users.map((user, index) => (
              <UserListItem key={index} user={user} />
            ))}
          </div>
        </div>
      </Modal>
    );
  }

  getCustomStyles() {
    return {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      },
      content: {
        position: "absolute",
        top: "50%",
        left: "50%",
        right: "initial",
        bottom: "initial",
        transform: "translate(-50%, -50%)",
        border: "none",
        background: "#fff",
        opacity: "0.8",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        borderRadius: "0px",
        outline: "none",
        padding: "0px",
        width: "80%",
        maxWidth: "800px",
        maxHeight: "80vh",
        transition: "all 400ms"
      }
    };
  }
}

UsersModal.propTypes = {
  heading: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default UsersModal;
