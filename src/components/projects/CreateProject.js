import React, { Component } from "react";
import { connect } from "react-redux";
import { createProject } from "../../store/actions";
import { Redirect } from "react-router-dom";
import mime from "mime-types";
import uuidv4 from "uuid/v4";
import firebase from "../../config/fbConfig";
import "./CreateProject.css";
import FormProjectDetails from "./FormProjectDetails";
import FormTimeSlot from "./FormTimeSlot";
import FormLocation from "./FormLocation";
import FormTag from "./FormTag";
import FormFileUpload from "./FormFileUpload";
import Confirm from "./Confirm";
import PropTypes from "prop-types";

class CreateProject extends Component {
  state = {
    step: 1,
    storageRef: firebase.storage().ref(),
    file: null,
    authorized: ["image/jpeg", "image / gif", "image/png", "image/bmp"],
    title: "",
    tag: "General",
    location: "",
    timeslot: "",
    uploadTask: null,
    content: "",
    uploadState: "",
    errors: [],
    isprojectLoading: false,
    isPhotoIncluded: null
  };

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  addFile = event => {
    console.log("add file");
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = async () => {
    const { file } = this.state;
    await this.setState({ isprojectLoading: true });
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        console.log("file is authorized");
        await this.uploadFile(file, metadata);
        // this.clearFile();
      }
    } else {
      await this.setState({ isPhotoIncluded: false });
      const {
        title,
        content,
        location,
        timeslot,
        tag,
        isPhotoIncluded
      } = this.state;

      const project = {
        title,
        content,
        location,
        timeslot,
        tag,
        isPhotoIncluded
      };
      await this.props.createProject(project);
      await this.setState({ isprojectLoading: false });
      this.props.history.push("/");
      this.clearFile();
    }
  };

  isAuthorized = filename =>
    this.state.authorized.includes(mime.lookup(filename));

  clearFile = () => this.setState({ file: null });
  uploadFile = (file, metadata) => {
    const filePath = `project_image/public/${uuidv4()}.jpg`;
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              // isprojectLoading: false,
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.setState({ file: downloadUrl, isPhotoIncluded: true });
                const {
                  file,
                  title,
                  content,
                  tag,
                  location,
                  timeslot,
                  isPhotoIncluded
                } = this.state;
                const project = {
                  file,
                  title,
                  content,
                  tag,
                  location,
                  timeslot,
                  isPhotoIncluded
                };
                this.props.createProject(project);
                console.log("downloadurl");
              })
              .then(() => {
                this.props.history.push("/");
              })

              .catch(err => {
                console.error(err);
                this.setState({
                  // isprojectLoading: false,
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleTimeChange = time => {
    this.setState({
      timeslot: time
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.sendFile();
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isRequiredFormFieldAllEmpty(this.state)) {
      error = { message: "Please fill in title and content" };
      this.setState({ errors: errors.concat(error) });
      document.getElementById("title").classList.add("invalid");
      document.getElementById("content").classList.add("invalid");

      return false;
    } else if (this.isFormTitleEmpty(this.state)) {
      document.getElementById("title").classList.add("invalid");
      error = { message: "Please fill in title" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (this.isFormContentEmpty(this.state)) {
      document.getElementById("content").classList.add("invalid");
      error = { message: "Please fill in content" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isRequiredFormFieldAllEmpty = ({ content, title }) => {
    return !title.length && !content.length;
  };

  isFormTitleEmpty = ({ title }) => {
    return !title.length;
  };

  isFormContentEmpty = ({ content }) => {
    return !content.length;
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  componentDidUpdate(prevProps, prevState) {
    //add whatever comparison logic you need here
    if (this.state.content !== prevState.content) {
      document.getElementById("content").classList.remove("invalid");
    }
    if (this.state.title !== prevState.title) {
      document.getElementById("title").classList.remove("invalid");
    }
  }

  render() {
    const { title, tag, location, timeslot, content, file } = this.state;
    const values = { title, tag, location, timeslot, content, file };
    const { errors, step, isprojectLoading, isPhotoIncluded } = this.state;
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;

    switch (step) {
      case 1:
        return (
          <FormProjectDetails
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
            errors={errors}
            displayErrors={this.displayErrors}
            isFormValid={this.isFormValid}
          />
        );
      case 2:
        return (
          <FormTimeSlot
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleTimeChange}
            values={values}
          />
        );
      case 3:
        return (
          <FormLocation
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 4:
        return (
          <FormTag
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 5:
        return (
          <FormFileUpload
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.addFile}
            values={values}
          />
        );
      case 6:
        return (
          <Confirm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            onSubmit={this.handleSubmit}
            values={values}
            isUploadingProject={isprojectLoading}
            isPhotoIncluded={isPhotoIncluded}
          />
        );
    }
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createProject: project => dispatch(createProject(project))
  };
};
CreateProject.propTypes = {
  project: PropTypes.object.isRequired,
  createProject: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProject);
