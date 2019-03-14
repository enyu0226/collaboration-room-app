import React, { Component } from "react";
import ConfirmationModal from "./ConfirmationModal";
import "../../styles/CommentItem.css";
import PropTypes from "prop-types";

export class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };

    this.closeModal = () => this.setState({ modalIsOpen: false });
    this.openModal = () => this.setState({ modalIsOpen: true });
  }
  renderBody() {
    const words = this.props.body.split(/\s+/);
    return (
      <span>
        {words.map((word, idx) => {
          return ` ${word}`;
        })}
      </span>
    );
  }

  render() {
    const { username } = this.props;
    return (
      <div className="CommentItem__root">
        <strong>{username}</strong> {this.renderBody()}
        {this.props.deletable === true ? (
          <span className="CommentItem__delete-button" onClick={this.openModal}>
            <i className="fa fa-times" />
          </span>
        ) : null}
        {this.props.deletable === true ? (
          <ConfirmationModal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            onConfirmClick={this.props.onDelete}
            confirmText="Delete Comment"
          />
        ) : null}
      </div>
    );
  }
}

export default CommentItem;

CommentItem.propTypes = {
  username: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  deletable: PropTypes.bool.isRequired,
  onDelete: PropTypes.func
};

CommentItem.defaultProps = {
  deletable: false
};
