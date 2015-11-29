# Assignment 2
by Oskar Klintrot, oklib08

## Table of Content
[Security Issus](#security-issus)
- [Injection](#injection)
  - [Background](#background)
  - [Technical Description](#technical-description)
- [Broken Authentication And Session Management](#broken-authentication-and-session-management)
  - [Background](#background-1)
  - [Technical Description](#technical-description-1)
- [Cross-site Scripting (XSS)](#cross-site-scripting-xss)
  - [Background](#background-2)
  - [Technical Description](#technical-description-2)
- [Insecure Direct Object References](#insecure-direct-object-references)
  - [Background](#background-3)
  - [Technical Description](#technical-description-3)
- [Sensitive Data Exposure](#sensitive-data-exposure)
  - [Background](#background-4)
  - [Technical Description](#technical-description-4)
- [Missing Function Level Access Control](#missing-function-level-access-control)
  - [Background](#background-5)
  - [Technical Description](#technical-description-5)
- [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)
  - [Background](#background-6)
  - [Technical Description](#technical-description-6)
- [Using Components with Known Vulnerabilities](#using-components-with-known-vulnerabilities)
  - [Background](#background-7)

[Performance Issues](#performance-issues)

[Miscellaneous](#miscellaneous)

[References](#references)

________________

## Security Issus

### Injection

#### Background

Code injection have been the number one most critical security flaw since 2010 [1] [2] and is therefore the first tested here. It is a very simple attack that can make a severe impact on an application [1, p.7]. To prevent this attack the developer could use a parameterized query [1, p.7].

#### Technical Description

It is possible to login with `foo' OR '1'='1`.  after removing the `required` attribute from the email input-tag, or typing in an email address. For some reason though you get logged in as "user2" no matter what email you use, or not use. Probably because "user2" is first in the database. The hack works because `foo' OR '1'='1` is inserted directly into the sql-statment `SELECT * FROM user WHERE email = '" + username +"' AND password = '" + password +"'` as `password`. `'foo' OR '1'='1'` will always return true, since 1 == 1, and you can therefore login without using correct credentials.

### Broken Authentication And Session Management

#### Background

Broken authentication and session management is the second most critical security flaw after code injection [1]. This includes both that the attacker can use the session id to pretend being someone else or that the passwords themself is not properly hashed in the database so if the attacker get access to the database he can use other users username and password [1, p.8].

#### Technical Description

If the attacker gets hold on the session id he can just go to the site, replace the content in his session cookie with the stolen session id. He can then just go to `/message` and start typing as the other user. Even after the user has logged out the attacker can still use the login since the application is not resetting the session. It's not even login the user out proparly so if you log out you can, on the same computer, go to `/message` and then you're logged in as the previous user. Also, in the database the passwords are stored unhashed.

OWASP recommends using an already existing secure session management from a framework ie in combination with a sequre transport layer as HTTPS [5] and also hashing and salting the passwords [1, p.8].

### Cross-site Scripting (XSS)

#### Background

The idea of XSS is to put your code onto someone else's web site, either to get information right away or to store the code onto the website so that someone else that uses that page is attacked [3]. The attack could be anything from a simple script-tag to something more elegant [4]:
```
<img src=x onerror="&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041">
```

#### Technical Description

Inserting the code below in a message is an interesting form of stored XSS [3] since at least Chrome (but not Edge) actually in some cases will prefill the saved username and password for the site into the form, even if the form is hidden! If you then open up the devtools you will see the stored username, password and cookies in the console. In Edge you will only see the cookies but with the session cookie you can still attack the user. Keep reading down below for that! Preventing XSS is done by properly escaping/sanatizing all inputs from the user [1, p.9] and all output to the user [6].
```
<form hidden method="POST" action="XSS">
    <input type="text" id="username" name="username">
    <input type="password" id="password" name="password">
    <img src="#" onerror="console.log([$('#username').val(), $('#password').val(), document.cookie])">
</form>
```

### Insecure Direct Object References

#### Background

If the application has references to, for example, key in the database then the attacker could use this information to manipulate specific data in the database if the user has access to those features or if the application dosen't check if the user is suppossed to have access to these features [1, p.10]. The application could, on the server, map the pk to other keys that is sent to the server in order to avoid exposing the pk to the client [1, p.10]. The application should also always authenticate the user before executing anything [1, p.10].

#### Technical Description

The database key to each messages is written in the html of the client. The function for sending a remove request to the server is also sent to the client in a js-file. Examining the code you find out that you can actually type `MessageBoard.removeMessage(messageID)` (where `messageID` is the id of the message you want to remove) into the console of the devtools to remove a message, even if your not logged in as admin. The id is also exposed at `http://localhost:3000/message/data` wich you find when you examining the code, again in `MessageBoard.js`.

### Sensitive Data Exposure

#### Background

Data sent over unencrypted HTTP is really easy to sniff and therefore steel for example an session cookie or even credentials that way [1, p.12].

#### Technical Description

The application is using HTTP but should use HTTPS in order to prevent an attacker listening to the traffic between the client and the server [1, p.12].

### Missing Function Level Access Control

#### Background

If the server is incorrect setup the attacker can access files on the server that the attacker shouldn't get access to [1, p.13]. It could be either a web page (for example a normal user that can get access to admin pages just by changing the url) or accessing files stored on the sever [1, s13].

#### Technical Description

The attacker can just simply go to `/static/message.db` and then access the whole database. Note however that this is the only attack I had to actually read the server side code the make. All others where possible through either using common attacks (like XSS and code injection) or reading the data sent to the client (like in the following example about insecure direct object references).

### Cross-Site Request Forgery (CSRF)

#### Background

An CSRF attack is done by sending a http request from a website trying to use cookies that already exsist on that computer [1, p.14]. For example, let's say that you're logged in at your bank. Then you visist another page that has malicious code that tries to send a post request to your bank to transfer money to the attackers account. If your logged in the browser takes the cookies on your computer and send them as well. Then the banks server validates the cookies and can confirm that you're logged in and transfers the money. The way to prevent this is use a random token that you have to send together with the post. That way the server can also validate that the request is valid [1, p.14].

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

### Using Components with Known Vulnerabilities

#### Background

The app is built on Node.js which is a very minimalistig platform that relies heavily on the developer in order to create a secure web application [6].

## Performance Issues

### 404 Not Found

When opening Chrome DevTools there is two files, `/static/css/materialize.min.css` and `static/js/materialize.js`, that is a 404. The response time where between 15% to staggering 50% of the total response time. On the login-page there is also the file `/assets/js/ie10-viewport-bug-workaround.js` that also is a 404. A smaller but also unnecessary request is the file `b.jpg` that is set as a background image but never used.

### Content Delivery Network (CDN)

Both jQuery and Bootstrap is used on the web application but is hosted on the local server. Loading them from a CDN could improve loading time since they would then be loading a local cach from a server closer to the user and more important, the user probably already have a cached copy of jQuery and Bootstrap since they are common libraries [8, p.18-21].

### Caching

The HTTP headers states that nothing should be cached. This makes the clienten makes request on every pageload. Instead everything except the data with the messages could be chached for a couple of minutes or hours since for example the css or logo wont likely change during that time [8], [9].

### CSS At The Top

There is some CSS that is inline in the `<head>` and some at the bottom of the `<body>`. The browser will wait to render the page until all CSS is loaded to avoid having to rerender the DOM [8, p.37-38]. Therefore, all CSS should be at the top of the page in the head-tag in order for the browser to render the page progressively [8, p.41].

### JS At The bottom

In contrary to CSS, the Javascript should be loaded last. This is because when the Javascript begins to being loaded it blocks the progressive rendering of the rest of the page [8, p.45].

### Do Not Put JS or CSS Inline

All Javascript and CSS should be put in external files and not inline. This because it enables the browser to cache the files, making reloading the pages faster [8, p.56]. It also makes it possible to reuse the code [8, p.57-58].

### Build And Minify JS

The main page contains of two (2) .js-files. They could be built into one file using a build tool and then minified. This would reduce one HTTP-request and also make the file smaller to load [8, p.69]. Also, the jQuery is not the minified version.

## Miscellaneous

There is empty js-files under `config/enviroment/`. The logout-button is always visible. The message board is not automatically updated. The "remove message"-button is hidden per default and you have to activate it (after you have activated it in the code...). For some reason the height of the body is set to 4000px. That's just obscure...

## References
[1] OWASP, "OWASP Top 10 - 2013," 12 Jun 2013 [Online]. Available: http://owasptop10.googlecode.com/files/OWASP%20Top%2010%20-%202013.pdf. Accessed 29 Nov 2015

[2] OWASP, "OWASP Top 10 - 2010," 19 Apr 2010 [Online]. Available: http://owasptop10.googlecode.com/files/OWASP%20Top%2010%20-%202010.pdf. Accessed 29 Nov 2015

[3] Michael Coate, "Application Security - Understanding, Exploiting and Defending against Top Web Vulnerabilities," CernerEng, 16 Mar 2014 [Online]. Available: https://www.youtube.com/watch?v=sY7pUJU8a7U. Accessed 29 Nov 2015

[4] OWASP, "XSS Filter Evasion Cheat Sheet," 12 Oct 2015 [Online]. Available: https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet. Accessed 29 Nov 2015

[5] OWASP, "Session Management Cheat Sheet," 10 May 2015 [Online]. Available: https://www.owasp.org/index.php/Session_Management_Cheat_Sheet. Accessed 29 Nov 2015

[6] Facebook, "Adding Markdown," in _Tutorial_, 2015. Available: http://facebook.github.io/react/docs/tutorial.html#adding-markdown. Accessed 29 Nov 2015

[7] OWASP, "OWASP Node js Goat Project," 8 Mar 2014. Available: https://www.owasp.org/index.php/OWASP_Node_js_Goat_Project. Accessed 29 Nov 2015

[8] Steve Souders, _High Performance Web Sites_. Sebastopol, CA: O'Reilly, 2007.

[9] Kyle Young, "A Beginner's Guide to HTTP Cache Headers," 30 Apr 2013. Available: http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/. Accessed 30 Nov 2015
