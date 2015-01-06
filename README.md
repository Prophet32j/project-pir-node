project-pir-node
================

Node.js API web server for delivering content and data to devices

Current API


look through models/ to see what is in each model and figure out what is required and what is not

## Parents Resource
GET /parents

GET /parents?ids[] or /parents?ids  - ids must be an array

GET /parents?readers[] or /parents?readers - readers must be an array

POST /parents  
 - responds to json payload or url-encoded request bodies
 - responds with status code 201 and created document with id

## Parent Resource
GET /parents/:id 

GET /parents/:email

PUT /parents/:id or :email  
 - responds to json payload or url-encoded
 - only send what you are modifying, not the entire parent object
 - responds only with status code 204

DELETE /parents/:id or :email  
 - responds only with status code 204
 - removes all related readers
 
## Readers Resource
GET /readers

GET /readers?ids[] or ?ids - must be an array

GET /readers?parent - must be single id

GET /readers?special\_needs - must be boolean true/false

GET /readers?language\_needs - must be boolean true false

POST /readers  
 - must have parent or else it fails
 - same as above

## Reader Resource
GET /readers/:id

PUT /readers/:id
 - same as above
 
DELETE /readers/:id  
 - same as above
 - removes reader from parent

## Volunteers Resource
GET /volunteers

GET /volunteers?ids[]= or ?ids= - must be array

GET /volunteers?special\_ed= - must be boolean

GET /volunteers?language\_ed= - must be boolean

POST /volunteers
 - same as /parents above
 
## Volunteer Resource
GET /volunteers/:id or :email - same as parent

PUT /readers/:id or :email - same as parent
 - only send what you are modifying

DELETE /readers/:id or :email - same as parent
 - also will remove any pairs from readers as well
