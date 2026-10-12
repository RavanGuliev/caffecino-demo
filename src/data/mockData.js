// Demo (fake) data — real API-nin strukturu ilə eynidir.
// src/api/api.js-də USE_MOCK=true olduqda bu data istifadə olunur.

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  lattesPlants: "1509042239860-f550ce710b93",
  handsCups: "1495474472287-4d71bcdd2085",
  icedCoffee: "1461023058943-07fcbe16d735",
  portafilter: "1511920170033-f8396924c348",
  cappuccino: "1572442388796-11668a67e53d",
  icedLatte: "1517701604599-bb29b565090c",
  lattePour: "1541167760496-1628856ab772",
  flatWhite: "1485808191679-5f86510681a2",
  americano: "1514432324607-a09d9b4aefdd",
  espressoTools: "1497935586351-b67a49e012bf",
  cafeBar: "1453614512568-c4024d13c247",
  matcha: "1515823064-d6e0c04616a7",
  icedTea: "1556679343-c7306c1976bc",
  milkTea: "1544787219-7f47ccb76574",
  croissant: "1555507036-ab1f4038808a",
  chocoCake: "1578985545062-69928b1d9587",
  raspberryCake: "1565958011703-44f9829ba187",
  cheesecake: "1533134242443-d4fd215305ad",
  donuts: "1551024601-bec78aea704b",
  eggToast: "1525351484163-7529414344d8",
  eggBowl: "1482049016688-2d3e1b311543",
  sandwich: "1528735602780-2552fd46c7af",
  orangeJuice: "1600271886742-f049cd451bba",
  blackCoffee: "1494314671902-399b18174975",
  tiramisu: "1571877227200-a0d98ea607e9",
  cookiesBasket: "1558961363-fa8fdf82db35",
  bread: "1509440159596-0249088772ff",
  saladBowl: "1512621776951-a57141f2eefd",
  croissants: "1530610476181-d83430b64dcd",
  blackTea: "1571934811356-5cc061b6821f",
  berrySmoothie: "1553530666-ba11a7da3888",
  lemonade: "1621263764928-df1444c5e859",
  strawberryLemonade: "1497534446932-c925b458314e",
  flatWhiteTop: "1517487881594-2787fef5ebf7",
  macchiato: "1610889556528-9a770e32642f",
  cupcakes: "1486427944299-d1955d23e34d",
  pourOver: "1442512595331-e89e73853f31",
  cupSaucer: "1504630083234-14187a9df0f5",
  herbalTea: "1576092768241-dec231879fc3",
  oreoDessert: "1563805042-7684c019e1cb",
  cookies: "1499636136210-6f4ee915583e",
  brownie: "1607920591413-4ec007e70023",
  cortado: "1559496417-e7f25cb247f3",
  pannaCotta: "1488477181946-6428a0291777",
  smoothies: "1505252585461-04db1eb84625",
  salmonBowl: "1546069901-ba9599a7e63c",
};

export const HERO_IMAGE = img(IMG.lattesPlants, 1800);

const tr = (field, az, en, ru) => ({
  [`${field}_az`]: az,
  [`${field}_en`]: en,
  [`${field}_ru`]: ru,
});

const SIZES = (s, m, l) => [
  { key: "S", ml: 250, price: s },
  { key: "M", ml: 350, price: m },
  { key: "L", ml: 450, price: l },
];

let pid = 100;
const p = (imgKey, name, desc, price, extra = {}) => ({
  id: ++pid,
  status: true,
  img: [img(IMG[imgKey])],
  price,
  ...tr("name", ...name),
  ...tr("description", ...desc),
  badges: [],
  ...extra,
});

const section = (slug, name, products) => ({
  id: slug,
  slug,
  status: true,
  ...tr("name", ...name),
  products,
});

