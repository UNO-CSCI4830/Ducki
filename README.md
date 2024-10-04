# Ducki
Ducki is an open-source code assistant designed with the developer in mind. The main objective of Ducki is to offer a smarter way to rubber duck program. Ducki is designed to provide the user with helpful suggestions and hints based on code that you give it instead of directly feeding the developer code. This is because we have a growth mindset and want to encourage growth within the software development industry in a time where it is easiest to lose integrity. We want you to succeed and grow with us.

## To start the app using Docker (preferred method)
1. From the root directory, run `docker compose build`
2. Also from the root directory, run `docker compose up`

## To start the app locally
1. Run the command `./setup.sh`
2. Run `python backend/backend.py`. This will start the backend on `http://localhost:5000/`, but you shouldn't need to interact with it directly.
3. Pause the process with `CTL+Z` and send to the background with the `bg` command
4. From the `frontend/` directory, perform the command `npm start`. This will start the Node app on `http://localhost:3000/`.
5. Pause the process with `CTL+Z` and send to the background with the `bg` command

From here, you should be able to interact with Ducki [here](http://localhost:3000/). Happy coding!
