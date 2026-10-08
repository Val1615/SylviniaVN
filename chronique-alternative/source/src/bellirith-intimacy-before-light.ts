import { A, B, M, P, W, X, SLEPT, FAVORITE, TREND_RESISTED, type AuthoredRoute } from "./bellirith-intimacy-kit";

/*
 * Diversion IV — « Saëlis sur une terrasse » (Al’Gratal, après la séance
 * devant Tia). Bellirith déplie une illusion de sa ville. Elle mène, mais
 * {player} trouve, une seconde, une « rue » qu’elle ne montre pas.
 */
export const BEFORE_LIGHT_ROUTE: AuthoredRoute = {
  id: "bellirith-saelis",
  context: "bellirith-diversion-before-light",
  text: "Une ville qui n’existe pas",
  detail: "Néons roses et pourpres au-dessus du palais de la Lumière. Une victoire, chez elle, ça se déshabille.",
  visual: { revealChapter: 3, postOrgasmChapter: 10 },
  chapters: [
    A(
      "L’escalier de service débouche sur une terrasse oubliée, tout en haut du palais, entre deux coupoles. Du jasmin a envahi la balustrade. En bas, très loin, Al’Gratal dort sous ses lanternes blanches, propre et silencieuse comme un registre bien tenu.",
      "Bellirith s’avance jusqu’au milieu des dalles, se retourne vers vous et ouvre la main.",
      "La nuit se déchire. Autour de vous, au-dessus de vous, sous vos pieds, une autre ville se lève : des toits qui battent lentement comme des cœurs, des enseignes de néon rose et pourpre, des ruelles où l’on rit trop fort, une musique qui sort de partout à la fois. La terrasse est devenue le toit d’une tour, au milieu de Saëlis.",
      B("Bienvenue chez moi. Enfin, une copie. L’original sent plus fort et on y perd plus souvent ses vêtements.", "smirk"),
      W(TREND_RESISTED, [
        B("Tu voulais choisir la rue. Choisis. Je te préviens : je les ai toutes dessinées, et toutes finissent sur ce toit.", "teasing"),
        P("Celle-là. Celle qui monte."),
        B("Évidemment. Celle qui monte. Tu as un goût exaspérant pour les choix qui me compliquent la vie.", "thoughtful"),
      ], [
        B("Ne cherche pas la sortie. Il n’y en a pas. Il n’y a que des entrées.", "seductive"),
      ]),
    ),
    A(
      "Elle vous fait faire le tour du toit comme une guide fière de son quartier. Là-bas, une rue où l’on vend des baisers au poids, à la criée. Ici, un tribunal qui ne juge qu’un seul crime : l’ennui. Plus loin, un pont où les amants qui se disputent doivent finir la querelle en dansant.",
      P("Et les gens qui gagnent une guerre ?"),
      B("À Saëlis, on ne gagne pas de guerre. On gagne des nuits. La Lumière a eu son armée ; personne ne lui a offert une nuit. Je trouve ça d’une tristesse indécente.", "teasing"),
      "Elle sort de nulle part une coupe de verre fumé et vous la tend. Le vin est presque noir.",
      B("Vin de Saëlis. Il a le goût de ce que tu veux. Ne me dis pas ce que tu goûtes. Je le saurai bien assez tôt.", "seductive"),
      "Vous buvez. Il a le goût de sa bouche, ce qui est, de toute évidence, de la triche.",
    ),
    M(
      [
        "Elle vous embrasse au bord du toit, au-dessus de la ville illusoire. Sous vos pieds, les néons palpitent plus vite quand votre cœur s’emballe.",
        B("Ta ville est plus honnête que toi. Regarde : elle bat pour moi.", "teasing"),
      ],
      [
        "Elle vous embrasse au bord du toit. Le baiser a le goût du vin noir, et il dure. Sous vos pieds, les enseignes de néon se mettent à palpiter plus vite à mesure que votre cœur s’emballe, comme si toute la ville s’était branchée sur votre poitrine.",
        B("Ta ville est plus honnête que toi. Regarde : elle bat pour moi. Toute une rue vient de devenir rouge.", "teasing"),
        P("C’est toi qui la fais battre."),
        B("Je l’ai dessinée. C’est toi qui la fais battre. Je n’aurais jamais osé une couleur pareille.", "smirk"),
      ],
      [
        "Elle vous embrasse au bord du toit. Le baiser a le goût du vin noir, et il dure. Ses mains glissent sous votre chemise, à plat sur votre dos, et la tirent vers le haut sans quitter votre bouche. Sous vos pieds, les enseignes de néon se mettent à palpiter plus vite à mesure que votre cœur s’emballe, comme si toute la ville s’était branchée sur votre poitrine.",
        B("Ta ville est plus honnête que toi. Regarde : elle bat pour moi. Toute une rue vient de devenir rouge.", "teasing"),
        P("C’est toi qui la fais battre."),
        B("Je l’ai dessinée. C’est toi qui la fais battre. Je n’aurais jamais osé une couleur pareille.", "smirk"),
        "Votre chemise tombe sur les dalles. Ses lèvres descendent dans votre cou, et à chaque morsure légère une enseigne clignote quelque part dans Saëlis.",
      ],
      [
        "Elle vous embrasse au bord du toit. La ville illusoire se met à battre au rythme de votre cœur.",
      ],
    ),
    M(
      [
        "La lumière des néons glisse sur sa peau quand elle laisse tomber sa robe. Rose, pourpre, rose. Elle tourne sur elle-même, une fois, pour vous laisser tout voir.",
        B("Une victoire, ça se déshabille. Tu commences ou je commence ?", "seductive"),
        "Elle commence, bien sûr.",
      ],
      [
        "La lumière des néons glisse sur sa peau quand elle laisse tomber sa robe. Rose, pourpre, rose. Elle tourne sur elle-même, une fois, lentement, pour vous laisser tout voir et pour voir tout ce que cela vous fait.",
        B("Une victoire, ça se déshabille. Tu commences ou je commence ?", "seductive"),
        "Elle commence, bien sûr. Elle défait le reste de vos vêtements avec une aisance presque insultante, et quand vous êtes nu·e sous le ciel de sa ville, elle recule pour vous contempler en faisant claquer sa langue.",
        B("Voilà. Maintenant, tu es habillé·e pour Saëlis.", "teasing"),
      ],
      [
        "La lumière des néons glisse sur sa peau quand elle laisse tomber sa robe. Rose sur ses seins, pourpre sur ses hanches, rose encore dans le creux de son ventre. Elle tourne sur elle-même, une fois, lentement, pour vous laisser tout voir et pour voir tout ce que cela vous fait.",
        B("Une victoire, ça se déshabille. Tu commences ou je commence ?", "seductive"),
        "Elle commence, bien sûr. Elle défait votre ceinture d’une main, le reste de l’autre, et vous dénude avec une aisance presque insultante.",
        X(
          "Quand vous êtes nue sous le ciel de sa ville, elle recule pour vous contempler. Les néons font briller la pointe de vos seins, l’arrondi de vos hanches, l’ombre humide entre vos cuisses. Elle fait claquer sa langue, ravie.",
          "Quand vous êtes nu sous le ciel de sa ville, elle recule pour vous contempler. Les néons dessinent votre torse, votre ventre, votre virilité tendue vers elle sans aucune retenue. Elle fait claquer sa langue, ravie.",
          "Quand vous êtes nu·e sous le ciel de sa ville, elle recule pour vous contempler. Les néons dessinent votre ventre, votre vigueur tendue vers elle, et la chaleur que la lumière rose fait luire juste en dessous. Elle fait claquer sa langue, ravie.",
        ),
        B("Voilà. Maintenant, tu es habillé·e pour Saëlis.", "teasing"),
      ],
      [
        "Elle laisse tomber sa robe sous les néons et vous habille « pour Saëlis », c’est-à-dire plus du tout.",
      ],
    ),
    M(
      [
        "Elle vous allonge sur des coussins qui n’étaient pas là une seconde plus tôt. Au-dessus de vous, le ciel de Saëlis est violet, sans étoiles, traversé de lanternes qui dérivent.",
        "Ses mains commencent leur exploration, et chaque fois qu’un frisson vous échappe, une lanterne s’allume au-dessus de vous.",
        B("Je vais remplir ce ciel. Tu vas voir.", "seductive"),
      ],
      [
        "Elle vous allonge sur des coussins qui n’étaient pas là une seconde plus tôt. Au-dessus de vous, le ciel de Saëlis est violet, sans étoiles, traversé de lanternes qui dérivent.",
        "Ses mains commencent leur exploration. Chaque fois qu’un frisson vous échappe, une lanterne s’allume au-dessus de vous ; chaque fois que vous retenez un soupir, deux. Le ciel se remplit à vue d’œil.",
        B("Je vais remplir ce ciel. Et ensuite, je vais allumer la ville entière.", "seductive"),
        W(SLEPT, [B("Celle-là, je la connaissais. Celle-là aussi. Oh, celle-là est nouvelle. Tu me caches des choses.", "teasing")], [B("Tu frissonnes en constellations. C’est très organisé, pour quelqu’un qui perd la tête.", "teasing")]),
      ],
      [
        "Elle vous allonge sur des coussins qui n’étaient pas là une seconde plus tôt. Au-dessus de vous, le ciel de Saëlis est violet, sans étoiles, traversé de lanternes qui dérivent.",
        "Ses mains commencent leur exploration, et sa bouche les suit. Chaque fois qu’un frisson vous échappe, une lanterne s’allume au-dessus de vous ; chaque fois que vous retenez un soupir, deux. Le ciel se remplit à vue d’œil.",
        W(SLEPT, [B("Celle-là, je la connaissais. Celle-là aussi. Oh, celle-là est nouvelle. Tu me caches des choses.", "teasing")], [B("Tu frissonnes en constellations. C’est très organisé, pour quelqu’un qui perd la tête.", "teasing")]),
        X(
          "Elle s’attarde sur vos seins jusqu’à ce que leurs pointes durcissent sous sa langue, puis descend, embrasse votre ventre, la crête de vos hanches, et souffle sur votre chaleur sans la toucher. Toute une avenue de lanternes s’embrase d’un coup.",
          "Elle s’attarde sur votre torse, mordille la ligne de vos côtes, puis descend, embrasse votre ventre, la crête de vos hanches, et souffle sur votre virilité sans la toucher. Toute une avenue de lanternes s’embrase d’un coup.",
          "Elle s’attarde sur votre poitrine, mordille la ligne de vos côtes, puis descend, embrasse votre ventre, et souffle sur votre vigueur puis sur votre chaleur, sans toucher ni l’une ni l’autre. Deux avenues de lanternes s’embrasent d’un coup.",
        ),
        B("Je vais remplir ce ciel. Et ensuite, je vais allumer la ville entière.", "seductive"),
      ],
      [
        "Elle vous allonge sous un ciel violet. Chaque frisson allume une lanterne. Le ciel se remplit vite.",
      ],
    ),
    M(
      [
        "Elle vous fait perdre la tête lentement, avec la bouche et les mains, et chaque fois que vous approchez du bord, elle s’arrête et vous montre le ciel.",
        B("Regarde ce que tu as fait. Tout ça pour une armée que tu n’as même pas fêtée.", "teasing"),
      ],
      [
        "Elle vous fait perdre la tête lentement, avec la bouche et les mains. Elle connaît l’art de vous amener au bord et l’art, plus cruel, de vous y laisser. Chaque fois qu’elle s’arrête, elle vous montre le ciel.",
        B("Regarde ce que tu as fait. Tout ça pour une armée que tu n’as même pas fêtée.", "teasing"),
        P("Je la fête maintenant."),
        B("Non. Maintenant, c’est moi que tu fêtes. Ne mélange pas tout.", "smirk"),
      ],
      [
        "Elle vous fait perdre la tête lentement.",
        X(
          "Sa bouche se pose enfin sur votre chaleur. Sa langue vous parcourt de bas en haut, s’enroule autour de votre perle de plaisir, la quitte pour l’intérieur de vos cuisses, revient. Ses doigts vous ouvrent, glissent en vous, cherchent et trouvent ce point qui vous fait cambrer les reins. Elle s’arrête au bord, chaque fois, et vous montre le ciel.",
          "Sa bouche se referme enfin sur votre virilité. Elle vous prend profondément, remonte, joue de la langue autour du sommet, redescend. Sa main serre la base au rythme exact qui vous fait perdre le souffle. Elle s’arrête au bord, chaque fois, et vous montre le ciel.",
          "Sa bouche se referme enfin sur votre vigueur pendant que ses doigts trouvent votre chaleur et s’y glissent. Elle alterne : la bouche, puis les doigts, puis les deux ensemble, sans jamais vous laisser deviner l’ordre. Elle s’arrête au bord, chaque fois, et vous montre le ciel.",
        ),
        B("Regarde ce que tu as fait. Tout ça pour une armée que tu n’as même pas fêtée.", "teasing"),
        P("Je la fête maintenant."),
        B("Non. Maintenant, c’est moi que tu fêtes. Ne mélange pas tout.", "smirk"),
      ],
      [
        "Elle vous mène jusqu’au bord, encore et encore, et chaque fois vous montre le ciel.",
      ],
    ),
    M(
      [
        "Quand elle vous laisse enfin basculer, toute la ville s’embrase. Des feux d’artifice roses éclatent au-dessus des toits, des enseignes explosent en pluie de lumière.",
        B("Voilà une victoire correctement célébrée.", "seductive"),
      ],
      [
        "Quand elle vous laisse enfin basculer, toute la ville s’embrase. Des feux d’artifice roses éclatent au-dessus des toits, les enseignes explosent en pluie de lumière, et quelque part dans une ruelle, une foule invisible applaudit.",
        B("Voilà une victoire correctement célébrée. Saëlis te remercie. Moi aussi, un peu.", "seductive"),
      ],
      [
        X(
          "Quand elle vous laisse enfin basculer, vous jouissez contre sa bouche, votre chaleur pulsant autour de ses doigts, vos talons enfoncés dans les coussins. Toute la ville s’embrase : des feux d’artifice roses éclatent au-dessus des toits, les enseignes explosent en pluie de lumière.",
          "Quand elle vous laisse enfin basculer, vous jouissez dans sa bouche, une main crispée dans ses cheveux, et elle vous garde jusqu’à la dernière secousse. Toute la ville s’embrase : des feux d’artifice roses éclatent au-dessus des toits, les enseignes explosent en pluie de lumière.",
          "Quand elle vous laisse enfin basculer, le plaisir éclate des deux côtés à la fois, votre vigueur dans sa bouche, votre chaleur serrée autour de ses doigts. Toute la ville s’embrase deux fois : des feux d’artifice roses, puis pourpres, au-dessus de tous les toits.",
        ),
        "Quelque part dans une ruelle, une foule invisible applaudit.",
        B("Voilà une victoire correctement célébrée. Saëlis te remercie. Moi aussi, un peu.", "seductive"),
      ],
      [
        "Elle vous laisse basculer. Toute la ville illusoire s’embrase en feux d’artifice roses.",
      ],
    ),
    M(
      [
        "Vous l’attirez contre vous et posez les lèvres sur un endroit au hasard, juste sous son oreille. Une rue entière de Saëlis s’éteint d’un coup. Bellirith se fige.",
        P("Qu’est-ce qui vient de se passer ?"),
        B("Rien. Une panne. Ma ville a des pannes.", "cold"),
        "Elle ne vous laisse pas recommencer. Mais elle a rougi, et dans sa ville, ça se voit.",
      ],
      [
        "Vous reprenez votre souffle et l’attirez contre vous. Sans calcul, vous posez les lèvres sur un endroit au hasard, au bas de sa nuque, juste à la naissance des cheveux.",
        "Une rue entière de Saëlis s’éteint d’un coup. Bellirith se fige, une demi-seconde, les yeux grands ouverts.",
        P("Qu’est-ce qui vient de se passer ?"),
        B("Rien. Une panne. Ma ville a des pannes. C’est une ville très ancienne.", "cold"),
        P("Tu as rougi."),
        B("Je suis une démone du Désir. Je rougis sur commande.", "angry"),
        "Elle ne vous laisse pas recommencer. Elle reprend votre bouche, plus vite, plus fort, comme on referme un livre qu’on a ouvert à la mauvaise page.",
      ],
      [
        "Vous reprenez votre souffle et l’attirez contre vous. Sans calcul, vous posez les lèvres sur un endroit au hasard, au bas de sa nuque, juste à la naissance des cheveux.",
        "Une rue entière de Saëlis s’éteint d’un coup. Bellirith se fige, une demi-seconde, les yeux grands ouverts, et contre votre cuisse vous sentez sa chaleur se serrer brusquement, comme une main qu’on referme.",
        P("Qu’est-ce qui vient de se passer ?"),
        B("Rien. Une panne. Ma ville a des pannes. C’est une ville très ancienne.", "cold"),
        P("Tu as rougi."),
        B("Je suis une démone du Désir. Je rougis sur commande.", "angry"),
        "Elle ne vous laisse pas recommencer. Elle reprend votre bouche, plus vite, plus fort, comme on referme un livre qu’on a ouvert à la mauvaise page, et vous pousse de nouveau sur les coussins.",
      ],
      [
        "Vous l’embrassez au hasard sous la nuque. Une rue de Saëlis s’éteint. Elle prétend que c’est une panne.",
      ],
    ),
    M(
      [
        "Elle s’installe sur vous et reprend le commandement avec une vigueur qui ressemble à une revanche. Les néons recommencent à battre, plus fort qu’avant.",
        B("Oublie ce que tu as vu.", "seductive"),
        P("Non."),
        B("Alors je vais te donner autre chose à te rappeler.", "teasing"),
      ],
      [
        "Elle s’installe à califourchon sur vous et reprend le commandement avec une ardeur qui ressemble beaucoup à une revanche. Elle bouge comme on danse sur ce pont où les amants finissent leurs querelles : vite, fièrement, sans vous laisser le moindre pas.",
        B("Oublie ce que tu as vu.", "seductive"),
        P("Non."),
        B("Alors je vais te donner autre chose à te rappeler.", "teasing"),
        "Les néons recommencent à battre, plus fort qu’avant, toutes les rues sauf une.",
      ],
      [
        "Elle s’installe à califourchon sur vous et reprend le commandement avec une ardeur qui ressemble beaucoup à une revanche.",
        X(
          "Elle presse sa chaleur contre la vôtre et se met à onduler, vite, fièrement, vos deux perles de plaisir frottant l’une contre l’autre à chaque mouvement. Elle saisit votre main et la plaque sur son sein, l’autre sur sa hanche, pour que vous suiviez sa danse sans jamais la mener.",
          "Elle vous guide en elle d’une seule poussée, jusqu’au bout, et se met à danser sur vous, vite, fièrement, comme sur ce pont où les amants finissent leurs querelles. Elle saisit vos mains et les plaque sur ses seins pour que vous la suiviez sans jamais la mener.",
          "Elle vous guide en elle d’une seule poussée et se met à danser sur votre vigueur, vite, fièrement, pendant que sa main revient chercher votre chaleur, comme pour vous rappeler que rien de vous ne lui échappe. Vous suivez sa danse sans jamais la mener.",
        ),
        B("Oublie ce que tu as vu.", "seductive"),
        P("Non."),
        B("Alors je vais te donner autre chose à te rappeler.", "teasing"),
        "Les néons recommencent à battre, plus fort qu’avant, toutes les rues sauf une.",
      ],
      [
        "Elle reprend le commandement avec une ardeur de revanche. Les néons recommencent à battre dans toutes les rues sauf une.",
      ],
    ),
    M(
      [
        "Elle atteint son plaisir avec un cri qui fait vibrer toute la ville. Les couleurs virent au pourpre profond, et pendant un long moment, Saëlis tout entière semble retenir son souffle avec elle.",
      ],
      [
        "Elle atteint son plaisir avec un cri qui fait vibrer toute la ville. Les couleurs virent au pourpre profond, les toits cessent de battre, et pendant un long moment Saëlis tout entière semble retenir son souffle avec elle.",
        "Le vôtre revient avec le sien, plus doux, plus lent, comme une marée qui remonte.",
        B("Tu vois ? Elle tient. Ma ville tient toujours.", "thoughtful"),
      ],
      [
        X(
          "Elle jouit avec un cri qui fait vibrer toute la ville, ses hanches serrées contre les vôtres, ses doigts noués aux vôtres sur son sein. Le plaisir vous reprend avec elle, plus doux, plus lent, comme une marée qui remonte.",
          "Elle jouit avec un cri qui fait vibrer toute la ville, se resserrant autour de vous en longues vagues qui vous emportent à votre tour. Vous vous répandez en elle pendant que les couleurs virent au pourpre profond.",
          "Elle jouit avec un cri qui fait vibrer toute la ville, se resserrant autour de votre vigueur pendant que ses doigts vous poussent de l’autre côté. Le plaisir vous reprend des deux côtés à la fois, plus doux, plus lent, comme une marée qui remonte.",
        ),
        "Les couleurs virent au pourpre profond, les toits cessent de battre, et pendant un long moment Saëlis tout entière semble retenir son souffle avec elle.",
        B("Tu vois ? Elle tient. Ma ville tient toujours.", "thoughtful"),
      ],
      [
        "Elle atteint son plaisir avec un cri. Saëlis vire au pourpre et retient son souffle avec elle.",
      ],
    ),
    A(
      "La ville s’éteint rue par rue, sans hâte, comme on souffle les bougies d’un salon après le départ des invités. Les toits redeviennent des coupoles. Les néons redeviennent du jasmin. Le ciel violet pâlit et redevient celui d’Al’Gratal, qui commence à blanchir à l’est.",
      "Bellirith est allongée contre vous, sur des dalles bien réelles et nettement moins confortables que les coussins. Elle ne bouge pas tout de suite. Elle regarde la dernière lanterne s’éteindre au-dessus de vous.",
      B("C’est toujours la partie que je préfère. Quand tout disparaît et que les gens restent quand même allongés.", "thoughtful"),
    ),
    A(
      "Puis elle se lève, ramasse sa robe, la secoue.",
      B("La Lumière a eu son armée. Toi, tu as eu ta fête. Je crois que tu as gagné au change.", "smirk"),
      P("Et les autres ?"),
      B("Eux, beaucoup moins. Mais ils n’étaient pas invités.", "teasing"),
      W(FAVORITE, [B("Tu sais ce que tu es, pour moi ? Le seul de mes invités qui ne demande jamais où est la sortie. Mon favori. Ne le répète pas, je nierai.", "seductive")], []),
    ),
    A(
      "Au moment de redescendre, elle s’arrête sur la première marche et vous regarde par-dessus son épaule.",
      B("Garde la rue que tu as trouvée. Je ne te dirai pas laquelle c’était.", "thoughtful"),
      P("Je la retrouverai."),
      B("C’est exactement ce que je crains. C’est exactement ce que j’espère. Ne me demande pas de choisir.", "seductive"),
    ),
  ],
};
