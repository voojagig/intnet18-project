



# The Flea Market finder

Betygsmål: B


- Vi vill bygga en hemsida där man som registrerad användare (TODO) kan söka efter (TODO) eller lägga till event (DONE) i form av loppisar som hålls IRL. 

- Eventen kan liknas vid ett event på facebook, med location, tid och beskrivning samt en eller flera användare
som är värdar (DONE)
- Användare kan också anmäla sig som attending till loppisen som antingen säljare eller köpare (DONE)
- Alla som attendat ett event kan starta en direktchatt med eventets värd eller värdar för att ställa frågor. (SKIP)
- De som attendat kan även lägga upp en post i eventet som alla kan se. (DONE)
- Alla tillgängliga loppisar listas på en sida (DONE) och användare kan filtrera fram de som de tror är relevanta, till exempel genom plats, tid eller antal deltagare.(TODO)
- Varje event kan tillskrivas en eller flera kategorier (till exempel Möbler, Kläder osv.) (DONE)
- Användare kan välja vilka kategorier de är intresserade av och får en notifikation då en ny loppis med en kategori de är intresserade av läggs upp på sidan. (TODO)

Ramverk som vi planerar att inkludera är Bootstrap, Angular, Node, Express, AJAX, Google Maps API, Mongoose och MongoDB.


# Exempelidéer: 

1 person D
Ett forum byggt i Laravel.
tabeller: trådar, inlägg, användare
Sidor: huvudsida (där trådar listas), trådsida (där trådens innehåll visas), användarsida (där användarens info visas).
kommentarer:
Går att utöka till 2 personer och B, man lägger till medelanden/chatt, man live-feedar nya kommentarer och ändringar av poster och man lägger till subforum samt admins. 

2 personer B/A
Ett kösystem byggt med en backend i Express och med en frontend i Angular(B)/Android(A) tabeller: Kö, person, kommentarer, log-entry, admins, messages.
Sidor: Kö-listning (där alla köer listas), kö-sidan (där själva kön visas), admin-sidan (där man kan lägga till och ta bort admins och göra inställningar för kön), statistik-sidan (där man kan göra enkla uppslagningar för att få ut statistik för kursen).
Kommentarer:
Om ni vill vara 3 personer eller vill ha inspiration be en assistent visa vilken funktionalitet som finns i det nuvarande systemet. Det mesta kan bara ses om man är assistent/lärare. 

2 personer B/A
Ett spel byggt med en backend i Express och med en frontend i Angular(B)/Android(A) tabeller: person, highscore, matcher, chatthistorik.
Sidor: Inloggning där man skriver in användarnamn och lösenord, användar-sida där man kan ändra sina personliga detaljer, highscore/historik där du kan se hur folk har gjort historiskt, lobby där du kan se de andra spelarna som vill spela, själva spelet.
Själva spelet kan vara hur enkelt som helst, ni kan ha att man ska skaka på mobilen (gyroskop), klicka på knappar när de dyker upp, ovs. Det viktiga här är att ni feedar datan till servern så att man kan se live hur det går. Tanken är att man ska spela mot varandra för att se att datan feedas ordentligt. Ni skulle annars kunna ha en annan monitor-sida om ni vill köra single-player. 

Kommentarer:
Vill ni vara 3 personer så får ni verkligen hitta på något mer komplicerat på den här. Den är lite i tunnaste laget för två personer som den är och man borde hitta på något mer för ett A.


# Krav:

●  Specifikation godkänd.

●  Ramverket ska vara baserat på MVC eller likvärdigt komplex design. Projektet måste såklart vara implementerat enligt standarden för ramverket. Är du osäker, fråga.

●  Visar god praktisk förståelse av DOM:en och hur du kan interagerar med den (god användning av HTML, javascript och CSS). För A ska du visa motsvarande kunskap för design i mobilklienten.

●  Har någon rimlig form av databasinteraktion.

●  PER PERSON (minimumkrav för att vi ens ska kolla på projektet/förslaget)

○ MINST 500 rader kod, vill du vara säker på att var godkänd bör du ha åtminstone 750 rader kod 

○ 2+ unika tabeller med 3+ kolumner per tabell givet BCNF. Bör helst ligga närmare 3 tabeller med 4+ kolumner om du vill vara säker.

●  Rimlig säkerhet. Riktiga certifikat är för omständligt för den här kursen, men ni bör sätta upp den så att det hade varit säkert OM https användes. Ni förväntas inte implementera det själva utan bara kunna hitta färdiga implementationer som löser det åt er. Vanligaste saken är hashning av lösenord som skiljer sig mycket från annan kryptografisk hashning. Kolla på följande länk som referens: https://gist.github.com/tqbf/be58d2d39690c3b366ad (Länkar till en externa sida.)Länkar till en externa sida.

●  Designen bör vara grundläggande Bootstrap eller bättre.


____

# Lab5 node-angular
This is the setup reference for lab 5 in the IntNet course.
The setup focuses on showing all the basic features of Nodejs and Angular while keeping it quite small and easy to understand. While not everything is perfect in terms of how to structure Nodejs/Angular it is a very good basic structure to build smaller applications without having to do a major refactoring.

When molding this setup into the project of your desire it's very important that you work incrementally. Angular is not always known to be very nice in it's error messages and HTML parsers are quite terrible in figuring out where you made an error.

For those who wants to do the project in Node/Angular i heavily recommend that you do this lab properly since you will most likely be able to use this lab as a base for the project.

## Setup
To run this you need to:
1. git clone this project
2. install node, latest version should work (tested with 6.2.2)
3. run npm install
4. run npm start

## Structure
The code is split into 2 very distinct part: API:server (app) and front end (public).

#### API:server
Written in Nodejs this simplistic structure will last for a few hundred lines or so before you want to start breaking down controller and model into their own folders and files. The first one to be done should probably be to break down the model into one file per class.

**index.js:** This is the main file and is both the most and least important one. You probably won't need to touch it very much to complete the lab, but it is the core to understanding how everything works.

**model.js:** This is where the data-structures are defined and how the data is related.

**controller.js:** defines what is supposed to happen for all api requests that are sent through http. Most are simply for fetching data.

**socketController.js:** Defines what is supposed to happen for all "interactive" events where the client wants to reach other clients or when the server wants to contact a/all clients.


#### Client:
The client is written in angular and showcases the basic structure any angular project. Everything has been put in the same folder to lower the initial complexity.

**index.html:** This is similarly to the index.js in the back end the most important file, and also the one you will probably change the least. The important thing to notice here is that it contains the navbar (since it should always be there) and <div ng-view></div> which declares that this section should contain dynamically loaded html.

**app.js:** Defines how the modules are interconnected and currently also defines routing and what code to associate to what sub-page.

**controllers.js:** This is the meat of the logic for the client. Here all the functions, events, ajax-calls and what not are defined for the entire application. This should obviously be split up for a larger app, but is more than good enough for the labb.

**main.less:** CSS written in a language that is then compiled to CSS. This files hasn't gotten much love during the coding and might even contain dead code.

**\*.html:** These are the "views" of the client and contains information about what data should be mapped where and how to display it.

**services.js:** this is where a large part of the angular "magic" happens. Here we define globally accessible resources and define helper packages that is used throughout the application.