// ---------- KATEQORİYALAR ----------
export const categories = [
  {
    id: 1,
    slug: "coffee",
    status: true,
    img: [img(IMG.cappuccino)],
    ...tr("name", "Qəhvə", "Coffee", "Кофе"),
    ...tr("subtitle", "Espresso əsaslı klassikalar", "Espresso-based classics", "Классика на эспрессо"),
  },
  {
    id: 2,
    slug: "cold-drinks",
    status: true,
    img: [img(IMG.icedCoffee)],
    ...tr("name", "Soyuq içkilər", "Cold Drinks", "Холодные напитки"),
    ...tr("subtitle", "Iced qəhvə, limonad, smuzi", "Iced coffee, lemonades, smoothies", "Айс-кофе, лимонады, смузи"),
  },
  {
    id: 3,
    slug: "tea-matcha",
    status: true,
    img: [img(IMG.matcha)],
    ...tr("name", "Çay & Matcha", "Tea & Matcha", "Чай и матча"),
    ...tr("subtitle", "Yaşıl enerjinin ritmi", "The rhythm of green energy", "Ритм зелёной энергии"),
  },
  {
    id: 4,
    slug: "desserts",
    status: true,
    img: [img(IMG.chocoCake)],
    ...tr("name", "Desertlər", "Desserts", "Десерты"),
    ...tr("subtitle", "Gündəlik təzə hazırlanır", "Freshly made every day", "Готовим каждый день"),
  },
  {
    id: 5,
    slug: "breakfast",
    status: true,
    img: [img(IMG.eggToast)],
    ...tr("name", "Səhər yeməyi", "Breakfast", "Завтраки"),
    ...tr("subtitle", "Bütün gün ərzində", "Served all day", "Весь день"),
  },
  {
    id: 6,
    slug: "bakery",
    status: true,
    img: [img(IMG.croissants)],
    ...tr("name", "Bakery", "Bakery", "Выпечка"),
    ...tr("subtitle", "Kruassan və çörəklər", "Croissants & breads", "Круассаны и хлеб"),
  },
  {
    id: 7,
    slug: "bowls",
    status: true,
    img: [img(IMG.saladBowl)],
    ...tr("name", "Salat & Bowl", "Salads & Bowls", "Салаты и боулы"),
    ...tr("subtitle", "Yüngül və balanslı", "Light & balanced", "Легко и сбалансированно"),
  },
  {
    id: 8,
    slug: "fresh",
    status: true,
    img: [img(IMG.orangeJuice)],
    ...tr("name", "Təzə şirələr", "Fresh Juices", "Свежевыжатые соки"),
    ...tr("subtitle", "Yerindəcə sıxılır", "Squeezed to order", "Выжимаем при вас"),
  },
];

