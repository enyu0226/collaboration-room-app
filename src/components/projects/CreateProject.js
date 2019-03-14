import React, { Component } from "react";
import { connect } from "react-redux";
import { createProject } from "../../store/actions";
import { Redirect } from "react-router-dom";
import mime from "mime-types";
import uuidv4 from "uuid/v4";
import firebase from "../../config/fbConfig";

class CreateProject extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    file: null,
    authorized: ["image/jpeg", "image / gif", "image/png", "image/bmp"],
    title: "",
    uploadTask: null,
    content: "",
    uploadState: ""
  };

  addFile = event => {
    console.log("add file");
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        console.log("file is authorized");
        this.uploadFile(file, metadata);
        this.clearFile();
      }
    } else {
      const { title, content } = this.state;
      const project = {
        title,
        content
      };
      this.props.createProject(project);
      this.props.history.push("/");
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
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.setState({ file: downloadUrl });
                const { file, title, content } = this.state;
                const project = {
                  file,
                  title,
                  content
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

  handleSubmit = e => {
    e.preventDefault();
    this.sendFile();
  };

  render() {
    console.log(this.state.file);
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Create a New Project</h5>
          <div className="input-field">
            <input type="text" id="title" onChange={this.handleChange} />
            <label htmlFor="title">Project Title</label>
          </div>
          <div className="input-field">
            <textarea
              id="content"
              className="materialize-textarea"
              onChange={this.handleChange}
            />
            <label htmlFor="content">Project Content</label>
          </div>
          <div class="file-field input-field">
            <div class="right btn-small purple" style={{ marginLeft: 20 }}>
              <span>Upload</span>
              <input type="file" onChange={this.addFile} />
            </div>

            <div class="file-path-wrapper">
              <input
                class="file-path validate"
                type="text"
                placeholder="Upload Project Image (Optional)"
              />
            </div>
          </div>

          <div className="input-field">
            <button className="btn pink lighten-1">Create</button>
          </div>
        </form>
      </div>
    );
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateProject);
