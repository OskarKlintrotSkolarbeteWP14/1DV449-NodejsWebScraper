# 1DV449_oklib08
## Laboration 3, [mashup](http://oskarklintrotskolarbetewp14.github.io/1DV449_oklib08)

### Körbar version
En körbar version av applikationen finns på [trafik.oskarklintrot.se](http://trafik.oskarklintrot.se).

### Testa applikationen lokalt
Efter att ha klonat repot, installera beroendena:
```
cd <repo folder>
npm install
```

Nu kan du köra en lokal server med live preview:
```
npm start
```
Appen finns på http://localhost:3000

För att bygga en statisk sida kör:
```
npm run build
```

### Reflektionsfrågor
#### Vad finns det för krav du måste anpassa dig efter i de olika API:erna?

##### SR

SR har inga speciella regler utan skriver:
> Det finns inga begränsningar på antalet anrop eller dylikt, men var snäll mot APIet och gör så få anrop som möjligt. [1]

Av den anledningen så cachar jag svaren samt utvecklar mot en lokal kopia på ett tidigare svar.

##### Leaflet / Mapbox

Applikationen använder sig av Leaflet:s bibliotek och Mapbox API. Mapbox är, precis som till exempel Google Maps, ett kommersiellt API där kraven får ställas utifrån projektets ekonomiska begränsningar och användarnas bandbredd. Mapbox tillåter 50'000 anrop utan kostnad [2]. Detta kan vara ett skäl till att cacha kart-datan lokalt. Ett annat skäl till att cacha data är att varje kartbild är en png-fil som laddas hem, det blir med andra ord mycket data som ska laddas in och genom att cacha datan skulle bättre prestanda på främst mobila enheter kunna uppnås.

#### Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?

Applikationen cachar inte kartdatan alls då tiden inte räckt till för att implementera en sådan funktion. Hade tiden funnits hade det inte varit orimligt att cacha datan väldigt länge, till exempel en månad, då vägarna oftast ligger där de ligger.

Datan från SR cachas bara i en minut då de inte sällan släpper ny information med bara någon minuts intervaller. Cachningen gör ändå att det maximalt kan bli 60 anrop på en timme per användare.

#### Vad finns det för risker kring säkerhet och stabilitet i din applikation?

Kartan och trafikinformationen laddas in var för sig och även om den ena skulle krasha så kommer den andra fortfarande att fungera. De två största riskerna som jag ser det är att det kommer in farlig kod via något av API:erna, även om React tar hand om till exempel `<script>alert("XSS")</script>`. En sak som kan vara en nackdel ur säkerhetssynpunkt är att hela applikationen är klientbaserad och därmed finns hela källkoden att tillgå. Å andra sidan finns det ingen server att attackera.

#### Hur har du tänkt kring säkerheten i din applikation?

React har som tidigare nämnts ett bra skydd mot olika typer av XSS attacker och det finns inte heller en server att attackera. Det finns heller inte några inloggningar. Dock ligger api-nyckeln uppenbarligen på klienten och inte skyddad på serversidan.

#### Hur har du tänkt kring optimeringen i din applikation?

Båda api:erna anropas samtidigt och informationen kan renderas oberoende av varandra. Trafikinformationen cachas och om tiden hade räckt hade även kartbilderna cachats. jQuery och Bootstrap JS används inte även om Bootstrap används. Dock borde Bootstrap byggas bort då väldigt lite används ur biblioteket samtidigt som det är det biblioteket som tar längst tid att ladda in. Leaflet log tidigare på en CDN men ligger nu lokalt på grund av alltför många serverproblem hos deras CDN.

#### Referenser

[1] Sveriges Radio, "Begränsningar," ur _Sveriges Radios öppna API - (version 2)_ [Online]. Tillgänglig: http://sverigesradio.se/api/documentation/v2/index.html. Hämtad 2015-12-14

[2] Mapbox, "Plans & Pricing," [Online]. Tillgänglig: https://www.mapbox.com/pricing/. Hämtad 2015-12-14
