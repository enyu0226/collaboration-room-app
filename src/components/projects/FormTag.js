import React, { Component } from "react";
import PropTypes from "prop-types";

export class FormTag extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values, handleChange } = this.props;

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
        <div className="input-field">
          <input
            type="text"
            id="tag"
            onChange={handleChange}
            value={values.tag}
            placeholder="Specify Project Tag (Optional). Default to General"
          />
          <label class="active" htmlFor="title">
            Project Tag
          </label>
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

FormTag.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default FormTag;
