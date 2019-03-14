import { ADD_COMMENT, DELETE_COMMENT } from "../actionTypes";
const uuidv4 = require("uuid/v4");

export const addComment = (projectId, commentBody) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userId = getState().firebase.auth.uid;
    var projectRef = firestore.collection("projects").doc(projectId);
    var userRef = firestore.collection("users").doc(userId);
    var username;
    userRef.get().then(user => {
      username = user.data().firstName;
      console.log("get user first name success");
    });
    firestore
      .runTransaction(function(transaction) {
        return transaction.get(projectRef).then(function(project) {
          let newCommentsCount = project.data().commentsCount + 1;
          let oldComments = project.data().comments;
          let newComment = {
            authorId: userId,
            username,
            id: uuidv4(),
            body: commentBody
          };
          transaction.update(projectRef, {
            commentsCount: newCommentsCount,
            comments: [...oldComments, newComment]
          });

          return {
            commentsCount: newCommentsCount,
            comments: [...oldComments, newComment],
            comment: newComment
          };
        });
      })
      .then(data => {
        console.log("successfully created comment", data);
        dispatch({
          type: ADD_COMMENT,
          payload: data.comment,
          projectId
        });
      })
      .catch(response => {
        console.log("could not create a comment", response);
      });
  };
};

export const deleteComment = (projectId, comment_id) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    var projectRef = firestore.collection("projects").doc(projectId);
    firestore
      .runTransaction(function(transaction) {
        return transaction.get(projectRef).then(function(project) {
          let newCommentsCount = project.data().commentsCount - 1;
          let oldComments = project.data().comments;
          let filteredComment = oldComments.filter(
            comment => comment.id !== comment_id
          );

          transaction.update(projectRef, {
            commentsCount: newCommentsCount,
            comments: filteredComment
          });

          return {
            commentsCount: newCommentsCount,
            comments: filteredComment
          };
        });
      })
      .then(
        () => {
          console.log("successfully delete comment");
          dispatch({
            type: DELETE_COMMENT,
            comment_id,
            projectId
          });
        },
        error => {
          console.log("delete comment failed", error);
        }
      );
  };
};
