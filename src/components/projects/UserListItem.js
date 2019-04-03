import React from "react";
import PropTypes from "prop-types";

const UserListItem = ({ user }) => {
  console.log(user);
  return (
    <div className="UsersModal__list-item">
      <div className="UsersModal__user-info">{user}</div>
    </div>
  );
};

UserListItem.PropTypes = {
  user: PropTypes.object.isRequired
};

export default UserListItem;
