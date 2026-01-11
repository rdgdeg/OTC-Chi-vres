
import { Place, Experience, Event, Article, Product, PageContent } from '../types';

// --- PAGE CONTENTS (CMS) ---
export const PAGES_CONTENT: Record<string, PageContent> = {
  home: {
    id: 'home',
    heroTitle: 'Bienvenue à Chièvres, la Cité des Aviateurs !',
    heroSubtitle: 'Votre portail officiel pour explorer Chièvres.',
    heroImage: 'https://images.unsplash.com/photo-1582236967527-3c5822349079?q=80&w=1920&auto=format&fit=crop',
    introTitle: "Chièvres, Terre d'Histoire",
    introText: "Située au cœur du Hainaut, Chièvres surprend par la richesse de son patrimoine. De la Tour de Gavre, sentinelle de pierre, à la Chapelle de la Ladrerie, chaque rue raconte une histoire. Mais Chièvres, c'est aussi la convivialité du Crossage au mercredi des Cendres, la saveur d'une bière Mader dégustée en terrasse, et le calme des sentiers qui serpentent entre les champs et la base aérienne.",
    extraImage: 'https://picsum.photos/id/1028/800/600'
  },
  museums: {
    id: 'museums',
    heroTitle: 'Culture & Patrimoine',
    heroSubtitle: "Plongez au cœur de l'histoire chièvroise, des temps médiévaux à l'époque contemporaine.",
    heroImage: 'https://picsum.photos/id/1050/1920/600',
    introTitle: 'Nos lieux culturels',
    introText: "Chièvres regorge de trésors cachés. De l'imposante Tour de Gavre qui veille sur la ville depuis des siècles, aux collections émouvantes du Musée de la Vie Rurale, chaque pierre a une histoire à raconter."
  },
  walks: {
    id: 'walks',
    heroTitle: 'Découvrir - Balades',
    heroSubtitle: 'Partez à la découverte de Chièvres et de ses campagnes ! Que ce soit à pied, à cheval ou à vélo, succombez au charme d\'un territoire riche en paysages, en patrimoine et en histoire.',
    heroImage: 'https://picsum.photos/id/1036/1920/600',
    introTitle: 'Cinq circuits soigneusement repérés',
    introText: 'Cinq circuits soigneusement repérés vous guident à travers moulins, rivières, hameaux pittoresques ou encore, les allées de la cité. Téléchargez votre tracé et préparez-vous à vivre une balade au grand air… vous ne serez pas déçus !'
  },
  crossage: {
    id: 'crossage',
    heroTitle: 'CROSSAGE 2025',
    heroSubtitle: 'Le folklore chiévrois par excellence. Rendez-vous le mercredi 5 mars et le samedi 8 mars.',
    heroImage: 'https://picsum.photos/id/1058/1920/600',
    introTitle: 'À vos rabots !',
    introText: "Il sera bientôt temps de sortir vos rabots ! Le crossage fera son retour avec une nouvelle édition le mercredi 5 mars à Chièvres et Vaudignies, ainsi que le samedi 8 mars à Grosage. Le crossage, c’est bien plus qu’un jeu : c’est une tradition portée par les Chièvrois depuis des générations. Ambiance conviviale garantie, passion partagée, et une immersion dans le folklore local que vous ne trouverez nulle part ailleurs.",
    extraTitle: 'Les Soumonces',
    extraText: "Avant le grand jour, venez vous entraîner lors des Soumonces le samedi 22 février 2025 à l'Étang de Hove. Une journée pour tester votre matériel et tenter de devenir le Roi ou la Reine du Crossage 2025 !"
  },
  bulletin: {
    id: 'bulletin',
    heroTitle: 'Bulletin Communal',
    heroSubtitle: 'Toutes les informations officielles de la Ville de Chièvres.',
    heroImage: 'https://picsum.photos/id/1016/1920/600',
    introTitle: 'Dernière édition',
    introText: "Retrouvez ici le dernier 'Chièvres Info' en version numérique ainsi que les archives des mois précédents. Restez informé des travaux, des décisions du conseil et de la vie associative."
  }
};

// --- PLACES ---

