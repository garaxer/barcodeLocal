-- postgres=# CREATE ROLE gary WITH LOGIN PASSWORD 'test123!';
-- postgres=# ALTER ROLE gary CREATEDB;
-- CREATE DATABASE api;
-- \c api
-- \dt \du
-- # https://x-team.com/blog/automatic-timestamps-with-postgresql/

-- drop table barcodes;
-- drop table users;
-- drop table company;

CREATE TABLE company (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  createdAt timestamp default current_timestamp
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  permission VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  company_id INTEGER REFERENCES company(ID),
  refresh_id VARCHAR(255),
  disabled VARCHAR(30),
  createdAt timestamp default current_timestamp
);

CREATE TABLE barcodes (
  ID SERIAL PRIMARY KEY,
  bnumber INTEGER NOT NULL,
  bprefix VARCHAR(255) NOT NULL,
  creator_id INTEGER REFERENCES users(ID),
  createdAt timestamp default current_timestamp
);

--INSERT INTO users (name, email, permission)
--  VALUES ('Gary', 'gary@gary.com', 'admin'), ('Test', 'Gary@example.com', null);
 
INSERT INTO barcodes (bprefix, bnumber, creator_id)
  VALUES ('AP', 0, 1);

--SELECT * FROM barcode
--WHERE creator_id IN (
--		SELECT ID FROM users
--		where name = 'Gary'
--	);
