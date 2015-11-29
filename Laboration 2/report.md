# Assignment 2
by Oskar oklib08 Klintrot

## Security Issus

### Injection

#### Technical Description

It is possible to login with `foo' OR '1'='1`.  after removing the `required` attribute from the email input-tag, or typing in an email address. For some reason though you get logged in as "user2" no matter what email you use, or not use. Probably because "user2" is first in the database. The hack works because `foo' OR '1'='1` is inserted directly into the sql-statment `SELECT * FROM user WHERE email = '" + username +"' AND password = '" + password +"'` as `password`. `'foo' OR '1'='1'` will always return true, since 1 == 1, and you can therefore login without using correct credentials.

#### Background

Code injection have been the number one most critical security flaw since 2010 [1] [2] and is therefore the first tested here. It is a very simple attack that can make a severe impact on an application [1, s.7]. To prevent this attack the developer could use a parameterized query [1, s.7].


## Miscellaneous

There is empty js-files under `config/enviroment/`.

## References
[1] OWASP, "OWASP Top 10 - 2013," 12 Jun 2013 [Online]. Available: http://owasptop10.googlecode.com/files/OWASP%20Top%2010%20-%202013.pdf. Accessed 29 Nov 2015

[2] OWASP, "OWASP Top 10 - 2010," 19 Apr 2010 [Online]. Available: http://owasptop10.googlecode.com/files/OWASP%20Top%2010%20-%202010.pdf. Accessed 29 Nov 2015