export const MUSEUMS: Place[] = [
  {
    id: 'm_miba',
    name: 'Musée International de la Base Aérienne (M.I.B.A.)',
    description: "Revivez l'histoire passionnante de l'aviation à Chièvres, depuis la Première Guerre mondiale jusqu'à la présence américaine actuelle (OTAN). Découvrez des collections uniques d'uniformes, de maquettes, de pièces d'avions et de photographies d'époque.",
    address: 'Rue des Alliés 2, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/1015/800/600',
    type: 'museum',
    tags: ['Musée', 'Aviation', 'Histoire Militaire', 'Guerre 40-45'],
    lat: 50.5752,
    lng: 3.8231,
    galleryImages: [
      'https://picsum.photos/id/1016/800/600',
      'https://picsum.photos/id/1019/800/600',
      'https://picsum.photos/id/1055/800/600'
    ]
  },
  {
    id: 'm_rural',
    name: 'Musée de la Vie Rurale',
    description: "Situé au cœur du village d'Huissignies, ce musée préserve la mémoire du monde agricole d'autrefois. Explorez des reconstitutions d'ateliers (cordonnier, forgeron), une classe d'école 1900 et découvrez les outils oubliés de nos campagnes.",
    address: 'Rue de la Cure 10, 7950 Huissignies',
    imageUrl: 'https://picsum.photos/id/1020/800/600',
    type: 'museum',
    tags: ['Musée', 'Folklore', 'Agriculture', 'Huissignies'],
    lat: 50.5685,
    lng: 3.7342,
    galleryImages: [
      'https://picsum.photos/id/1021/800/600',
      'https://picsum.photos/id/1022/800/600',
      'https://picsum.photos/id/1023/800/600'
    ]
  },
  {
    id: 'p_tour',
    name: 'La Tour de Gavre',
    description: "Emblème de la cité, ce donjon roman (XIIe siècle) est le vestige de l'ancien château des Comtes de Gavre. Ses murs épais et sa silhouette massive en font un témoignage remarquable de l'architecture militaire médiévale en Hainaut.",
    address: 'Rue de la Chapelle, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/1040/800/600',
    type: 'museum',
    tags: ['Patrimoine', 'Moyen-Âge', 'Architecture', 'Monument Classé'],
    lat: 50.5884,
    lng: 3.8062,
    galleryImages: [
      'https://picsum.photos/id/1039/800/600',
      'https://picsum.photos/id/1038/800/600',
      'https://picsum.photos/id/1037/800/600'
    ]
  },
  {
    id: 'p_ladrerie',
    name: 'Chapelle de la Ladrerie',
    description: "Construite au XIIe siècle, cette chapelle gothique est l'unique vestige d'une léproserie médiévale. Située à l'écart de la ville pour éviter la contagion, elle est un lieu chargé d'émotion, classé Patrimoine Exceptionnel de Wallonie.",
    address: 'Chaussée de Mons, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/239/800/600',
    type: 'museum',
    tags: ['Patrimoine', 'Gothique', 'Histoire Religieuse', 'Monument Classé'],
    lat: 50.5832,
    lng: 3.8095,
    galleryImages: [
      'https://picsum.photos/id/238/800/600',
      'https://picsum.photos/id/217/800/600',
      'https://picsum.photos/id/216/800/600'
    ]
  },
  {
    id: 'p_stmartin',
    name: 'Église Saint-Martin',
    description: "Cet édifice imposant du XIVe siècle est un chef-d'œuvre du gothique hennuyer. Admirez sa tour massive qui servait de poste de guet, ses vitraux et son vaste volume intérieur. Elle domine la Grand Place de sa superbe.",
    address: 'Grand Place, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/247/800/600',
    type: 'museum',
    tags: ['Patrimoine', 'Église', 'Art Sacré', 'Gothique'],
    lat: 50.5891,
    lng: 3.8075,
    galleryImages: [
       'https://picsum.photos/id/248/800/600',
       'https://picsum.photos/id/249/800/600',
       'https://picsum.photos/id/250/800/600'
    ]
  },
  {
    id: 'p_ndfontaine',
    name: 'Chapelle Notre-Dame de la Fontaine',
    description: "Haut lieu de pèlerinage, cette chapelle (XIVe s.) abrite une source miraculeuse ('La Fontaine') réputée guérir la vue. Elle est le centre de la célèbre procession du Pèlerinage qui a lieu chaque année le jeudi de l'Ascension.",
    address: 'Rue de la Fontaine, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/1043/800/600',
    type: 'museum',
    tags: ['Pèlerinage', 'Patrimoine', 'Culte', 'Miracle'],
    lat: 50.5910,
    lng: 3.8040,
    galleryImages: [
      'https://picsum.photos/id/1044/800/600',
      'https://picsum.photos/id/1045/800/600'
    ]
  }
];

