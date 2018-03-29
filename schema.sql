
CREATE TABLE public.mission
(
  id SERIAL PRIMARY KEY,
  owner_name character varying NOT NULL,
  owner_id character varying NOT NULL,
  body character varying NOT NULL,
  price integer NOT NULL,
  executor_id character varying,
  executor_name character varying,
  deadline timestamp NOT NULL DEFAULT NOW(), 
  created_at timestamp NOT NULL DEFAULT NOW(), 
  CONSTRAINT mission_key UNIQUE (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.mission
  OWNER TO postgres;


CREATE TABLE public.mission_histo
(
  id SERIAL PRIMARY KEY,
  id_mission INTEGER REFERENCES public.mission (id),
  bidder_name character varying NOT NULL,
  bidder_id character varying NOT NULL,
  reason character varying NOT NULL,
  bid_price integer NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(), 
  CONSTRAINT mission_histo_key UNIQUE (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.mission_histo
  OWNER TO postgres;



-- postgres=> INSERT INTO mission VALUES(1, 'jules.truong.perso', 'test', 1, '1999-01-08 04:05:06', '1999-01-08 04:05:06'