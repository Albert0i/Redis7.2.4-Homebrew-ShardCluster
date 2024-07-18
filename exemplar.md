### exemplar

“That, too, is my watchword. Method, order, and the little gray cells.”


#### Prologue
Why people prefers to putting things in tabular form? Because it's the most natural and effective way. Because we are taught and tamed to do so... 

Hearly can i recollect the days without RDBMS for I have been working with them for more than three decades. The DDL and DML syntax is deep in my bone and marrow, rigid schema has planted in my subconscious. Never was i heard of, thought of and dreamed of other means... 


#### I. Address book 
Address book is a typical exemplar of tabular data. As social circle grows in size, repeatedly looking up our address book is quite time-consuming. Usually, address book are categoried by A~Z, to look up "Roger Ackroyd", just starts on category "R" and onward. This greatly simplify and speed up the search process. 

As we delve into finer grain of address book, we found that "All entries are equal, but some entries are more equal than others", ie. changes on some entries are more often than the others. In the same way, some entries are more repeatedly accessed than the others. 

What if our address book contains millions of entries, we need other means other than simple categorization. We need to differentiate between ephemeral and durable data, to differentiate between frequently access and infrequently access data. 

RDBMS is another exemplar of tabular data with unparalleled power on table joining and aggregation, and yet has naught to make out propensity of data. The access method is none other than `index scan` and `full table scan`. 


#### II. Students' Score 
We are going to setup tables to record students and scores on each subject.  
```
CREATE TABLE Students (
  StudentID INT PRIMARY KEY AUTO_INCREMENT,
  StudentName VARCHAR(50),

  INDEX idx_StudentName (StudentName ASC)
);

CREATE TABLE Scores (
  ScoreID INT PRIMARY KEY AUTO_INCREMENT,
  StudentID INT,
  Subject VARCHAR(50),
  Score INT,

  INDEX idx_StudentID (StudentID),
  INDEX idx_Subject_Score (Subject, Score),
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);
```

Besides primary key, a secondary index is created on Students table: 
```
INDEX idx_StudentName (StudentName ASC)
```

Semantically speaking, it indicates that we are going to acccess Students table by StudentName, even though it is not mandatory to do so. And Scores table: 
```
  INDEX idx_StudentID (StudentID),
  INDEX idx_Subject_Score (Subject, Score),
```

It indicates that we are going to access Scores table using StudentID, and combination of Subject and Score, even though it is not mandatory to do so. 

```  
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
```

To enforece a restriction on Score must based on Student. 

Take a look at the following code fragment:
```
HSET Students:1 studentName 'John' math 90 science 85 history 92 english 88 physics 87 
HSET Students:2 studentName 'Jane' math 78 science 92 history 85 english 90 physics 84 
HSET Students:3 studentName 'Alice' math 88 science 79 history 90 english 82 physics 91 
HSET Students:4 studentName 'Bob' math 95 science 87 history 88 english 89 physics 92 
HSET Students:5 studentName 'Charlie' math 82 science 91 history 86 english 87 physics 90 
```

Without schema, we store domain objects in hash. 
```
ZADD Students:math 90 1 78 2 88 3 95 4 82 5
ZADD Students:science 85 1 92 2 79 3 87 4 91 5
ZADD Students:history 82 1 85 2 90 3 88 4 86 5
ZADD Students:english 88 1 90 2 82 3 89 4 87 5
ZADD Students:physics 87 1 84 2 91 3 82 4 90 5

ZADD Students:names 1 'John' 1 'Jane' 1 'Alice' 1 'Bob' 1 'Charlie'
```

And sex more Sorted Sets for index purpose. To access by student 3, simply use: 
```
HGETALL Students:3
1) "studentName"
2) "Alice"
3) "math"
4) "88"
5) "science"
6) "79"
7) "history"
8) "90"
9) "english"
10) "82"
11) "physics"
12) "91"
```

To list scores on history in descending order: 
```
ZREVRANGE Students:history 0 -1 WITHSCORES
1) "3"
2) "90"
3) "4"
4) "88"
5) "5"
6) "86"
7) "2"
8) "85"
9) "1"
10) "82"
```


#### III. Students' Score (cont.)


#### VI. Bibliography 
1. [Moving from Relational to Key-Value Databases](https://www.memurai.com/blog/moving-from-relational-to-key-value-databases)
2. [Getting Started with Redis in C# using StackExchange.Redis](https://medium.com/@sadigrzazada20/getting-started-with-redis-in-c-using-stackexchange-redis-353a9d65a136)
3. [Five Best Ways To Use Redis With ASP.NET MVC](https://www.c-sharpcorner.com/article/five-best-ways-to-use-redis-with-asp-net-mvc/)
4. [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/)
5. [The murder of Roger Ackroyd](https://www.gutenberg.org/cache/epub/69087/pg69087-images.html)


### Epilogue 
```
using System;
using StackExchange.Redis;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Create a connection to the Redis server
        var options = ConfigurationOptions.Parse("127.0.0.1:6379"); 
        options.User = "alberto"; 
        options.Password = "123456";
        options.AbortOnConnectFail = false;
        
        ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(options);

        // Get a reference to the Redis database
        IDatabase db = redis.GetDatabase();

        string name = db.StringGet("name");
        string age = db.StringGet("age");
        string foo = db.StringGet("foo");        

        redis.Close(); 
    }
}
```

### EOF (2024/07/19)
