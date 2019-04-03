import React, { Component } from "react";
import UsersModal from "./UsersModal";

class LikersModal extends Component {
  render() {
    return (
      <UsersModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        users={this.props.likers}
        heading="People who liked this post"
      />
    );
  }
}

export default LikersModal;