export const WALKS: Place[] = [
  {
    id: 'w_cervia',
    name: 'Circuit "Cervia"',
    description: "Flânez au cœur de Chièvres et partez à la rencontre de ses ruelles, de son patrimoine et de ses petites histoires locales. Cette balade vous emmène à travers le centre-ville, en passant par des lieux emblématiques et quelques chemins offrant de beaux points de vue. Terminez votre promenade sur la Grand-Place : l'endroit parfait pour s'installer en terrasse et profiter d'une pause conviviale lorsque le soleil est de la partie. Ce circuit a été imaginé par une Chiévroise, Axelle Mercier, avec l'envie de faire découvrir sa ville autrement : par le regard, la curiosité, et ces détails que l'on ne voit qu'en prenant le temps d'observer. Pour vous orienter ? Suivez simplement les flèches jaunes.",
    address: 'Départ: Parc communal (Chièvres - rue du grand Vivier)',
    imageUrl: 'https://picsum.photos/id/1036/800/600',
    type: 'walk',
    distance: '5 km',
    duration: '1h',
    difficulty: 'Facile',
    tags: ['Famille', 'Patrimoine', 'Centre-ville', 'Flèches jaunes'],
    lat: 50.5891,
    lng: 3.8075,
    downloadUrl: '#'
  },
  {
    id: 'w_piedsentes',
    name: 'La ronde des Piedsentes',
    description: "Partez à la découverte de ces petits sentiers typiques, appelés piedsentes, qui reliaient autrefois les terres agricoles, les prairies et les maisons du village. Cette balade vous invite à cheminer hors des grands axes, entre chemins herbeux, passages étroits et paysages champêtres paisibles. Une immersion douce et authentique dans la Chièvres rurale — idéale pour respirer, prendre son temps et observer la nature. L'atmosphère calme et verdoyante, les passages typiques entre haies et jardins, la sensation de marcher \"comme autrefois\". Un parcours parfait pour les familles et promeneurs tranquilles.",
    address: 'Départ: Musée de la Vie rurale de Huissignies (rue Augustin Melsens, 28)',
    imageUrl: 'https://picsum.photos/id/1020/800/600',
    type: 'walk',
    distance: '7,5 km',
    duration: '2h',
    difficulty: 'Facile',
    tags: ['Famille', 'Nature', 'Piedsentes', 'Huissignies'],
    lat: 50.5685,
    lng: 3.7342,
    downloadUrl: '#'
  },
  {
    id: 'w_eglises',
    name: 'Circuit découverte des églises',
    description: "Partez à la rencontre des trésors religieux de Chièvres et découvrez l'architecture variée de ses églises et chapelles, du gothique au roman. Ce circuit vous emmène à travers le centre-ville et les alentours, mêlant patrimoine urbain et paysages ruraux. Admirez façades, vitraux, clochers et détails historiques souvent méconnus. Une belle manière de plonger dans l'histoire et le patrimoine religieux de la cité, tout en profitant d'une randonnée vivifiante. La diversité des styles architecturaux : gothique, roman et néo-gothique, les anecdotes et histoires locales liées à chaque édifice, les points de vue champêtres et urbains pour la photographie. Une expérience complète alliant culture, patrimoine et nature.",
    address: 'Départ: Rue du Château à Chièvres (église Saint-Martin)',
    imageUrl: 'https://picsum.photos/id/247/800/600',
    type: 'walk',
    distance: '22 km',
    duration: '± 5h à pied',
    difficulty: 'Moyen',
    tags: ['Patrimoine', 'Églises', 'Architecture', 'Randonneurs'],
    lat: 50.5891,
    lng: 3.8075,
    downloadUrl: '#'
  },
  {
    id: 'w_chateaux',
    name: 'Circuit des châteaux',
    description: "Enfourchez votre vélo et partez à la découverte des châteaux et demeures historiques de Chièvres et de ses environs. Le long de chemins de campagne pittoresques, vous passerez devant les vestiges et emplacements des anciens châteaux qui ont façonné l'histoire locale. Entre architecture, anecdotes historiques et paysages champêtres, ce circuit vous plonge dans le patrimoine seigneurial de la région, tout en profitant de l'air pur et de la beauté des environs. Les vestiges et traces des anciens châteaux de Chièvres, les panoramas champêtres et pittoresques le long du parcours, les histoires et anecdotes liées aux familles seigneuriales et à leur influence sur la région. Une expérience idéale pour les amateurs de patrimoine et de balades à vélo. Circuit permanent testé et validé par le Vélo Club de Tongre Notre-Dame.",
    address: 'Départ: Grand-Place Chièvres',
    imageUrl: 'https://picsum.photos/id/1040/800/600',
    type: 'walk',
    distance: '28 km',
    duration: '± 3h en vélo',
    difficulty: 'Moyen',
    tags: ['Vélo', 'Châteaux', 'Histoire', 'Cyclistes'],
    lat: 50.5891,
    lng: 3.8075,
    downloadUrl: '#',
    documentUrl: '#'
  },
  {
    id: 'w_moulins',
    name: 'À la rencontre des moulins',
    description: "Partez sur les traces des moulins qui jalonnent la Hunelle et découvrez le rôle central qu'ils ont joué dans la vie économique et sociale de la région. Ce circuit vous invite à flâner le long de la rivière, à observer les paysages champêtres et à vous imprégner de l'histoire locale. À ne pas manquer : les anciens moulins et leur architecture, les ponts et passages typiques de la Hunelle, les prairies et paysages champêtres.",
    address: 'Départ: Chapelle de la Ladrerie (Rue d\'Ath)',
    imageUrl: 'https://picsum.photos/id/490/800/600',
    type: 'walk',
    distance: '18 km',
    duration: '4h (à pied)',
    difficulty: 'Moyen',
    tags: ['Moulins', 'Hunelle', 'Randonneurs', 'Cyclistes'],
    lat: 50.5832,
    lng: 3.8095,
    downloadUrl: 'https://www.openrunner.com/route-details/22818735'
  },
  {
    id: 'w_tongre',
    name: 'Les deux Tongre',
    description: "Partez à la découverte des villages de Tongre-Saint-Martin et Tongre-Notre-Dame, deux joyaux de l'entité chiévroise. Ce circuit vous emmène à travers ruelles pittoresques, chemins ruraux et hameaux typiques, vous offrant un aperçu authentique de la vie locale et du patrimoine architectural. Entre fermes anciennes, églises charmantes et petits paysages champêtres, laissez-vous surprendre par les détails et anecdotes qui font le caractère unique de Tongre. Les ruelles et places pittoresques des deux villages, les fermes anciennes et maisons typiques de la région, les chemins champêtres tranquilles, propices aux promenades et photos, les petites histoires locales et traditions chiévroises.",
    address: 'Départ: Parking Moulin de la Hunelle (Rue d\'Ath, 90)',
    imageUrl: 'https://picsum.photos/id/1049/800/600',
    type: 'walk',
    distance: '10 km',
    duration: '2h (à pied)',
    difficulty: 'Facile',
    tags: ['Famille', 'Villages', 'Tongre', 'Patrimoine'],
    lat: 50.5920,
    lng: 3.8100,
    downloadUrl: 'https://www.openrunner.com/route-details/22818836'
  },
  {
    id: 'w_ladeuze_huissignies',
    name: 'Ladeuze & Huissignies',
    description: "Ce circuit vous invite à parcourir deux villages emblématiques de l'entité : Ladeuze et Huissignies. Au fil des chemins, vous découvrirez des paysages typiques du Haut-Pays hennuyer, entre champs ouverts, sentiers bordés de haies et petites voiries agricoles. Vous traverserez des cœurs de villages chaleureux où subsistent fermes en briques, chapelles discrètes et témoignages d'une vie rurale encore bien ancrée. Un parcours qui respire la douceur, la simplicité et l'authenticité. La tranquillité du parcours, loin de l'agitation et du bruit, les paysages ouverts, typiques des campagnes du Haut-Pays, les petites chapelles et calvaires qui ponctuent le chemin, discrets témoins de la vie d'autrefois, le charme des villages de Ladeuze et Huissignies, authentiques, simples, accueillants.",
    address: 'Départ: halte nautique de Ladeuze (Grande Drève)',
    imageUrl: 'https://picsum.photos/id/111/800/600',
    type: 'walk',
    distance: '10 km',
    duration: '2h (à pied)',
    difficulty: 'Facile',
    tags: ['Famille', 'Villages', 'Haut-Pays', 'Authentique'],
    lat: 50.5520,
    lng: 3.7510,
    downloadUrl: 'https://www.openrunner.com/route-details/22819149'
  },
  {
    id: 'w_vaudignies',
    name: 'Vaudignies',
    description: "Partez à la découverte de Vaudignies, un hameau paisible où le temps semble s'écouler autrement. Cette balade vous emmène à travers chemins de campagne et petites voiries rurales. Vous emprunterez notamment le sentier du Tunnel, un passage pittoresque qui vous conduit jusqu'au lieu-dit \"le Pont des Amoureux\". L'ambiance apaisante du hameau et des campagnes environnantes, le Pont des amoureux, une balade courte, facile, mais pleine de charme.",
    address: 'Départ: église Saint-Philippe, parking rue Rincheval',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    type: 'walk',
    distance: '5,5 km',
    duration: '1h30 (à pied)',
    difficulty: 'Facile',
    tags: ['Famille', 'Vaudignies', 'Pont des Amoureux', 'Charme'],
    lat: 50.5720,
    lng: 3.7820,
    downloadUrl: 'https://www.openrunner.com/route-details/12667613'
  },
  {
    id: 'w_grosage',
    name: 'Grosage',
    description: "Découvrez Grosage, un village paisible au cœur de la campagne chiévroise. Cette balade vous mène à travers les chemins agricoles, typiques de la région. Ici, la nature s'étend à perte de vue, et le temps semble ralentir. Le départ de la balade à l'église de la Sainte-Vierge est un moment à ne pas manquer : autrefois dédiée à Saint-Christophe, cette charmante église mérite qu'on s'y attarde pour admirer son architecture, ses vitraux et ressentir l'ambiance unique du lieu. Le charme de l'église Saint-Christophe, les fermes en briques témoignent du patrimoine rural local, une boucle courte et accessible, parfaite pour s'aérer.",
    address: 'Départ: église de Grosage',
    imageUrl: 'https://picsum.photos/id/431/800/600',
    type: 'walk',
    distance: '7 km',
    duration: '1h45 (à pied)',
    difficulty: 'Facile',
    tags: ['Famille', 'Grosage', 'Église', 'Campagne'],
    lat: 50.5625,
    lng: 3.7655,
    downloadUrl: 'https://www.openrunner.com/route-details/19517101'
  }
];

