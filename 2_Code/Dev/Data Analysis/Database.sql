create database health_data;

use health_data;
create table health_param
(
userid int unsigned not null AUTO_INCREMENT Primary Key,
first_name varchar(50),
last_name varchar(50),
email varchar(75) not null,
age int not null,
weight int not null,
height int not null,
bp int,
time_stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);

insert into health_param values 
(1, 'Pratik', 'Mistry', 'pratik.mistry@rutgers.edu', 25, 80, 6, 120, current_timestamp());

insert into health_param values 
(2, 'Pranav', 'Shivkumar', 'pranav.shivkumar@rutgers.edu', 25, 80, 6, 120, current_timestamp());

insert into health_param values 
(3,'Amod', 'Deo', 'amod.deo@rutgers.edu', 25, 80, 6, 120, current_timestamp());

insert into health_param values 
(4, 'Shaunak', 'Rangwala', 'Shaunak.Rangwala@rutgers.edu', 25, 80, 6, 120, current_timestamp());


insert into health_param values 
(5, 'Sen', 'Zhang', 'Zen.Zhang@rutgers.edu', 25, 80, 6, 120, current_timestamp());


select * from health_param;