# Another Night – Visual Bible

Diese Dokumentation ist die kanonische visuelle Referenz für `Another Night`.
Sie beschreibt, wie das Gebäude, die Kameras, die Bildsprache und die
Eskalation von Anomalien zusammenhängen.

## Leitprinzipien

- Das Gebäude wirkt wie ein altes, teilweise modernisiertes Verwaltungs- oder
  Industriegebäude.
- Jede Kamera zeigt dieselbe Welt aus einem anderen Winkel, nicht ein neues
  Setting.
- Horror entsteht durch Widersprüche, Verzögerungen und falsche Kausalität,
  nicht durch Gore oder Monsterbilder.
- CAM 01 etabliert die visuelle Sprache. Alle weiteren Kameras müssen dazu
  passen.
- CAM 07 ist eine spätere Regelverletzung, aber weiterhin plausibel genug,
  um als Teil desselben Gebäudes zu wirken.

## Dateiübersicht

- [style.md](./style.md) – globaler Stil, Licht, Farben und CCTV-Artefakte
- [architecture.md](./architecture.md) – Gebäudecharakter, Materialien und Kontinuität
- [cameras.md](./cameras.md) – Rolle und Funktion jeder Kamera
- [events.md](./events.md) – visuelle Zustände, Anomalie-Level und Zeitlogik
- [prompts/](./prompts/) – kanonische Master-Prompts pro Kamera

## Arbeitsreihenfolge

1. Zuerst CAM 01 als Referenzbild erzeugen.
2. Dann die übrigen Kameras so anlegen, dass Architektur und Blickwinkel
   konsistent bleiben.
3. Danach pro Kamera nur die vorgesehenen Zustände ableiten:
   `normal`, `movement`, `distortion`, `unknown`, `lost`.
4. Zum Schluss die Event-Bilder gegen die Architektur- und Zeitregeln prüfen.

## Kontinuitätsregeln

- Kameraposition, Field of View und Raumgeometrie bleiben stabil.
- Große Einrichtungsgegenstände und dominante Lichtquellen bleiben zwischen
  den Zuständen erkennbar gleich.
- Neue Elemente dürfen nur dann auftauchen, wenn sie ein Ereignis erklären
  oder die Logik des Raums gezielt brechen.
- Jede Unstimmigkeit muss so aussehen, als gehöre sie noch zum selben
  Gebäude.

## Legacy-Hinweis

`docs/camera-prompts.md` bleibt als Übergangs- und Kompatibilitätsdatei
erhalten. Die dortigen Kurzprompts und Verweise sollen auf diese Visual Bible
führen, nicht neben ihr eine zweite Quelle der Wahrheit bilden.