export const ACCOMMODATION: Place[] = [
  {
    id: 'h_meermin',
    name: 'Meermin boot (Sur Péniche)',
    description: "Logement insolite sur péniche. Capacité de 1 à 5 personnes avec tout le confort nécessaire pour un séjour reposant. Contact: meerminboot@gmail.com",
    address: 'Rue de la grande drève, 7950 Ladeuze',
    imageUrl: 'https://images.unsplash.com/photo-1566375638419-18c3752e0d4e?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0489 64 94 93',
    tags: ['Insolite', 'Péniche', 'Ladeuze', 'Bord de l\'eau'],
    lat: 50.5520,
    lng: 3.7510
  },
  {
    id: 'h_real',
    name: 'Chez Réal & Annick',
    description: "Chambre d'hôtes (4 pers). 1 chambre 'Tintin' (2 lits simples) & 1 chambre 'Doux Repos' (1 lit double). Contact: Annick & Réal, duquesnereal@hotmail.be",
    address: 'Rue de la Gare 11B, 7950 Ladeuze',
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0477 99 59 27',
    tags: ['Chambre d\'hôtes', 'Ladeuze', 'Famille'],
    lat: 50.5545,
    lng: 3.7540
  },
  {
    id: 'h_kiki',
    name: 'Chez les Kiki',
    description: "Gîte rural. 2 adultes + 1 adulte (canapé-lit) ou 2 petits enfants. Contact: Vaeyens Johan & Busiau Françoise, chezleskiki@gmail.com",
    address: 'Rue Royale 28C, 7950 Chièvres',
    imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '068 65 78 18',
    tags: ['Gîte', 'Chièvres', 'Couple'],
    lat: 50.5895,
    lng: 3.8085
  },
  {
    id: 'h_moulin',
    name: 'Moulin du Domissart',
    description: "Ensemble de 4 gîtes ruraux (24 personnes). Contact: Aurore et Thomas Vanneste, info@moulin-a-eau.be",
    address: 'Rue Puits à Leval 27, 7950 Grosage',
    imageUrl: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0477 13 22 99',
    tags: ['Gîte', 'Grand Groupe', 'Grosage', 'Campagne'],
    lat: 50.5610,
    lng: 3.7680
  },
  {
    id: 'h_loge',
    name: 'La Loge Bed & Breakfast',
    description: "Appartement pour 2 à 4 personnes avec option petit-déjeuner. Contact: laloge@outlook.be",
    address: 'Rue de Ladeuze 1, 7950 Chièvres',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0472 65 32 01',
    tags: ['Appartement', 'B&B', 'Chièvres', 'Petit-déjeuner'],
    lat: 50.5850,
    lng: 3.7950
  },
  {
    id: 'h_chauchaut',
    name: 'Au Sentier Chauchaut',
    description: "Chambre d'hôtes (3 à 5 personnes). Contact: M et Mme Ost-Nasdrovisky, ostchr1968@gmail.com",
    address: 'Sentier Chauchaut 1, 7950 Chièvres',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-40891a940c75?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0473 96 11 94',
    tags: ['Chambre d\'hôtes', 'Chièvres', 'Nature'],
    lat: 50.5820,
    lng: 3.8120
  },
  {
    id: 'h_maison_cote',
    name: 'La Maison d\'à Côté',
    description: "Gîte de 2 chambres (capacité 5 personnes). Contact: Winiecki Michaël, winieckimic@gmail.com",
    address: 'Rue Emile Daubechies 4, 7950 Tongre-Saint-Martin',
    imageUrl: 'https://images.unsplash.com/photo-1513584685908-22746531f536?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0474 78 71 99',
    tags: ['Gîte', 'Tongre-St-Martin', 'Famille'],
    lat: 50.5940,
    lng: 3.8260
  },
  {
    id: 'h_ruiclot',
    name: 'Le Ruiclot',
    description: "Gîte rural à Huissignies. Réservation : carlierpatrick@skynet.be. Sur place : M. Henri Frédéric (069 68 71 92).",
    address: 'Rue des Huées 8, 7950 Huissignies',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0498 08 91 17',
    tags: ['Gîte', 'Huissignies', 'Calme'],
    lat: 50.5690,
    lng: 3.7360
  },
  {
    id: 'h_bouillon',
    name: 'Au Champ du Bouillon',
    description: "Gîte tout confort (2-4 pers) avec espace bien-être privatif. Contact: rogejoh@hotmail.com",
    address: 'Rue de la Ladrerie 12, 7950 Tongre-Notre-Dame',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0498 07 00 85',
    tags: ['Gîte', 'Wellness', 'Tongre-ND', 'Détente'],
    lat: 50.5810,
    lng: 3.7850
  },
  {
    id: 'h_evasion',
    name: 'L\'Évasion (Yacht)',
    description: "Gîte sur un yacht (6 voyageurs, 3 chambres). Contact: evasionyacht@hotmail.com",
    address: 'Rue Grande Drève, 7950 Ladeuze',
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0491 86 58 09',
    tags: ['Insolite', 'Yacht', 'Ladeuze', 'Groupe'],
    lat: 50.5530,
    lng: 3.7520
  },
  {
    id: 'h_greniers',
    name: 'Les Greniers du Moulin',
    description: "Gîte à la ferme spacieux (8 voyageurs, 3 chambres, 7 lits). Contact: lafermedumoulin@skynet.be",
    address: 'Rue des Héros de Roumont 26, 7950 Grosage',
    imageUrl: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1000&auto=format&fit=crop',
    type: 'hotel',
    phone: '0478 45 94 19',
    tags: ['Ferme', 'Gîte', 'Grosage', 'Famille'],
    lat: 50.5605,
    lng: 3.7660
  }
];

