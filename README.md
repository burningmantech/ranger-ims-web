# Ranger Incident Management System — Web Client

[![Build Status](https://github.com/burningmantech/ranger-ims-web/workflows/CI%2fCD/badge.svg)](https://github.com/burningmantech/ranger-ims-web/actions)
[![Code Coverage](https://codecov.io/github/burningmantech/ranger-ims-web/coverage.svg?branch=master)](https://codecov.io/github/burningmantech/ranger-ims-web?branch=master)

This software package implements software to provide logging for incidents as they occur and to aid in the dispatch of resources to respond to those incidents.
It is presently tailored to the specific needs of the Black Rock Rangers in Black Rock City.

The server is the master (authoritative) repository for incident information.
Clients connect to the server over the network and provide an interface to users which enables them to view and manage incident information.

This project provides a web client for the server.

The application is implemented using [React](https://reactjs.org/).


## Development

### Install dependencies

You'll need to install the project's dependencies before you can run the server:

```console
npm install
```

### Running the Test Suite

To run all of the tests:

```console
npm test -- --all --watchAll=false
```

### Running the Server

```console
npm start
```
