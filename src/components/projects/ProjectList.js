import React, { Component } from "react";
import ProjectSummary from "./ProjectSummary";
import { Link } from "react-router-dom";

export class ProjectList extends Component {
  state = {
    projects: []
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.projects) {
      this.setState({ projects: this.props.projects });
    }
  }

  render() {
    const { projects } = this.props;
    return (
      <div className="project-list section">
        {projects &&
          projects.map(project => {
            return (
              <Link to={"/project/" + project.id} key={project.id}>
                <ProjectSummary project={project} />
              </Link>
            );
          })}
      </div>
    );
  }
}

export default ProjectList;
