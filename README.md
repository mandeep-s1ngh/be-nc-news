# **Northcoders News API**

## <ins>Summary</ins>

This project is part of my portfolio whilst enrolled on the NorthCoders Software Engineering bootcamp. I am creating a RESTful API for a news style website.
The database system used is [PostgreSQL](https://www.postgresql.org/), and the interaction with the database will be done using [node-postgres](https://node-postgres.com/). <br>

## <ins>Hosted Version</ins>

You can find the hosted version [here](https://nc-news-api-e6xe.onrender.com/) <br>
The list of available endpoints can be found [here](https://nc-news-api-e6xe.onrender.com/api) <br>
I would recommend the [JSON viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh) extension that will display the JSON data in a nicely formatted way.

## <ins>Local Setup</ins>

If you would like to run this project locally, please make sure you will have at least **Node.js v18** and **PostgreSQL v14.7** installed. You can then **_fork_** this repo to have a copy inside your Github repositories section and then **_clone_** the forked repo.

## <ins>Dependencies</ins>

Once cloned, CD into the root of the project and install the dependencies by running:

`npm install`

## <ins>Environment Variables</ins>

You will also need to define the `PGDATABASE` environment variable which is used by PSQL to define the name of the databases to be used for the API.
There are two databases: one for the test data and one for the dev data.
To set up the environment variables, please create the following two files in the root of the project:

1. `.env.test` which will need to contain the following line of code: `PGDATABASE=nc_news_test`.

2. `.env.development` which will need to contain the following line of code: `PGDATABASE=nc_news`

## <ins>Setup and Seed the local databases</ins>

CD into the root of the project then:

1.Setup the databases: `npm run setup-dbs`

2.Seed the databases: `npm run seed`

## <ins>Running Test Suite</ins>

[Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) are used for the test suite and if you would like to run the tests associated with each endpoint, please install the packages as a dev dependency by running `npm install -D jest` and `npm install -D supertest` <br> After installing, you can run the test file: CD into the root of the project and run `npm test app.test.js` <br>
You can append **.only** (which is a Jest global) to a describe block to run the tests associated with a specific endpoint or to an it block to run a specific test.
