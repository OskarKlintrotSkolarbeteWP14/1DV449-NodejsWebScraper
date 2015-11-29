# Assignment 2
by Oskar oklib08 Klintrot

## Security Issus

### Injection

#### Background

Code injection have been the number one most critical security flaw since 2010 [1] [2] and is therefore the first tested here. It is a very simple attack that can make a severe impact on an application [1, s.7]. To prevent this attack the developer could use a parameterized query [1, s.7].

#### Technical Description

It is possible to login with `foo' OR '1'='1`.  after removing the `required` attribute from the email input-tag, or typing in an email address. For some reason though you get logged in as "user2" no matter what email you use, or not use. Probably because "user2" is first in the database. The hack works because `foo' OR '1'='1` is inserted directly into the sql-statment `SELECT * FROM user WHERE email = '" + username +"' AND password = '" + password +"'` as `password`. `'foo' OR '1'='1'` will always return true, since 1 == 1, and you can therefore login without using correct credentials.

### Cross-site Scripting (XSS)

#### Background

The idea of XSS is to put your code onto someone else's web site, either to get information right away or to store the code onto the website so that someone else that uses that page is attacked [3]. The attack could be anything from a simple script-tag to something more elegant [4]:
```
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```

#### Technical Description

Inserting the code below in a message is an interesting form of stored XSS [3] since at least Chrome (but not Edge) actually in some cases will prefill the saved username and password for the site into the form, even if the form is hidden! If you then open up the devtools you will see the stored username, password and cookies in the console. In Edge you will only see the cookies but with the session cookie you can still attack the user. Keep reading down below for that! Preventing XSS is done by proparly escaping/sanatizing all inputs from the user [1, s.9] and all output to the user [6].
```
<form hidden method="POST" action="XSS">
    <input type="text" id="username" name="username">
    <input type="password" id="password" name="password">
    <img src="#" onerror="console.log([$('#username').val(), $('#password').val(), document.cookie])">
</form>
```

### Broken Authentication And Session Management

#### Background

Broken authentication and session management is the second most critical security flaw after code injection [1]. This includes both that the attacker can use the session id to pretend being someone else or that the passwords themself is not properly hashed in the database so if the attacker get access to the database he can use other users username and password [1, s.8].

#### Technical Description

If the attacker gets hold on the session id he can just go to the site, replace the content in his session cookie with the stolen session id. He can then just go to `/message` and start typing as the other user. Even after the user has logged out the attacker can still use the login since the application is not resetting the session. It's not even login the user out proparly so if you log out you can, on the same computer, go to `/message` and then you're logged in as the previous user. Also, in the database the passwords are stored unhashed.

OWASP recommends using an already existing secure session management from a framework ie in combination with a sequre transport layer as HTTPS [5] and also hashing and salting the passwords [1, s.8].

### Cross-Site Request Forgery (CSRF)

#### Background

An CSRF attack is done by sending a http request from a website trying to use cookies that already exsist on that computer [1, s.14]. For example, let's say that you're logged in at your bank. Then you visist another page that has malicious code that tries to send a post request to your bank to transfer money to the attackers account. If your logged in the browser takes the cookies on your computer and send them as well. Then the banks server validates the cookies and can confirm that you're logged in and transfers the money. The way to prevent this is use a random token that you have to send together with the post. That way the server can also validate that the request is valid [1, s.14].

#### Technical Description

The application is not using any CSRF tokens and it is therefore easy to write an html-page that posts messages to the message board when you access it:
```
<!DOCTYPE html>
<head></head>
<body onload="document.forms[0].submit()">
  <form action="http://localhost:3000/message" method="POST" hidden>
    <input name="message" value="CSRF"/>
    <input type="submit" value=""/>
  </form>
</body>
```

### Missing Function Level Access Control

#### Background

If the server is incorrect setup the attacker can access files on the server that the attacker shouldn't get access to [1, s.13]. It could be either a web page (for example a normal user that can get access to admin pages just by changing the url) or accessing files stored on the sever [1, s13].

#### Technical Description

The attacker can just simply go to `/static/message.db` and then access the whole database. Note however that this is the only attack I had to actually read the server side code the make. All others where possible through either using common attacks (like XSS and code injection) or reading the data sent to the client (like in the following example about insecure direct object references).

### Insecure Direct Object References

#### Background

If the application has references to, for example, key in the database then the attacker could use this information to manipulate specific data in the database if the user has access to those features or if the application dosen't check if the user is suppossed to have access to these features [1, s.10]. The application could, on the server, map the pk to other keys that is sent to the server in order to avoid exposing the pk to the client [1, s.10]. The application should also always authenticate the user before executing anything [1, s.10].

#### Technical Description

The database key to each messages is written in the html of the client. The function for sending a remove request to the server is also sent to the client in a js-file. Examining the code you find out that you can actually type `MessageBoard.removeMessage(messageID)` (where `messageID` is the id of the message you want to remove) into the console of the devtools to remove a message, even if your not logged in as admin. The id is also exposed at `http://localhost:3000/message/data` wich you find when you examining the code, again in `MessageBoard.js`.

## Miscellaneous

There is empty js-files under `config/enviroment/`.

## References
[1] OWASP, "OWASP Top 10 - 2013," 12 Jun 2013 [Online]. Available: http://owasptop10.googlecode.com/files/OWASP%20Top%2010%20-%202013.pdf. Accessed 29 Nov 2015

[2] OWASP, "OWASP Top 10 - 2010," 19 Apr 2010 [Online]. Available: http://owasptop10.googlecode.com/files/OWASP%20Top%2010%20-%202010.pdf. Accessed 29 Nov 2015

[3] Michael Coate, "Application Security - Understanding, Exploiting and Defending against Top Web Vulnerabilities," CernerEng, 16 Mar 2014 [Online]. Available: https://www.youtube.com/watch?v=sY7pUJU8a7U. Accessed 29 Nov 2015

[4] OWASP, "XSS Filter Evasion Cheat Sheet," 12 Oct 2015 [Online]. Available: https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet. Accessed 29 Nov 2015

[5] OWASP, "Session Management Cheat Sheet," 10 May 2015 [Online]. Available: https://www.owasp.org/index.php/Session_Management_Cheat_Sheet. Accessed 29 Nov 2015

[6] Facebook, "Adding Markdown," in _Tutorial_, 2015. Available: http://facebook.github.io/react/docs/tutorial.html#adding-markdown. Accessed 29 Nov 2015
