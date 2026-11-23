# S01 · L’assaut des morts-vivants

**Version v0.417 · Chapitre XVI · Mode Histoire**

Le lot commence sur le cri de Draven, au bout du chemin où s’achève le chapitre XV. Il se termine lorsque la colonne fait halte en vue d’Akuhn’Nabad. Le menu **Chapitres** rend le XVI accessible une fois le XV achevé. La sauvegarde normale suit le joueur jusque sur l’écran **À suivre**.

## Sources et adaptation

| Source du dépôt | Passage utilisé |
| --- | --- |
| [Chroniques de Sylvinia Tome 1](../../Ressource%20lore/Chroniques%20de%20Sylvinia%20Tome%201.docx) | Fin du chapitre 19, « L’heure du départ ». Début du chapitre 20, « La Porte Noire », du cri de Draven jusqu’à la halte devant Akuhn’Nabad. |
| [Bible maîtresse](../../Ressource%20lore/BIBLE_MAITRESSE_SYLVINIA_VN_CHRONIQUES_ALTERNATIVES_V1_1.docx) | § 3.1 sur les connaissances des personnages, § 7.3 sur la Forêt Interdite, § 10.15 sur les voix et motivations. |
| [Fiches visuelles](../../Ressource%20lore/Charactersheet/) et [images du XV](../../assets/images/keyscenes/chapter15/) | Draven et Iriana gardent leurs traits, leurs accessoires et leurs couleurs. Les troncs noirs, la boue et la brume du XV se prolongent dans l’embuscade. |

Le VN reprend intégralement les 288 paragraphes du chapitre 20 compris entre « Le premier cri brise le silence » et « Un dernier rassemblement s’impose. ». La lecture conserve les mots, les répliques et l’ordre du manuscrit. Le découpage en scènes et les guillemets des répliques, comme dans les chapitres XIII à XV, adaptent la mise en page au jeu. Le secours au fantassin et les réactions d’Hylee au moment de reprendre pied ajoutent des passages jouables entre les paragraphes du roman. Cette règle de transcription intégrale s’applique aux prochains lots.

## Montage et visuels

| Fichier | Utilisation |
| --- | --- |
| [Index du jeu](../../index.html) | Chargement du lot avant le Studio et conservation des souvenirs, objets et fragments encore en cours d’enregistrement au démarrage. |
| [Script de S01](../../fusion/story-finale-s01.js) | 42 scènes, variantes comprises. De `c16_assaut` à `c16_s01_fin`, avec choix, raccords, carte de chapitre et entrées du Codex. |
| [Premier choc](../../assets/images/keyscenes/chapter16/c16_premier_choc.webp) | Plan latéral de Draven et du relevé. La rencontre des lames, les visages et les insignes restent lisibles au-dessus du dialogue. |
| [Foudre d’Iriana](../../assets/images/keyscenes/chapter16/c16_foudre_iriana.webp) | Plan trois-quarts sur Iriana. La foudre et les braises éclairent la forêt dans des directions opposées. |
| [Lisière avant l’assaut](../../assets/images/backgrounds/chapter16/c16_lisiere_assaut.webp) et [après l’assaut](../../assets/images/backgrounds/chapter16/c16_apres_assaut.webp) | Même axe sur le tronc fourchu et le passage boueux. Les braises et les débris apparaissent après la riposte d’Iriana. |

Chaque image clé se débloque dans le Codex au moment où le joueur atteint la scène correspondante. Le chapitre compte 19 illustrations, dont 8 ajoutées dans cette version.

## Mise en scène

