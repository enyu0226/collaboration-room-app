const initState = {
  likedPostIds: [],
  totalPostLike: "",
  commentsCount: 0,
  comments: []
};

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT_SUCCESS":
      console.log("create project success");
      return state;
    case "CREATE_PROJECT_ERROR":
      console.log("create project error");
      return state;
    case "EDIT_PROJECT_SUCCESS":
      console.log("edit project success");
      return state;
    case "EDIT_PROJECT_ERROR":
      console.log("edit project error");
      return state;
    case "DELETE_PROJECT_SUCCESS":
      console.log("delete project success");
      return state;
    case "DELETE_PROJECT_ERROR":
      console.log("delete project error");
      return state;
    case "LIKE_POST":
      return {
        ...state,
        totalPostLike: action.payload.newLikesCount,
        likedPostIds: [...state.likedPostIds, action.payload.projectId]
      };
    case "DISLIKE_POST":
      return {
        ...state,
        likedPostIds: state.likedPostIds.filter(
          id => id !== action.payload.projectId
        ),
        totalPostLike: action.payload.newLikesCount
      };

    case "ADD_COMMENT":
      return {
        ...state,
        commentsCount: state.commentsCount + 1,
        comments: [...state.comments, action.payload]
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        commentsCount: state.commentsCount - 1,
        comments: state.comments.filter(
          comment => comment.id !== action.commentId
        )
      };
    default:
      return state;
  }
};

export default projectReducer;

export const getLikedPostIds = state => {
  return state.likedPostIds;
};
