export const favoritePost = projectId => {
  console.log("fire favorite post");
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    var projectRef = firestore.collection("projects").doc(projectId);
    firestore.collection("projects").doc(projectId);
    firestore
      .runTransaction(function(transaction) {
        return transaction.get(projectRef).then(async function(project) {
          var favoritePostIds;
          var favorite;
          var userFavoritedPostId = false;
          var authorIdSpread;
          if (project.data()) {
            if (project.data().favorite && project.data().favorite[authorId]) {
              favoritePostIds = await project.data().favoritePostIds;
              favorite = await project.data().favorite;
              authorIdSpread = await project.data()[authorId];
              await transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, favorite: false },
                favorite: { ...favorite, [authorId]: null },
                favoritePostIds: favoritePostIds.filter(id => id !== projectId)
              });
              userFavoritedPostId = false;
            } else {
              favoritePostIds = await project.data().favoritePostIds;
              favorite = await project.data().favorite;
              authorIdSpread = await project.data()[authorId];
              await transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, favorite: true },
                favorite: { ...favorite, [authorId]: true },
                favoritePostIds: [...favoritePostIds, projectId]
              });
              userFavoritedPostId = true;
            }
          }
          return { projectId, userFavoritedPostId };
        });
      })
      .then(response => {
        console.log("favorite succeed");
        //optimistic update
        dispatch({
          type: "Favorite_Post",
          payload: response
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const disFavorPost = projectId => {
  console.log("fire disfavor post");
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    var projectRef = firestore.collection("projects").doc(projectId);
    firestore
      .runTransaction(function(transaction) {
        return transaction.get(projectRef).then(async function(project) {
          var favoritePostIds;
          var favorite;
          var userFavoritedPostId = false;
          var authorIdSpread;
          if (project.data()) {
            if (project.data().favorite && project.data().favorite[authorId]) {
              favoritePostIds = await project.data().favoritePostIds;
              favorite = await project.data().favorite;
              authorIdSpread = await project.data()[authorId];
              await transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, favorite: false },
                favorite: { ...favorite, [authorId]: null },
                favoritePostIds: favoritePostIds.filter(id => id !== projectId)
              });
              userFavoritedPostId = false;
            } else {
              favoritePostIds = await project.data().favoritePostIds;
              authorIdSpread = await project.data()[authorId];
              await transaction.update(projectRef, {
                [authorId]: { ...authorIdSpread, favorite: true },
                favorite: { ...project.data().favorite, [authorId]: true },
                favoritePostIds: [...favoritePostIds, projectId]
              });
              userFavoritedPostId = true;
            }
          }
          return { projectId, userFavoritedPostId };
        });
      })
      .then(response => {
        console.log("disfavor successful");
        dispatch({
          type: "Disfavor_Post",
          payload: response
        });
      })
      .catch(err => {
        console.log("disfavor failed", err);
      });
  };
};
