# ProSolar_Backend

## Deployed Link
**TBD**

## Wireframes

Tesla (Profile)

![wireframe](https://i.imgur.com/9WBWRMM.png)

Tickets

![wireframe](https://i.imgur.com/OrGHNUO.png)

Referrals

![wireframe](https://i.imgur.com/kNnvCfN.png)

Contact

![wireframe](https://i.imgur.com/6O1CeZE.png)

## User Stories

## Routes
| Request   | Route URL  | Description  | Takes In  | Returns
| --------- | --------- | ------------- | ---------- | --------- |
|   POST    | /user    | user signup   | name, email, password, profile image, home image | new user
|   POST    | /user/login | user login | email, password | user
|   GET     | /user/profile | get user profile | auth id | user
|   PUT     | /user/profile | update user profile | auth id, name, email, password | updated user
|   POST    | /tickets/submit | submit service ticket | auth id, title, description | new ticket
|   GET     | /tickets | get all service tickets | auth id | all tickets
|   GET     | /tickets/user | get user's service tickets | auth id | user's tickets
|   POST    | /tickets/:id/assign | assign service ticket | auth id, email | assigned ticket, new tasked ticket
|   PUT     | /tickets/:id/complete | mark service ticket complete/incomplete | auth id | ticket
|   GET     | /tasks | get user's tasks | auth id | all tasks