export const RESTAURANTS: Place[] = [
  // --- CAFES (Se désaltérer) ---
  {
    id: 'c_faubourg',
    name: 'Au Faubourg',
    description: "Café convivial. Ouvert tous les jours à partir de 10h, fermé le mercredi.",
    address: 'Grand Rue 24, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/431/800/600',
    type: 'cafe',
    phone: '0496/39 45 76',
    tags: ['Café', 'Chièvres'],
    lat: 50.5880,
    lng: 3.8070
  },
  {
    id: 'c_egmont',
    name: 'Comte d’Egmont',
    description: "Café situé sur la Grand Place. Possibilité de déguster la bière «7e Wing». Ouvert 09h30-20h30 (samedi et dimanche jusqu’à 22h00). Fermé le jeudi.",
    address: 'Grand Place 11, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/1060/800/600',
    type: 'cafe',
    phone: '068/65.92.95',
    tags: ['Café', 'Bière Spéciale', 'Terrasse'],
    lat: 50.5890,
    lng: 3.8078
  },
  {
    id: 'c_point_arret',
    name: 'Au point d\'arrêt (Chez Sandro)',
    description: "Café de village sympathique à Vaudignies.",
    address: 'Rue des Écoles 25, 7950 Vaudignies',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    type: 'cafe',
    phone: '0477/89 04 14',
    tags: ['Café', 'Vaudignies'],
    lat: 50.5720,
    lng: 3.7820
  },
  {
    id: 'c_gina',
    name: 'Chez Gina',
    description: "Café ouvert du lundi au dimanche dès 08h.",
    address: 'Rue de la Grand Drève 6, 7950 Ladeuze',
    imageUrl: 'https://picsum.photos/id/425/800/600',
    type: 'cafe',
    phone: '068/65 72 81',
    tags: ['Café', 'Ladeuze'],
    lat: 50.5525,
    lng: 3.7515
  },
  {
    id: 'c_fermette',
    name: 'Café étang la Fermette',
    description: "Cadre agréable près de l'étang.",
    address: 'Rue Puits à Leval 14B, 7950 Grosage',
    imageUrl: 'https://picsum.photos/id/111/800/600',
    type: 'cafe',
    phone: '0486/03 51 24',
    tags: ['Café', 'Grosage', 'Nature'],
    lat: 50.5615,
    lng: 3.7690
  },
  {
    id: 'c_marcotte',
    name: 'La Marcotte',
    description: "Lundi, mercredi, jeudi et vendredi 16h-00h. Samedi 11h-00h. Dimanche 11h-16h. Fermé mardi.",
    address: 'Rue de l’Église 12, 7950 Huissignies',
    imageUrl: 'https://picsum.photos/id/433/800/600',
    type: 'cafe',
    phone: '069/68 92 87',
    tags: ['Café', 'Huissignies'],
    lat: 50.5688,
    lng: 3.7350
  },
  {
    id: 'c_amis',
    name: 'Les Amis de la Campagne',
    description: "Samedi-lundi 11h-14h et 17h à ... ; mardi-vendredi 17h à ...",
    address: 'Rue des Carrières 8, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/531/800/600',
    type: 'cafe',
    tags: ['Café', 'Chièvres'],
    lat: 50.5870,
    lng: 3.8050
  },

  // --- RESTAURANTS (Se restaurer) ---
  {
    id: 'r_maman',
    name: 'Au goût de maman',
    description: "Tea-room, épicerie et sandwicherie. Mercredi-vendredi 8h-17h ; samedi 10h30-17h ; dimanche 8h-17h. Fermé lundi & mardi.",
    address: 'Rue Saint Jean 31A, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    type: 'restaurant',
    phone: '0495 38 73 63',
    tags: ['Tea-room', 'Sandwicherie', 'Épicerie'],
    lat: 50.5885,
    lng: 3.8072
  },
  {
    id: 'r_eden',
    name: 'L’Eden',
    description: "Taverne et Restaurant sur la Grand Place.",
    address: 'Grand’Place 18, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/336/800/600',
    type: 'restaurant',
    phone: '068 30 06 57',
    tags: ['Restaurant', 'Taverne'],
    lat: 50.5892,
    lng: 3.8076
  },
  {
    id: 'r_hunelle',
    name: 'Moulin de la Hunelle',
    description: "Atelier protégé – restaurant/traiteur. Dimanche au vendredi à partir de 12h00 ; le soir sur réservation (min 15 pers).",
    address: '90 Rue d’Ath, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/490/800/600',
    type: 'restaurant',
    phone: '068 65 67 67',
    tags: ['Restaurant', 'Traiteur', 'Social'],
    lat: 50.5920,
    lng: 3.8100
  },
  {
    id: 'r_lindsay',
    name: 'Friterie Lindsay',
    description: "Snack – friterie. Lundi-jeudi 12h00-13h30 & 18h00-21h00 ; vendredi-samedi jusqu’à minuit.",
    address: 'Grand-Rue 39, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/766/800/600',
    type: 'restaurant',
    tags: ['Friterie', 'Snack'],
    lat: 50.5882,
    lng: 3.8065
  },
  {
    id: 'r_saporita',
    name: 'Pizza Saporita',
    description: "Pizzas cuites au feu de bois (livraison / emporter). Fermé lundi ; mardi-samedi 11h30-13h30 & 18h-22h ; dimanche 18h-22h.",
    address: 'Grand Rue 77A, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/674/800/600',
    type: 'restaurant',
    phone: '068 65 93 50',
    tags: ['Pizzeria', 'À emporter', 'Livraison'],
    lat: 50.5875,
    lng: 3.8060
  },
  {
    id: 'r_stchristophe',
    name: 'Brasserie Saint‑Christophe',
    description: "Mardi, jeudi & dimanche 11h-00h ; mercredi 16h-00h ; vendredi et samedi 11h-02h.",
    address: 'Place Saint-Christophe, 7950 Grosage',
    imageUrl: 'https://picsum.photos/id/431/800/600',
    type: 'restaurant',
    phone: '069 77 74 11',
    tags: ['Brasserie', 'Grosage'],
    lat: 50.5625,
    lng: 3.7655
  },
  {
    id: 'r_fritmobile',
    name: 'La Fritmobile',
    description: "Foodtruck au Pont du Chasseur. Vendredi & dimanche 18h30-21h30.",
    address: 'Ladeuze (Pont du Chasseur)',
    imageUrl: 'https://picsum.photos/id/564/800/600',
    type: 'restaurant',
    tags: ['Foodtruck', 'Friterie', 'Ladeuze'],
    lat: 50.5550,
    lng: 3.7550
  },
  {
    id: 'r_dreve_bras',
    name: 'Brasserie La Drève',
    description: "Brasserie-taverne. Vendredi & samedi 18h-23h ; jours fériés 11h30-22h.",
    address: 'Rue de la Grande Drève, 7950 Ladeuze',
    imageUrl: 'https://picsum.photos/id/835/800/600',
    type: 'restaurant',
    phone: '068 55 12 18',
    tags: ['Brasserie', 'Ladeuze'],
    lat: 50.5530,
    lng: 3.7520
  },
  {
    id: 'r_real',
    name: 'La Table de Réal',
    description: "Table d’hôte – cuisine semi-gastronomique. Réservation obligatoire (4-15 pers).",
    address: 'Rue de la Gare 11b, 7950 Ladeuze',
    imageUrl: 'https://picsum.photos/id/658/800/600',
    type: 'restaurant',
    phone: '0477 995 927',
    tags: ['Table d\'hôte', 'Gastronomie', 'Sur réservation'],
    lat: 50.5540,
    lng: 3.7545
  },
  {
    id: 'r_claude',
    name: 'La Table de Claude',
    description: "Cuisine du terroir. Ouvert jeudi & vendredi midi et soir, samedi soir, dimanche midi ; en été : aussi mercredi midi/soir.",
    address: 'Chaussée de Saint-Ghislain 199, 7950 Vaudignies',
    imageUrl: 'https://picsum.photos/id/365/800/600',
    type: 'restaurant',
    phone: '068 65 93 72',
    website: 'http://www.la-tabledeclaude.be',
    tags: ['Terroir', 'Vaudignies'],
    lat: 50.5750,
    lng: 3.7880
  },
  {
    id: 'r_dreve_2',
    name: 'La Drève',
    description: "Brasserie conviviale.",
    address: 'Grande Drève 16a, 7950 Ladeuze',
    imageUrl: 'https://picsum.photos/id/225/800/600',
    type: 'restaurant',
    phone: '0475 66 46 98',
    tags: ['Brasserie', 'Ladeuze'],
    lat: 50.5535,
    lng: 3.7525
  }
];

