// Create admin user with readWrite access to the "pathways" database
db.createUser(
  {
      user: "admin",
      pwd: "password",
      roles: [
          {
              role: "readWrite",
              db: "pathways"
          }
      ]
  }
);

// switch to the "pathways" database
db = db.getSiblingDB("pathways");

// create the collections
db.createCollection("patients");
db.createCollection("appointments");