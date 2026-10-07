# Bellirith — refonte complète (Acte I)

Bellirith n’est plus une romance de « guérison sans aura » : c’est une démone du désir qui **interfère** avec la campagne. Elle choisit les pires moments pour vous détourner, vous céderez ou vous résisterez, et chaque réponse a un prix concret (compagnons, Désir, statut de favori·te). La refonte suit la consigne Work (§0–§60) ; ordre de priorité canonique : consigne > Tomes > Bible > canon VN/CA > implémentation existante.

## Fil d’interférences (§3–§12)

| # | Après la scène de campagne | Titre | Présents en direct | Diversion si vous cédez |
| --- | --- | --- | --- | --- |
| I01 | `campaign-imperial-audience` | Une sœur dans l’embrasure | Valurn, Iriana | — (première rencontre, pas d’intimité) |
| I02 | `campaign-price-of-aid` | La lettre peut attendre | Iriana, Draven | Le salon des miroirs |
| I03 | `campaign-amanea-letter` | Le courrier de minuit | Draven | Les bains au-dessus de la salle de musique |
| I04 | `campaign-before-light` | Ce que la Lumière ne célèbre pas | Iriana, Draven | Saëlis sur une terrasse |
| IX | `campaign-coalition-preparation` | Chapitre IX réactif | — | La veille de bataille |

- `bellirith-intrusions.ts` : données, 40 variantes (4 intrusions × direct / rattrapage × 5 historiques), flags, tendance, migration, résumé du fil (`bellirithThreadSummary`).
- **Céder** (`bel-i0X-cede-*`) : petit gain d’affection, Désir ≤ 1, pénalités **contextuelles en direct uniquement** (Iriana / Draven perdent de la confiance s’ils étaient là ; la pénalité s’alourdit si vous avez déjà cédé en direct). Le choix ouvre ensuite la diversion intime manuelle — toujours après votre acceptation explicite.
- **Résister** : Désir +4 au minimum (davantage si vous avez déjà cédé), confiance des compagnons présents, flag `bellirith-has-resisted`. Une résistance ne mène jamais à une intimité.
- **Favori·te** : `bellirith-favorite` dès deux acceptations, ou immédiatement avec un choix « défi ». `bellirith-has-slept` après toute intimité réellement vécue.
- **Tendance** : `bellirith-trend:none|ceded|resisted|mixed`, recalculée à chaque résolution ; elle colore préludes, courriers, moments libres, réactions et le duel final.
- **Rattrapage persistant (§9)** : une intrusion manquée (jalon dépassé sans la vivre, ou interrompue par un rechargement) reçoit `bellirith-intrusion:0X:missed` puis une invitation `invite-bellirith-catchup-0X` qui n’expire jamais. Une seule à la fois, dans l’ordre. En rattrapage, **aucune pénalité de compagnon** (les `relationshipEffects` sont retirés) ; seuls Désir / affection et flags s’appliquent.
- **Étape de lien** = intrusions résolues + chapitre IX (max 5). Les trois rendez-vous s’ouvrent à l’étape 5.

## Migration (sauvegarde v18)

`migrateBellirithFlags` : toute sauvegarde qui a dépassé un jalon sans résolution reçoit un rattrapage ; un `live-started` orphelin devient `missed`. Le marqueur `bellirith-refactor-v1-migrated` rend la migration idempotente. Aucune pénalité rétroactive, aucun flag d’intimité inventé.

## Intimités manuelles (§13–§16, §25)

Huit routes (4 diversions, 2 « heures volées », 2 duels de fin d’Acte I) dans `bellirith-intimacy-*.ts`, assemblées par `bellirith-diversion-intimacy.ts` / `bellirith-intimacy-frames.ts` (ouvertures, approches, fins selon l’historique et la source). Chaque route existe en femme / homme / intersexe × tendre / suggestif / explicite / ellipse, 12 séquences minimum.

Mots par mode (min / moy / max) : tendre 496 / 716 / 995 · suggestif 856 / 1056 / 1388 · explicite 1018 / 1286 / 1845 · ellipse 386 / 545 / 678.

Sources des heures volées (`BELLIRITH_FREE_SOURCES`) : invitations, déviation d’une confidence (`bellirith-free-confidence`), propositions des moments libres, rendez-vous salon / marché, logis (`bellirith-home`). Le **duel final** (`date-bellirith-final`) est la seule fin d’Acte I : « Au début, je me disais : je peux te faire céder. Ce soir, j’ai compris que tu pouvais me tenir tête. »

Les relectures (galerie, mode développeur) ouvrent en souvenir : ni horloge, ni relations, ni flags ne changent.

## Rendez-vous (§26–§30)

