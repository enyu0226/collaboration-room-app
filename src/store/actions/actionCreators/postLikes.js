import { LIKE_POST, DISLIKE_POST } from "../actionTypes";

export const likePost = projectId => {
  console.log("fire like post");
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    var projectRef = firestore.collection("projects").doc(projectId);
    firestore.collection("projects").doc(projectId);
    firestore
      .runTransaction(function(transaction) {
        return transaction.get(projectRef).then(function(project) {
          var newLikesCount;
          var likedPostIds;
          if (project.data()) {
            if (project.data().likes && project.data().likes[authorId]) {
              newLikesCount = project.data().likesCount - 1;
              likedPostIds = project.data().likedPostIds;
              transaction.update(projectRef, {
                likesCount: newLikesCount,
                likes: { [authorId]: null },
                likedPostIds: likedPostIds.filter(id => id !== projectId)
              });
            } else {
              newLikesCount = project.data().likesCount + 1;
              likedPostIds = project.data().likedPostIds;
              transaction.update(projectRef, {
                likesCount: newLikesCount,
                likes: { [authorId]: true },
                likedPostIds: [...likedPostIds, projectId]
              });
            }
          }
          return { projectId, newLikesCount };
        });
      })
      .then(response => {
        console.log("success");
        //optimistic update
        dispatch({
          type: LIKE_POST,
          payload: response
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const dislikePost = projectId => {
  console.log("fire dislike post");
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    var projectRef = firestore.collection("projects").doc(projectId);
    firestore
      .runTransaction(function(transaction) {
        return transaction.get(projectRef).then(function(project) {
          var newLikesCount;
          var likedPostIds;
          if (project.data()) {
            if (project.data().likes && project.data().likes[authorId]) {
              newLikesCount = project.data().likesCount - 1;
              likedPostIds = project.data().likedPostIds;
              transaction.update(projectRef, {
                likesCount: newLikesCount,
                likes: { [authorId]: null },
                likedPostIds: likedPostIds.filter(id => id !== projectId)
              });
            } else {
              newLikesCount = project.data().likesCount + 1;
              likedPostIds = project.data().likedPostIds;

              transaction.update(projectRef, {
                likesCount: newLikesCount,
                likes: { [authorId]: true },
                likedPostIds: [...likedPostIds, projectId]
              });
            }
          }
          return { projectId, newLikesCount };
        });
      })
      .then(response => {
        console.log("dislike successful");
        dispatch({
          type: DISLIKE_POST,
          payload: response
        });
      })
      .catch(err => {
        console.log("dislike failed", err);
      });
  };
};
