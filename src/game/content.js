export const STORAGE_KEY = 'another-night-progress'
export const TICK_INTERVAL_MS = 1000
export const NIGHT_END_MINUTE = 6 * 60

export const cameraDefinitions = [
  { id: 'cam-01', name: 'CAM 01', location: 'Eingang', description: 'Leere Lobby, flackernde Neonröhre.' },
  { id: 'cam-02', name: 'CAM 02', location: 'Flur', description: 'Langer Flur mit mehreren Türen.' },
  { id: 'cam-03', name: 'CAM 03', location: 'Büro', description: 'Schreibtische, Monitore und Aktenregale.' },
  { id: 'cam-04', name: 'CAM 04', location: 'Keller', description: 'Feuchte Stufen, schwere Metalltür.' },
  { id: 'cam-05', name: 'CAM 05', location: 'Lager', description: 'Regale mit anonymen Kisten.' },
  { id: 'cam-06', name: 'CAM 06', location: 'Hinterhof', description: 'Ein verschlossener Zaun im Regen.' },
]

export const sensorDefinitions = [
  { id: 'motion-hall', label: 'Bewegung', location: 'Flur', unit: '' },
  { id: 'door-basement', label: 'Tür', location: 'Keller', unit: '' },
  { id: 'temperature-basement', label: 'Temperatur', location: 'Keller', unit: '°C' },
  { id: 'power-grid', label: 'Strom', location: 'Gebäude', unit: '%' },
  { id: 'lights-office', label: 'Licht', location: 'Büro', unit: '' },
  { id: 'phone-line', label: 'Telefon', location: 'Empfang', unit: '' },
]

export const actionDefinitions = {
  inspect_basement_camera: { energy: -5, attention: 4, effects: ['focus_basement'] },
  lock_basement: { energy: -8, attention: 10, effects: ['locked_basement'] },
  switch_on_hall_lights: { energy: -6, attention: 2, effects: ['hall_lights_on'] },
  ignore_movement: { energy: 0, attention: -1, effects: ['ignored_movement'] },
  answer_phone: { energy: -2, attention: 6, effects: ['answered_phone'] },
  silence_phone: { energy: -1, attention: 1, effects: ['silenced_phone'] },
  archive_note: { energy: -1, attention: 0, effects: ['archived_note'] },
  review_log: { energy: -3, attention: 2, effects: ['reviewed_log'] },
  cut_aux_power: { energy: -12, attention: 8, effects: ['cut_aux_power'] },
  reset_circuit: { energy: -10, attention: 5, effects: ['reset_circuit'] },
  mark_false_alarm: { energy: 0, attention: -3, effects: ['marked_false_alarm'] },
}

