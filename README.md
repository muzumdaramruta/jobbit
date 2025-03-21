# jobbit
Jobbit is a website used for connecting talented individuals with their dream jobs. Users can signup for free, save their favourite jobs and apply in few sec.

The website is currently in progress and is created with dummy data using html, css, bootstrap and jquery.


## How to Run

Prequisites:
1. MongoDB
2. npm & node

To run the project locally, follow these steps:

1. Navigate to the backend directory:
    ```bash
    cd backend
    npm i
    npm run start
    ```

2. Navigate to the frontend directory:
    ```bash
    cd frontend
    npm i
    npm run dev
    ```



This project has been deployed and working on following Cloud service:

Vercel (https://vercel.com/)
Create two separate projects for backend and frontend
Set env variables properly and deploy them both

For backend project, need to create vercel.json and remove `"type": "module",` from package.json
Try running in local using `vercel dev` using expressjs-vercel tutorial

NOTE: add `"type": "module",` to package.json to run in local.
