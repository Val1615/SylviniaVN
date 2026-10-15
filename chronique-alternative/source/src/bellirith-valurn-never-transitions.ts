/**
 * Passages entre deux tours de table du « Je n’ai jamais ».
 * Une transition = une phrase d’amorce (ce qui vient de se passer) + une phrase d’ambiance
 * (avant ou après le tournant, selon l’ivresse de la table). Chaque phrase n’est entendue qu’une fois par soirée.
 */

export type BVTransitionLead = "answer-acknowledge" | "answer-deny" | "answer-dodge" | "pression" | "drank-player" | "drank-bellirith" | "drank-valurn" | "drank-all" | "drank-none";

export const BV_TRANSITION_LEADS: Record<BVTransitionLead, string[]> = {
  "answer-acknowledge": [
    "Votre aveu flotte encore au-dessus de la table quand vous reposez le verre.",
    "La gorgée de votre aveu vous chauffe encore la gorge.",
    "Votre franchise a laissé un petit silence étonné derrière elle.",
    "Après votre aveu, plus personne ne vous regarde tout à fait de la même façon.",
    "Le goût de votre aveu reste sur vos lèvres, plus doux que vous ne l’auriez cru.",
    "Un oui tout simple, et la table a dû s’en accommoder.",
  ],
  "answer-deny": [
    "Votre refus a claqué net, et votre verre est resté plein.",
    "Votre démenti avait de l’aplomb ; quelqu’un, en face, n’y croit qu’à moitié.",
    "Votre verre intact trône devant vous comme une pièce à conviction.",
    "Votre non tient encore debout, mais on l’examine sous tous les angles.",
    "Vous gardez le menton haut après votre démenti, et cela se remarque.",
    "Le démenti est posé sur la table ; personne n’ose encore y toucher.",
  ],
  "answer-dodge": [
    "Votre pirouette a fait sourire, sans tromper tout à fait.",
    "La question esquivée rôde encore autour de vous.",
    "Votre réponse oblique a laissé une porte entrouverte que chacun fixe un peu.",
    "Vous avez glissé hors de la question comme on quitte un salon par la porte de service.",
    "L’esquive vous a sauvé le verre, pas la curiosité des autres.",
    "On vous laisse votre détour, en se promettant d’y revenir.",
  ],
  pression: [
    "La pression retombe d’un cran, sans disparaître ; vos épaules s’en souviennent.",
    "Vous respirez enfin, et vous découvrez que vous aviez retenu votre souffle.",
    "Le regard qui vous pressait se détourne, lentement, à regret.",
    "Vos doigts se desserrent du pied du verre, un à un.",
    "La question vous a serré la gorge ; elle vous relâche à peine.",
  ],
  "drank-player": [
    "Votre verre est plus léger qu’au tour précédent, et vos joues un peu plus chaudes.",
    "Vous reposez votre verre avec un tintement plus franc que voulu.",
    "La gorgée que vous venez de boire descend lentement, comme une confidence.",
    "Vous buvez la dernière goutte et sentez deux regards suivre le geste.",
    "Le vin vous a laissé une chaleur douce au creux de la poitrine.",
  ],
  "drank-bellirith": [
    "Bellirith repose son verre vide d’un geste de reine qui ne regrette rien.",
    "Bellirith essuie le bord de son verre du pouce, sans hâte.",
    "Bellirith a bu, et le fait payer à la table d’un sourire.",
    "Une goutte brille au coin des lèvres de Bellirith ; elle la laisse là, exprès.",
    "Bellirith fait tourner son verre vide entre ses doigts bagués.",
  ],
  "drank-valurn": [
    "Valurn repose son verre avec le soin d’un homme qui range une preuve.",
    "Valurn a bu sans un mot, et ses doigts tapotent la canne posée contre le fauteuil.",
    "Valurn s’éclaircit la gorge après sa gorgée, comme pour effacer quelque chose.",
    "Le verre de Valurn est vide ; il le regarde comme on regarde un témoin gênant.",
    "Valurn passe une main dans ses cheveux après avoir bu, l’air soudain moins tiré à quatre épingles.",
  ],
  "drank-all": [
    "Trois verres se reposent presque ensemble, et ce petit chœur arrache un rire à la tablée.",
    "Chacun a bu ; la complicité qui s’installe a quelque chose d’inavouable.",
    "Trois gorgées pour une seule phrase : la table entière se sent prise en faute.",
    "Le même geste, trois fois : vous voilà tous complices, bon gré mal gré.",
  ],
  "drank-none": [
    "Personne n’a bu, et les verres pleins ont l’air de se moquer de vous.",
    "Trois verres intacts, et un soupçon de déception partagée.",
    "Personne n’a levé son verre ; l’affirmation est tombée à plat sur le tapis.",
    "Les verres restent sages, ce qui ne rend personne plus sage.",
    "Rien n’a bougé sur la table, sinon quelques sourcils.",
  ],
};