export const MERCHANTS: Place[] = [
  // --- MERCHANTS (Existing + Producers) ---
  {
    id: 's1',
    name: 'Boulangerie "L\'Épi d\'Or"',
    description: "Célèbre pour sa Tarte à Maton, la spécialité de la région (lait caillé, amandes).",
    address: 'Rue Grande 15, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/488/800/600',
    type: 'shop',
    phone: '+32 68 65 44 44',
    tags: ['Boulangerie', 'Tarte au Maton', 'Artisan'],
    lat: 50.5888,
    lng: 3.8068
  },
  {
    id: 's2',
    name: 'Fleurs & Passion',
    description: "Artisan fleuriste créatif pour toutes les occasions. Articles de décoration.",
    address: 'Grand Place 8, 7950 Chièvres',
    imageUrl: 'https://picsum.photos/id/360/800/600',
    type: 'shop',
    phone: '+32 68 65 55 55',
    tags: ['Fleuriste', 'Décoration', 'Cadeaux'],
    lat: 50.5893,
    lng: 3.8079
  },
  
  // --- PRODUCERS (Alimentation et terroir) ---
  {
    id: 'p_moulin',
    name: 'La Ferme du Moulin',
    description: "Glaces artisanales, produits fermiers (crèmerie, œufs, viandes). Spécialité glaces, œufs de poules/cailles, viandes. Horaires : tous les samedis matin 9h-15h et sur rendez-vous.",
    address: 'Rue des Héros de Roumont 26, 7950 Grosage',
    imageUrl: 'https://picsum.photos/id/1020/800/600',
    type: 'producer',
    phone: '069 68 94 76',
    tags: ['Ferme', 'Glaces', 'Viande', 'Circuit-court'],
    lat: 50.5600,
    lng: 3.7670
  },
  {
    id: 'p_recoltes',
    name: 'Au temps des récoltes',
    description: "Magasin de fruits & légumes, pommes de terre, bières, produits laitiers, chocolats. Lundi, mercredi, vendredi 13h30-18h ; samedi 9h-12h & 13h30-18h.",
    address: 'Rue Puits à Leval, 7950 Grosage',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    type: 'producer',
    phone: '0473 62 04 85',
    tags: ['Magasin', 'Fruits & Légumes', 'Produits locaux'],
    lat: 50.5612,
    lng: 3.7685
  },
  {
    id: 'p_fourmanoy',
    name: 'Ferme Fourmanoy',
    description: "Boulangerie artisanale, farine, produits bio. Mercredi 14h-19h ; samedi 8h30-19h. Présent sur les marchés (Ath, Mons, Chièvres).",
    address: 'Rue Albert Quivy 12, 7950 Tongres Saint-Martin',
    imageUrl: 'https://picsum.photos/id/999/800/600',
    type: 'producer',
    phone: '068 65 90 51',
    tags: ['Ferme', 'Boulangerie', 'Bio'],
    lat: 50.5960,
    lng: 3.8240
  },
  {
    id: 'p_feron',
    name: 'Ferme Feron',
    description: "Produits fermiers en self-service (oignons, pommes de terre en sac).",
    address: 'Chaussée de Saint-Ghislain 110, 7950 Vaudignies',
    imageUrl: 'https://picsum.photos/id/113/800/600',
    type: 'producer',
    tags: ['Ferme', 'Pommes de terre', 'Self-service'],
    lat: 50.5740,
    lng: 3.7850
  },
  {
    id: 'p_fraises',
    name: 'Fraises de Vaudignies',
    description: "Production artisanale de fraises (Elianny, Joli & Lambada) et légumes de saison. Cueillette de mai à juillet.",
    address: 'Rue du Bois 103, 7950 Vaudignies',
    imageUrl: 'https://picsum.photos/id/108/800/600',
    type: 'producer',
    phone: '068 65 84 49',
    tags: ['Fruits', 'Fraises', 'Cueillette'],
    lat: 50.5760,
    lng: 3.7810
  },
  {
    id: 'p_blondiau',
    name: 'Côté Nature – Ferme Blondiau',
    description: "Produits fermiers et alimentation animale.",
    address: 'Chaussée de Saint-Ghislain 248, 7950 Vaudignies',
    imageUrl: 'https://picsum.photos/id/292/800/600',
    type: 'producer',
    phone: '0472 95 46 33',
    tags: ['Ferme', 'Alimentation', 'Animaux'],
    lat: 50.5770,
    lng: 3.7900
  }
];

