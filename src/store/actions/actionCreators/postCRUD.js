import {
  CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT_ERROR,
  GET_PROJECT_SUCCESS,
  GET_PROJECT_ERROR,
  EDIT_PROJECT_SUCCESS,
  EDIT_PROJECT_ERROR,
  DELETE_PROJECT_SUCCESS,
  DELETE_PROJECT_ERROR
} from "../actionTypes";

export const createProject = project => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firestore
      .collection("projects")
      .add({
        ...project,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date(),
        likesCount: 0,
        comments: [],
        commentsCount: 0,
        comment: "",
        likedPostIds: []
      })
      .then(() => {
        dispatch({ type: CREATE_PROJECT_SUCCESS });
      })
      .catch(err => {
        dispatch({ type: CREATE_PROJECT_ERROR }, err);
      });
  };
};

export const getProject = (projectId, obj) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("projects")
      .doc(projectId)
      .get()
      .then(snapshot => {
        const project = snapshot.data();
        obj.setState({ title: project.title, content: project.content });
        console.log("get project success");
        dispatch({ type: GET_PROJECT_SUCCESS });
      })
      .catch(err => {
        console.log("get project error");
        dispatch({ type: GET_PROJECT_ERROR }, err);
      });
  };
};

export const editProject = (project, projectId) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("projects")
      .doc(projectId)
      .update({
        title: project.title,
        content: project.content
      })
      .then(() => {
        dispatch({ type: EDIT_PROJECT_SUCCESS });
      })
      .catch(err => {
        dispatch({ type: EDIT_PROJECT_ERROR }, err);
      });
  };
};

export const deleteProject = projectId => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    firestore
      .collection("projects")
      .doc(projectId)
      .delete()
      .then(() => {
        dispatch({ type: DELETE_PROJECT_SUCCESS });
      })
      .catch(err => {
        dispatch({ type: DELETE_PROJECT_ERROR }, err);
      });
  };
};
