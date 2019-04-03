import React, { Component } from "react";
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "../../styles/EmojiButton.css";
import "../../styles/MicrophoneButton.css";

export class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: "",
      emojiPicker: false
    };

    this.onCommentChange = event =>
      this.setState({ commentBody: event.target.value });
    this.handleKeyDown = this._handleKeyDown.bind(this);
  }

  _handleKeyDown(event) {
    if (event.which === 13 && this.state.commentBody.trim().length > 0) {
      this.props.onSubmit(this.state.commentBody);
      this.setState({ commentBody: "" });
      this.commentInput.blur();
    }
  }

  handleTogglePicker = () => {
    this.setState({ emojiPicker: !this.state.emojiPicker });
  };

  handleFocus = event => {
    var val = event.target.value;
    event.target.value = "";
    event.target.value = val;
  };

  handleAddEmoji = emoji => {
    const oldMessage = this.state.commentBody;
    const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `);
    this.setState({ commentBody: newMessage, emojiPicker: false });
    setTimeout(() => this.commentInput.focus(), 0);
  };

  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  render() {
    const { emojiPicker, listening } = this.state;
    return (
      <div>
        <div className="CommentBox__root">
          <span>
            <input
              className="CommentBox__input"
              type="text"
              placeholder="Add a comment..."
              value={this.state.commentBody}
              onChange={this.onCommentChange}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleFocus}
              ref={ref => {
                this.commentInput = ref;
              }}
            />
            <button
              className="EmojiButton__root"
              onClick={this.handleTogglePicker}
            >
              {emojiPicker ? (
                <i class="fa fa-smile-o fa-2x EmojiButton__icon--afterClick " />
              ) : (
                <i class="fa fa-smile-o fa-2x " />
              )}
            </button>{" "}
          </span>
        </div>
        {emojiPicker && (
          <Picker
            set="apple"
            onSelect={this.handleAddEmoji}
            style={{ position: "relative", bottom: "0px", right: "22.5px" }}
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
          />
        )}
      </div>
    );
  }
}

export default CommentBox;
