import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import { CommentBox } from "./CommentBox";
import { CommentItem } from "./CommentItem";
import { getFirestore } from "redux-firestore";
import ConfirmationModal from "./ConfirmationModal";
import {
  deleteProject,
  dislikePost,
  likePost,
  addComment,
  deleteComment
} from "../../store/actions";
import LikeButton from "./LikeButton";
import "../../styles/ProjectDetails.css";

export class ProjectDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHeartAnimation: false,
      project: "",
      likesCount: "",
      likedPostIds: [],
      comments: [],
      modalIsOpen: false
    };

    this.closeModal = () => this.setState({ modalIsOpen: false });
    this.openModal = () => this.setState({ modalIsOpen: true });
  }
  componentDidMount() {
    const projectId = this.props.match.params.id;
    const firestore = getFirestore();
    firestore
      .collection("projects")
      .doc(projectId)
      .onSnapshot(coll => {
        const project = coll.data();
        if (project) {
          const likedPostIds = project.likedPostIds;
          const comments = project.comments;
          this.setState({
            likedPostIds,
            project,
            likesCount: project.likesCount,
            comments
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.liked) {
      this.setState({ showHeartAnimation: false });
    }
  }

  renderLikes() {
    const { likesCount } = this.state;
    if (likesCount > 0) {
      return (
        <div className="ProjectDetails__likes">
          {likesCount} {likesCount === 1 ? "like" : "likes"}
          <br />
          <br />
        </div>
      );
    }
  }

  renderHeartAnimation() {
    if (this.state.showHeartAnimation) {
      return (
        <i className="fa fa-heart fa-2x ProjectDetails__heart-animation-icon" />
      );
    }
  }

  handleEdit = () => {
    const id = this.props.match.params.id;
    const editUrl = `/edit/project/${id}`;
    this.props.history.push(editUrl);
  };

  handleDelete = () => {
    const projectId = this.props.match.params.id;
    this.props.deleteProject(projectId);
    this.props.history.push("/");
    window.location.reload();
  };

  renderComments() {
    const { comments } = this.state;
    const { auth } = this.props;
    const projectId = this.props.match.params.id;
    if (comments) {
      return (
        <div className="ProjectDetails__comments">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              username={comment.username}
              body={comment.body}
              deletable={comment.authorId === auth.uid}
              onDelete={() => this.props.onCommentDelete(projectId, comment.id)}
            />
          ))}
        </div>
      );
    } else {
      return "";
    }
  }

  render() {
    const { project, auth } = this.props;
    const projectId = this.props.match.params.id;
    //console.log(this.state.likedPostIds);
    if (!auth.uid) return <Redirect to="/signin" />;
    if (project) {
      const isSameProjectAuthenticatedUser = project.authorId !== auth.uid;
      return (
        <div className="row">
          <div className="col s12 m18">
            <div className="container section project-details">
              <div className="card z-depth-0">
                <div className="card-content">
                  <span className="card-title">{project.title}</span>
                  <p>{project.content}</p>
                  <br />

                  <ConfirmationModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    onConfirmClick={this.handleDelete}
                    confirmText="Delete Project"
                  />

                  {project.file ? (
                    <img
                      style={{ width: "100%" }}
                      src={project.file}
                      role="presentation"
                    />
                  ) : (
                    ""
                  )}
                  <br />
                  <span>
                    <a
                      className="btn-small right"
                      disabled={isSameProjectAuthenticatedUser}
                      onClick={this.openModal}
                    >
                      Delete
                    </a>
                    <a
                      className="btn-small right"
                      style={{ marginRight: 20 }}
                      disabled={isSameProjectAuthenticatedUser}
                      onClick={this.handleEdit}
                    >
                      Edit
                    </a>
                  </span>
                  <br />
                </div>
                <div className="card-action lighten-4 grey-text">
                  <div>
                    Posted by {project.authorFirstName} {project.authorLastName}
                  </div>
                  <div>{moment(project.createdAt.toDate()).calendar()}</div>
                </div>
                <div className="card-action">
                  {this.renderLikes()}
                  {this.renderComments()}
                  <div className="ProjectDetails__action-box">
                    <div className="ProjectDetails__like-button">
                      {this.state.likedPostIds !== undefined ? (
                        <LikeButton
                          onLike={() => this.props.likePost(projectId)}
                          onDislike={() => this.props.dislikePost(projectId)}
                          liked={
                            this.state.likedPostIds.indexOf(projectId) >= 0
                          }
                        />
                      ) : (
                        ""
                      )}
                      <div className="ProjectDetails__comment-box">
                        <CommentBox
                          onSubmit={commentBody =>
                            this.props.addComment(projectId, commentBody)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container center">
          <p>Loading project...</p>
        </div>
      );
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteProject: projectId => dispatch(deleteProject(projectId)),
    likePost: projectId => dispatch(likePost(projectId)),
    dislikePost: projectId => dispatch(dislikePost(projectId)),
    addComment: (projectId, commentBody) =>
      dispatch(addComment(projectId, commentBody)),
    onCommentDelete: (projectId, comment_id) =>
      dispatch(deleteComment(projectId, comment_id))
  };
};
const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const projects = state.firestore.data.projects;
  const project = projects ? projects[id] : null;
  return {
    project: project,
    auth: state.firebase.auth,
    likesCount: state.project.totalPostLike,
    likedPostIds: state.project.likedPostIds
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
)(ProjectDetails);
