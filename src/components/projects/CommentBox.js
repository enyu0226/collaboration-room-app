import React, { Component } from "react";
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import "../../styles/EmojiButton.css";
import "../../styles/MicrophoneButton.css";

// //-----------------SPEECH RECOGNITION SETUP---------------------

// var recognition = new (window.SpeechRecognition ||
//   window.webkitSpeechRecognition ||
//   window.mozSpeechRecognition ||
//   window.msSpeechRecognition)();
// recognition.continous = true;
// recognition.lang = "en-US";
// recognition.interimResults = true;
// //------------------------COMPONENT-----------------------------

export class CommentBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBody: "",
      emojiPicker: false
      // listening: false
    };

    // this.toggleListen = this.toggleListen.bind(this);
    // this.handleListen = this.handleListen.bind(this);

    this.onCommentChange = event =>
      this.setState({ commentBody: event.target.value });
    this.handleKeyDown = this._handleKeyDown.bind(this);
  }

  // toggleListen() {
  //   this.setState(
  //     {
  //       listening: !this.state.listening
  //     },
  //     this.handleListen
  //   );

  //   setTimeout(() => {
  //     this.setState(
  //       {
  //         listening: false
  //       },
  //       () => {
  //         recognition.stop();
  //         recognition.onend = () => {
  //           console.log("Stopped listening per click");
  //         };
  //       }
  //     );
  //   }, 5000);
  // }

  // handleListen() {
  //   console.log("listening?", this.state.listening);

  //   if (this.state.listening) {
  //     recognition.start();
  //     recognition.onend = () => {
  //       console.log("...continue listening...");
  //       recognition.start();
  //     };
  //   } else {
  //     recognition.stop();
  //     recognition.onend = () => {
  //       console.log("Stopped listening per click");
  //     };
  //   }

  //   recognition.onstart = () => {
  //     console.log("Listening!");
  //   };

  //   let finalTranscript = "";
  //   recognition.onresult = event => {
  //     let interimTranscript = "";

  //     for (let i = event.resultIndex; i < event.results.length; i++) {
  //       const transcript = event.results[i][0].transcript;
  //       if (event.results[i].isFinal) finalTranscript += transcript + " ";
  //       else interimTranscript += transcript;
  //     }
  //     if (document.getElementById("interim")) {
  //       document.getElementById("interim").innerHTML = interimTranscript;
  //     }
  //     this.setState({ commentBody: finalTranscript });

  //     //-------------------------COMMANDS------------------------------------

  //     const transcriptArr = finalTranscript.split(" ");
  //     const stopCmd = transcriptArr.slice(-3, -1);
  //     console.log("stopCmd", stopCmd);

  //     if (stopCmd[0] === "stop" && stopCmd[1] === "listening") {
  //       recognition.stop();
  //       recognition.onend = () => {
  //         console.log("Stopped listening per command");
  //         const finalText = transcriptArr.slice(0, -3).join(" ");
  //         this.setState({ commentBody: finalText });
  //       };
  //     }
  //   };

  //   //-----------------------------------------------------------------------

  //   recognition.onerror = event => {
  //     console.log("Error occurred in recognition: " + event.error);
  //   };
  // }

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

  componentWillUnmount() {
    // this.setState(
    //   {
    //     listening: false
    //   },
    //   () => {
    //     recognition.stop();
    //     recognition.onend = () => {
    //       console.log("Stopped listening per click");
    //     };
    //   }
    // );
  }

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
            {/* <button
              className="MicrophoneButton__root"
              onClick={this.toggleListen}
            >
              {listening ? (
                <i class="fa fa-microphone MicrophoneButton__icon--afterClick fa-2x" />
              ) : (
                <i class="fa fa-microphone fa-2x" />
              )}
            </button> */}
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

        <div>
          {listening
            ? "Make sure to turn off microphone before you leave!"
            : ""}
          <div id="interim" />
        </div>
      </div>
    );
  }
}

export default CommentBox;