export const nightDefinitions = [
  {
    id: 'night-1',
    number: 1,
    title: 'Nacht 1 – Dienstantritt',
    intro:
      'Die erste Schicht beginnt unspektakulär. Das Handbuch fehlt, aber das System läuft. Kurz vor Mitternacht blinkt eine Notiz auf: "Nicht jedem Sensor glauben."',
    outro:
      'Als die Sonne aufgeht, bleibt eine letzte Frage: Wer hat die Warnung hinterlassen, bevor du überhaupt angekommen bist?',
    briefing: [
      'Halte bis 06:00 Uhr durch.',
      'Beobachte Kameras und Sensoren.',
      'Jede Entscheidung verändert spätere Hinweise.',
    ],
    documents: [
      {
        id: 'welcome-note',
        title: 'Begrüßungsnotiz',
        body: 'Schicht 01. Wenn Flur und Keller sich widersprechen, prüfe nicht nur die Kamera. Prüfe dich selbst.',
      },
    ],
    events: [
      {
        id: 'n1-note',
        trigger: { minute: 2 },
        message: 'Unmarkierte Begrüßungsnotiz im System gefunden.',
        type: 'story',
        effects: {
          logs: ['00:02  Systemhinweis entdeckt – "Nicht jedem Sensor glauben."'],
          discoverDocuments: ['welcome-note'],
          knownFacts: ['Die Nachtschicht wurde vorbereitet.'],
        },
      },
      {
        id: 'n1-motion-hall',
        trigger: { minute: 41 },
        message: 'Bewegung erkannt – Flur 2',
        type: 'decision',
        effects: {
          sensorUpdates: [{ id: 'motion-hall', value: 'AKTIV', severity: 'warning' }],
          cameraUpdates: [{ id: 'cam-02', status: 'BEWEGUNG', detail: 'Etwas huscht durch den Flur.' }],
          logs: ['00:41  Bewegung erkannt – Flur 2'],
        },
        choices: [
          { id: 'inspect_basement_camera', label: 'Kamera prüfen', outcome: 'Du schaltest in den Keller. Die Tür wirkt bereits einen Spalt offen.' },
          { id: 'switch_on_hall_lights', label: 'Licht einschalten', outcome: 'Das Hallenlicht springt an, aber der Bewegungsmelder bleibt kurz aktiv.' },
          { id: 'ignore_movement', label: 'Ignorieren', outcome: 'Du protokollierst die Meldung, ohne zu reagieren.' },
        ],
      },
      {
        id: 'n1-contradiction',
        trigger: { minute: 42 },
        message: 'Kamera Flur 2 meldet keinen Kontakt zur vorherigen Bewegung.',
        type: 'story',
        effects: {
          logs: ['00:42  Kamera Flur 2: keine Bewegung sichtbar'],
          sensorUpdates: [{ id: 'motion-hall', value: 'RUHIG', severity: 'normal' }],
          cameraUpdates: [{ id: 'cam-02', status: 'NORMAL', detail: 'Der Flur ist leer. Zu leer.' }],
          knownFacts: ['Sensoren und Kameras widersprechen sich.'],
        },
      },
      {
        id: 'n1-basement-door',
        trigger: { minute: 137 },
        message: 'Türkontakt im Keller ausgelöst.',
        type: 'decision',
        effects: {
          sensorUpdates: [
            { id: 'door-basement', value: 'OFFEN', severity: 'danger' },
            { id: 'temperature-basement', value: '-4', severity: 'danger' },
          ],
          cameraUpdates: [{ id: 'cam-04', status: 'STÖRUNG', detail: 'Starke Interferenzen an der Kellertür.' }],
          logs: [
            '02:17  Tür geöffnet – Keller',
            '02:17  Temperatur -4 °C – Keller',
            '02:18  Kamera Keller zeigt Interferenzen',
          ],
        },
        choices: [
          { id: 'lock_basement', label: 'Keller verriegeln', outcome: 'Das Schloss greift hörbar, obwohl niemand auf der Kamera zu sehen ist.' },
          { id: 'inspect_basement_camera', label: 'Kamera fokussieren', outcome: 'Zwischen dem Rauschen steht für einen Frame eine zweite Tür im Bild.' },
          { id: 'ignore_movement', label: 'Ignorieren', outcome: 'Die Temperatur fällt weiter. Im Log erscheint kein weiterer Fehler.' },
        ],
      },
      {
        id: 'n1-phone',
        trigger: { minute: 211 },
        message: 'Das Telefon klingelt nur ein einziges Mal.',
        type: 'decision',
        conditions: [{ type: 'timeAfter', minute: 210 }],
        effects: {
          sensorUpdates: [{ id: 'phone-line', value: 'KLINGELT', severity: 'warning' }],
          logs: ['03:31  Telefonleitung aktiv – eingehender Ruf'],
        },
        choices: [
          { id: 'answer_phone', label: 'Annehmen', outcome: 'Eine leise Stimme flüstert: "Raum 4 ist nicht auf deinem Plan."' },
          { id: 'silence_phone', label: 'Stumm schalten', outcome: 'Das Klingeln stoppt sofort. Wenige Sekunden später wird CAM 05 schwarz.' },
        ],
      },
      {
        id: 'n1-hidden-room',
        trigger: { minute: 212 },
        message: 'Eine Raumreferenz taucht ohne Plan auf.',
        type: 'story',
        conditions: [{ type: 'flagAny', values: ['answered_phone', 'silenced_phone'] }],
        effects: {
          logs: ['03:32  Unbekannte Raumreferenz – "Raum 4"'],
          knownFacts: ['Es gibt Hinweise auf einen nicht verzeichneten Raum.'],
          buildingState: [{ key: 'unknownRoomReferenced', value: true }],
          cameraUpdates: [{ id: 'cam-05', status: 'UNBEKANNT', detail: 'Für einen Moment zeigt das Lager eine zusätzliche Tür.' }],
        },
      },
      {
        id: 'n1-handover',
        trigger: { minute: 330 },
        message: 'Automatische Schichtzusammenfassung verfügbar.',
        type: 'story',
        effects: {
          logs: ['05:30  Nachtschicht 17 – Personal: unbekannt – Status: abgeschlossen'],
          knownFacts: ['Vor dir gab es mindestens 17 dokumentierte Schichten.'],
        },
      },
    ],
  },
  {
    id: 'night-2',
    number: 2,
    title: 'Nacht 2 – Verzögerte Aufzeichnung',
    intro:
      'Die zweite Nacht startet mit einem bereits geöffneten Verlauf. Einige Einträge wurden gelöscht, aber nicht sauber genug.',
    outro:
      'Kurz vor Ende speichert das System eine Kameraansicht, die es offiziell nicht geben dürfte.',
    briefing: [
      'Achte auf wiederkehrende Widersprüche.',
      'Dokumentiere jede Anomalie im Log.',
      'Ressourcenmangel verändert Folgeereignisse.',
    ],
    documents: [
      {
        id: 'shift-17',
        title: 'Auszug Nachtschicht 17',
        body: '03:17 Bewegung Flur 2. 03:19 Tür Keller offen. 03:19 Kamera Keller SIGNAL VERLOREN. Keine Person im Gebäude gemeldet.',
      },
    ],
    events: [
      {
        id: 'n2-log-fragment',
        trigger: { minute: 6 },
        message: 'Ein Archivfragment wird automatisch wiederhergestellt.',
        type: 'decision',
        effects: {
          discoverDocuments: ['shift-17'],
          logs: ['00:06  Archivfragment wiederhergestellt – Nachtschicht 17'],
        },
        choices: [
          { id: 'review_log', label: 'Archiv lesen', outcome: 'Die Zeiten stimmen fast exakt mit deinen Erlebnissen überein.' },
          { id: 'archive_note', label: 'Für später markieren', outcome: 'Du verschiebst das Fragment, aber es bleibt im Blickfeld.' },
        ],
      },
      {
        id: 'n2-flur-loop',
        trigger: { minute: 77 },
        message: 'Der Flur meldet Bewegung, während die Kamera ältere Bilder zeigt.',
        type: 'story',
        effects: {
          sensorUpdates: [{ id: 'motion-hall', value: 'AKTIV', severity: 'warning' }],
          cameraUpdates: [{ id: 'cam-02', status: 'STÖRUNG', detail: 'Die Aufzeichnung springt sichtbar zwei Sekunden zurück.' }],
          logs: [
            '01:17  Bewegung erkannt – Flur 2',
            '01:18  Kamera Flur 2 wiederholt ältere Bilder',
          ],
          knownFacts: ['Mindestens eine Kamera zeichnet zeitversetzt auf.'],
        },
      },
      {
        id: 'n2-power-dip',
        trigger: { minute: 155 },
        message: 'Das Hilfsnetz bricht ein.',
        type: 'decision',
        effects: {
          sensorUpdates: [{ id: 'power-grid', value: '62', severity: 'danger' }],
          cameraUpdates: [{ id: 'cam-06', status: 'SIGNAL VERLOREN', detail: 'Der Hinterhof verschwindet im Schwarz.' }],
          logs: [
            '02:35  Stromversorgung fällt auf 62 %',
            '02:36  Kamera Hinterhof: SIGNAL VERLOREN',
          ],
        },
        choices: [
          { id: 'reset_circuit', label: 'Stromkreis zurücksetzen', outcome: 'Ein Teil des Bilds kehrt zurück, doch das Rauschen bleibt.' },
          { id: 'cut_aux_power', label: 'Hilfsnetz trennen', outcome: 'Die Monitore flackern. Das System priorisiert unbekannte Bereiche.' },
          { id: 'mark_false_alarm', label: 'Fehler als harmlos markieren', outcome: 'Das System akzeptiert die Meldung, aber das Log sperrt den Hinterhof.' },
        ],
      },
      {
        id: 'n2-room4',
        trigger: { minute: 156 },
        message: 'Eine neue Kamera taucht in der Liste auf.',
        type: 'story',
        conditions: [{ type: 'factKnown', value: 'Es gibt Hinweise auf einen nicht verzeichneten Raum.' }],
        effects: {
          logs: ['02:36  CAM 07 – Raum 4 erscheint ohne Freigabe'],
          dynamicCamera: {
            id: 'cam-07',
            name: 'CAM 07',
            location: 'Raum 4',
            description: 'Ein Raum ohne Bauplan, mit einer zweiten Kontrollstation.',
            status: 'UNBEKANNT',
            detail: 'Auf dem Monitor läuft deine aktuelle Schicht mit einigen Minuten Verzögerung.',
          },
          knownFacts: ['Das System kann Kameras für nicht existierende Räume anzeigen.'],
        },
      },
      {
        id: 'n2-call-back',
        trigger: { minute: 248 },
        message: 'Die Telefonleitung ruft von innen zurück.',
        type: 'decision',
        effects: {
          sensorUpdates: [{ id: 'phone-line', value: 'RÜCKRUF', severity: 'warning' }],
          logs: ['04:08  Telefonleitung aktiv – interner Rückruf'],
        },
        choices: [
          { id: 'answer_phone', label: 'Abheben', outcome: 'Dieselbe Stimme sagt: "Du beobachtest nur die falsche Seite der Tür."' },
          { id: 'silence_phone', label: 'Ruf blockieren', outcome: 'Der Rückruf bricht ab, aber CAM 07 friert auf deinem eigenen Arbeitsplatz ein.' },
        ],
      },
      {
        id: 'n2-finale',
        trigger: { minute: 344 },
        message: 'Das System speichert ein nicht autorisiertes Standbild.',
        type: 'story',
        effects: {
          logs: ['05:44  Standbild gespeichert – Quelle: CAM 07 – Status: autorisiert durch Benutzer'],
          knownFacts: ['Jemand verwendet deine Kennung, ohne dass du dich angemeldet hast.'],
        },
      },
    ],
  },
]
