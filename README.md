# raumly — Independent Interior Design AI

Ein interaktiver, responsiver Web-MVP für eine KI-gestützte Interior-Design-Plattform. Der Prototyp zeigt den vollständigen Kern-Flow von der Raumerfassung über Stil und Budget bis zur editierbaren Visualisierung und shopübergreifenden Einkaufsliste.

## Enthalten

- Landingpage mit B2C- und B2B2C-Positionierung
- Vierstufiger Onboarding-Flow für Fotos, Grundriss, Maße, Stil und Budget
- Interaktiver Vorher-/Nachher-Regler
- Grundrissansicht und auswählbare Einrichtungskonzepte
- Produktfilter, Favoriten, Shopping-Liste und simulierte Partner-Checkouts
- Optionaler Human-in-the-loop Designer-Check
- Pro-Bereich für Makler, Projektentwickler und Interior Studios
- Responsive Darstellung und reduzierte Animationen für `prefers-reduced-motion`

## Lokal starten

Der MVP ist bewusst ohne Build-Schritt angelegt und kann direkt als statische Website betrieben werden.

```bash
python3 -m http.server 8080
```

Danach `http://localhost:8080` öffnen.

## Deployment

Die Dateien können direkt über GitHub Pages, Netlify, Vercel oder jeden statischen Webhost veröffentlicht werden. Für GitHub Pages unter **Settings → Pages** die Veröffentlichung aus dem Branch `main` und dem Verzeichnis `/ (root)` aktivieren.

## Produktive Integrationen

Der aktuelle Stand ist ein Frontend-MVP. Für ein Produktivsystem sollten als nächste Schichten ergänzt werden:

1. Authentifizierung, Projekte und verschlüsselter Object Storage
2. Room-understanding-Pipeline für Segmentierung, Tiefenschätzung und Grundrisserkennung
3. Maßstabstreues 2D/3D-Raummodell mit Kollisionen und Laufwegprüfung
4. Händlerfeeds mit Verfügbarkeit, Varianten, Preisen und Affiliate-Tracking
5. Generative Render-Pipeline mit konsistenter Geometrie und austauschbaren Produkten
6. DSGVO-konforme Einwilligung, Löschkonzept, Impressum und Datenschutz

## Assets

Die zusammengehörigen Raumvisualisierungen wurden mit OpenAIs integriertem ImageGen-Workflow speziell für diesen Prototyp erzeugt. Arbeitsname und Produktdaten sind fiktiv; genannte Händlernamen dienen ausschließlich der MVP-Demonstration und implizieren keine Partnerschaft.
