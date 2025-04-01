# SDP2 Frontend groep 7

- Mathisse Snauwaert
- Senne Timbreur
- Joris Coppejans
- Alexander Callebaut
- Kevin Vermeulen

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- ...

## Opstarten

1. Maak een bestand ".env" aan in de hoofdmap
2. Voeg `VITE_API_URL='http://localhost:9000/api'` toe aan het bestand
3. Voer het commando `yarn install` uit.
4. als volgt voer je de commande `yarn dev` uit in je console.

## Testen

1. Voor het testen zorg je dat de api en de website opgestart zijn volgens de gegeven stappen.
2. Voer `yarn cypress open` uit.
3. Cypress is nu opgestart, kies voor "E2E Testing".
4. kies een browser naar keuze en druk dan op "Start E2E Testing in ..."
5. In de Tab "Specs" kies je voor de bestanden om de testen uit te voeren.