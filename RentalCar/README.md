🚗 CarTeh – Web aplikacija za iznajmljivanje automobila

CarTeh je full-stack web aplikacija za iznajmljivanje automobila koja omogućava korisnicima
pregled vozila, rezervaciju i plaćanje, dok owner-i imaju poseban panel za upravljanje
vozilima i rezervacijama.

Aplikacija je razvijena kao projekat iz predmeta Internet tehnologije i implementira
savremene principe web razvoja, bezbednosti i rada sa eksternim servisima.

📌 Osnovne funkcionalnosti
👤 Korisnici

registracija i login (JWT autentifikacija)

pregled dostupnih automobila

provera dostupnosti vozila po datumu

rezervacija automobila

upload potrebne dokumentacije (pasoš, lična karta, vozačka dozvola)

evidencija plaćanja

🚘 Owner

promena uloge korisnika u owner-a

dodavanje i upravljanje vozilima

pregled svih rezervacija za sopstvena vozila

promena statusa rezervacije

dashboard sa statistikom (broj vozila, rezervacija, prihodi)

💳 Plaćanje i integracije

evidencija plaćanja rezervacija

podrška za valute (EUR)

integracija sa eksternim API servisima:

konverzija valuta

države / lokacije

🧱 Arhitektura aplikacije

Projekat je podeljen na dva glavna dela:

carteh/
│
├── server/        # Backend (Node.js + Express)
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── validators
│   ├── configs
│   └── .env
│
├── client/        # Frontend (React + Vite)
│
├── docker-compose.yml
└── README.md

🛠 Korišćene tehnologije
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT autentifikacija

Zod (validacija zahteva)

Swagger (OpenAPI 3.0)

Multer (upload fajlova)

ImageKit (hostovanje slika)

Frontend

React (Vite)

Axios

React Router

Context API

DevOps

Docker & Docker Compose

CI/CD (GitHub Actions)

▶️ Pokretanje aplikacije (Docker – preporučeno)
1️⃣ Kloniranje repozitorijuma
git clone <repo-url>
cd carteh

2️⃣ Podešavanje environment varijabli

U folderu server/ napraviti .env fajl (nije deo repozitorijuma):

PORT=3000
MONGODB_URL=mongodb://mongo:27017
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url

CORS_ORIGINS=http://localhost:5173

3️⃣ Pokretanje aplikacije
docker compose up --build

4️⃣ Pristup aplikaciji

Frontend:
👉 http://localhost:5173

Backend API:
👉 http://localhost:3000

Swagger dokumentacija:
👉 http://localhost:3000/api-docs

📖 Swagger API dokumentacija

API je dokumentovan pomoću Swagger UI, koji omogućava:

pregled svih dostupnih ruta

opis zahteva i odgovora

testiranje API poziva

JWT autorizaciju

🔐 Autorizacija u Swagger-u

Izvršiti login ili registraciju korisnika

Kopirati JWT token

Kliknuti na Authorize

Uneti token u formatu:

Bearer <JWT_TOKEN>

📂 Dokumentovane API grupe

User

registracija

login

dohvat podataka o korisniku

Cars

pregled dostupnih vozila

Booking

provera dostupnosti

kreiranje rezervacije

pregled rezervacija (user / owner)

promena statusa rezervacije

Owner

dodavanje i upravljanje vozilima

dashboard

Document

upload dokumenata

Payment

evidencija plaćanja

Integrations

eksterni API servisi (valute, države)

🔒 Bezbednost

JWT autentifikacija

role-based pristup (user / owner)

validacija svih zahteva (Zod)

zaštita od IDOR napada

CORS konfiguracija

.env fajl nije deo repozitorijuma

✅ Napomena

Projekat je u potpunosti funkcionalan i spreman za evaluaciju.
Swagger specifikacija se automatski generiše iz anotacija u routes/*.js fajlovima,
što olakšava održavanje i proširenje API-ja.