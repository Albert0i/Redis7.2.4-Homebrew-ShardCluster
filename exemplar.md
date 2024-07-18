### exemplar

“That, too, is my watchword. Method, order, and the little gray cells.”


#### Prologue
Why people prefers to putting things in tabular form? Because it's the most natural and effective way. Because we are taught and tamed to do so... 


#### I. Address book 
Address book is typical exemplars of tabular data. As acquaintance grows in size, repeatedly looking up our address book is quite time-consuming. We need to way to make life easier. Usually, address book are categoried by A~Z, to look up "Roger Ackroyd", just starts on category "R" and onward. This greatly simplify and speed up the search process. 

As we delve into finer grain of address book, we found that "All entries are equal, but some entries are more equal than others", ie. change of some entries are more often than the others. This is quite natural since some data are more transient than the others. In the same way, some entries required repeated access than the others. 

If our address book contains millions of entries, we need methods other than a simple categorization. To contine with our address book, we need to differentiate between ephemeral and durable data, to differentiate between hot and cold data. 

RDBMS is another exemplar of tabular data with unparalleled power on table joining, and yet has naught to make out propensity of data, the access method is always index scan or full table scan. 


#### II. Students' Score 


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
        var options = ConfigurationOptions.Parse("127.0.0.1:6379"); // host1:port1, host2:port2, ...        
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
