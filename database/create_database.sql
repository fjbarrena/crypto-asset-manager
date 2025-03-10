CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE crypto_db.public."Coins" AS ENUM (
	'bitcoin',
	'ethereum',
	'doge'
);

CREATE TABLE crypto_db.public."user" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	created_by varchar NULL,
	modified_at timestamp DEFAULT now() NOT NULL,
	modified_by varchar NULL,
	username varchar NOT NULL,
	"encryptedPassword" varchar NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
	CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username)
);

CREATE TABLE crypto_db.public."order" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	created_by varchar NULL,
	modified_at timestamp DEFAULT now() NOT NULL,
	modified_by varchar NULL,
	asset public."Coins" NOT NULL,
	quantity int4 NOT NULL,
	"priceUSD" float8 NOT NULL,
	"priceEUR" float8 NOT NULL,
	"buyerId" uuid NOT NULL,
	CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id)
);


-- public."order" foreign keys
ALTER TABLE crypto_db.public."order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES crypto_db.public."user"(id);

