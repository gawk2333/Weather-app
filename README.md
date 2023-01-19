# CSV-Box

A storage for CSV files

checklist

The core requirements (do your best to implement these requirements): 
- [x] The user should be able to create a new empty box with box name and box description.
- [x]The user should be able to edit the box name and the description when needed.
- [x]The user should be able to upload a CSV file into the chosen box.
- [x]Each box can contain no more than one file.
- [x]The user should be able to see the list of boxes.
- [x]The user should be able to view the content of any box: the name, the description and
the file name inside the box, if any.
- [x]The user should be able to «unbox» the file, that is download it from the server or
storage.


Bonus points (you don’t have to implement these requirements but doing so will increase your score):
- [x](huge bonus) the box view UI may contain a subsequent or embedded UI for viewing the content of the CSV file.
- [x]authentication: the user should be able to log in and log out;
- [x]authorization: the logged in users become the owners of the boxes they create;
- [x]authorization: the owned boxes are private by default
- [x]authorization: the owners may opt to turn their boxes to be public;
- [x]authorization: public boxes should be visible to any user (regardless their logged status);
- [x]authorization: the boxes, created by unauthenticated users are public by default;
- [ ]authorization: the user should be able to delete only the boxes that they own (have
created);
- [ ]authorization: there may be a user with elevated privileges (superuser), who can delete
any regular user and their data;
- [ ]authorization: the users may share their boxes with other specific users by knowing their
usernames or emails.
