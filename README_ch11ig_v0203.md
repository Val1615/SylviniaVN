# Sylvinia VN - v0.203

## Correctif principal

Cette version corrige le rythme de la route **Chapitre X-I · L’Impératrice Noire**.

La route Iriana du Chapitre X était techniquement fonctionnelle, mais plusieurs scènes narratives étaient trop longues par rapport à la route Groupe. Le rendu donnait des blocs plus massifs, moins proches du découpage VN adopté ensuite dans **Chapitre X-G** et **Chapitre XI_G**.

## Changements

- Redécoupage automatique des longues scènes narratives `c10_` de la route Iriana.
- Les contenus ne sont pas raccourcis : les textes sont simplement divisés en battements plus courts.
- Les scènes de dialogue déjà courtes sont conservées.
- Les choix et transitions existants sont préservés.
- La fin `c10_end` garde bien la transition vers **Chapitre XI_I · Amie ou ennemie ?**.
- Quelques incises de dialogue ont été ajoutées pour rapprocher la présentation de la route Groupe.

## Résultat attendu

La route **X-I** doit maintenant mieux respirer : moins de pavés, plus de clics narratifs, et une mise en page plus cohérente avec l’exemple de la route Groupe.

## Vérification

- Analyse syntaxique JavaScript : OK.
- Patch non destructif : aucune suppression de contenu canonique.
