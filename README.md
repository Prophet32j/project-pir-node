project-pir-node
================

Node.js API web server for delivering content and data to devices

Current API

## Parents Resource
GET /parents  return
GET /parents?ids[] or /parents?ids  - ids must be an array  return
GET /parents?readers[] or /parents?readers - readers must be an array  return
POST /parents  
 - responds to json payload or url-encoded request bodies
 - responds with status code 201 and created document with id

## Parent Resource
GET /parents/:id  return
GET /parents/:email  return
PUT /parents/:id or :email  
 - responds to json payload or url-encoded
 - only send what you are modifying, not the entire parent object
 - responds only with status code 204
DELETE /parents/:id or :email  
 - responds only with status code 204
 - removes all related readers
 
## Readers Resource
GET /readers  return
GET /readers?ids[] or ?ids - must be an array  return
GET /readers?parent - must be single id  return
GET /readers?special\_needs - must be boolean true/false  return
GET /readers?language\_needs - must be boolean true false  return
POST /readers  
 - must have parent or else it fails
 - same as above

## Reader Resource
GET /readers/:id  return
PUT /readers/:id
 - same as above
DELETE /readers/:id  
 - same as above
 - removes reader from parent

