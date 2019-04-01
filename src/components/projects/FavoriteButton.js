import React, { Component } from "react";
import "./FavoriteButton.css";
class FavoriteButton extends Component {
  constructor(props) {
    super(props);

    // this.handleClick = this._handleClick.bind(this);
  }

  // _handleClick(event) {
  //   event.preventDefault();
  //   if (this.props.favorited) {
  //     this.props.onDisfavor();
  //   } else {
  //     this.props.onFavor();
  //   }
  // }

  render() {
    return (
      // <button className="FavoriteButton__root">
      <button
        className="FavoriteButton__root"
        onClick={this.props.handleFavoriteClick}
      >
        {this.props.favorited ? (
          <i className="fa fa-star fa-2x FavoriteButton__icon" />
        ) : (
          <i className="fa fa-star-o fa-2x fa-2x" />
        )}
      </button>
    );
  }
}

export default FavoriteButton;
