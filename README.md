# Prüfungskompass · IHK-Prüfungsrechner für Ausbildungsberufe

Stand der dokumentierten Prüfung: **21.10.2026**

Interaktive, lokal im Browser rechnende Seite zur überschlägigen Überprüfung der Bestehensbedingungen. Enthalten sind:

1. Mechatroniker:in (bisheriger Testballon)
2. Industriemechaniker:in
3. Elektroniker:in für Automatisierungstechnik
4. Elektroniker:in für Betriebstechnik
5. Maschinen- und Anlagenführer:in
6. Chemikant:in
7. Anlagenmechaniker:in (Industrie/IHK, **nicht** SHK-Handwerk)

## GitHub Pages: Veröffentlichung ohne Buildsystem

Ein neues öffentliches Repository erstellen, beispielsweise `pruefungskompass`. Die **drei Dateien `index.html`, `style.css` und `app.js`** direkt im Hauptverzeichnis hochladen. `README.md` und `PRUEFLOGIK_UND_QUELLEN.md` können ebenfalls hochgeladen werden, sind für die Funktion jedoch nicht nötig.

In GitHub unter **Settings → Pages → Build and deployment** die Quelle `Deploy from a branch`, Branch `main`, Verzeichnis `/(root)` auswählen und speichern. Nach erfolgreichem Deployment wird die Seite unter `https://BENUTZERNAME.github.io/pruefungskompass/` erreichbar sein. Dies ist nur ein URL-Schema, kein verifizierter Live-Link.

Es werden kein npm, keine Bibliotheken, keine Datenbank, kein Backend und kein Tracking-Skript eingesetzt. Nach dem Download aller drei Dateien läuft der Rechner ebenfalls offline, wenn `index.html` geöffnet wird.

Die Link-Fragmente `#mech`, `#im`, `#eat`, `#ebt`, `#maf`, `#chem` und `#am` öffnen direkt den jeweiligen Ausbildungsberuf.

## Was berechnet die Webseite?

* Gewichtete Punktzahlen unter Beachtung der jeweiligen Ausbildungsordnung
* Berufsabhängige, **einzeln ausgewiesene** Bestehensbedingungen
* Grün/rot gekennzeichnetes vorläufiges Ergebnis; angeheftete Statusleiste auf Smartphones
* Optionale Aufteilung von Teilaufgaben **nur**, wenn eine Gewichtung belastbar angegeben ist; andernfalls Eingabe der Fachgesamtpunkte
* Simulierte mündliche Ergänzungsprüfung mit Verhältnis schriftlich:mündlich **2:1**, nur wenn ein zum Bestehen führender Weg rechnerisch erreichbar ist
* Verlinkte Rechtsgrundlagen der Bundesverordnungen und prüfungsspezifische PAL-Seiten

**Wichtig:** Prüfungsrechtliche Vorgaben und offizielle IHK-Ergebnisse gehen der Simulation vor. Die Anwendung arbeitet mit intern ungerundeten Werten. Die IHK kann Zwischenergebnisse und Noten nach ihrer Prüfungs- bzw. Bewertungsordnung runden. Die Auswahl oder Bewilligung einer mündlichen Prüfung erfolgt durch die zuständige IHK bzw. den Prüfungsausschuss, nicht durch den Rechner.

## Qualitätssicherung / Pflege

* Berufsregelungen und amtliche Primärquellen stehen in `app.js` als Datenstruktur (`jobs`, `SOURCES`, `PAL`).
* Detailerläuterungen und Prüftabellen: `PRUEFLOGIK_UND_QUELLEN.md`.
* Fachliche Regressionstests mit Node.js: `node test_logic.js` (im Projektpaket zum internen Testen); Browserprüfungen mit `python test_browser.py` und Playwright/Chromium.
* Vor einer breiten Bereitstellung die Ergebnisse **durch eine zweite fachkundige Person** gegen die für die betroffenen Jahrgänge geltende Verordnung und die konkrete Prüfungsübersicht der IHK/PAL prüfen lassen. Relevant insbesondere bei Änderungen und Altverträgen.
* Beispiele zum Testen: 50 Punkte in allen Bereichen muss bestanden sein; eine fehlende Eingabe darf niemals als bestanden gelten; 49,9 in zwingenden Praxisfächern muss nicht bestanden ergeben; eine schwache TAP 1 darf bei den gestreckten Prüfungen durch hervorragende TAP 2 ausgeglichen werden, sofern auch die anderen Bedingungen erfüllt sind.

## Rechtliches vor Veröffentlichung im Namen der Schule

Der Quellcode enthält bewusst **keinen erfundenen Betreiber, kein fiktives Impressum und keine fingierte Datenschutzerklärung**. Vor der öffentlichen Verlinkung für ganze Jahrgänge sind mit der Schule bzw. dem Träger Anbieterkennzeichnung, Datenschutzhinweise für GitHub Pages, organisatorische Verantwortung und jährliche Pflege zu klären. Die in der App eingegebenen Punkte werden nicht an den Server übertragen; der Hoster verarbeitet technisch bedingt beim Seitenaufruf Verbindungsdaten.

Alle Namen und Texte sind auf den Prüfungsrechner als **nicht amtliches Hilfsmittel** ausgelegt.
