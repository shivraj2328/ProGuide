create database ProGuide;
use ProGuide;

create table Professionals(
id int auto_increment primary key,
p_name varchar(100),
industry varchar(100),
experience int,
organization varchar(100),
bio text
);
alter table Professionals change p_name name varchar(100);
alter table Professionals add column title varchar(100);
select *from Professionals;
TRUNCATE TABLE Professionals;
ALTER TABLE professionals
ADD COLUMN location VARCHAR(100),
ADD COLUMN skills TEXT,
ADD COLUMN education VARCHAR(255),
ADD COLUMN linkedin VARCHAR(255),
ADD COLUMN email VARCHAR(255),
ADD COLUMN availability VARCHAR(100),
ADD COLUMN sessionFee INT;

INSERT INTO professionals 
(name, title, industry, experience, organization, bio, location, skills, education, linkedin, email, availability, sessionFee)
VALUES
(
  "Dr. Anjali Mehta",
  "Cardiologist",
  "Healthcare",
  8,
  "Apollo Hospital",
  "Experienced cardiologist helping patients and guiding medical aspirants.",
  "Delhi",
  "Cardiology, Patient Care",
  "MBBS, MD Cardiology",
  "https://linkedin.com/in/anjalimehta",
  "anjali@example.com",
  "Evenings",
  1500
),
(
  "Rahul Sharma",
  "Chartered Accountant",
  "Finance",
  5,
  "Sharma & Co.",
  "Helping startups with taxation and finance planning.",
  "Pune",
  "Taxation, Accounting, Finance",
  "CA",
  "https://linkedin.com/in/rahulsharma",
  "rahul@example.com",
  "Weekdays",
  1000
);

INSERT INTO professionals 
(name, title, industry, experience, organization, bio, location, skills, education, linkedin, email, availability, sessionFee)
VALUES

("Amit Verma","Backend Developer","Technology",3,"Infosys",
"Node.js developer helping students understand backend and APIs.",
"Bangalore","Node.js, Express, MongoDB","B.Tech Computer Science",
"https://linkedin.com/in/amitverma","amit@example.com","Weekends",600),

("Sneha Kapoor","UI/UX Designer","Design",4,"Zomato",
"Designing intuitive user experiences and mentoring design students.",
"Delhi","Figma, UX Research, Prototyping","B.Des",
"https://linkedin.com/in/snehakapoor","sneha@example.com","Evenings",700),

("Dr. Rohit Patil","General Physician","Healthcare",6,"City Care Hospital",
"Practicing doctor guiding medical aspirants and NEET students.",
"Mumbai","Diagnosis, Patient Care","MBBS",
"https://linkedin.com/in/rohitpatil","rohit@example.com","Weekends",1200),

("Neha Agarwal","Digital Marketing Expert","Marketing",5,"Freelancer",
"Helping businesses grow online and guiding marketing students.",
"Pune","SEO, Social Media, Ads","MBA Marketing",
"https://linkedin.com/in/nehaagarwal","neha@example.com","Flexible",800),

("Karan Malhotra","Investment Banker","Finance",7,"Goldman Sachs",
"Finance professional helping students break into investment banking.",
"Mumbai","Finance, Valuation","MBA Finance",
"https://linkedin.com/in/karanmalhotra","karan@example.com","Weekends",1500),

("Priya Sharma","School Teacher","Education",10,"Delhi Public School",
"Passionate educator mentoring students for career growth.",
"Delhi","Teaching, Communication","B.Ed",
"https://linkedin.com/in/priyasharma","priya@example.com","Evenings",400),

("Aditya Singh","Full Stack Developer","Technology",2,"Startup",
"Building web apps and helping beginners become job-ready.",
"Noida","React, Node, MySQL","BCA",
"https://linkedin.com/in/adityasingh","aditya@example.com","Flexible",500),

("Ravi Deshmukh","Entrepreneur","Business",8,"Own Startup",
"Startup founder guiding students on business and entrepreneurship.",
"Nagpur","Startup, Leadership","MBA",
"https://linkedin.com/in/ravideshmukh","ravi@example.com","Weekends",1000),

("Meera Iyer","HR Manager","Business",6,"TCS",
"Helping students with resume building and interview preparation.",
"Chennai","HR, Interviews","MBA HR",
"https://linkedin.com/in/meeraiyer","meera@example.com","Evenings",600),

("Sahil Khan","Graphic Designer","Design",3,"Freelancer",
"Creative designer helping students learn branding and visuals.",
"Hyderabad","Photoshop, Illustrator","Diploma Design",
"https://linkedin.com/in/sahilkhan","sahil@example.com","Flexible",500);

select * from professionals;
delete from professionals
where id=1;