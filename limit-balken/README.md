# limit-balken

Eine Mod für Claude Code. Sie zeigt über der Eingabezeile einen Balken mit dem Stundenlimit (5 Stunden) und dem Wochenlimit des eigenen Claude-Abos: Prozent verbraucht, Farbe (grün unter 70 %, gelb ab 70 %, rot ab 90 %) und Zeitpunkt des Resets. Zusätzlich steht eine kurze Fassung in der Statuszeile, zum Beispiel `5h 35% · Woche 14%`. Die Werte werden nach jeder Antwort neu gemessen.

Der Balken erscheint im Terminal und in der Desktop-App; die Werte gibt es nur mit einem Claude-Abo.

## Installation

In einer Terminal-Sitzung von Claude Code an der Eingabezeile:

```
/plugin install limit-balken --marketplace Muelli-byte/Bernd-M-ller
```

Aus einer Shell:

```bash
claude plugin install limit-balken --marketplace Muelli-byte/Bernd-M-ller
```

Danach die Frage `Add marketplace?` mit `y` beantworten und einen Bereich wählen (Enter für den Nutzerbereich).

In der Desktop-App, wo `/plugin` nicht läuft: auf + neben dem Eingabefeld klicken, dann Plugins, Add marketplace mit `Muelli-byte/Bernd-M-ller`, dann Add plugin.

Ist das Repository privat, klappt die Installation nur für Personen, die es auf GitHub lesen können und deren Rechner schon Zugangsdaten für github.com hat (SSH-Schlüssel oder `gh auth login` und danach `gh auth setup-git`).
