
-- Student table
CREATE TABLE Students (
  StudentID INT PRIMARY KEY AUTO_INCREMENT,
  StudentName VARCHAR(50),

  INDEX idx_StudentName (StudentName ASC)
);

-- Score table
CREATE TABLE Scores (
  ScoreID INT PRIMARY KEY AUTO_INCREMENT,
  StudentID INT,
  Subject VARCHAR(50),
  Score INT,

  INDEX idx_StudentID (StudentID),
  INDEX idx_Subject_Score (Subject, Score),
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

-- Sample student data
INSERT INTO Students (StudentName)
VALUES ('John'), ('Jane'), ('Alice'), ('Bob'), ('Charlie');

-- Sample score data
INSERT INTO Scores (StudentID, Subject, Score)
VALUES
  -- John's scores
  (1, 'Math', 90),
  (1, 'Science', 85),
  (1, 'History', 92),
  (1, 'English', 88),
  (1, 'Physics', 87),

  -- Jane's scores
  (2, 'Math', 78),
  (2, 'Science', 92),
  (2, 'History', 85),
  (2, 'English', 90),
  (2, 'Physics', 84),

  -- Alice's scores
  (3, 'Math', 88),
  (3, 'Science', 79),
  (3, 'History', 90),
  (3, 'English', 82),
  (3, 'Physics', 91),
  
  -- Bob's scores
  (4, 'Math', 95),
  (4, 'Science', 87),
  (4, 'History', 88),
  (4, 'English', 89),
  (4, 'Physics', 92),
  
  -- Charlie's scores
  (5, 'Math', 82),
  (5, 'Science', 91),
  (5, 'History', 86),
  (5, 'English', 87),
  (5, 'Physics', 90);
  
