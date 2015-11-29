# 1DV449_oklib08
## Laboration 1, [duschskrapan](http://duschskrapan.azurewebsites.net/)
### Finns det några etiska aspekter vid webbskrapning. Kan du hitta något rättsfall?
Att skrapa en sida är egentligen ingen större teknisk skillnad mot om en människa läser sidan. Däremot kan det bli problematiskt beroende på vad skrapan sedan använder informationen till. Vissa skrapar är till för att samla mailadresser att spamma eller hitta kommentarsfält att spamma. Det finns också robotar som skrapar sidor och sedan sätter ihop informationen till egna sidor för att locka klick till reklam. Där är främsta problem att upphovsrätten inte respekteras.
### Finns det några riktlinjer för utvecklare att tänka på om man vill vara "en god skrapare" mot serverägarna?
* Belasta inte servern. Servern kan ha en klen uppkoppling så bara för att min skrapa klarar trafiken betyder inte det att den servern jag skrapar klarar trafiken.
* Ta hand om din robot. Det är viktigt att veta vad ens robot gör och att om den skulle spåra ur så upptäcker man det och kan stoppa den. [Här](https://www.cs.washington.edu/lab/webcrawler-policy) finns ett exempel på en robot som fastnade i en loop, inte så lyckat.
* Lämna dina kontaktuppgifter. Se till att det går att få tag på dig om någon skulle stöta på problem med din robot.

### Begränsningar i din lösning- vad är generellt och vad är inte generellt i din kod?
#### Generellt
* Det finns inget hårdkodat, förutom att de tre olika sidorna innehåller orden "cinema", "dinner" och "calendar". Det är den informationen som skrapan har hårdkodat för att veta vart den ska gå vidare.
#### Ej generellt
* För att få fram vilka tider som är lediga på restaurangen letar skrapan efter syskon till `input`. Skulle bokningen ligga nere kan inte skrapan hitta några lediga tider.
* Skrapan förutsätter att alla sidorna finns på samma subdomän. Skrapan lagrar den inmatade url:en och lägger på de länkarna den skrapar fram på den url:en för att gå vidare till nästa sida.

### Vad kan robots.txt spela för roll?
I robots.txt kan webbplats-ägaren ange om vilka begränsningar som gäller för olika typer av robotar.
______
## Laboration 2
Rapporten finns på engelska [här](https://github.com/OskarKlintrotSkolarbeteWP14/1DV449_oklib08/blob/master/Laboration%202/report.md).
