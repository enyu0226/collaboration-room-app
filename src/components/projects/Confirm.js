import React, { Component } from "react";
import "../../styles/Confirm.css";
export class Confirm extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };
  removeTextinButton = async () => {
    let removeText = (document.querySelector("#confirm").innerText = "");
    await removeText;
  };
  render() {
    const {
      values: { title, tag, location, timeslot, content, file },
      isUploadingProject
    } = this.props;
    return (
      <div class="confirm">
        <div class="container">
          <div class="card z-depth-3">
            <br />
            <h2 class="subheader blue-text text-darken-2 center-align">
              Confirmation
            </h2>
            <br />
            <hr />
            <br />
            <ul class="list">
              <li class="waves-effect">
                <div class="valign-wrapper">
                  <i class="material-icons left circle white-text">info</i>
                  <div class="title">
                    Title
                    <br />
                    <span>{title}</span>
                  </div>
                </div>
              </li>
              <br />
              <li class="waves-effect">
                <div class="valign-wrapper">
                  <i class="material-icons left circle white-text">info</i>
                  <div class="title">
                    Content
                    <br />
                    <span>{content}</span>
                  </div>
                </div>
              </li>
              <br />
              <li class="waves-effect">
                <div class="valign-wrapper">
                  <i class="material-icons left circle white-text">info</i>
                  <div class="title">
                    Timeslot
                    <br />
                    <span>{timeslot}</span>
                  </div>
                </div>
              </li>
              <br />
              <li class="waves-effect">
                <div class="valign-wrapper">
                  <i class="material-icons left circle white-text">info</i>
                  <div class="title">
                    Location
                    <br />
                    <span>{location}</span>
                  </div>
                </div>
              </li>
              <br />
              <li class="waves-effect">
                <div class="valign-wrapper">
                  <i class="material-icons left circle white-text">info</i>
                  <div class="title">
                    Tag
                    <br />
                    <span>{tag}</span>
                  </div>
                </div>
              </li>
              <br />
              <li class="waves-effect">
                <div class="valign-wrapper">
                  <i class="material-icons left circle white-text">info</i>
                  <div class="title">
                    Photo
                    <br />
                    <span>{file ? "Yes" : "No"}</span>
                  </div>
                </div>
              </li>
            </ul>
            <br />
            <br />
          </div>
        </div>
        <div className="container">
          <div className="col s3 m5 l5" />
          <div className="col s3 m6 l6">
            <div className="chip-btn">
              <button
                className="btn chip blue darken-2 center-align"
                onClick={this.back}
              >
                >
              </button>

              <button
                className="btn chip blue darken-2 center-align right"
                id="confirm"
                onClick={this.props.onSubmit}
                disabled={isUploadingProject}
              >
                {isUploadingProject ? <i class="fa fa-refresh fa-spin" /> : ""}{" "}
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirm;
