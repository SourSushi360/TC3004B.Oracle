
CREATE TABLE TODOUSER.Projects (
    ID_Project NUMBER PRIMARY KEY,
    Name VARCHAR2(100),
    Description VARCHAR2(4000)
);

CREATE TABLE TODOUSER.Sprints (
    ID_Sprint NUMBER PRIMARY KEY,
    Name VARCHAR2(100),
    Starts_At DATE,
    Ends_At DATE,
    ID_Project NUMBER REFERENCES TODOUSER.Projects(ID_Project)
);

CREATE TABLE TODOUSER.Users (
    ID_User NUMBER PRIMARY KEY,
    ID_Telegram VARCHAR2(50),
    Name VARCHAR2(100),
    Position VARCHAR2(100)
);

CREATE TABLE TODOUSER.Tasks (
    ID_Task NUMBER PRIMARY KEY,
    Description VARCHAR2(4000),
    State VARCHAR2(50),
    Hours_Estimated NUMBER,
    Hours_Real NUMBER,
    Starts_At DATE,
    Finished_At DATE,
    Ends_At DATE,
    ID_Sprint NUMBER REFERENCES TODOUSER.Sprints(ID_Sprint),
    Assigned_To NUMBER REFERENCES TODOUSER.Users(ID_User)
);

CREATE TABLE TODOUSER.Task_Dependency (
    ID_Task_Parent NUMBER REFERENCES TODOUSER.Tasks(ID_Task),
    ID_Task_Children NUMBER REFERENCES TODOUSER.Tasks(ID_Task),
    PRIMARY KEY (ID_Task_Parent, ID_Task_Children)
);

CREATE TABLE TODOUSER.Messages (
    ID_Message NUMBER PRIMARY KEY,
    Content VARCHAR2(4000),
    Posted_At TIMESTAMP WITH TIME ZONE,
    Notificate_To NUMBER REFERENCES TODOUSER.Users(ID_User)
);

ALTER TABLE TODOUSER.TODOITEM ADD DELIVERY_TS TIMESTAMP(6) WITH TIME ZONE;