// --- EXPERIENCES ---

export const EXPERIENCES: Experience[] = [
  {
    id: 'e1',
    title: "L'Énigme de la Tour de Gavre",
    description: "Un escape game en plein air. Munis d'un carnet de route, résolvez les énigmes médiévales disséminées dans la ville pour retrouver le trésor des Comtes.",
    category: 'famille',
    price: '15€ / groupe',
    duration: '2h00',
    imageUrl: 'https://picsum.photos/id/1068/800/600',
    features: ['Kit de jeu fourni', 'Accessible aux enfants', 'Cadeau à la clé']
  },
  {
    id: 'e2',
    title: "Initiation au Crossage de Rue",
    description: "Découvrez ce sport folklorique unique, ancêtre du golf, pratiqué traditionnellement le Mercredi des Cendres. Apprenez à manier la 'chôlette' et le 'rabot'.",
    category: 'adulte',
    price: '10€ / pers',
    duration: '1h30',
    imageUrl: 'https://picsum.photos/id/1056/800/600',
    features: ['Matériel fourni', 'Encadrement par des experts', 'Verre de l\'amitié']
  }
];

// --- EVENTS ---

export const EVENTS: Event[] = [
  {
    id: 'ev1',
    title: 'Le Crossage de Chièvres',
    date: 'Mercredi des Cendres',
    day: 5,
    month: 'MAR',
    description: "L'événement incontournable de l'année. Toute la ville joue au crossage (soule) dans les rues. Ambiance festive garantie !",
    location: 'Centre-ville',
    category: 'folklore',
    imageUrl: 'https://picsum.photos/id/1058/800/600'
  },
  {
    id: 'ev2',
    title: 'Foire aux Artisans',
    date: 'Dimanche 12 Mai',
    day: 12,
    month: 'MAI',
    description: "Venez découvrir le savoir-faire de nos artisans locaux : poterie, bijoux, produits de bouche et animations musicales.",
    location: 'Grand Place',
    category: 'marché',
    imageUrl: 'https://picsum.photos/id/1059/800/600'
  },
  {
    id: 'ev3',
    title: 'Procession du Pèlerinage',
    date: 'Jeudi de l\'Ascension',
    day: 9,
    month: 'MAI',
    description: "Procession historique en l'honneur de Notre-Dame de la Fontaine. Un moment de recueillement et de tradition.",
    location: 'Chapelle N-D de la Fontaine',
    category: 'culture',
    imageUrl: 'https://picsum.photos/id/1060/800/600'
  }
];