`date-scenes.ts` + `bellirith-dates.ts` : « Le salon des mauvaises intentions », « Le prix d’une envie », « Coup pour coup ». Préludes selon favori / a dormi / tendance. Pour le dernier, c’est **vous** qui invitez : l’issue propose « « Maintenant. » », « Pas ce soir » ou « Rester proches amicalement ». Clôtures dédiées dans `scene-closures.ts`.

## Confidences, courriers, invitation (§31–§40)

- `bellirith-living-world.ts` : quatre confidences débloquées par le **Désir** (20 / 40 / 60 / 80) — Les mauvaises manières de Bhaal, Ce que je sais de lui, Les néons de Saëlis, Le trou dans le récit — avec option de pousser (Lucidité) ou de dévier vers une heure volée. Deux confidences de Valurn sur Bellirith.
- Faux canon retiré : stase, « mémoire perdue », route de guérison, « soirée sans aura ». L’invitation devient « Le pari de la salle de musique ».
- Sept courriers dynamiques (préférence regrettable, à mon favori, arrière-goût, erratum, et trois lettres de fin d’Acte selon la tendance). Aucun ton thérapeutique.

## Moments libres et réactions (§41–§49)

- `bellirith-ambient.ts` : 19 moments réécrits (provocation, jeu, ennui, défi, marché, rumeur…), avec `requiresFlags` / `excludesFlags` / `promptVariants` et filtrage des choix par flags (`ambient-dialogues.ts`). Trois proposent ponctuellement une intimité (`launchesIntimacy: "bellirith-free"`) — toujours avec des refus qui ne coûtent rien et ne basculent jamais.
- `bellirith-reactions.ts` : quatre moments de Valurn, trois d’Iriana, conditionnés à l’historique réel (méthode de sa sœur, moquerie si vous cédez, sérieux après I04 en direct, registre des refus…).
- Logis (`housing-scenes.ts`, `housing-data.ts`) : rendez-vous « La partie de salon », commentaires d’objets, moments résidents ; l’intimité au logis passe par la route manuelle (`bellirith-home`).
- Les anciens blocs génériques Bellirith de `intimacy-scenes.ts`, `intimacy-routes.ts`, `home-intimacy-routes.ts` sont marqués obsolètes et ne sont plus atteints.

## Fiche et Journal (§50–§52, §58)

La fiche Liens affiche « Interférences · n / 5 » et l’objectif courant (rattrapage en attente, prochaine interférence, chapitre IX, rendez-vous final, fil accompli). La passerelle vers l’Acte II reste explicite : Bellirith n’est pas « résolue », elle est installée.

## Mode développeur

Options → SESSION → Mode développeur :

1. « Préparer toutes les relations » puis éventuellement « Marquer l’Acte I accompli ».
2. Ligne **Bellirith · interférences** : `I0X · direct` / `I0X · rattrapage` (joués pour de vrai : effets, flags, file de rattrapage).
3. **Historique** : « A beaucoup cédé », « A toujours résisté », « Mixte », « Effacer ».
4. **Intimités** (souvenir, sans mutation) : Diversion II / III / IV, Chapitre IX, Heure volée, Duel final.
5. **Confidences & rendez-vous**, **Moments libres** (19 + « Intimité au logis »), **Réactions de Valurn et d’Iriana**.

## Validation

Depuis `chronique-alternative/source` :

```sh
npm test            # inclut test:bellirith
npm run test:bellirith
npm run build
```

`scripts/validate-bellirith-refactor.mjs` vérifie : jalons et absence de double direct ; file et persistance du rattrapage ; aucune pénalité de compagnon en rattrapage ; règles de Désir (résister ≥ 4, céder ≤ 1) ; refus jamais suivis d’intimité ; tendance, favori, flags ; migration v18 idempotente sans pénalité rétroactive ; 12 séquences et minimums de mots pour chaque route / mode / sexe / historique ; vocabulaire interdit ; Naïah jamais locutrice ni cible ; duel final qui lit l’historique ; rendez-vous fermés à l’étape 4, ouverts à 5 ; confidences par le Désir ; faux canon absent ; courriers ; invitation renommée ; banque de moments libres et réactions ; logis débarrassé de l’ancien axe ; protections de relecture ; fiche nettoyée.

## Limites connues

- Les trios de groupe (Valurn + Bellirith, Naïah + Bellirith) dans `group-dates.ts` / `group-explicit-scenes.ts` n’ont pas été réécrits : ils sont hors de la liste §59 et inaccessibles dans le fil actuel. À reprendre séparément (attention aux règles Naïah).
- `scripts/validate-narrative.mjs` (hors `npm test`) échoue comme sur la base 8b19380 (choix contextuels hylee / remerii), sans lien avec Bellirith.
