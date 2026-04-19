/* ─────────────────────────────────────────────────────────
   LOCAL POIs — places not yet mapped in OpenStreetMap
   ─────────────────────────────────────────────────────────
   HOW TO ADD A MISSING PLACE:
   1. Open Google Maps and find the place
   2. Right-click on it → "What's here?"
   3. Copy the lat/lon shown at the bottom
   4. Add an entry below following the same format

   Available categories:
     restaurant · pizzeria · supermarket · bank
     bar · church · pool · club · transport · train

   All fields in "extra" are optional (use null if unknown).
   ───────────────────────────────────────────────────────── */

var LOCAL_POIS = {

    dalmine: [

        // ── ADD MISSING PLACES BELOW ─────────────────────────────────────────
        // L'Anonimo — not in OpenStreetMap yet. To add:
        //   1. Open Google Maps → search "L'Anonimo Dalmine"
        //   2. Right-click the pin → "What's here?" → copy lat/lon
        //   3. Uncomment and fill the entry below:
        // {
        //     name: "L'Anonimo",
        //     cat:  'restaurant',
        //     lat:  45.?????,
        //     lon:  9.?????,
        //     extra: { phone: null, hours: null, website: null }
        // },

        // ── ADD MORE BELOW ────────────────────────────────────────────────────
        // {
        //     name: 'Nome del posto',
        //     cat:  'restaurant',   // category key (see list above)
        //     lat:  45.?????,
        //     lon:  9.?????,
        //     extra: {
        //         phone:   '+39 035 000000',
        //         hours:   'Mo-Fr 12:00-15:00,19:00-23:00',
        //         website: 'https://example.it'
        //     }
        // },

    ],

    bergamo: [
        // Add Bergamo-area places here using the same format
    ]

};
