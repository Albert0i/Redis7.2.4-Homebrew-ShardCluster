### exemplar

“That, too, is my watchword. Method, order, and the little gray cells.”


#### Prologue
Why people prefers to putting things in *tabular* form? Because it's the most natural and effective way. Because we are taught and tamed to do so... 

Hearly can i recollect the days without [RDBMS](https://en.m.wikipedia.org/w/index.php?title=Relational_database&diffonly=true#RDBMS) for I have been working with them for more than three decades. The [DDL]() and [DML](https://en.wikipedia.org/wiki/Data_manipulation_language) syntax is deep in my bone and marrow, rigid schema has planted in my subconscious. Never was i heard of, thought of and dreamet of other means... 


#### I. Address book 
Address book is a typical exemplar of tabular data. As our social circle grows in size, repeatedly looking up entries is tedious and time-consuming. Usually, address book are categoried by A~Z, to look up "Roger Ackroyd", simply jump to "R" and start to check onward. In this way, the search process is greatly facilitated and sped up. 

As we delve into finer grain of our address book, it is not difficult to find out that *"All entries are equal, but some entries are more equal than others"*, ie. changes on some entries are more often than the others. similarly, some entries are more repeatedly consulted than the others. 

What if our address book contains millions of entries, we need innovations other than simple categorization, ie. to distinguish between ephemeral and durable data; between hot (frequently access) and cold (infrequently access) data. 

RDBMS is another exemplar of tabular data with unparalleled power on table joining and aggregation, and yet has naught to make out *propensity* of data, everything persists on disk as first priority, access methods are `index scan` and `full table scan` all along. 


#### II. Students' Score 
Let's kick start with a *miniature* Students' Score project. To setup tables storing student data and scores on each subject. 
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

Besides primary key, access to Students table by StudentName is expected and secondary index is added accordingly even though it is not mandatory to do so. 
```
INDEX idx_StudentName (StudentName ASC)
```

And so does access to the Scores table by StudentID and composite of Subject and Score. 
```
  INDEX idx_StudentID (StudentID),
  INDEX idx_Subject_Score (Subject, Score),
```

Lastly, to enforece a restriction on Scores table. 
```  
  FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
```

However, in schema-less Redis, domain objects are stored in hash. 
```
HSET Students:1 studentName 'John' math 90 science 85 history 92 english 88 physics 87 
HSET Students:2 studentName 'Jane' math 78 science 92 history 85 english 90 physics 84 
HSET Students:3 studentName 'Alice' math 88 science 79 history 90 english 82 physics 91 
HSET Students:4 studentName 'Bob' math 95 science 87 history 88 english 89 physics 92 
HSET Students:5 studentName 'Charlie' math 82 science 91 history 86 english 87 physics 90 
```

Plus six indexes in Sorted Set. 
```
ZADD Students:math 90 1 78 2 88 3 95 4 82 5
ZADD Students:science 85 1 92 2 79 3 87 4 91 5
ZADD Students:history 82 1 85 2 90 3 88 4 86 5
ZADD Students:english 88 1 90 2 82 3 89 4 87 5
ZADD Students:physics 87 1 84 2 91 3 82 4 90 5

ZADD Students:names 1 'John' 1 'Jane' 1 'Alice' 1 'Bob' 1 'Charlie'
```

To access student no.3 for example. 
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

To list out student's score on history in descending order. 
```
ZREVRANGE Students:history 0 -1 WITHSCORES
1) "1"
2) "92"
3) "3"
4) "90"
5) "4"
6) "88"
7) "5"
8) "86"
9) "2"
10) "85"
```

To list out student's score on history in descending order with names. 
```
SCRIPT LOAD "
local key = KEYS[1]
local id = ''
local score = 0.0
local name = ''
local scores = redis.call('ZREVRANGE', 'Students:'..key,  0, -1, 'WITHSCORES')
local retTable = {}

for i = 1, #scores, 2 do
    id = scores[i]
    score = tonumber(scores[i + 1])
    name = redis.call('HGET', 'Students:'..id, 'studentName')
    table.insert(retTable, { name, score })
end
return retTable "
"a50238803b4bcdada6c1ce307fcd9e79b3afb35c"
```

```
EVALSHA "a50238803b4bcdada6c1ce307fcd9e79b3afb35c" 1 history
1) 1) "John"
   2) "92"
2) 1) "Alice"
   2) "90"
3) 1) "Bob"
   2) "88"
4) 1) "Charlie"
   2) "86"
5) 1) "Jane"
   2) "85"
```

As you can see: 
1. Underlaying data structure for Student is hash; 
2. Indexes are Sorted Set; 
3. No table join, use [Lua](https://www.lua.org/) script instead; 
4. Maintain data and indexes programmatically;

So, what's the point? 
1. Access to Hash is super fast; 
2. Sorted Set is efficient and easy to maintain; 
3. Lua script is used to mix and match between data structures; 
4. Performance doesn't come for free.

In RDBMS, one would write. 
```
SELECT a.StudentName, b.Score
FROM students a, scores b 
WHERE a.StudentID = b.StudentID AND 
      b.Subject = "history"
ORDER BY b.Score DESC
```

| StudentName | Score |
| ----------- | ----------- |
| John | 92 |
| Alice | 90 |
| Bob | 88 |
| Charlie | 86 |
| Jane | 85 |

What happens behind the scenes involves *parsing*, *compilation*, *optimization* and *result retrieval* and *transfer of data*, which makes it an expensive operation even though the aforementioned indexes is used. Let alone hidden cost regarding data distribution and applicability of indexes. 

In Redis, everything is plain and clear, every single operation has a time-complexity and thus overall latency can be estimated easily. 


#### III. Students' Score (cont.)
So far we know that RDBMS has unrivalled power on table joining and aggregation. Redis has no built-in secondary index on it's own. As you can see, we have employed Sorted Set as our secondary index. With the emerge of [RediSearch](https://github.com/RediSearch/RediSearch), Redis is now endorsed with capability of search and aggregation to some extent. 

To create index with [FT.CREATE](https://redis.io/docs/latest/commands/ft.create/). 
```
FT.CREATE Students:idx 
   ON HASH PREFIX 1 Students: SCHEMA 
   studentName AS name TEXT SORTABLE 
   math NUMERIC SORTABLE    
   science NUMERIC SORTABLE 
   history NUMERIC SORTABLE
   english NUMERIC SORTABLE
   physics NUMERIC SORTABLE
```

To find out student "John" with [FT.SEARCH](https://redis.io/docs/latest/commands/ft.search/). 
```
FT.SEARCH Students:idx "@name:john" 
1) "1"
2) "Students:1"
3) 1) "studentName"
   2) "John"
   3) "math"
   4) "90"
   5) "science"
   6) "85"
   7) "history"
   8) "92"
   9) "english"
   10) "88"
   11) "physics"
   12) "87"
```

To find out student(s) with english score 75~85 (inclusive). 
```
FT.SEARCH Students:idx "@english:[75 85]"
1) "1"
2) "Students:3"
3) 1) "studentName"
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

To find out student(s) with math and history score 90~100 (inclusive). 
```
FT.SEARCH Students:idx "@math:[90 100] @history:[90 100]"
1) "1"
2) "Students:1"
3) 1) "studentName"
   2) "John"
   3) "math"
   4) "90"
   5) "science"
   6) "85"
   7) "history"
   8) "92"
   9) "english"
   10) "88"
   11) "physics"
   12) "87"
