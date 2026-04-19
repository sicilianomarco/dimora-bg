# 🏠 Affitti Stanze - Room Rental Website

Un elegante sito web per promuovere il vostro business di affitto stanze nel cuore di Bergamo.

## 📁 Struttura Progetto

```
RoomRentalWebsite/
├── index.html              # Pagina home con descrizione e feedback
├── apartment1.html         # Pagina XXX Appartamento
├── apartment2.html         # Pagina YYY Appartamento
├── css/
│   └── style.css          # Foglio di stile elegante
├── js/
│   └── main.js            # Logica interattiva (gallery, form, etc)
├── assets/
│   └── images/            # Cartella per le foto degli appartamenti
└── README.md              # Questo file
```

## 🎨 Design & Features

### Caratteristiche Implement
✅ **Design Elegante & Responsive** - Perfetto su desktop, tablet, mobile
✅ **Navigazione Fluida** - Menu sticky con link attivi
✅ **Hero Section** - Landing page d'impatto
✅ **Descrizione Azienda** - Home page con features principali
✅ **Pagine Appartamenti** - Layout dedicato per XXX e YYY
✅ **Galleria Fotografica** - Con lightbox interattiva
✅ **Modulo Feedback** - Modulo con valutazione a stelle
✅ **Sistema Approvazione** - Admin panel per approvare commenti
✅ **Design Minimalista** - Colori sofisticati (beige, blu scuro, bianco)

### Tecnologie
- HTML5 Semantico
- CSS3 Moderno (Grid, Flexbox, Animazioni)
- JavaScript Vanilla (no dipendenze)
- LocalStorage per persistenza dati

## 🚀 Come Iniziare

### 1. Clona/Copia il Progetto
```bash
cd /Users/marcosiciliano/Documents/Claude/Projects/RoomRentalWebsite
```

### 2. Aggiungi le Foto
Crea cartelle e carica le immagini:
```
assets/images/
├── apartment-xxx-1.jpg
├── apartment-xxx-2.jpg
├── apartment-xxx-3.jpg
├── apartment-xxx-4.jpg
├── apartment-xxx-common.jpg
├── apartment-xxx-kitchen.jpg
├── apartment-yyy-1.jpg
├── apartment-yyy-2.jpg
├── apartment-yyy-3.jpg
├── apartment-yyy-4.jpg
├── apartment-yyy-common.jpg
└── apartment-yyy-kitchen.jpg
```

### 3. Personalizza i Contenuti

#### Home Page (index.html)
- Modifica la sezione "Chi Siamo" con la vostra descrizione
- Aggiorna i Features secondo le vostre caratteristiche

#### Appartamento 1 (apartment1.html)
- Cambia "XXX" con il nome reale
- Cambia "www" con l'indirizzo reale
- Modifica la descrizione e i servizi

#### Appartamento 2 (apartment2.html)
- Cambia "YYY" con il nome reale
- Cambia "ppp" con l'indirizzo reale
- Modifica la descrizione e i servizi

#### Email di Contatto
- Modifica `info@affittistanze.it` nei link mailto con la vostra email reale

### 4. Apri nel Browser
Apri semplicemente `index.html` nel browser (o usa Live Server)

## 💬 Sistema Feedback & Approvazione

### Flusso
1. **Ospite** compila il modulo feedback con:
   - Nome
   - Email
   - Appartamento
   - Valutazione (1-5 stelle)
   - Commento

2. **Sistema** salva il feedback in localStorage (client-side)

3. **Voi (Admin)** approvate i feedback dal browser:
   - Apri la console (DevTools: F12)
   - Digita: `showAdminPanel()`
   - Inserisci password: `admin123`
   - Approva/rifiuta i feedback uno per uno

4. **Solo i feedback approvati** vengono mostrati pubblicamente

### Gestione Admin
```javascript
// Apri il panel di approvazione
showAdminPanel()

// Cancella tutti i feedback (per testing)
clearAllFeedbacks()
```

### Cambiar Password Admin
Nel file `js/main.js`, riga ~196, modificate:
```javascript
if (adminPwd !== 'admin123') {  // Cambiate 'admin123' con la vostra password
```

## 📧 Integrazione Email/Backend (Opzionale)

Attualmente il sistema salva i feedback in **localStorage** (solo sul browser dell'utente).

Per ricevere i feedback via email o su un database, potete aggiungere:

### Opzione 1: Formspree (Facile)
```javascript
// Nel js/main.js, sostituite saveFeedback() con:
async function saveFeedback(feedback) {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: JSON.stringify(feedback),
        headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) console.log('Feedback inviato!');
}
```
Registratevi su [Formspree.io](https://formspree.io) per ottenere il form ID.

### Opzione 2: Backend Node.js
Potete creare un semplice server Node.js che:
- Riceve i feedback dal form
- Li salva in un database
- Invia email di notifica
- Fornisce un admin panel web

(Chiedete se volete aiuto con questa opzione!)

## 🎯 Prossimi Passi

1. **Aggiunta foto**: Inserite le vostre fotografie degli appartamenti
2. **Personalizzazione testo**: Cambiate placeholders con vostri dettagli
3. **Logo/Branding**: Potete aggiungere logo nella navbar
4. **Mappa**: Aggiungete Google Maps con le posizioni
5. **Form prenotazione**: Aggiungete una sezione per prenotare visite
6. **Backend**: Implementate un sistema vero per salvare i dati

## 🎨 Personalizzazione Design

I colori principali sono definiti in `css/style.css`:
```css
:root {
    --primary: #2c3e50;        /* Blu scuro */
    --accent: #c0a080;         /* Beige/Dorato */
    --light-bg: #f8f7f4;       /* Bianco sporco */
    --text: #2c3e50;           /* Testo scuro */
}
```

Cambiate questi valori per adattare il design al vostro branding.

## 📱 Responsive Design

Il sito è ottimizzato per:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

Tutti gli elementi si adattano automaticamente.

## 🔒 Note Importanti

⚠️ **LocalStorage Limitazioni**:
- I dati rimangono solo nel browser dell'utente
- Se l'utente cancella i dati di navigazione, i feedback scompaiono
- Non è backup-ato

✅ **Soluzione**: Implementate un backend quando andate live

## 📞 Supporto

Se avete domande sulla struttura o volete aggiungere nuove features, fatevelo sapere!

---

**Affitti Stanze - Eleganza e Comfort nel Cuore di Bergamo** 🏠
