import React, { Component } from "react";
import PropTypes from "prop-types";

export class FormLocation extends Component {
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
            id="location"
            onChange={handleChange}
            placeholder="Specify Location (Optional)"
            value={values.location}
          />
          <label class="active" htmlFor="location">
            Location
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

FormLocation.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default FormLocation;