```

There are lots of combination one can play with. And for. 
```
SELECT Subject, avg(Score), min(Score), max(Score)  
FROM scores
GROUP BY Subject
ORDER BY Subject
```

| Subject | avg(Score) | min(Score) | max(Score) |
| ----------- | ----------- |----------- |----------- |
| English | 87.2 | 82 | 90 |
| History | 88.2 | 85 | 92 |
| Math | 86.6 | 78 | 95 |
| Physics | 88.8 | 84 | 92 |
| Science | 86.8 | 79 | 92 |


Use [FT.AGGREGATE](https://redis.io/docs/latest/commands/ft.aggregate/). 
```
FT.AGGREGATE Students:idx * 
   GROUPBY 0 
   REDUCE avg 1 @english AS avg_english 
   REDUCE min 1 @english AS min_english 
   REDUCE max 1 @english AS max_english 
   REDUCE avg 1 @history AS avg_history 
   REDUCE min 1 @history AS min_history 
   REDUCE max 1 @history AS max_history 
   REDUCE avg 1 @math AS avg_math 
   REDUCE min 1 @math AS min_math 
   REDUCE max 1 @math AS max_math 
   REDUCE avg 1 @physics AS avg_physics 
   REDUCE min 1 @physics AS min_physics 
   REDUCE max 1 @physics AS max_physis 
   REDUCE avg 1 @science AS avg_science 
   REDUCE min 1 @science AS min_science 
   REDUCE max 1 @science AS max_science 
