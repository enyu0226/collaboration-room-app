import React from "react";
import moment from "moment";

const ProjectSummary = ({ project }) => {
  // console.log("project", project);
  const timeslot = project.timeslot ? (
    <div>
      <i class="fa fa-calendar" /> <span />
      <span>&nbsp; {project.timeslot}</span>
    </div>
  ) : (
    ""
  );
  const location = project.location ? (
    <div>
      <i class="fa fa-map-marker fa-lg" />
      <span>&nbsp;&nbsp; {project.location}</span>
    </div>
  ) : (
    ""
  );

  return (
    <div className="card z-depth-3 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{project.title}</span>
        <div>{timeslot}</div>
        <div>{location}</div>
        <br />
        <span class="chip">
          {project.tag
            ? project.tag.charAt(0).toUpperCase() + project.tag.slice(1)
            : "General"}
        </span>
      </div>

      <div className="card-action lighten-4 grey-text">
        <div>
          Posted by {project.authorFirstName} {project.authorLastName}
        </div>
        <div>{moment(project.createdAt.toDate()).calendar()}</div>
      </div>
    </div>
  );
};

export default ProjectSummary;
