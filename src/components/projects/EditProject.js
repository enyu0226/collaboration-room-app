import React, { Component } from "react";
import { connect } from "react-redux";
import { editProject, getProject } from "../../store/actions";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import ConfirmationModal from "./ConfirmationModal";

class EditProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
      modalIsOpen: false
    };

    this.closeModal = () => this.setState({ modalIsOpen: false });
    this.openModal = () => this.setState({ modalIsOpen: true });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleClick = () => {
    const projectId = this.props.match.params.id;
    this.props.history.push(`/project/${projectId}`);
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleEdit = async () => {
    const projectId = this.props.match.params.id;
    await this.props.editProject(this.state, projectId);
    this.props.history.push("/");
    window.location.reload();
  };

  componentDidMount() {
    const projectId = this.props.match.params.id;
    console.log(this.props.match.params);
    console.log(projectId);
    this.props.getProject(projectId, this);
  }

  render() {
    const { auth } = this.props;
    const { title, content } = this.state;
    if (!auth.uid) return <Redirect to="/signin" />;
    return (
      <div className="container">
        <ConfirmationModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          onConfirmClick={this.handleEdit}
          confirmText="Confirm Edit"
        />

        <form className="white z-depth-3" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Edit Exisitng Project</h5>
          <div className="input-field">
            <input
              type="text"
              id="title"
              onChange={this.handleChange}
              value={title}
            />
            <label htmlFor="title" />
          </div>
          <div className="input-field">
            <textarea
              id="content"
              className="materialize-textarea"
              onChange={this.handleChange}
              value={content}
            />
            <label htmlFor="content" />
          </div>
          <div className="input-field">
            <button
              className="btn chip purple lighten-1"
              onClick={this.openModal}
            >
              Edit
            </button>
            <button
              className="btn chip purple lighten-1"
              onClick={this.handleClick}
              style={{ marginLeft: 20 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProject: (projectId, obj) => dispatch(getProject(projectId, obj)),
    editProject: (project, projectId) =>
      dispatch(editProject(project, projectId))
  };
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const projects = state.firestore.data.projects;
  const project = projects ? projects[id] : "";
  return {
    project: project,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect([
    {
      collection: "projects"
    }
  ])
)(EditProject);