1) "1"
2) 1) "avg_english"
   2) "87.2"
   3) "min_english"
   4) "82"
   5) "max_english"
   6) "90"
   7) "avg_history"
   8) "88.2"
   9) "min_history"
   10) "85"
   11) "max_history"
   12) "92"
   13) "avg_math"
   14) "86.6"
   15) "min_math"
   16) "78"
   17) "max_math"
   18) "95"
   19) "avg_physics"
   20) "88.8"
   21) "min_physics"
   22) "84"
   23) "max_physis"
   24) "92"
   25) "avg_science"
   26) "86.8"
   27) "min_science"
   28) "79"
   29) "max_science"
   30) "92"
```

See! "When one door closes, another opens.", there is always alternatives to get around... Finally, to generate list of students' score on history. 
```
FT.AGGREGATE Students:idx * 
   LOAD 1 @studentName 
   SORTBY 2 @history DESC
1) "5"
2) 1) "studentName"
   2) "John"
   3) "history"
   4) "92"
3) 1) "studentName"
   2) "Alice"
   3) "history"
   4) "90"
4) 1) "studentName"
   2) "Bob"
   3) "history"
   4) "88"
5) 1) "studentName"
   2) "Charlie"
   3) "history"
   4) "86"
6) 1) "studentName"
   2) "Jane"
   3) "history"
   4) "85"
```

So, why *on earth* not to use RediSearch in the first place? 

Well, the reason is simple. RediSearch is an extension module to Redis, with which not all installation is necessarily equipped. In addition, RediSearch only works for Hash and JSON data structure by now. One can check with commands: 
```
INFO modules
# Modules
module:name=ReJSON,ver=20608,api=1,filters=0,usedby=[],using=[],options=[handle-io-errors]
```

```
MODULE list
1) 1) "name"
   2) "ReJSON"
   3) "ver"
   4) "20608"
   5) "path"
   6) "rejson.dll"
   7) "args"
   8) (empty list or set)
```


#### IV. The metrics
Not the least an accurate comparison. 

| Method | Time |
| ----------- | ----------- |
| EVALSHA | 81 µs |
| SORTBY | 67 µs |
| GROUPBY | 103 µs |
| SQL JOIN | 0.6 ms |
| SQL GROUP BY | 1.7 ms |

Where 
1 second = 1,000 milliseconds (ms) = 1,000,000 microseconds (µs)

One thing for sure, moving from RDBMS to Redis is a [paradigm shift](https://en.wikipedia.org/wiki/Paradigm_shift) which requires insightful cognition of data propensity, a fundamental change in ways of storage and retrieval on data of a system, which is both agonizing and tormenting. The only goal is to achieve high performance. If speed doesn't matter, stay where your are, Redis is not ypur cup of tea... 


#### V. Bibliography 
1. [Moving from Relational to Key-Value Databases](https://www.memurai.com/blog/moving-from-relational-to-key-value-databases)
2. [Getting Started with Redis in C# using StackExchange.Redis](https://medium.com/@sadigrzazada20/getting-started-with-redis-in-c-using-stackexchange-redis-353a9d65a136)
3. [Five Best Ways To Use Redis With ASP.NET MVC](https://www.c-sharpcorner.com/article/five-best-ways-to-use-redis-with-asp-net-mvc/)
4. [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/)
5. [The murder of Roger Ackroyd](https://www.gutenberg.org/cache/epub/69087/pg69087-images.html)


#### Epilogue 
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

*PS: Honestly, I don't think it's a good idea to use Redis with C#.*

### EOF (2024/07/19)
