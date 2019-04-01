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
import { StateProvider } from "reenhance-components/dist";
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
import LikeButton from "./LikeButton";
import "../../styles/ProjectDetails.css";
import _ from "lodash";
import FavoriteButton from "./FavoriteButton";

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
      imageHits: null
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
          console.log(project.hasOwnProperty(currentUser));
          if (project.hasOwnProperty(currentUser)) {
            userFavoritedPostId = project[currentUser].favorite;
            console.log(project[currentUser].favorite);
            userLikedPostId = project[currentUser].like;
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

  async handleFavoriteClick(event, projectId) {
    event.preventDefault();
    if (this.state.userFavoritedPostId) {
      this.setState(
        {
          isFavoriteButtonDisabled: true
        },
        this.props.disFavorPost(projectId)
      );
      // this.props.onDisfavor();
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
  componentWillMount() {
    if (this.unsubscribe) this.unsubscribe();
  }
  handleEdit = () => {
    const id = this.props.match.params.id;
    const editUrl = `/edit/project/${id}`;
    this.props.history.push(editUrl);
  };

  handleDelete = async () => {
    const projectId = this.props.match.params.id;
    await this.props.deleteProject(projectId);
    this.props.history.push("/");
    window.location.reload();
  };

  cacheHitImage = (project, projectId) => {
    // let project_file = await project.file;
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
    let projectFile;
    const { project, auth } = this.props;
    const projectId = this.props.match.params.id;
    //console.log(this.state.likedPostIds);
    console.log(this.state.userFavoritedPostId);
    console.log(this.state.userLikedPostId);

    if (!auth.uid) return <Redirect to="/signin" />;

    const LoadedState = StateProvider(false);

    const ImageWithLoading = ({ src, style }) => (
      <LoadedState>
        {({ state: loaded, setState: setLoaded }) => (
          <div>
            {!loaded ? (
              <div style={{ textAlign: "center" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="64px"
                  height="64px"
                  viewBox="0 0 128 128"
                >
                  <rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" />
                  <g>
                    <linearGradient id="linear-gradient">
                      <stop offset="0%" stop-color="#000" />
                      <stop offset="100%" stop-color="#0090fe" />
                    </linearGradient>
                    <linearGradient id="linear-gradient2">
                      <stop offset="0%" stop-color="#000" />
                      <stop offset="100%" stop-color="#90e6fe" />
                    </linearGradient>
                    <path
                      d="M64 .98A63.02 63.02 0 1 1 .98 64 63.02 63.02 0 0 1 64 .98zm0 15.76A47.26 47.26 0 1 1 16.74 64 47.26 47.26 0 0 1 64 16.74z"
                      fill-rule="evenodd"
                      fill="url(#linear-gradient)"
                    />
                    <path
                      d="M64.12 125.54A61.54 61.54 0 1 1 125.66 64a61.54 61.54 0 0 1-61.54 61.54zm0-121.1A59.57 59.57 0 1 0 123.7 64 59.57 59.57 0 0 0 64.1 4.43zM64 115.56a51.7 51.7 0 1 1 51.7-51.7 51.7 51.7 0 0 1-51.7 51.7zM64 14.4a49.48 49.48 0 1 0 49.48 49.48A49.48 49.48 0 0 0 64 14.4z"
                      fill-rule="evenodd"
                      fill="url(#linear-gradient2)"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 64 64"
                      to="360 64 64"
                      dur="1800ms"
                      repeatCount="indefinite"
                    />
                  </g>
                </svg>
              </div>
            ) : null}

            <img
              src={src}
              style={!loaded ? { visibility: "hidden" } : style}
              onLoad={() => setLoaded(true)}
            />
          </div>
        )}
      </LoadedState>
    );

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
    console.log(project);
    console.log(this.state.favoritedPostIds);
    // console.log(this.props.favoritedPostIds);
    console.log(this.state.userFavoritedPostId);
    console.log(window);
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

                  {project.file ? (
                    // (localstorage.getItem(`${projectId}-img`, project.file))?
                    //     {
                    //       projectFile = localstorage.getItem(`${projectId}-img`, project.file)
                    //     }

                    //     : localstorage.setItem(`${projectId}-img`, project.file)

                    <div>
                      <img
                        style={{ width: "100%" }}
                        src={
                          this.cacheHitImage(project, projectId) || project.file
                        }
                        role="presentation"
                      />
                    </div>
                  ) : (
                    // <ImageWithLoading
                    //   style={{ width: "100%" }}
                    //   src={
                    //     this.cacheHitImage(project, projectId) || project.file
                    //   }
                    //   role="presentation"
                    // />
                    // <ImageWithLoading
                    //   style={{ width: "100%" }}
                    //   src={project.file}
                    //   role="presentation"
                    // />
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
                      {/* userFavoritedPostId */}
                      {/* favoritedPostIds */}
                      {this.state.userFavoritedPostId !== undefined ? (
                        <FavoriteButton
                          onFavor={() => this.props.favoritePost(projectId)}
                          onDisfavor={() => this.props.disFavorPost(projectId)}
                          handleFavoriteClick={e =>
                            this.handleFavoriteClick(e, projectId)
                          }
                          // favorited={
                          //   this.state.favoritedPostIds.indexOf(projectId) >= 0
                          // }
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
                  {this.renderLikes()}
                  {this.renderComments()}
                  <div className="ProjectDetails__action-box">
                    <div className="ProjectDetails__like-button">
                      {this.state.likedPostIds !== undefined ? (
                        <LikeButton
                          onLike={() => this.props.likePost(projectId)}
                          onDislike={() => this.props.dislikePost(projectId)}
                          // liked={
                          //   this.state.likedPostIds.indexOf(projectId) >= 0
                          // }
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
