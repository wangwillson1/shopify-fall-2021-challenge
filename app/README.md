## Setting up the API
Assuming node is installed and you have cloned the project already, type `npm install` in your console. This should install all the necessary dependencies.

## Setting up PostgreSQL
Get Postgres on your machine in whatever way is most convenient for you. Create a user with username `me` and password `password`. Port should be 5432 but that's the default anyways. This is really important, otherwise the database won't be hooked up.

## Running the app
`npm start` will run the API. Make sure your PostgreSQL DB is running prior to running the API.
