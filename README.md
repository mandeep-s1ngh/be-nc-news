# Northcoders News API

## Background

This project is part of my portfolio whilst enrolled on the NorthCoders Software Engineering bootcamp. The goal is to create an API for a news style website (similar to reddit).

The database will be PSQL, and we will interact with it using [node-postgres](https://node-postgres.com/).

## Environment Variables

If you would like to clone this repo and run it locally, you will be making use of the `PGDATABASE` environment variable which is used by PSQL to define the name of the databases to be used for the API. To do this, please create the following two files in the root of the project:

1. `.env.test` which will need to contain the following line of code: `PGDATABASE=nc_news_test`

2. `.env.development` which will need to contain the following line of code: `PGDATABASE=nc_news`

## Dependencies

Please then proceed to bring down the dependencies needed for the project by running:

> npm install
