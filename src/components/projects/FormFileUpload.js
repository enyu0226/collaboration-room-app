import React, { Component } from "react";

export class FormFileUpload extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { handleChange, values } = this.props;
    return (
      <div className="container">
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div class="file-field input-field">
          <div
            class="right btn chip purple lighten-3"
            style={{ marginLeft: 20 }}
          >
            <span>Upload</span>
            <input type="file" onChange={handleChange} />
          </div>

          <div class="file-path-wrapper">
            <input
              class="file-path validate"
              type="text"
              id="file"
              placeholder="Upload Project Image (Optional)"
            />
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
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
              onClick={this.continue}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormFileUpload;
