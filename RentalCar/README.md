# CarTeh – API dokumentacija

Ovaj projekat predstavlja backend web aplikacije za iznajmljivanje automobila (CarTeh).
API je dokumentovan korišćenjem **Swagger (OpenAPI 3.0)** specifikacije.

---

## 📌 Swagger API specifikacija

Za dokumentovanje REST API-ja korišćen je alat **Swagger UI**, koji omogućava:

- pregled svih dostupnih API ruta
- opis zahteva i odgovora
- testiranje API poziva direktno iz browser-a
- autentifikaciju putem JWT tokena

---

## 🔗 Pristup Swagger dokumentaciji

Nakon pokretanja backend servera, Swagger UI je dostupan na sledećoj adresi:


http://localhost:3000/api-docs

## 🔐 Autorizacija (JWT)

Za pristup zaštićenim rutama:

1. Izvršiti login ili registraciju korisnika
2. Kopirati dobijeni JWT token
3. U Swagger UI kliknuti na dugme **Authorize**
4. Uneti token u sledećem formatu:


Bearer <JWT_TOKEN>

## 📂 Dokumentovane funkcionalnosti

Swagger dokumentacija obuhvata sledeće grupe API operacija:

- **User**
  - registracija
  - login
  - dohvat podataka o korisniku
- **Cars**
  - pregled dostupnih vozila
- **Booking**
  - provera dostupnosti
  - kreiranje rezervacije
  - pregled rezervacija korisnika i owner-a
  - promena statusa rezervacije
- **Owner**
  - dodavanje i upravljanje vozilima
  - owner dashboard
- **Document**
  - upload dokumenata (vozačka, pasoš, lična karta)
- **Payment**
  - evidencija plaćanja
- **Integrations**
  - spoljni servisi (države, konverzija valuta)

---

## 🛠 Tehnologije

- Node.js
- Express.js
- MongoDB
- Swagger (swagger-jsdoc, swagger-ui-express)
- JWT autentifikacija

---

## ✅ Napomena

Swagger specifikacija se automatski generiše na osnovu anotacija
u `routes/*.js` fajlovima, što omogućava jednostavno održavanje i proširivanje API dokumentacije.
