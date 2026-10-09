# Audit du désir de Bellirith

Règle : le désir de Bellirith naît quand on lui tient tête (refuser, contredire, déjouer, renvoyer la provocation en gardant la main, tenir sa ligne). Céder, obéir, flatter, s’empresser ou rester passif ne rapporte rien (0, au plus +1 pour les redditions négociées des intrusions, comme avant). Ces choix gardent leurs gains d’affection ou de confiance.

Validateur : `npm run test:bellirith-desire` (`scripts/validate-bellirith-desire.mjs`), instantané « avant » : `scripts/fixtures/bellirith-desire-before.json`.

## Synthèse par système

| Système | Options | Modifiées | dont baissées | dont relevées |
|---|---|---|---|---|
| Moments libres | 58 | 20 | 11 | 9 |
| Confidences | 16 | 4 | 4 | 0 |
| Lettres | 14 | 6 | 4 | 2 |
| Invitations | 3 | 0 | 0 | 0 |
| Intrusions | 19 | 0 | 0 | 0 |
| Rendez-vous | 9 | 2 | 2 | 0 |
| Sorties à plusieurs | 6 | 2 | 2 | 0 |
| Campagne (chap. IX) | 3 | 0 | 0 | 0 |
| Logis (soirée) | 3 | 1 | 1 | 0 |
| Logis (moments) | 12 | 7 | 1 | 6 |
| Série Bellirith / Naïah | 41 | 19 | 5 | 14 |
| Mini-jeu BN | 3 | 0 | 0 | 0 |
| Scènes intimes BN (fin) | 3 | 3 | 3 | 0 |
| **Total** | **190** | **64** | **33** | **31** |

## Détail (avant → après)

