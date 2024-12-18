# Ducki
Ducki is an open-source code assistant designed with the developer in mind. The main objective of Ducki is to offer a smarter way to rubber duck program. Ducki is designed to provide the user with helpful suggestions and hints based on code that you give it instead of directly feeding the developer code. This is because we have a growth mindset and want to encourage growth within the software development industry in a time where it is easiest to lose integrity. We want you to succeed and grow with us.

## To start the app using Docker (preferred method)
1. From the root directory, run `docker compose build`
2. Also from the root directory, run `docker compose up`

## To start the app locally
1. Go to the `backend/` directory (activate your virtual environment if desired), and perform the command `pip install -r requirements.txt`. This should install all necessary dependencies.
2. From the `backend/` directory, run the following command: `python backend.py`. This will start the backend on `http://localhost:5000/`, but you shouldn't need to interact with it directly.
3. Pause the process with `CTL+Z` and resume it in the background with the `bg` command
4. From the `frontend/` directory, perform the command  `npm install` if it is your first time running the app
5. From the same directory, perform the command `npm start`. This will start the Node app on `http://localhost:3000/`.
6. Pause the process with `CTL+Z` and send to the background with the `bg` command

From here, you should be able to interact with Ducki [here](http://localhost:3000/). Happy coding!

## The Mission
Our mission as the developers of Ducki is to provide the user a smarter way to rubber duck program. We want this to be a free, open source, and public project. We want everyone to be able to add to Ducki at their own will and tailor the context to their desire. To help ensure that, we have worked hard to make the installation and deployment as straight-forward as we could while also trying to minimize dependencies. We really hope that this will benefit developers, old and new. 

## Requirements
The only requirement to run this application is Docker! The rest should be handled for you! If you choose to run it locally, you can see the `backend/requirements.txt` file and the `frontend/package.json` file. These should have all of the requirements listed for the application.