export type BVTransitionMood = "avant-sobre" | "avant-gris" | "avant-ivre" | "apres-sobre" | "apres-gris" | "apres-ivre" | "court-avant" | "court-apres";

export const BV_TRANSITION_MOODS: Record<BVTransitionMood, string[]> = {
  "avant-sobre": [
    "Bellirith remplit les verres d’une main sûre, et le feu crépite dans l’âtre du salon de musique.",
    "Le piano reste fermé dans son coin, mais vous avez l’impression qu’il écoute.",
    "Valurn redresse un coussin, puis un autre, avec une application qui trahit qu’il réfléchit.",
    "Une bûche glisse dans la cheminée ; personne n’y prête attention, sauf vous.",
    "La bouteille passe de main en main, encore lourde, encore polie.",
    "La lumière des chandelles danse sur le vernis du piano comme une invitée de plus.",
  ],
  "avant-gris": [
    "Les rires viennent plus vite, et Bellirith ne remet plus sa mèche en place.",
    "Valurn se cale plus loin dans son fauteuil, une jambe allongée vers le feu.",
    "Quelqu’un pianote trois notes faussement distraites sur le couvercle du piano.",
    "Le vin a adouci les angles ; les regards, eux, s’aiguisent.",
    "Bellirith rapproche son fauteuil du vôtre, d’un pied, comme par hasard.",
    "Les verres se remplissent un peu trop haut, et personne ne le fait remarquer.",
  ],
  "avant-ivre": [
    "Bellirith rit d’une chose qu’elle n’a pas encore dite, et Valurn rit de la voir rire.",
    "Les chandelles ont l’air de tanguer, à moins que ce ne soit vous.",
    "Valurn a desserré son col et prétend que c’est la faute du feu.",
    "La bouteille passe plus vite, et les mains se frôlent en la tendant.",
    "Le salon de musique tourne doucement autour de la table, comme un manège poli.",
    "Bellirith s’appuie à votre épaule une seconde pour se redresser, et ne s’excuse pas.",
  ],
  "apres-sobre": [
    "Le feu baisse, et personne ne se lève pour le nourrir.",
    "Le silence s’installe entre deux souffles et prend toute la place.",
    "Valurn fixe le fond de son verre comme s’il y lisait une date.",
    "Bellirith ne sourit plus tout à fait ; ses bagues restent immobiles.",
    "Le piano semble plus loin qu’au début de la soirée.",
  ],
  "apres-gris": [
    "Le vin rend les silences plus longs et les regards plus francs.",
    "Bellirith tient son verre à deux mains, comme pour se réchauffer.",
    "Valurn ouvre la bouche, la referme, et remplit les verres à la place.",
    "Quelque chose de fragile flotte au-dessus de la table, et chacun évite de souffler dessus.",
    "Le crépitement du feu meuble un silence que personne ne veut briser.",
  ],
  "apres-ivre": [
    "L’ivresse a ôté les armures ; il ne reste que deux enfants trop grands et vous.",
    "Bellirith pose la tête contre le dossier et regarde le plafond, les yeux brillants.",
    "Valurn rit, puis s’arrête net, comme surpris d’en être encore capable.",
    "Les mains cherchent les verres à tâtons, et trouvent parfois celles des autres.",
    "Le feu n’est plus que braises, rouges et patientes comme ce qui vient d’être dit.",
  ],
  "court-avant": [
    "Les verres se remplissent sans cérémonie : ce soir, on ira droit à l’essentiel.",
    "Bellirith pose la bouteille au milieu de la table, à portée de toutes les mains.",
    "Le piano attend, le feu ronronne, et la soirée file plus vite que prévu.",
    "Valurn lance un regard à la pendule, puis à sa sœur, et décide de ne rien dire.",
  ],
  "court-apres": [
    "Il n’y a plus de temps pour les détours ; la vérité est déjà sur la table.",
    "Les braises rougeoient, et la nuit semble pressée de finir ce qu’elle a commencé.",
    "Personne ne remplit plus les verres ; tout le monde attend la suite.",
    "Le salon se resserre autour de vous trois, et la chaleur n’a plus rien à voir avec le feu.",
  ],
};
