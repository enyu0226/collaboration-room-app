import React, { Component } from "react";
import "../../styles/LikeButton.css";

class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this._handleClick.bind(this);
  }

  _handleClick(event) {
    event.preventDefault();
    if (this.props.liked) {
      this.props.onDislike();
    } else {
      this.props.onLike();
    }
  }

  render() {
    return (
      <button className="LikeButton__root" onClick={this.handleClick}>
        {this.props.liked ? (
          <i className="fa fa-heart fa-2x LikeButton__icon LikeButton__icon--liked" />
        ) : (
          <i className="fa fa-heart-o fa-2x LikeButton__icon" />
        )}
      </button>
    );
  }
}

export default LikeButton;