| Séquence | Plans dans l’ordre du texte |
| --- | --- |
| **L’embuscade** | Charge de Draven, irruption du mur de glace, intervention de Naïah, lame de Tia, flash de sa main levée, Saidin au milieu de la mêlée. |
| **La riposte d’Iriana** | Six plans depuis la gerbe de feu aperçue par Valurn jusqu’au silence des survivants. |
| **La panique d’Hylee** | Le givre déclenche un rapprochement sur Hylee. Le cadre se resserre sur Remerii lorsqu’elle touche le visage d’Hylee, puis isole le pendentif au moment où Hylee le reconnaît. |
| **Après l’assaut** | Par-dessus l’épaule d’Iriana, on voit Hylee soutenue par Remerii, avec Naïah derrière elles. Le contrechamp montre Iriana rester à distance. Iriana et Draven sont ensuite réunis autour des plaques quand elle s’agenouille. Un recul ouvre la vue sur Akuhn’Nabad. |

| Début du passage | Cadrage de la riposte |
| --- | --- |
| « Un bruit sourd résonne » | Par-dessus l’épaule de Valurn, une gerbe embrase la trouée. |
| « Puis vient la foudre » | Même point de vue. Le premier éclair frappe la clairière. |
| « Et au centre de ce chaos » | Recul sur Iriana au milieu de la décharge, quand le texte révèle sa présence. |
| « Une force brute » | Gros plan sur son regard devenu bleu. |
| « Ses doigts se resserrent » | Insert fixe sur la main qui se referme. |
| « La bataille est terminée » | Plan large du champ brûlé depuis les rangs des survivants. |

Sur écran large, les mouvements se déclenchent au début des plans. En portrait, le jeu montre toute la largeur de l’image avec un cadre fixe. Le réglage système de réduction des animations utilise aussi des cadres fixes.

## Musique

« Combat des Ombres » accompagne l’assaut dès le cri de Draven, à travers les choix et tous les changements de point de vue. Le moteur garde sa position dans la piste tant que la bataille dure. L’ambiance de la forêt prend le relais à « La bataille est terminée » et accompagne les scènes qui suivent jusqu’à la halte.

## Choix et sauvegarde

| État | Effet |
| --- | --- |
| `c15WalkedWithDraven` | Hylee se rappelle l’avertissement de Draven avant de choisir sa manœuvre. |
| `c15WalkedWithRemerii`, `c15AskedNaiahRoute` | Souvenir de la marche avec Remerii au moment de l’ancrage. Écho de la conversation avec Naïah avant le choix tactique. |
| `s01AssaultTactic` | `repli` permet une évacuation coordonnée. `breche` expose Hylee et laisse le fantassin avec un bras blessé. Les deux branches rejoignent l’intervention de Naïah. |
| `s01HyleeAnchor` | `etoile` ou `voix`, selon la réaction de Hylee face à la panique. Le souvenir de Mir relie les deux chemins. |
| `s01AssaultComplete` | Enregistré à la halte. Le point de reprise reste l’écran de fin du lot après retour au menu. |

## Vérification ciblée

- Reprise d’une sauvegarde v81 au dernier écran du XV. Valeurs, objet, souvenir, fragment valide et flags antérieurs conservés.
- Repli réussi et secours contrarié parcourus jusqu’à la halte. Rechargement au milieu du lot, verrou du chapitre et déblocage ordonné des images d’Iriana dans le Codex vérifiés.
- Comparaison des 288 paragraphes du manuscrit sur les quatre combinaisons de choix. Pagination vérifiée en tailles mobile et bureau, ainsi que les médias et l’extraction des scènes dans le Studio.
- Relecture des 19 images à taille de lecture et examen agrandi des zones sensibles. Contrôle des mains, des appuis, de la prise de l’épée de Tia, du pendentif d’Hylee, de la couleur des yeux et des vêtements entre les plans d’Iriana. Le feu et l’éclair ont été séparés, et le flash de Tia a été décalé jusqu’à sa phrase.
- Une seule transition musicale pendant la lecture de S01, sur les quatre parcours. Le lecteur garde sa position quand l’image ou le personnage change.
- Sept tests existants passent, dont les tests de surcharge du Studio. L’ancien doublon `tests/story-world.test.cjs` échoue déjà sur le commit de départ avec `4 !== 3` à la ligne 182.
