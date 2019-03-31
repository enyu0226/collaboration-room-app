# Welcome to Collab Room

An elegant, beautiful and sophisticated project task manager app that is implemented using React, Redux and Firebase. Collab room is a place where people come to hang out and post their project(s) and request(s) for other people to see, so they can make comments or provide suggestions on them. Users can also like/unlike and comment on the their or others' projects.

## Core features:

1. [x] Architected to follow React/Redux best practice.
2. [x] UI logic that makes sense and caters to users on web and mobile Application.
3. [x] User sign in and authentication.
4. [x] Non-login user cannot access any other part of the app other than sign in page.
5. [x] Login user can create project and display it on public dashboard that is visible to everyone.
6. [x] Clicking on the project will take user to view the actual project content.
7. [x] A given user can edit or delete his/her own projects but not others.
8. [x] The notification would inform new sign-in user and recently created project.
9. [x] Sign in user can like or unlike a given project by clicking on the heart.
10. [x] The number of like counts on a given post is tracked across different users.
11. [x] User can comment on the posts. Any user who created the comment may delete their own post.
12. [x] Edit and delete post or comment would prompt user for additional confirmation.
13. [x] User can include an optional project photo when creating project.
14. [x] Allow user to search project by project tag, title, content and location of the project.
15. [x] Improve overall UI image loading speed by saving image to local storage upon initial image request and thus prevent duplicate API call to the backend.
16. [x] User can favorite the post by clicking on the star icon and turn on favorite filter on the search result so that it only return favorited projects.
17. [x] Added multi-step project creation to create smooth UI form and incorporate loading flag while project is been submitted to the backend to prevent multiple project submission attempt.
18. [x] Added form validation to project creation step such that missing required field would produce error message and prevent going to the next step.
19. [x] The UI display intelligently adapts to any lack of optional field value.

## Future release:

1. [] User can schedule chat with other users.

## Live Example

You can find a live running site of this code [here](https://collaboration-room.firebaseapp.com)