| Système | Scène | Choix | Texte | Classe | Avant | Après |
|---|---|---|---|---|---|---|
| Moments libres | bellirith-ecoute | bel-ecoute-l | Écouter à votre tour et trouver ce qu’elle a manqué. | tenir tête | 2 | 2 |
| Moments libres | bellirith-ecoute | bel-ecoute-a | Parier qu’elle a tort, sans même écouter. | tenir tête | 2 | 2 |
| Moments libres | bellirith-figues | bel-figues-s | Accepter et tenir, quoi qu’elle fasse. | tenir tête | 5 | 5 |
| Moments libres | bellirith-figues | bel-figues-a | En manger une tout de suite, pour lui voler son jeu. | céder | 1 | **0** |
| Moments libres | bellirith-figues | bel-figues-l | Renégocier l’enjeu avant d’accepter. | tenir tête | 2 | 2 |
| Moments libres | bellirith-tenue | bel-tenue-a | Lui demander ce que sa propre tenue fait à la salle, ce soir. | tenir tête | 2 | 2 |
| Moments libres | bellirith-tenue | bel-tenue-s | Juger la robe vous-même, sans flatter personne. | tenir tête | 0 | **2** |
| Moments libres | bellirith-marche | bel-marche-a | Négocier avec un aplomb scandaleux. | neutre | 1 | 1 |
| Moments libres | bellirith-marche | bel-marche-l | Observer d’abord ce qui fait céder le marchand. | tenir tête | 2 | 2 |
| Moments libres | bellirith-musicien | bel-musicien-a | Monter les enchères en dansant devant lui. | céder | 2 | **0** |
| Moments libres | bellirith-musicien | bel-musicien-r | Parier qu’il ne cassera rien, parce qu’il est meilleur qu’il ne le montre. | tenir tête | 0 | **2** |
| Moments libres | bellirith-musicien | bel-musicien-s | Récupérer discrètement les pièces avant qu’elle ne surenchérisse. | tenir tête | 1 | **3** |
| Moments libres | bellirith-rumeur | bel-rumeur-a | Fournir le chat. | céder | 1 | **0** |
| Moments libres | bellirith-rumeur | bel-rumeur-s | Refuser l’expérience, mais parier sur le résultat. | tenir tête | 3 | 3 |
| Moments libres | bellirith-valurn | bel-valurn-a | Lui demander ce qu’elle aurait chanté, elle, si elle avait perdu. | tenir tête | 2 | 2 |
| Moments libres | bellirith-valurn | bel-valurn-r | Remarquer qu’elle raconte cette histoire chaque fois qu’il est dans la pièce. | tenir tête | 0 | **2** |
| Moments libres | bellirith-regard | bel-regard-a | « Toi. » | tenir tête | 3 | **2** |
| Moments libres | bellirith-regard | bel-regard-l | Lui retourner la question : depuis quand vous observe-t-elle ? | tenir tête | 2 | 2 |
| Moments libres | bellirith-regard | bel-regard-s | Lui laisser deviner, sans rien confirmer. | tenir tête | 3 | 3 |
| Moments libres | bellirith-refus | bel-refus-l | Lui donner la vraie raison : vous aviez quelque chose à faire. | tenir tête | 4 | 4 |
| Moments libres | bellirith-refus | bel-refus-a | « Parce que tu aurais été trop contente. » | tenir tête | 6 | 6 |
| Moments libres | bellirith-refus | bel-refus-s | Ne pas se justifier. | tenir tête | 4 | 4 |
| Moments libres | bellirith-info | bel-info-a | Aller raconter tout ça à Lineva, devant Saidin. | céder | 1 | **0** |
| Moments libres | bellirith-info | bel-info-l | Lui demander ce qu’elle y gagne vraiment. | tenir tête | 0 | **2** |
| Moments libres | bellirith-info | bel-info-s | Garder l’information pour plus tard. | tenir tête | 2 | 2 |
| Moments libres | bellirith-ennui | bel-ennui-p | « Ou bien on s’ennuie à deux, ailleurs. » | céder | 1 | **0** |
| Moments libres | bellirith-ennui | bel-ennui-s | Ne rien proposer et vous allonger sur la banquette d’en face. | tenir tête | 0 | **2** |
| Moments libres | bellirith-defi | bel-defi-a | Y aller franchement, avec la pire plaisanterie que vous connaissiez. | neutre | 1 | 1 |
| Moments libres | bellirith-defi | bel-defi-l | Lui parler de son petit-fils, dont il porte le portrait. | tenir tête | 0 | **2** |
| Moments libres | bellirith-defi | bel-defi-s | La laisser passer en premier et observer. | tenir tête | 3 | **2** |
| Moments libres | bellirith-regles | bel-regles-s | Jouer sans la moindre expression. | tenir tête | 4 | 4 |
| Moments libres | bellirith-regles | bel-regles-a | Inventer vos propres règles à votre tour. | tenir tête | 2 | 2 |
| Moments libres | bellirith-regles | bel-regles-l | Repérer quelle règle la fait réagir, elle. | tenir tête | 2 | 2 |
| Moments libres | bellirith-aura | bel-aura-s | Accepter, et tenir la minute entière. | tenir tête | 6 | 6 |
| Moments libres | bellirith-aura | bel-aura-a | Accepter, et lui retourner le jeu en vous approchant pendant la minute. | tenir tête | 5 | 5 |
| Moments libres | bellirith-aura | bel-aura-l | Refuser, et lui demander à quoi ressemble la pièce quand elle ne l’utilise pas. | tenir tête | 2 | **4** |
| Moments libres | bellirith-matin | bel-matin-p | « Vérifie encore. » | céder | 1 | **0** |
| Moments libres | bellirith-matin | bel-matin-l | Lui rendre la pareille : vous aussi, vous connaissez un endroit. | tenir tête | 3 | 3 |
| Moments libres | bellirith-matin | bel-matin-s | Vous lever : vous avez à faire. | tenir tête | 3 | 3 |
| Moments libres | bellirith-proposition | bel-prop-p | Dire oui. | céder | 1 | **0** |
| Moments libres | bellirith-proposition | bel-prop-a | Dire non, en la provoquant. | tenir tête | 7 | 7 |
| Moments libres | bellirith-proposition | bel-prop-s | Dire non, calmement. | tenir tête | 5 | 5 |
| Moments libres | bellirith-favori | bel-favori-a | Jouer le jeu avec une révérence exagérée. | céder | 1 | **0** |
| Moments libres | bellirith-favori | bel-favori-s | La corriger devant l’ambassadrice : c’est elle, votre favorite. | tenir tête | 3 | 3 |
| Moments libres | bellirith-conseil | bel-conseil-l | Deviner, et lui expliquer pourquoi. | tenir tête | 0 | **2** |
| Moments libres | bellirith-conseil | bel-conseil-a | Lui demander lequel elle aurait séduit pour faire basculer le vote. | neutre | 2 | **1** |
| Moments libres | bellirith-conseil | bel-conseil-s | Lui demander ce qu’elle compte faire de ce qu’elle a vu. | neutre | 1 | 1 |
| Confidences | secret-bellirith-father | sbf20-accept | Prendre le jeton et accepter ce qu’elle a choisi de donner. | céder | 2 | **0** |
| Confidences | secret-bellirith-father | sbf20-push-word | Relever le « nous » qu’elle a ravalé avant de dire « mon frère et moi ». | tenir tête | 4 | 4 |
| Confidences | secret-bellirith-father | sbf20-push-valurn | Lui dire que Valurn parle de Bhaal exactement avec le même sourire qu’elle. | tenir tête | 4 | 4 |
| Confidences | secret-bellirith-before-hate | sbb40-accept | Trinquer à ce qu’elle a donné, sans aller chercher plus loin. | céder | 2 | **0** |
| Confidences | secret-bellirith-before-hate | sbb40-push | Lui faire remarquer qu’elle parle de lui au présent pour ses faiblesses, et au passé pour tout le reste. | tenir tête | 4 | 4 |
| Confidences | secret-bellirith-before-hate | sbb40-near | Revenir sur ce « il y a eu » qui lui a fait serrer le verre. | tenir tête | 1 | 1 |
| Confidences | secret-bellirith-before-hate | sbb40-return | Refuser le détour, doucement, et revenir à sa phrase. | tenir tête | 5 | 5 |
| Confidences | secret-bellirith-saelis | sbs60-accept | Lui demander de vous montrer une rue de Saëlis, une seule, sa préférée. | céder | 2 | **0** |
| Confidences | secret-bellirith-saelis | sbs60-push | Lui demander pourquoi la tour du centre reste éteinte, et pourquoi elle l’a cachée en prononçant le nom de Valurn. | tenir tête | 5 | 5 |
| Confidences | secret-bellirith-saelis | sbs60-near | Lui dire qu’elle a dit « vulgaire » deux fois, et que ce mot appartient à Valurn. | tenir tête | 1 | 1 |
| Confidences | secret-bellirith-saelis | sbs60-return | Rester contre le mur, et répéter doucement : « C’était son mot. » | tenir tête | 6 | 6 |
| Confidences | secret-bellirith-gap | sbg80-accept | Accepter la limite, et rester simplement près d’elle à la fenêtre. | céder | 2 | **0** |
| Confidences | secret-bellirith-gap | sbg80-push-valurn | Lui dire que Valurn vous a parlé d’un talisman, et d’une promesse de protection. | tenir tête | 4 | 4 |
| Confidences | secret-bellirith-gap | sbg80-push-ring | Lui demander pourquoi elle a caché cette bague dès qu’elle a parlé de promesse. | tenir tête | 4 | 4 |
| Lettres | letter-bellirith-preferred | bel-pref-tease | Répondre que la carte avait de très jolies flèches. | tenir tête | 3 | 3 |
| Lettres | letter-bellirith-preferred | bel-pref-honest | Avouer que partir vous a coûté. | céder | 4 | **0** |
| Lettres | letter-bellirith-favorite | bel-fav-counter | Répondre que vous aussi, vous avez pris des notes. | tenir tête | 1 | **2** |
| Lettres | letter-bellirith-favorite | bel-fav-dry | Rappeler que vous avez des conseils de guerre à tenir. | tenir tête | 0 | **2** |
| Lettres | letter-bellirith-aftertaste | bel-after-no | Prévenir qu’il n’y aura pas forcément de prochaine fois. | tenir tête | 3 | 3 |
| Lettres | letter-bellirith-correction | bel-corr-cat | Demander des nouvelles du descendant de Dette. | neutre | 2 | **0** |
| Lettres | letter-bellirith-correction | bel-corr-listen | Répondre que vous continuerez à écouter. | neutre | 3 | **1** |
| Lettres | letter-bellirith-act-end-resisted | bel-end-res-come | Répondre : « Bientôt. » | céder | 3 | **1** |
| Lettres | letter-bellirith-act-end-resisted | bel-end-res-tease | Répondre que vous la ferez peut-être attendre encore un peu. | tenir tête | 4 | 4 |
| Lettres | letter-bellirith-act-end-ceded | bel-end-ced-surprise | Répondre : « Tu vas être surprise. » | tenir tête | 4 | 4 |
| Lettres | letter-bellirith-act-end-mixed | bel-end-mix-come | Répondre que vous viendrez, quand vous l’aurez décidé. | tenir tête | 3 | 3 |
| Lettres | letter-bellirith-act-end-mixed | bel-end-mix-guess | Répondre qu’elle n’a qu’à deviner. | tenir tête | 4 | 4 |
| Invitations | invite-bellirith-mask | ibm-judge | Arbitrer, et surveiller de très près qu’elle ne triche pas. | tenir tête | 3 | 3 |
| Invitations | invite-bellirith-mask | ibm-rival | Jouer contre elle, et faire avouer un désir à quelqu’un avant elle. | tenir tête | 5 | 5 |
| Intrusions | intrusion-01 | bel-i01-steady | Soutenir son regard sans reculer d’un pouce | tenir tête | 3 | 3 |
| Intrusions | intrusion-01 | bel-i01-read | Lui renvoyer sa propre lecture | tenir tête | 4 | 4 |
| Intrusions | intrusion-01 | bel-i01-spark | Répondre à la provocation sur le même ton | tenir tête | 2 | 2 |
| Intrusions | intrusion-01 | bel-i01-aura | Sentir où son aura appuie, et ne pas la suivre | tenir tête | 3 | 3 |
| Intrusions | intrusion-02 | bel-i02-cede-dare | « Montre-moi ce qui vaut mieux qu’une lettre de mission. » | céder | 1 | 1 |
| Intrusions | intrusion-02 | bel-i02-resist-calm | « J’en ai envie. J’y vais quand même. » | tenir tête | 4/5 | 4/5 |
| Intrusions | intrusion-02 | bel-i02-resist-tease | Se pencher jusqu’à son oreille, lui laisser croire que vous cédez… puis repartir | tenir tête | 6/7 | 6/7 |
| Intrusions | intrusion-02 | bel-i02-resist-duty | Rejoindre Draven pour préparer l’escorte | tenir tête | 5/6 | 5/6 |
| Intrusions | intrusion-03 | bel-i03-cede-dare | « Une nuit. Et tu me dis ce que tu sais sur demain. » | céder | 1 | 1 |
| Intrusions | intrusion-03 | bel-i03-resist-calm | « Pas cette nuit. Les preuves voyagent avec moi. » | tenir tête | 4/5 | 4/5 |
| Intrusions | intrusion-03 | bel-i03-resist-tease | L’embrasser une fois, longuement, puis retourner vers la carte | tenir tête | 6/7 | 6/7 |
| Intrusions | intrusion-03 | bel-i03-resist-duty | Rester avec Draven pour veiller la sacoche | tenir tête | 4/5 | 4/5 |
| Intrusions | intrusion-04 | bel-i04-cede-dare | « Montre-moi ce que Saëlis fait d’une victoire. » | céder | 1 | 1 |
| Intrusions | intrusion-04 | bel-i04-resist-calm | « Pas maintenant. » | tenir tête | 4/5/6 | 4/5/6 |
| Intrusions | intrusion-04 | bel-i04-resist-tease | Lui donner raison… et offrir la célébration à Draven | tenir tête | 6/7 | 6/7 |
| Intrusions | intrusion-04 | bel-i04-resist-duty | Rejoindre le cabinet d’Iriana | tenir tête | 5/6 | 5/6 |
| Rendez-vous | date-bellirith-music | dbm-a | Lui rendre la pareille : faire désirer à la salle… qu’elle perde | tenir tête | 7 | 7 |
| Rendez-vous | date-bellirith-music | dbm-l | Oublier la salle et lui demander ce qu’elle désire, elle, ce soir | tenir tête | 6 | **4** |
| Rendez-vous | date-bellirith-music | dbm-s | Jouer franchement : faire désirer une chanson triste à une salle venue s’amuser | neutre | 4 | **1** |
| Rendez-vous | date-bellirith-market | dbk-l | La laisser deviner, et lui prouver qu’elle se trompe | tenir tête | 8 | 8 |
| Rendez-vous | date-bellirith-market | dbk-a | Lui retourner le pari : nommer ce qu’elle désire, elle | tenir tête | 6 | 6 |
| Rendez-vous | date-bellirith-market | dbk-s | Refuser d’être une cible et lui offrir une brioche à la place | tenir tête | 3 | 3 |
| Rendez-vous | date-bellirith-final | dbf-cards | Jouer aux cartes, et la laisser tricher pour mieux la piéger | tenir tête | 7 | 7 |
| Rendez-vous | date-bellirith-final | dbf-piano | Lui disputer le piano : une valse à quatre mains, chacun voulant imposer son tempo | tenir tête | 6 | 6 |
| Rendez-vous | date-bellirith-final | dbf-words | Une joute de répliques : le premier qui rougit a perdu | tenir tête | 7 | 7 |
| Sorties à plusieurs | group-date-valurn-bellirith | gvb-referee | Imposer une règle : chaque provocation doit être suivie d’une vérité que son auteur préférerait cacher. | tenir tête | 6 | 6 |
| Sorties à plusieurs | group-date-valurn-bellirith | gvb-third | Entrer dans le duel et voler successivement l’avantage à Valurn puis à Bellirith. | tenir tête | 9 | 9 |
| Sorties à plusieurs | group-date-valurn-bellirith | gvb-truce | Leur demander ce qu’ils admirent réellement chez leur rival avant d’autoriser la prochaine manche. | neutre | 5 | **1** |
| Sorties à plusieurs | group-date-naiah-bellirith | gnb-name | Nommer à voix haute chaque illusion et chaque charme avant de l’accepter. | tenir tête | 5 | 5 |
| Sorties à plusieurs | group-date-naiah-bellirith | gnb-truth | Demander un désir sans image à Naïah, puis une peur sans sourire à Bellirith. | tenir tête | 4 | **3** |
| Sorties à plusieurs | group-date-naiah-bellirith | gnb-stage | Prendre le contrôle de la scène et leur interdire toute magie pendant une danse. | tenir tête | 8 | 8 |
| Campagne (chap. IX) | campaign-coalition-preparation | coalition-protocol | Créer un protocole que chaque camp peut vérifier | tenir tête | 4 | 4 |
| Campagne (chap. IX) | campaign-coalition-preparation | coalition-friction | Prévoir les désaccords au lieu d'exiger l'unité | tenir tête | 5 | 5 |
| Campagne (chap. IX) | campaign-coalition-preparation | coalition-bellirith | Refuser de laisser Bellirith détourner la préparation | tenir tête | 6 | 6 |
| Logis (soirée) | home-bellirith | home:amoureux | Coup pour coup | tenir tête | 4 | 4 |
| Logis (soirée) | home-bellirith | home:desir | Mise indécente | tenir tête | 11 | **7** |
| Logis (moments) | home-bellirith-0 | home-bellirith-0-a | Je m’assieds, je me sers et je les interroge un par un sur leurs intentions. | tenir tête | 2 | 2 |
| Logis (moments) | home-bellirith-0 | home-bellirith-0-l | Tu voulais savoir si j’allais être jaloux·se. Raté : je suis curieux·se. | tenir tête | 0 | **2** |
| Logis (moments) | home-bellirith-0 | home-bellirith-0-s | Je les remercie d’être venus et je raccompagne tout le monde à la porte, sauf elle. | tenir tête | 0 | **1** |
| Logis (moments) | home-bellirith-1 | home-bellirith-1-a | Je traverse le couloir en chemise de nuit, avec une dignité absolue. | céder | 2 | **0** |
| Logis (moments) | home-bellirith-1 | home-bellirith-1-l | Combien as-tu misé, et pourquoi pas sur moi ? | tenir tête | 0 | **1** |
| Logis (moments) | home-bellirith-1 | home-bellirith-1-s | Je reste dans ma chambre jusqu’à midi et une minute. | tenir tête | 0 | **2** |
| Logis (moments) | home-bellirith-2 | home-bellirith-2-a | Je m’assieds à côté d’elle et je joue encore plus fort et encore plus mal. | tenir tête | 2 | 2 |
| Logis (moments) | home-bellirith-2 | home-bellirith-2-l | Tu ne joues pas mal. Tu joues exprès. Qu’est-ce que tu veux ? | tenir tête | 0 | **2** |
| Logis (moments) | home-bellirith-3 | home-bellirith-3-a | J’ajoute une règle en bas de la liste, avec ma plus belle écriture. | tenir tête | 2 | 2 |
| Logis (moments) | home-bellirith-3 | home-bellirith-3-l | Règle numéro un : tu as triché dès la première ligne. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-01 | cross-bn-01-join | Rejoindre Bellirith et relancer la conversation sur le tour de la chope. | céder | 1 | **0** |
| Série Bellirith / Naïah | cross-bn-01 | cross-bn-01-bet | Parier avec Naïah que Bellirith finira par trouver ce qu’elle cherche. | céder | 1 | **0** |
| Série Bellirith / Naïah | cross-bn-02 | cross-bn-02-vexed | Faire remarquer à Bellirith qu’elle a l’air plus vexée que flattée. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-02 | cross-bn-02-accept | Accepter de rester ce soir et d’entrer dans leur jeu. | céder | 1 | **0** |
| Série Bellirith / Naïah | cross-bn-02 | cross-bn-02-later | Proposer de garder cette nuit pour plus tard. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-02 | cross-bn-02-decline | Refuser d’en faire partie, sans retirer votre amitié à aucune des deux. | tenir tête | 0 | **1** |
| Série Bellirith / Naïah | cross-bn-03 | cross-bn-03-score | Prendre le carnet et promettre de compter sans favoriser personne. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-03 | cross-bn-03-coach | Glisser à Naïah que Bellirith annonce toujours la vérité de ce qu’elle lit. | tenir tête | 0 | **1** |
| Série Bellirith / Naïah | cross-bn-03 | cross-bn-03-tease | Demander à Bellirith ce qu’elle mise, puisqu’elle aime tant les enjeux. | tenir tête | 1 | **2** |
| Série Bellirith / Naïah | cross-bn-04 | cross-bn-04-rules | Rappeler à Bellirith qu’un jeu sans règle d’arrêt n’en est plus un. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-04 | cross-bn-04-push | Pousser Bellirith à poser la question franchement, sans détour. | tenir tête | 1 | **2** |
| Série Bellirith / Naïah | cross-bn-04 | cross-bn-04-accept | Les rejoindre sur la grève. | céder | 1 | **0** |
| Série Bellirith / Naïah | cross-bn-04 | cross-bn-04-later | Leur proposer de reprendre ce jeu une autre nuit. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-04 | cross-bn-04-decline | Leur dire que vous préférez rester en dehors. | tenir tête | 0 | **1** |
| Série Bellirith / Naïah | cross-bn-05 | cross-bn-05-accept | Rester avec elles cette nuit. | céder | 1 | **0** |
| Série Bellirith / Naïah | cross-bn-05 | cross-bn-05-decline | Les laisser seules et attendre dehors. | tenir tête | 0 | **1** |
| Série Bellirith / Naïah | cross-bn-06 | cross-bn-06-game | Proposer de rejouer une manche des Trois Réponses, pour voir. | tenir tête | 1 | 1 |
| Série Bellirith / Naïah | cross-bn-06 | cross-bn-06-careful | Demander à Bellirith d’y aller doucement. | tenir tête | 0 | **1** |
| Série Bellirith / Naïah | cross-bn-06 | cross-bn-06-warn | Lui dire que cette faim-là pourrait la mordre, elle aussi. | tenir tête | 0 | **2** |
| Série Bellirith / Naïah | cross-bn-06 | cross-bn-06-ask | Demander si elle sait ce qu’elle cherche à obtenir. | tenir tête | 1 | 1 |
| Série Bellirith / Naïah | cross-bn-after-inn | cross-bn-after-inn-score | Demander à Naïah où en est son score. | tenir tête | 1 | 1 |
| Série Bellirith / Naïah | cross-bn-after-tokens | cross-bn-after-tokens-play | Distribuer les jetons et tenir les comptes, comme la première fois. | tenir tête | 0 | **1** |
| Série Bellirith / Naïah | cross-bn-after-willow | cross-bn-after-willow-tease | Proposer à Naïah de partir, puisqu’elle s’ennuie tant. | tenir tête | 1 | 1 |
| Mini-jeu BN | result | bn-game:naiah | Résultat mini-jeu: naiah | tenir tête | 1 | 1 |
| Mini-jeu BN | result | bn-game:egalite | Résultat mini-jeu: egalite | tenir tête | 1 | 1 |
| Scènes intimes BN (fin) | completion | bn-intimacy:bn-first | Fin de scène intime bn-first | céder | 2 | **0** |
| Scènes intimes BN (fin) | completion | bn-intimacy:bn-limit | Fin de scène intime bn-limit | céder | 2 | **1** |
| Scènes intimes BN (fin) | completion | bn-intimacy:bn-simulation | Fin de scène intime bn-simulation | céder | 3 | **1** |

## Parcours simulés

Chaque scène est jouée une fois (première visite), avec les drapeaux de l’historique correspondant. « Céder » choisit la reddition quand elle existe, sinon l’option la moins frontale ; « résister » choisit la meilleure option qui lui tient tête ; « mixte » alterne. Les paliers sont ceux des confidences (20/40/60/80) et des sorties à plusieurs (27, 28).

| Parcours | Avant | Après | Paliers atteints après |
|---|---|---|---|
| Céder | 65 (5/6) | 35 (3/6) | confidence 20, sorties à plusieurs |
| Mixte | 127 (6/6) | 109 (6/6) | tous |
| Résister | 183 (6/6) | 185 (6/6) | tous |

Rien de principal ne dépend du désir : les rendez-vous (dont le duel de fin d’Acte) s’ouvrent à l’étape 5, l’intimité des rendez-vous Bellirith ignore le désir, et la série Bellirith / Naïah demande l’étape 5, pas un palier de désir. Le validateur le vérifie avec les vraies fonctions du jeu.