// ---------- MƏHSULLAR (kateqoriya → bölmələr) ----------
export const productsByCategory = {
  1: [
    section("espresso-bar", ["Espresso bar", "Espresso bar", "Эспрессо-бар"], [
      p("macchiato", ["Espresso", "Espresso", "Эспрессо"],
        ["Ərəbika qarışığından 30 ml sıx və ətirli espresso.", "A 30 ml rich and aromatic shot of our arabica blend.", "30 мл насыщенного эспрессо из нашей арабики."],
        3.5, { kcal: 5, time: 2 }),
      p("cortado", ["Doppio", "Doppio", "Доппио"],
        ["İkiqat espresso — güclü başlanğıc üçün.", "Double espresso for a strong start.", "Двойной эспрессо для бодрого старта."],
        4.5, { kcal: 10, time: 2 }),
      p("americano", ["Amerikano", "Americano", "Американо"],
        ["Espresso və isti su — yumşaq, təmiz dad.", "Espresso topped with hot water — smooth and clean.", "Эспрессо с горячей водой — мягкий и чистый вкус."],
        4.5, { kcal: 10, time: 3, sizes: SIZES(4.5, 5.5, 6.5), badges: ["popular"] }),
      p("flatWhiteTop", ["Makiato", "Macchiato", "Макиато"],
        ["Espresso üzərində bir qaşıq süd köpüyü.", "Espresso marked with a spoon of milk foam.", "Эспрессо с ложкой молочной пенки."],
        4.8, { kcal: 25, time: 3 }),
      p("blackCoffee", ["Kortado", "Cortado", "Кортадо"],
        ["Bərabər nisbətdə espresso və isti süd.", "Equal parts espresso and steamed milk.", "Эспрессо и горячее молоко в равных долях."],
        5.2, { kcal: 60, time: 3 }),
    ]),
    section("milk-coffee", ["Südlü qəhvələr", "Milk coffee", "Кофе с молоком"], [
      p("cappuccino", ["Kapuçino", "Cappuccino", "Капучино"],
        ["Espresso, isti süd və məxməri köpük — klassika.", "Espresso, steamed milk and velvety foam — a classic.", "Эспрессо, молоко и бархатная пенка — классика."],
        5.5, { kcal: 120, time: 4, sizes: SIZES(5.5, 6.5, 7.5), badges: ["popular"] }),
      p("lattePour", ["Latte", "Latte", "Латте"],
        ["Yumşaq espresso və bol süd, üstündə latte art.", "Mellow espresso with plenty of milk and latte art.", "Мягкий эспрессо, много молока и латте-арт."],
        6.0, { kcal: 160, time: 4, sizes: SIZES(6, 7, 8), badges: ["popular"] }),
      p("flatWhite", ["Flet uayt", "Flat White", "Флэт уайт"],
        ["İkiqat ristretto və nazik mikroköpük.", "Double ristretto with silky micro-foam.", "Двойной ристретто и тонкая микропена."],
        6.2, { kcal: 110, time: 4 }),
      p("handsCups", ["Raf qəhvə", "Raf Coffee", "Раф"],
        ["Espresso, qaymaq və vanil şəkəri ilə çalınmış.", "Espresso whipped with cream and vanilla sugar.", "Эспрессо, взбитый со сливками и ванильным сахаром."],
        7.0, { kcal: 260, time: 5, sizes: SIZES(7, 8, 9), badges: ["new"] }),
      p("cupSaucer", ["Moka", "Mocha", "Мокка"],
        ["Belçika şokoladı, espresso və süd.", "Belgian chocolate, espresso and milk.", "Бельгийский шоколад, эспрессо и молоко."],
        6.8, { kcal: 290, time: 5, sizes: SIZES(6.8, 7.8, 8.8) }),
    ]),
    section("alternative", ["Alternativ dəmləmə", "Alternative brewing", "Альтернатива"], [
      p("pourOver", ["V60 filtr", "V60 Pour Over", "Пуровер V60"],
        ["Tək mənşəli Efiopiya dənələri, meyvəli notlar.", "Single-origin Ethiopia beans with fruity notes.", "Эфиопия моносорт, фруктовые ноты."],
        7.5, { kcal: 5, time: 6, badges: ["signature"] }),
      p("espressoTools", ["Kemeks", "Chemex", "Кемекс"],
        ["2 nəfərlik təmiz və şirin filtr qəhvə.", "Clean, sweet filter coffee for two.", "Чистый сладкий фильтр-кофе на двоих."],
        11.0, { kcal: 10, time: 7 }),
      p("portafilter", ["Aeropress", "Aeropress", "Аэропресс"],
        ["Sıx gövdəli, yumşaq turşuluqlu dəmləmə.", "Full-bodied brew with gentle acidity.", "Плотный напиток с мягкой кислотностью."],
        7.0, { kcal: 5, time: 5 }),
    ]),
  ],
  2: [
    section("iced-coffee", ["Iced qəhvə", "Iced coffee", "Айс-кофе"], [
      p("icedLatte", ["Iced Latte", "Iced Latte", "Айс латте"],
        ["Buz, soyuq süd və espresso.", "Ice, cold milk and a double espresso.", "Лёд, холодное молоко и эспрессо."],
        6.5, { kcal: 140, time: 3, sizes: SIZES(6.5, 7.5, 8.5), badges: ["popular"] }),
      p("icedCoffee", ["Cold Brew", "Cold Brew", "Колд брю"],
        ["18 saat soyuq dəmlənmiş, şirin və yumşaq.", "Steeped cold for 18 hours, sweet and smooth.", "18 часов холодного заваривания, мягкий вкус."],
        6.8, { kcal: 10, time: 2, badges: ["signature"] }),
      p("macchiato", ["Espresso Tonik", "Espresso Tonic", "Эспрессо-тоник"],
        ["Tonik, buz, portağal qabığı və espresso.", "Tonic, ice, orange zest and espresso.", "Тоник, лёд, цедра апельсина и эспрессо."],
        7.2, { kcal: 70, time: 3, badges: ["new"] }),
    ]),
    section("lemonades", ["Limonadlar", "Lemonades", "Лимонады"], [
      p("lemonade", ["Klassik limonad", "Classic Lemonade", "Классический лимонад"],
        ["Limon, nanə, laym və qazlı su.", "Lemon, mint, lime and sparkling water.", "Лимон, мята, лайм и газированная вода."],
        6.0, { kcal: 90, time: 3, badges: ["vegan"] }),
      p("strawberryLemonade", ["Çiyələk limonadı", "Strawberry Lemonade", "Клубничный лимонад"],
        ["Təzə çiyələk püresi və sitrus.", "Fresh strawberry purée and citrus.", "Свежее клубничное пюре и цитрус."],
        6.5, { kcal: 110, time: 3, badges: ["popular", "vegan"] }),
      p("icedTea", ["Şaftalı Ice Tea", "Peach Ice Tea", "Персиковый айс-ти"],
        ["Ev üsulu dəmlənmiş qara çay və şaftalı.", "House-brewed black tea with peach.", "Домашний чёрный чай с персиком."],
        5.5, { kcal: 80, time: 2, badges: ["vegan"] }),
    ]),
    section("smoothies", ["Smuzilər", "Smoothies", "Смузи"], [
      p("berrySmoothie", ["Giləmeyvə smuzisi", "Berry Smoothie", "Ягодный смузи"],
        ["Moruq, qaragilə, banan və yoqurt.", "Raspberry, blueberry, banana and yoghurt.", "Малина, голубика, банан и йогурт."],
        7.5, { kcal: 210, time: 4 }),
      p("smoothies", ["Banan-karamel smuzisi", "Banana Caramel Smoothie", "Банан-карамель смузи"],
        ["Banan, duzlu karamel və yulaf südü.", "Banana, salted caramel and oat milk.", "Банан, солёная карамель и овсяное молоко."],
        7.8, { kcal: 260, time: 4, badges: ["new"] }),
    ]),
  ],
  3: [
    section("matcha", ["Matcha", "Matcha", "Матча"], [
      p("matcha", ["Matcha Latte", "Matcha Latte", "Матча латте"],
        ["Yapon seremonial matcha və süd.", "Japanese ceremonial matcha with milk.", "Японская церемониальная матча с молоком."],
        7.0, { kcal: 150, time: 4, sizes: SIZES(7, 8, 9), badges: ["popular", "signature"] }),
      p("icedLatte", ["Iced Matcha", "Iced Matcha", "Айс матча"],
        ["Buz üzərində matcha, yulaf südü ilə.", "Matcha over ice with oat milk.", "Матча со льдом на овсяном молоке."],
        7.5, { kcal: 130, time: 3, badges: ["vegan"] }),
    ]),
    section("tea", ["Çaylar", "Teas", "Чаи"], [
      p("blackTea", ["Azərbaycan çayı", "Azerbaijani Black Tea", "Азербайджанский чай"],
        ["Armudu stəkanda, limon və mürəbbə ilə.", "Served in armudu glass with lemon and jam.", "В армуду с лимоном и вареньем."],
        4.0, { kcal: 5, time: 3, badges: ["popular"] }),
      p("herbalTea", ["Bitki çayı", "Herbal Tea", "Травяной чай"],
        ["Kəklikotu, çobanyastığı və nanə.", "Thyme, chamomile and mint.", "Чабрец, ромашка и мята."],
        5.0, { kcal: 0, time: 4, badges: ["vegan"] }),
      p("milkTea", ["Masala Çay", "Masala Chai", "Масала чай"],
        ["Ədviyyatlı çay, süd və darçın.", "Spiced tea with milk and cinnamon.", "Пряный чай с молоком и корицей."],
        6.0, { kcal: 140, time: 5 }),
    ]),
  ],
  4: [
    section("cakes", ["Tortlar", "Cakes", "Торты"], [
      p("chocoCake", ["Şokoladlı tort", "Chocolate Cake", "Шоколадный торт"],
        ["Üç qat Belçika şokoladı və ganaş.", "Three layers of Belgian chocolate and ganache.", "Три слоя бельгийского шоколада и ганаш."],
        8.5, { kcal: 480, badges: ["popular"] }),
      p("raspberryCake", ["Moruqlu tort", "Raspberry Cake", "Малиновый торт"],
        ["Vanil biskvit, maskarpone kremi, təzə moruq.", "Vanilla sponge, mascarpone cream, fresh raspberries.", "Ванильный бисквит, маскарпоне, свежая малина."],
        8.0, { kcal: 390 }),
      p("cheesecake", ["Qaragiləli çizkeyk", "Blueberry Cheesecake", "Чизкейк с голубикой"],
        ["Nyu-York çizkeyki, qaragilə sousu ilə.", "New York cheesecake with blueberry sauce.", "Нью-Йорк чизкейк с соусом из голубики."],
        8.5, { kcal: 420, badges: ["popular"] }),
      p("tiramisu", ["Tiramisu", "Tiramisu", "Тирамису"],
        ["Espresso ilə isladılmış savoyardi və maskarpone.", "Espresso-soaked savoiardi and mascarpone.", "Савоярди в эспрессо и маскарпоне."],
        8.0, { kcal: 410, badges: ["signature"] }),
    ]),
    section("sweets", ["Şirniyyatlar", "Sweets", "Сладости"], [
      p("pannaCotta", ["Panna Kotta", "Panna Cotta", "Панна котта"],
        ["Vanil kremi və çiyələk kompotu.", "Vanilla cream with strawberry compote.", "Ванильный крем и клубничный компот."],
        6.5, { kcal: 280 }),
      p("brownie", ["Brauni", "Brownie", "Брауни"],
        ["İsti şokoladlı brauni, duzlu karamel.", "Warm chocolate brownie with salted caramel.", "Тёплый брауни с солёной карамелью."],
        5.5, { kcal: 350 }),
      p("donuts", ["Donat", "Donut", "Пончик"],
        ["Şokolad qlazurlu və rəngli şəkərli.", "Chocolate glazed with sprinkles.", "В шоколадной глазури с посыпкой."],
        3.5, { kcal: 300 }),
      p("cupcakes", ["Kapkeyk", "Cupcake", "Капкейк"],
        ["Vanil kapkeyk, nanəli krem.", "Vanilla cupcake with mint frosting.", "Ванильный капкейк с мятным кремом."],
        4.0, { kcal: 310, badges: ["new"] }),
      p("oreoDessert", ["Oreo trayfl", "Oreo Trifle", "Трайфл Орео"],
        ["Oreo, şokolad kremi və qaymaq.", "Oreo, chocolate cream and whipped cream.", "Орео, шоколадный крем и сливки."],
        6.8, { kcal: 450 }),
    ]),
  ],
  5: [
    section("toasts", ["Tost və yumurta", "Toasts & eggs", "Тосты и яйца"], [
      p("eggToast", ["Avokado tost", "Avocado Toast", "Тост с авокадо"],
        ["Turş xəmirli çörək, avokado, gözlü yumurta.", "Sourdough, smashed avocado, fried egg.", "Хлеб на закваске, авокадо, яичница."],
        11.5, { kcal: 420, time: 10, badges: ["popular"] }),
      p("eggBowl", ["Yaşıl bowl", "Green Breakfast Bowl", "Зелёный боул"],
        ["Ispanaq, avokado, qaynadılmış yumurta, toxumlar.", "Spinach, avocado, soft-boiled eggs, seeds.", "Шпинат, авокадо, яйца, семена."],
        12.5, { kcal: 380, time: 10, badges: ["signature"] }),
      p("sandwich", ["Klub sendviç", "Club Sandwich", "Клаб-сэндвич"],
        ["Toyuq, bekon, pomidor və sous, kartof ilə.", "Chicken, bacon, tomato and sauce, with fries.", "Курица, бекон, томат, соус и картофель."],
        13.0, { kcal: 640, time: 12 }),
    ]),
  ],
  6: [
    section("pastries", ["Kruassanlar", "Croissants", "Круассаны"], [
      p("croissant", ["Kərə yağlı kruassan", "Butter Croissant", "Масляный круассан"],
        ["Fransız kərə yağı ilə 27 qatlı xəmir.", "27 layers of French butter pastry.", "27 слоёв на французском масле."],
        4.0, { kcal: 270, badges: ["popular"] }),
      p("croissants", ["Badamlı kruassan", "Almond Croissant", "Миндальный круассан"],
        ["Badam kremi və qovrulmuş badam lopaları.", "Almond cream and toasted almond flakes.", "Миндальный крем и лепестки миндаля."],
        5.5, { kcal: 390 }),
    ]),
    section("bread-cookies", ["Çörək və peçenye", "Bread & cookies", "Хлеб и печенье"], [
      p("bread", ["Turş xəmirli çörək", "Sourdough Loaf", "Хлеб на закваске"],
        ["48 saat fermentasiya, xırtıldayan qabıq.", "48-hour fermentation, crackling crust.", "48 часов ферментации, хрустящая корочка."],
        6.0, { kcal: 240, badges: ["vegan"] }),
      p("cookiesBasket", ["Şokoladlı peçenye", "Chocolate Chip Cookie", "Печенье с шоколадом"],
        ["Böyük, yumşaq, içi şokoladlı.", "Big, soft and loaded with chocolate.", "Большое, мягкое, с шоколадом."],
        3.0, { kcal: 220 }),
      p("cookies", ["Fındıqlı peçenye", "Hazelnut Cookie", "Печенье с фундуком"],
        ["Qəbələ fındığı və tünd şokolad.", "Gabala hazelnuts and dark chocolate.", "Габалинский фундук и тёмный шоколад."],
        3.5, { kcal: 230, badges: ["new"] }),
    ]),
  ],
  7: [
    section("bowls", ["Bowl və salatlar", "Bowls & salads", "Боулы и салаты"], [
      p("saladBowl", ["Budda bowl", "Buddha Bowl", "Будда-боул"],
        ["Noxud, avokado, tərəvəzlər, tahini sousu.", "Chickpeas, avocado, veggies, tahini dressing.", "Нут, авокадо, овощи, соус тахини."],
        13.5, { kcal: 520, time: 10, badges: ["vegan", "popular"] }),
      p("salmonBowl", ["Qızılbalıq bowl", "Salmon Bowl", "Боул с лососем"],
        ["Qızardılmış qızılbalıq, düyü, edamame, tərəvəz.", "Seared salmon, rice, edamame and veggies.", "Лосось, рис, эдамаме и овощи."],
        16.5, { kcal: 610, time: 12, badges: ["signature"] }),
    ]),
  ],
  8: [
    section("juices", ["Şirələr", "Juices", "Соки"], [
      p("orangeJuice", ["Portağal şirəsi", "Orange Juice", "Апельсиновый сок"],
        ["100% təzə sıxılmış portağal.", "100% freshly squeezed oranges.", "100% свежевыжатый апельсин."],
        6.0, { kcal: 110, time: 3, sizes: [{ key: "S", ml: 250, price: 6 }, { key: "L", ml: 400, price: 8.5 }], badges: ["popular", "vegan"] }),
      p("smoothies", ["Yaşıl detoks", "Green Detox", "Зелёный детокс"],
        ["Alma, kərəviz, ispanaq, xiyar, zəncəfil.", "Apple, celery, spinach, cucumber, ginger.", "Яблоко, сельдерей, шпинат, огурец, имбирь."],
        7.5, { kcal: 90, time: 4, badges: ["vegan", "new"] }),
    ]),
  ],
};

export const allProducts = Object.values(productsByCategory).flatMap((secs) =>
  secs.flatMap((s) => s.products)
);

// Hər kateqoriyada neçə məhsul var
categories.forEach((c) => {
  c.count = (productsByCategory[c.id] || []).reduce((n, s) => n + s.products.length, 0);
});

export const cafeInfo = {
  hours: "08:00 – 23:00",
  phone: "+994 50 123 45 67",
  email: "info@caffecino.az",
  ...tr("address", "Ceyhun Hacıbəyli küç. 85, Bakı", "85 Jeyhun Hajibeyli St, Baku", "ул. Джейхуна Гаджибейли 85, Баку"),
  instagram: "https://www.instagram.com/caffecino.az/",
  tiktok: "https://www.tiktok.com/@caffecino.az",
  wifi: "Caffecino_Guest",
};
