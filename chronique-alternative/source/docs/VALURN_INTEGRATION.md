# Valurn Saël · intégration technique

## Fichiers
- `src/valurn-quests.ts` : `VALURN_QUESTS` (q1 à q7), `VALURN_RELATION_BEATS`, `valurnQuestStage`, `valurnJournalEntry`.
- `src/valurn-market.ts`, `src/valurn-market-ui.tsx` : registre du salon (Q5, contre-bluff), état `GameState.valurnMarket`, fenêtre `valurn-market`.
- `src/valurn-living-world.ts` : connaissances, 8 confidences, lettres (dont tierces), 3 invitations.
- `src/valurn-dates.ts`, `src/valurn-home-date.ts`, `src/valurn-date-intimacy.ts`, `src/valurn-ambient.ts`.
- `src/valurn.css` (importé par `main.tsx`).

## Chaînage
- Q1 exige `campaign-imperial-audience` ; chaque quête exige la précédente ; Q6 exige `valurn-market-done`.
- Lieux / périodes : marché·matin (Q1, Q3, Q5), salle d'audience·soirée (Q2, Q6), rues·après-midi (Q4, Q7).
- Routine : Valurn dans `algratal-streets` les après-midi de jour pair.
- Fin de Q5 : ouverture du registre ; `finishValurnMarket` pose `valurn-market-done`, `valurn-market-result:*`, `valurn-market-reaction:*`, la connaissance `knows_valurn_seeded_leads`, puis avance la période. Reprise et rejeu (sans effet) depuis le Journal.
- Rendez-vous et logis : seulement après `valurn-q7` (fin de série), stade 5, désir ≥ 20. Le choix initial pose `valurn-date-branch:<dateId>:<branche>` (une seule par lieu, `withoutReplacedBranchFlags`). L'intimité lit cette branche (`valurnIntimacyContext`).

## Sauvegarde (v18 inchangée)
`migrateValurnSave` (après `migrateBellirithSave`) : retire `valurn-0..4` de l'historique, pose `valurn-legacy-scene:N`, `valurn-legacy-arc`, `valurn-refonte-v1`, retire `valurn-accountability`, conserve le stade ; `hydrate` valide `valurnMarket`. Aucun champ de version modifié.

## Outils développeur
Options › Session › « Valurn · Les trois mensonges du grand parieur » : placer avant Q1 à Q7, marché en attente, « Série achevée » (ouvre les rendez-vous), 9 branches de rendez-vous.

## Contrôle éditorial
Une liste de vocabulaire interdite est vérifiée sur tout le corpus Valurn et sur le bundle publié (contrats 12 bis et E7). La confidence du regret ne nomme ni ne genre le proche.
