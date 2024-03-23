# Requeste-RS
Requesters is a request testing application inspired by insomnia and postman built with Tauri and NextJS.

## Development
These are the steps necessary to develop on this application

### Setup
To run the application you first need to install all dependencies: 
For the frontend, run `yarn` in the root directory of the application to install all nextjs dependencies.
For the backend, run `cargo build` in the `src-tauri/` directory of the application.

For tauri you will also need to install the tauri CLI by running `cargo install tauri-cli`, please refer to the [tauri-website](https://tauri.app/) for information regarding other system dependencies that are required to run tauri. 

### Running development
To run & watch the files, run `cargo tauri dev` in the root directory of the project.
Please note that changes to the frontend (`src/` directory) should hot-reload in the application window. 
However, any changes to the backend (`src-tauri/` directory) will lead to the application restarting.


## Features / TODO
A list of features and their status in the project. 
Statuses:
 - ❌ Not started
 - 🏗️ Partially implemented
 - 🍑 Implemented in backend
 - 🍏 Implemented in frontend
 - ✅ Done!

### Sending requests
 - ✅ HTTP Methods:
   - ✅ GET
   - ✅ POST
   - ✅ PUT
   - ✅ DELETE
   - ✅ OPTION
   - ✅ HEAD
 - 🏗️ Headers
   - ✅ User can specify custom headers
   - ❌ Default headers, should be used iff the user haven't specified anything for that header.
     - ❌ User-agent
     - ❌ Accept
     - ❌ Content-Type
     - ❌ Content-Length
 - 🏗️ Request Body
   - 🍏 JSON 
   - ❌ XML
   - ❌ Multi-part-form
   - ❌ Plain
 - ❌ Websockets
 - ❌ GraphQL
 - ❌ Handle redirects

### Viewing sent requests
 - 🏗️ Trace of request
   - ✅ See sent/received headers
   - ❌ See sent/received body
   - ❌ See certificate handling
   - ❌ See multiple requests/responses
   - ❌ Color code requests/responses
   - ❌ See "trace" specific detailed information
 - ✅ Raw response body
   - ✅ See stringified body
 - ✅ Headers
   - ✅ See response headers
 - 🏗️ Preview
   - 🏗️ HTML response
     - ✅ Basic html view in iframe
     - ❌ Support images
     - ❌ load css?

### Store requests
 - 🏗️ Sidepanel with requests listings
   - ✅ List of template http requests that can be reused
   - ❌ Store the current request to the list (and store to file)
   - ❌ Load from file
 - ❌ Multiple "projects"
 - ❌ Store data between requests, e.g. making one request, switching to another and then switching back should still show the previous response for that request.