// --- BLOG ---

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: "La légende de la Tour de Gavre",
    excerpt: "Connaissez-vous l'histoire de la Dame de Gavre ? Découvrez la légende qui entoure ce monument emblématique de notre cité...",
    date: '15 Oct 2023',
    author: 'Sophie Dubois',
    imageUrl: 'https://picsum.photos/id/1039/800/600',
    category: 'Histoire'
  },
  {
    id: 'a2',
    title: "3 recettes à base de Tarte au Maton",
    excerpt: "La tarte au maton se déguste nature, mais saviez-vous qu'on peut la revisiter ? Voici trois idées originales pour surprendre vos invités.",
    date: '22 Sept 2023',
    author: 'Jean Michel',
    imageUrl: 'https://picsum.photos/id/1062/800/600',
    category: 'Gastronomie'
  },
  {
    id: 'a3',
    title: "Randonnée : les plus beaux spots d'automne",
    excerpt: "L'automne pare nos campagnes de couleurs flamboyantes. Nous avons sélectionné pour vous les meilleurs sentiers pour en profiter.",
    date: '10 Sept 2023',
    author: 'Marc Rando',
    imageUrl: 'https://picsum.photos/id/1063/800/600',
    category: 'Nature'
  }
];

// --- SHOP ---

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tarte au Maton (4 pers)',
    price: 8.50,
    description: "La véritable tarte au maton de Chièvres, préparée artisanalement avec du lait de ferme.",
    imageUrl: 'https://picsum.photos/id/1069/400/400',
    category: 'terroir'
  },
  {
    id: 'p2',
    name: 'Bière "L\'Aviateur" (75cl)',
    price: 6.00,
    description: "Une bière blonde légère et rafraîchissante, brassée en hommage à l'histoire aéronautique de la ville.",
    imageUrl: 'https://picsum.photos/id/1070/400/400',
    category: 'terroir'
  },
  {
    id: 'p3',
    name: 'Livre: "Chièvres d\'hier et d\'aujourd\'hui"',
    price: 25.00,
    description: "Un ouvrage magnifique retraçant l'évolution de la ville à travers des cartes postales anciennes.",
    imageUrl: 'https://picsum.photos/id/1071/400/400',
    category: 'livre'
  },
  {
    id: 'p4',
    name: 'Mug "I Love Chièvres"',
    price: 12.00,
    description: "Mug en céramique de haute qualité. Le souvenir parfait de votre visite.",
    imageUrl: 'https://picsum.photos/id/1072/400/400',
    category: 'souvenir'
  }
];
