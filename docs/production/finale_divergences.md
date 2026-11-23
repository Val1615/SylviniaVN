# Divergences et points sensibles · Final du Tome I

## 1. Scène 5 : Naïah sous les traits de Tia

**Manuscrit du dépôt (source n° 1)**, § 10601–10783 : trois silhouettes s’approchent, « Tia » supplie, frappe et tranche la gorge d’Amanea. L’illusion se dissipe ensuite (« Ce ne sont pas les yeux de Tia… Naïah. Sa fille. »), et Valurn murmure « je t’avais dit que je te l’offrirais ».

**Cahier de production** (pages 321 à 325 de l’édition imprimée) : la scène montre une Tia distincte.

**Choix retenu : la VN suit le manuscrit du dépôt**, en accord avec la suite du texte. Tia et Iriana arrivent « trop tard » (§ 10897), la culpabilité de Tia s’explique, Allenna croit qu’une lame sylvinienne a tué sa mère (Épilogue) et Ellion porte Naïah disparue. Si l’auteur préfère la version imprimée, seules les scènes `c17_trois` à `c17_regard_satisfait` sont à reprendre. Le reste du final n’en dépend pas.

Mise en scène :

- aucune silhouette pendant la supplique et le meurtre, faute de sprite de Tia adulte ;
- la silhouette de Naïah (`naiah_neutral`) apparaît seulement à `c17_illusion`, au moment où le texte la nomme ;
- l’image clé CG-08 est prévue sur `c17_gorge` et `c17_illusion`.

## 2. Hylee transformée

À la fin, Hylee apparaît dans sa forme entièrement transformée. Il n’existe pas encore de sprite pour cette forme : le dépôt contient seulement `hylee_*`, `hylee2_*` et « Hylee apprentie mage.png ». Pour ne pas la montrer avec son ancienne apparence :

- les silhouettes habituelles servent jusqu’à la canalisation (`c18_conduit`) ;
- à partir de `c18_remerii_tombe`, aucune silhouette d’Hylee ne s’affiche (Épilogue compris) ;
- la révélation `c18_reflet` (« Deux saphirs ») est prête à afficher la fiche fournie par l’auteur (`BG_FICHE_HYLEE`). En attendant, elle utilise le panorama d’Al’Gratal ;
- l’emplacement prévu pour les futurs sprites est `assets/sprites/hylee_finale_*.png`.

## 3. Naïah

Aucune scène ajoutée ne lui prête de désir, et son orientation n’est jamais nommée. Dans le roman, sa seule présence est le regard qu’elle échange avec Iriana au portail, puis l’illusion.

## 4. Points de vue optionnels

Le cahier fait de Draven (S06) et d’Iriana (S07) des branches facultatives. La règle d’or interdit de retirer du texte : le joueur lit donc toujours les passages de Draven et d’Iriana du roman. Le point de vue choisi au carrefour ajoute des scènes jouables dans le passage concerné. Les autres joueurs lisent le même texte sans interaction.

## 5. Ajouts écrits pour le jeu

Toutes les scènes interactives (`c17_choix_*`, `c17_regard_*`, `c17_adieu_*`, le duel, `c18_dp_*`, `c18_ip_*`, `c18_choix_*`, `c18_reponse_hylee`, `c18_arcane_brule`, `c19_promesse`, écrans de fin) sont écrites au présent, en guillemets avec incise. Elles n’ajoutent aucun fait qui contredise le roman.

Deux points à valider par l’auteur :

- Démendras : le salut sans un mot dans `c17_regard_demendras` reprend son masque et ses lunettes décrits au § 9688 ;
- Valurn : la réplique « Encore une minute, très chère. » vient du cahier.

## 6. Interface

- L’en-tête des boutons de choix affiche « Le choix d’Hylee » même quand le joueur dirige Valurn, Draven ou Iriana. Ce libellé est codé en dur dans `adapter.js`, qui n’a pas été touché pour préserver la pagination v50.
- Pour l’interface, l’Épilogue est rangé sous « Chapitre XIX » (`getSceneChapterLabel`). À l’écran, son titre reste « Épilogue · Tome I ».
