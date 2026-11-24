# Divergences et points sensibles · Final du Tome I

## 1. Scène 5 : Naïah sous les traits de Tia

**Manuscrit du dépôt (source n° 1)**, § 10601–10783 : trois silhouettes s’approchent, « Tia » supplie, frappe et tranche la gorge d’Amanea. L’illusion se dissipe ensuite (« Ce ne sont pas les yeux de Tia… Naïah. Sa fille. »), et Valurn murmure « je t’avais dit que je te l’offrirais ».

**Cahier de production** (pages 321 à 325 de l’édition imprimée) : la scène montre une Tia distincte.

**Choix retenu et validé par l’auteur (24 novembre 2026) : la VN suit le manuscrit du dépôt.** Dans ses mots : « Dans l’histoire, on a l’illusion de suivre Tia. Et on découvre en même temps qu’Amanea, à la toute fin, que c’était Naïah. » Le joueur suit donc l’illusion de Tia jusqu’au bout et découvre Naïah au même instant qu’Amanea. C’est cohérent avec la suite du texte : Tia et Iriana arrivent « trop tard » (§ 10897), la culpabilité de Tia s’explique, Allenna croit qu’une lame sylvinienne a tué sa mère (Épilogue) et Ellion porte Naïah disparue.

Mise en scène :

- de `c17_trois` à `c17_dernier_souffle`, rien ne trahit Naïah : aucune silhouette (il n’existe pas non plus de sprite de Tia adulte), et ni les sous-titres (« Trois silhouettes », « Tia… écoute-moi… », « Une Farae ne pardonne jamais », « L’acier sur la pierre », « Pourquoi… ? », « Dernier souffle »), ni les identifiants de scène affichés sur la tranche de la boîte de dialogue ne la nomment ou ne parlent d’illusion ;
- la révélation est découpée en deux scènes :
  - `c17_dernier_souffle` (§ 10747–10757, « Les sons. » jusqu’à « …qu’elle a protégé sans qu’elle ne le sache. ») : pas de silhouette, sous-titre « Dernier souffle » ;
  - `c17_naiah_revelee` (§ 10758–10761, « Naïah. Sa fille. Son propre sang. » jusqu’à « Sans un regret. ») : sous-titre « L’illusion se dissipe », la silhouette de Naïah (`naiah_neutral`) apparaît à l’instant exact où le texte la nomme ;
- l’image clé CG-08 est prévue sur `c17_gorge` (Tia apparente) puis `c17_naiah_revelee` (révélation).

## 2. Hylee transformée

À la fin, Hylee apparaît dans sa forme entièrement transformée. Il n’existe pas encore de sprite pour cette forme : le dépôt contient seulement `hylee_*`, `hylee2_*` et « Hylee apprentie mage.png ». Pour ne pas la montrer avec son ancienne apparence :

- les silhouettes habituelles servent jusqu’à la canalisation (`c18_conduit`) ;
- à partir de `c18_remerii_tombe`, aucune silhouette d’Hylee ne s’affiche (Épilogue compris) ;
- la révélation `c18_reflet` (« Deux saphirs ») garde un vrai décor de scène : les portes d’Al’Gratal (`bg_algratal_portes`), comme `c18_algratal` et `c18_ne_me_laisse_pas` (« sol de pierre », Sylviniens qui s’affairent). Le panorama `c2_algratal_panorama_cg` a été retiré de ces scènes, car on y voit de dos une Hylee aux cheveux roux. La fiche d’Hylee n’y est jamais affichée ;
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

## Fichiers fournis par l’auteur (24/11/2026)

- **Quatre décors, affichés en jeu**, copiés à l’identique sous `assets/images/backgrounds/finale/` : la Porte Noire (`BG_PORTE`), la Porte sous le blizzard (`BG_GIVRE`), le champ de bataille (`BG_CHAMP`) et le ravin (`BG_CREVASSE`, crevasse et grotte de Draven). `BG_AKUHN` garde la citadelle `c4v_akuhn_citadel` : le texte du rassemblement décrit la cité vue de loin, que le ravin ne montre pas.
- **Quatre fiches personnages (Hylee forme finale, Alamma, Bhaal, Amanea forme finale) : référence de design uniquement, non affichées en jeu.** Consigne de l’auteur : « Les fiches sont à titre indicatif ». Elles sont rangées à l’identique dans `Ressource lore/Charactersheet/finale/`, à côté des autres fiches du dépôt. Aucune scène, ni le Codex, ni une galerie ne les charge, et elles ne figurent pas dans le registre d’assets `A`.
- Détail et sha256 : [finale_assets_manifest.json](finale_assets_manifest.json).
