import React, { Component } from "react";
import PropTypes from "prop-types";
export class FormProjectDetails extends Component {
  continue = e => {
    e.preventDefault();
    if (this.props.isFormValid()) {
      this.props.nextStep();
    }
  };

  render() {
    const { values, handleChange, errors, displayErrors } = this.props;
    return (
      <div className="container">
        <div className="row">
          <br />
          <br />
          <h5 className="grey-text text-darken-3 center-align">
            Create a New Project
          </h5>
          <br />
          <div className="input-field">
            <input
              type="text"
              id="title"
              onChange={handleChange}
              value={values.title}
            />
            <label className="active" htmlFor="title">
              Project Title
            </label>
          </div>
          <br />
          <div className="input-field">
            <textarea
              id="content"
              className="materialize-textarea"
              onChange={handleChange}
              value={values.content}
            />
            <label className="active" htmlFor="content">
              Project Content
            </label>
          </div>
          <br />
          <div className="col s4 m5 l5" />
          <div className="col s4 m6 l6">
            <div className="input-field">
              <button
                className="btn chip blue darken-2 center-align"
                onClick={this.continue}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {errors.length > 0 ? (
          <div className="card-action center red-text">
            {displayErrors(errors)}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

FormProjectDetails.propTypes = {
  nextStep: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  displayErrors: PropTypes.func.isRequired
};

export default FormProjectDetails;
