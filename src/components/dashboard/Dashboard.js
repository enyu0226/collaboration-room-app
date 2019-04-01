import React, { Component } from "react";
import ProjectList from "../projects/ProjectList";
import Notifications from "./Notifications";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import _ from "lodash";

class Dashboard extends Component {
  state = {
    isLoading: false,
    search: "",
    userFavorite: false
  };
  // handleChat = () => {
  //   console.log("chat");
  // };

  handleSearchChange = e => {
    this.setState({ isLoading: true, search: e.target.value });
  };

  handleShowFavoritePost = () => {
    this.setState({
      userFavorite: !this.state.userFavorite
    });
  };

  render() {
    console.log(window);
    const { isLoading, search } = this.state;
    const { projects, auth, notifications } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    let filteredProjects = [];
    if (projects) {
      filteredProjects = projects.filter(project => {
        if (!project.tag) {
          project.tag = "general";
        }
        if (!project.location) {
          project.location = "";
        }

        if (!this.state.userFavorite) {
          return (
            project.content.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.title.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.tag.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.location.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.authorFirstName.toLocaleLowerCase().indexOf(search) !== -1
          );
        }

        return (
          (project.content.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.title.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.tag.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.location.toLocaleLowerCase().indexOf(search) !== -1 ||
            project.authorFirstName.toLocaleLowerCase().indexOf(search) !==
              -1) &&
          (project.hasOwnProperty("favorite") &&
          project.favorite.hasOwnProperty(auth.uid) &&
          project.favorite[auth.uid]
            ? true
            : false)
        );
      });
    }
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m6">
            <ProjectList projects={filteredProjects} />
          </div>
          <div className="col s12 m5 offset-m1">
            <Notifications notifications={notifications} />
          </div>
        </div>

        <div className="row">
          <div class="col s12 m6">
            <button
              className="FavoriteButton__root"
              onClick={this.handleShowFavoritePost}
            >
              {this.state.userFavorite ? (
                <i className="fa fa-star fa-2x FavoriteButton__icon" />
              ) : (
                <i className="fa fa-star-o fa-2x fa-2x" />
              )}
            </button>
          </div>
          {/* <form class="col s12 m6">
     
            <div class="input-field">
              <input
                loading={isLoading}
                id="first_name"
                type="text"
                value={search}
                placeholder="Seach by author, location, tag, title and content"
                onChange={_.debounce(this.handleSearchChange, 500, {
                  leading: true
                })}
              />
              <label className="active" for="first_name">
                Search
              </label>
            </div>
   
          </form> */}

          <form class="col s12 m6">
            {/* <div class="row"> */}
            <div class="input-field">
              <input
                loading={isLoading}
                id="first_name"
                type="text"
                value={search}
                placeholder="Seach by author, location, tag, title and content"
                onChange={_.debounce(this.handleSearchChange, 500, {
                  leading: true
                })}
              />
              <label className="active" for="first_name">
                Search
              </label>
            </div>
            {/* </div> */}
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.firestore.ordered.projects,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: "projects", orderBy: ["createdAt", "desc"] },
    { collection: "notifications", limit: 3, orderBy: ["time", "desc"] }
  ])
)(Dashboard);
