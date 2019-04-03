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
import firebase from "../../config/fbConfig";
import {
  deleteProject,
  dislikePost,
  likePost,
  addComment,
  deleteComment,
  favoritePost,
  disFavorPost
} from "../../store/actions";
import PropTypes from "prop-types";
import LikeButton from "./LikeButton";
import "../../styles/ProjectDetails.css";
import _ from "lodash";
import FavoriteButton from "./FavoriteButton";
import LikersModal from "./LikersModal";

export class ProjectDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showHeartAnimation: false,
      project: "",
      likesCount: "",
      likedPostIds: [],
      comments: [],
      modalIsOpen: false,
      favoritedPostIds: [],
      userFavoritedPostId: false,
      isFavoriteButtonDisabled: false,
      userLikedPostId: false,
      imageHits: null,
      IsFetchingLikers: false,
      likersName: [],
      likersModalIsOpen: false,
      likersModalPostId: null
    };

    this.closeModal = () => this.setState({ modalIsOpen: false });
    this.openModal = () => this.setState({ modalIsOpen: true });
    this.unsubscribe;
  }
  componentDidMount() {
    const projectId = this.props.match.params.id;
    const firestore = getFirestore();
    const currentUser = firebase.auth().currentUser.uid;
    this.unsubscribe = firestore
      .collection("projects")
      .doc(projectId)
      .onSnapshot(coll => {
        const project = coll.data();
        if (project) {
          const likedPostIds = project.likedPostIds;
          const comments = project.comments;
          const favoritedPostIds = project.favoritePostIds;
          let userFavoritedPostId;
          let userLikedPostId;
          // console.log(project.hasOwnProperty(currentUser));
          if (project.hasOwnProperty(currentUser)) {
            if (project[currentUser].hasOwnProperty("favorite")) {
              userFavoritedPostId = project[currentUser].favorite;
            } else {
              userFavoritedPostId = false;
            }
            userLikedPostId = project[currentUser].like;
            // console.log(project[currentUser].favorite);
          } else {
            userFavoritedPostId = false;
            userLikedPostId = false;
          }
          this.setState({
            likedPostIds,
            project,
            likesCount: project.likesCount,
            comments,
            favoritedPostIds,
            userFavoritedPostId,
            userLikedPostId
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.liked) {
      this.setState({ showHeartAnimation: false });
    }
  }

  renderLikes(projectId) {
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

  async handleFavoriteClick(event, projectId) {
    event.preventDefault();
    if (this.state.userFavoritedPostId) {
      this.setState(
        {
          isFavoriteButtonDisabled: true
        },
        this.props.disFavorPost(projectId)
      );
      setTimeout(
        () => this.setState({ isFavoriteButtonDisabled: false }),
        2000
      );
    } else {
      this.setState(
        {
          isFavoriteButtonDisabled: true
        },
        this.props.favoritePost(projectId)
      );

      setTimeout(
        () => this.setState({ isFavoriteButtonDisabled: false }),
        2000
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
  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  handleEdit = () => {
    const id = this.props.match.params.id;
    const editUrl = `/edit/project/${id}`;
    this.props.history.push(editUrl);
  };

  handleDelete = async () => {
    let component = this;
    const projectId = this.props.match.params.id;
    await this.props.deleteProject(projectId, component);
  };

  openLikersModal = postId => {
    this.setState({
      likersModalIsOpen: true,
      likersModalPostId: postId
    });
  };

  closeLikersModal = () => {
    this.setState({
      likersModalIsOpen: false,
      likersModalPostId: null
    });
  };

  cacheHitImage = (project, projectId) => {
    if (project.file) {
      const cacheHits = window.localStorage.getItem(
        `${projectId}-img`,
        project.file
      );
      if (cacheHits) {
        return cacheHits;
      } else {
        window.localStorage.setItem(`${projectId}-img`, project.file);
        return null;
      }
    }
    return null;
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
    console.log(project);
    if (!auth.uid) return <Redirect to="/signin" />;

    const timeslot = _.has(project, "timeslot") ? (
      project.timeslot ? (
        <div>
          <i class="fa fa-calendar" /> <span />
          <span>&nbsp; {project.timeslot}</span>
        </div>
      ) : (
        ""
      )
    ) : (
      ""
    );
    const location = _.has(project, "timeslot") ? (
      project.location ? (
        <div>
          <i class="fa fa-map-marker fa-lg" />
          <span>&nbsp;&nbsp; {project.location}</span>
        </div>
      ) : (
        ""
      )
    ) : (
      ""
    );

    if (project) {
      const isSameProjectAuthenticatedUser = project.authorId !== auth.uid;
      return (
        <div className="row">
          <div className="col s12 m12">
            <div className="container section project-details">
              <div className="card z-depth-2">
                <div className="card-content">
                  <span className="card-title">{project.title}</span>
                  <p>
                    {project.content.split("\n").map(function(item) {
                      return (
                        <span>
                          {item}
                          <br />
                        </span>
                      );
                    })}
                  </p>
                  <br />
                  <div>{timeslot}</div>
                  <div>{location}</div>
                  <br />

                  <ConfirmationModal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    onConfirmClick={this.handleDelete}
                    confirmText="Delete Project"
                  />

                  {project.isPhotoIncluded ? (
                    project.file ? (
                      localStorage.getItem(`${projectId}-img`, project.file) ? (
                        <div>
                          <img
                            style={{ width: "100%" }}
                            src={
                              this.cacheHitImage(project, projectId) ||
                              project.file
                            }
                            role="presentation"
                          />
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                  <br />
                  <span>
                    <a
                      className="btn-small chip right"
                      disabled={isSameProjectAuthenticatedUser}
                      onClick={this.openModal}
                    >
                      Delete
                    </a>
                    <a
                      className="btn-small chip right"
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

                  <span>
                    {moment(project.createdAt.toDate()).calendar()}
                    <span className="right">
                      {this.state.userFavoritedPostId !== undefined ? (
                        <FavoriteButton
                          onFavor={() => this.props.favoritePost(projectId)}
                          onDisfavor={() => this.props.disFavorPost(projectId)}
                          handleFavoriteClick={e =>
                            this.handleFavoriteClick(e, projectId)
                          }
                          favorited={this.state.userFavoritedPostId}
                          isFavoriteButtonDisabled={
                            this.state.isFavoriteButtonDisabled
                          }
                        />
                      ) : (
                        ""
                      )}
                    </span>
                  </span>
                </div>
                <div className="card-action">
                  {this.renderLikes(projectId)}
                  {this.renderComments()}
                  <div className="ProjectDetails__action-box">
                    <div className="ProjectDetails__like-button">
                      {this.state.likedPostIds !== undefined ? (
                        <LikeButton
                          onLike={() => this.props.likePost(projectId)}
                          onDislike={() => this.props.dislikePost(projectId)}
                          liked={this.state.userLikedPostId}
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
                    {this.state.likersName ? (
                      <LikersModal
                        isOpen={
                          this.state.likersName && this.state.likersModalIsOpen
                        }
                        onRequestClose={this.closeLikersModal}
                        postId={this.state.likersModalPostId}
                        likers={this.state.likersName}
                      />
                    ) : (
                      ""
                    )}
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
    deleteProject: (projectId, component) =>
      dispatch(deleteProject(projectId, component)),
    likePost: projectId => dispatch(likePost(projectId)),
    dislikePost: projectId => dispatch(dislikePost(projectId)),

    favoritePost: projectId => dispatch(favoritePost(projectId)),
    disFavorPost: projectId => dispatch(disFavorPost(projectId)),

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
    likedPostIds: state.project.likedPostIds,
    favoritedPostIds: state.project.favoritedPostIds,
    userFavoritedPostId: state.project.userFavoritedPostId
  };
};

ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  likesCount: PropTypes.number.isRequired,
  likedPostIds: PropTypes.array.isRequired,
  avoritedPostIds: PropTypes.array.isRequired,
  userFavoritedPostId: PropTypes.bool.isRequired
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
