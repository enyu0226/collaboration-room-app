import React, { Component } from "react";
import "flatpickr/dist/themes/dark.css";
import Flatpickr from "flatpickr";
import moment from "moment";

export class FormTimeSlot extends Component {
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  componentDidMount() {
    var component = this;
    let today = moment().format("YYYY-MM-DD");
    Flatpickr(".flatpickr", {
      altInput: true,
      altFormat: "l, F j, Y at h:i K",
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      minDate: today,
      onChange: function(dateObj, dateStr) {
        component.props.handleChange(String(dateObj[0]));
      }
    });
  }

  render() {
    const { values } = this.props;
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
        <label className="active" htmlFor="timeslot">
          Timeslot
        </label>
        <input
          className="input-field"
          type="text"
          id="timeslot"
          class="flatpickr"
          placeholder="Specify Time (Optional)"
          value={values.timeslot}
        />
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

export default FormTimeSlot;
