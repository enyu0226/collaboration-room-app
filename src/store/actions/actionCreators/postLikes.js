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
        return transaction.get(projectRef).then(async function(project) {
          var newLikesCount;
          var likedPostIds;
          var likes;
          var authorIdSpread;
          if (project.data()) {
            if (project.data().likes && project.data().likes[authorId]) {
              newLikesCount = (await project.data().likesCount) - 1;
              likedPostIds = await project.data().likedPostIds;
              likes = await project.data().likes;
              authorIdSpread = await project.data()[authorId];
              transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, like: false },
                likesCount: newLikesCount,
                likes: { ...likes, [authorId]: null },
                likedPostIds: likedPostIds.filter(id => id !== projectId)
              });
            } else {
              newLikesCount = (await project.data().likesCount) + 1;
              likedPostIds = await project.data().likedPostIds;
              likes = await project.data().likes;
              authorIdSpread = await project.data()[authorId];
              transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, like: true },
                likesCount: newLikesCount,
                likes: { ...likes, [authorId]: true },
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
        return transaction.get(projectRef).then(async function(project) {
          var newLikesCount;
          var likedPostIds;
          var likes;
          var authorIdSpread;
          if (project.data()) {
            if (project.data().likes && project.data().likes[authorId]) {
              newLikesCount = (await project.data().likesCount) - 1;
              likedPostIds = await project.data().likedPostIds;
              likes = await project.data().likes;
              authorIdSpread = await project.data()[authorId];
              await transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, like: false },
                likesCount: newLikesCount,
                likes: { ...likes, [authorId]: null },
                likedPostIds: likedPostIds.filter(id => id !== projectId)
              });
            } else {
              newLikesCount = (await project.data().likesCount) + 1;
              likedPostIds = await project.data().likedPostIds;
              likes = await project.data().likes;
              authorIdSpread = await project.data()[authorId];
              await transaction.update(projectRef, {
                likesCount: newLikesCount,
                [authorId]: { ...authorIdSpread, like: true },
                likes: { ...likes, [authorId]: true },
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
