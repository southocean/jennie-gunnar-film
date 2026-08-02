/* Content data + first-draft story for the Jennie & Gunnar wedding film.
   Ratings here are Claude's first-pass defaults; users can override them in the app. */
(function(){
const DATA = { targetSec:135, appVersion:"1.0", appUpdated:"2026-08-02 18:34 WEST" };

/* ---- event groups (code -> label + colour) ---- */
DATA.events = {
  "SPECIAL":    {label:"Special / assets",        color:"#b5539c"},
  "SE-HOME":    {label:"Sweden · home life",      color:"#c08457"},
  "SE-SEASONS": {label:"Sweden · seasons",        color:"#7a9e8e"},
  "SE-LAPLAND": {label:"Sweden · Arctic Lapland", color:"#4f7fa3"},
  "SE-GOTLAND": {label:"Sweden · Gotland",        color:"#6b8f9c"},
  "EU":         {label:"Europe · city breaks",    color:"#8a6fb0"},
  "VN-HALONG":  {label:"Vietnam · Ha Long Bay",   color:"#2f9e8f"},
  "VN-NINHBINH":{label:"Vietnam · Ninh Binh",     color:"#3aa79a"},
  "VN-SAPA":    {label:"Vietnam · Sapa/Fansipan",  color:"#3f8f6b"},
  "VN-HAGIANG": {label:"Vietnam · Ha Giang",      color:"#6fae52"},
  "VN-MEKONG":  {label:"Vietnam · Mekong Delta",  color:"#9aa93b"},
  "TW-TAIPEI":  {label:"Taiwan · Taipei",         color:"#d08a3a"},
  "TW-TAROKO":  {label:"Taiwan · Taroko/east",    color:"#c76f57"},
  "TW-YUSHAN":  {label:"Taiwan · Yushan summit",  color:"#8a5a44"},
  "TH-BANGKOK": {label:"Thailand · Bangkok",      color:"#d8a94b"},
  "QA-DOHA":    {label:"Qatar · Doha layover",    color:"#9e8a5a"},
  "MISC":       {label:"Camera-roll misc",        color:"#b0a89c"}
};

/* ---- VIDEOS (56) ---- */
/* [id,file,dur,orient,event,people,loc,ctx,rating,beat] */
const V = [
["v01","04375d38-01f8-41a3-83f6-23cf1adc757f.MP4",43,"L","VN-SAPA","Both","Fansipan summit, Vietnam","Unfurling the Vietnamese flag at 'Top of Indochina', 3143 m",5,"On top of the world"],
["v02","1914a7fd666b5ab91d8a66e9767b3d35.MP4",15,"P","SPECIAL","Both","-","A ready-made 'Happy to have found you' Valentine's reel with captions",4,"“Happy to have found you.”"],
["v03","39be167c-2cf3-4ee4-97fa-36a1c1684bbd.MP4",17,"P","VN-HAGIANG","Group","Vietnam countryside","Cycling a country road together",3,"Two wheels, one road"],
["v04","6A7A3068-6718-4D4F-BEA6-F6104EB1781A.MOV",72,"P","VN-SAPA","Both","Hotel, Vietnam","Goofing around on the chairs, completely at ease",3,"The easy, silly comfort of us"],
["v05","84ae4bdb-a9ef-4eb9-a68b-6656bad0dbfa.MP4",26,"P","VN-SAPA","Distant","Sapa, Vietnam","Hiking a rocky ridge in the mist",3,"Every trail, side by side"],
["v06","DJI_20250430124950_0002_D.MP4",118,"L","VN-SAPA","Both","Sapa (Apr 2025)","Pedalling a 'sky-bike' across cables over the misty forest",4,"Pedalling across the sky"],
["v07","FOODIE_1745322572.MP4",11,"P","VN-HALONG","Gunnar","Ha Long Bay cruise","Fine dining on the bay cruise",3,"Dinner drifting over Ha Long"],
["v08","FOODIE_1767546848.MP4",9,"P","SE-HOME","Hands","Stockholm home","Cooking a chicken & rice bake",2,"Sunday means cooking together"],
["v09","FOODIE_1770572208.MP4",5,"P","SE-HOME","Hands","Stockholm home","Simmering a stew",2,""],
["v10","FOODIE_1772473454.MP4",10,"P","SE-HOME","Hands","Stockholm home","Stirring a big pan of bolognese",2,""],
["v11","FOODIE_1782665450.MP4",9,"P","SE-HOME","Arm","Stockholm home","Frying chanterelles - Swedish autumn",2,"Chanterelle season"],
["v12","IMG_0017.MOV",6,"P","SE-GOTLAND","Gunnar","Gotland (Visby)","Wheeling a suitcase - off on another trip",2,"Bags packed, again"],
["v13","IMG_0377.MOV",12,"P","SE-HOME","Gunnar","Stockholm home","Cooking together, steam and laughter",2,""],
["v14","IMG_0619.MOV",6,"P","SE-HOME","Both","Car, Stockholm","Car selfie, Jennie beaming",4,"The everyday joy of us"],
["v15","IMG_0662.MOV",11,"P","SE-SEASONS","Both","Stockholm, winter","A frozen-lake outdoor spa in the snow",4,"Warm water, frozen lake"],
["v16","IMG_0677.MOV",15,"P","SE-SEASONS","Gunnar","Stockholm","Candle-lit design-restaurant dinner",2,"Date night"],
["v17","IMG_0842.MOV",1,"P","SE-LAPLAND","Both","Kiruna, Lapland","Arctic night - reindeer and lights",4,"Under the Arctic lights"],
["v18","IMG_1136.MOV",6,"P","SE-HOME","Gunnar","Stockholm home","Baking a tray of saffron buns",3,"Baking through the dark winter"],
["v19","IMG_1215.MOV",9,"P","SE-HOME","Hands","Stockholm home","Cooking pad thai, wok steaming",2,""],
["v20","IMG_1900.MOV",8,"L","VN-HALONG","Both","Ha Long Bay","Kayak selfie, huge smiles under the karsts",5,"Paddling through paradise"],
["v21","IMG_2254.MOV",7,"P","VN-HALONG","Both+friends","Ha Long Bay","Leaping off the boat to swim",4,"Jump first, think later"],
["v22","IMG_2255.MOV",4,"P","VN-HALONG","Gunnar","Ha Long Bay","Swimming in the bay",3,""],
["v23","IMG_2456.MOV",14,"P","VN-SAPA","Gunnar","Sapa trek","Climbing a misty jungle trail",3,"Into the clouds"],
["v24","IMG_2515.MOV",8,"P","VN-SAPA","Both","Sapa, Vietnam","Mountaintop hug, pointing out the valley",4,"This view - with you, always"],
["v25","IMG_2538.MOV",6,"P","SE-SEASONS","Glimpse","North of Stockholm","Spring at a grand manor",2,""],
["v26","IMG_2631.MOV",6,"P","VN-SAPA","Gunnar","Fansipan summit","Proudly holding the summit certificate & medal",5,"We made it"],
["v27","IMG_2632.MOV",11,"P","VN-SAPA","Jennie","Fansipan summit","Beaming with her summit certificate & medal",5,"Proof: they reach every summit together"],
["v28","IMG_3073.mov",8,"P","SE-HOME","Hands","Stockholm home","Cooking chicken & rice",2,""],
["v29","IMG_3128.MOV",9,"P","SE-SEASONS","Both","Stockholm forest","A summer forest walk",3,"Slow summer walks"],
["v30","IMG_3202.MOV",1,"P","SE-SEASONS","Players","Stockholm","Watching a football match",2,""],
["v31","IMG_3260.MOV",11,"P","QA-DOHA","-","Doha, Qatar","City lights on a layover",3,"Somewhere between here and there"],
["v32","IMG_3287.MOV",7,"P","VN-SAPA","Distant","Sapa, Vietnam","The glass skywalk over the cliffs",4,"Walking on air"],
["v33","IMG_3532.MOV",17,"P","SE-SEASONS","Gunnar+crowd","Stockholm (Södermalm)","Midsummer - flower crowns, arms waving",4,"Midsummer, flower crowns and all"],
["v34","IMG_3659.MOV",9,"P","VN-SAPA","Gunnar","Sapa, Vietnam","Cliffside swing out over the valley",4,"Swinging over the edge -"],
["v35","IMG_3662.MOV",11,"P","VN-SAPA","Jennie","Sapa, Vietnam","Her turn on the cliffside swing",4,"- her turn"],
["v36","IMG_3969.MOV",7,"P","SE-SEASONS","Gunnar","South of Stockholm","Summer by the jetty",3,"Long light summer evenings"],
["v37","IMG_3989.MOV",9,"P","SE-SEASONS","Jennie","South of Stockholm","Posing at a pastel palace",3,""],
["v38","IMG_4512.MOV",6,"P","VN-MEKONG","Gunnar","Mekong Delta","Draped in a giant python, grinning",5,"Say yes to (almost) everything"],
["v39","IMG_4584.MOV",12,"P","SE-SEASONS","Both","Höga Kusten (Jul 2026)","Setting up a lakeside picnic",3,"Every summer, somewhere new"],
["v40","IMG_5423.MOV",12,"P","TW-TAIPEI","-","Beitou, Taipei","Steam rising off the thermal spring",3,""],
["v41","IMG_5613.MOV",10,"P","TW-TAROKO","Jennie","Taiwan night market","Bear hat, waving, laughing",4,"Night-market joy"],
["v42","IMG_5742.MOV",12,"P","TW-TAROKO","-","Taroko / Hualien","Lake and mountain from the jetty",2,""],
["v43","IMG_5805.MOV",9,"P","TW-TAROKO","Jennie","Taroko, Taiwan","Twirling down a tree-lined road",4,"Dancing because why not"],
["v44","IMG_5952.MOV",9,"P","TW-TAROKO","Jennie","Hualien","On a dramatic black-pebble beach",3,""],
["v45","IMG_5967.MOV",9,"P","VN-HAGIANG","Riders","Ha Giang, Vietnam","Motorbikes winding a cliff road",3,"The Ha Giang loop"],
["v46","IMG_6448.MOV",13,"P","VN-HAGIANG","Gunnar","Ha Giang, Vietnam","Juggling in a bamboo house",4,"Always up for a laugh"],
["v47","IMG_6524.MOV",7,"P","TW-TAROKO","-","Taiwan east","A green river valley",2,""],
["v48","IMG_6660.MOV",7,"P","TW-TAROKO","-","Taiwan east coast","Turquoise sea on a rocky coast",3,""],
["v49","IMG_6827.MOV",8,"P","TW-YUSHAN","-","Alishan / Yushan","Tall alpine forest",2,""],
["v50","IMG_6866.MOV",11,"P","TW-YUSHAN","Hikers","Yushan (Jade Mtn), Taiwan","Summit sunrise over a sea of clouds",5,"Sunrise, earned"],
["v51","IMG_6955.MOV",5,"P","TW-YUSHAN","-","Yushan, Taiwan","Alpine ridge peaks",4,""],
["v52","IMG_7193.MOV",11,"P","TW-TAIPEI","Travelers","Taipei airport","Waiting between flights",2,""],
["v53","IMG_7912.MOV",11,"P","TH-BANGKOK","-","Bangkok","The Grand Palace glittering",4,"Golden Bangkok"],
["v54","e95f6a66-01ec-4667-a0e3-347a2a455243.MP4",3,"L","TW-YUSHAN","Group","High-mountain trek","A long line of trekkers on the scree",4,"- one step at a time, together"],
["v55","f55e2a90-930f-47cd-99b8-09c57ad9857a.MP4",7,"P","TW-YUSHAN","Both","Night summit push","Head-torches climbing before dawn",4,"Some climbs you do in the dark -"],
["v56","fafda0a7-9dd0-48ce-822a-c1b2b6f83492.MP4",15,"P","TW-YUSHAN","Both","Summit above the clouds","Standing at the edge of a sea of clouds",5,"- until you're above the clouds"]
];
DATA.videos = V.map(a=>({id:a[0],file:a[1],dur:a[2],orient:a[3],event:a[4],people:a[5],loc:a[6],ctx:a[7],rating:a[8],beat:a[9]}));

/* ---- IMAGE overrides (the good shots). everything else defaults to 1★ misc ---- */
/* id: [rating,event,people,loc,ctx,(beat)] */
const O = {
 i002:[4,"VN-SAPA","Both","Sapa, Vietnam","Straw-hat selfie in the mountains"],
 i003:[4,"SE-SEASONS","Both","Sweden, castle","Selfie at a Swedish castle"],
 i004:[3,"VN-HAGIANG","Both","Ha Giang, Vietnam","Convex-mirror selfie on a mountain road"],
 i005:[3,"SE-HOME","Friends","Stockholm","Sangria night with friends"],
 i006:[4,"SE-HOME","Both","Stockholm","Dressed-up date-night selfie"],
 i007:[4,"VN-NINHBINH","Both","Ninh Binh, Vietnam","Sampan boat ride through the karsts"],
 i008:[4,"SE-SEASONS","Both","Stockholm rooftop","A rooftop kiss on the cheek"],
 i009:[4,"EU","Both","Krakow, Poland","Night selfie by the cathedral"],
 i010:[4,"SE-SEASONS","Both","Stockholm","A candle-lit dinner date"],
 i011:[3,"SE-HOME","Friends","Stockholm","Dinner party, Swedish flag flying"],
 i012:[4,"VN-HALONG","Both","Vietnam beach","Tropical beach cheers"],
 i013:[4,"SE-LAPLAND","Both","Swedish Lapland","Snowy night in bear hats"],
 i014:[3,"SE-HOME","Friends","Stockholm","Christmas dinner"],
 i015:[3,"VN-SAPA","Jennie","Sapa, Vietnam","On the red suspension bridge"],
 i016:[4,"VN-HAGIANG","Both","Ha Giang, Vietnam","Selfie in the green hills"],
 i017:[4,"VN-HAGIANG","Both","Vietnam rice country","Sunglasses selfie over the paddies"],
 i018:[4,"VN-SAPA","Both","Sapa trek","Trekking poles, matching grins"],
 i019:[4,"SE-HOME","Both","Stockholm","Home with a bunch of tulips"],
 i020:[4,"VN-HAGIANG","Both","Vietnam paddies","Golden rice-field selfie"],
 i021:[4,"TH-BANGKOK","Both","Thailand temple","At a glittering Thai temple"],
 i022:[3,"VN-SAPA","Both","Sapa, Vietnam","With Red Dao women in Sapa"],
 i023:[4,"VN-SAPA","Both","Fansipan trek","On the rocky ridge together"],
 i024:[4,"TW-TAIPEI","Both","Beitou, Taipei","Selfie at the steaming hot spring"],
 i025:[3,"TW-TAIPEI","Both","Beitou, Taipei","Misty hot-spring selfie"],
 i026:[4,"TW-TAROKO","Both","Hualien, Taiwan","Lakeside bear-hat selfie"],
 i027:[4,"TW-TAROKO","Both","Taiwan","Golden-hour lake selfie"],
 i028:[3,"VN-SAPA","Both","Fansipan trek","Resting by a waterfall on the climb"],
 i029:[4,"VN-SAPA","Jennie","Sapa glass bridge","Arms wide on the skywalk"],
 i030:[4,"VN-SAPA","Both","Sapa, Vietnam","Straw-hat selfie in the mist"],
 i031:[3,"SE-HOME","Jennie","Stockholm","Jennie with a little one"],
 i033:[4,"SE-SEASONS","Both","Stockholm waterfront","Dressed up and goofing by the water"],
 i034:[4,"SE-LAPLAND","Both","ICEHOTEL, Kiruna","Inside the ICEHOTEL"],
 i035:[4,"SE-SEASONS","Both","Stockholm waterfront","Summer selfie by the water"],
 i036:[4,"SE-SEASONS","Both","Stockholm","In the local paper as Halloween 'zombies'"],
 i037:[4,"VN-SAPA","Both","Fansipan summit","Arms up - we made it"],
 i038:[4,"VN-SAPA","Both","Sapa, Vietnam","Straw hats, misty peaks"],
 i039:[3,"SE-SEASONS","Both","Stockholm","Lakeside selfie with swans"],
 i040:[3,"VN-HAGIANG","Jennie","Vietnam viewpoint","The lone tree on the cliff"],
 i041:[4,"VN-SAPA","Both","Love Waterfall, Sapa","At the waterfall"],
 i042:[3,"VN-SAPA","Both","Sapa, Vietnam","Straw-hat selfie"],
 i043:[3,"SE-SEASONS","Both","Sweden","Selfie under a stone arch"],
 i044:[4,"VN-SAPA","Both","Fansipan summit","At the 3143 m marker"],
 i045:[3,"VN-SAPA","Both","Love Waterfall, Sapa","Tiny us beneath the falls"],
 i046:[3,"VN-SAPA","Both","Sapa, Vietnam","Sun-hat mountain selfie"],
 i047:[3,"SE-HOME","Both","Stockholm","At home by the Cinque Terre print"],
 i048:[4,"TH-BANGKOK","Both","Thailand","By the temple tower"],
 i049:[4,"TW-YUSHAN","Both","Summit, Taiwan","At the peak marker"],
 i050:[4,"VN-SAPA","Both","Sapa, Vietnam","Straw-hat mountain selfie"],
 i051:[4,"SE-SEASONS","Both","Sweden","Cozy bear-hat cuddle"],
 i052:[4,"VN-HAGIANG","Both","Ha Giang, Vietnam","On a bike through the paddies"],
 i053:[3,"VN-SAPA","Both","Sapa trek","Poles up on the jungle trail"],
 i054:[3,"SE-HOME","Both","Stockholm","Cozy night-in selfie"],
 i055:[3,"VN-SAPA","Both","Sapa, Vietnam","Bear-hat selfie"],
 i056:[3,"VN-SAPA","Both","Sapa, Vietnam","On the rope bridge"],
 i057:[3,"TW-TAROKO","Jennie","Taiwan","In the harvested field"],
 i058:[2,"SE-HOME","Friends","Stockholm","Jennie and a friend"],
 i059:[3,"VN-SAPA","Jennie","Sapa, Vietnam","Playful pose on the trail"],
 i060:[4,"VN-HAGIANG","Both","Ha Giang, Vietnam","Above the mountain switchbacks"],
 i061:[3,"VN-HALONG","Gunnar","Ha Long Bay","Splashing in the sea"],
 i062:[3,"SE-HOME","Friends","Stockholm","Festive dinner in red"],
 i063:[4,"TW-TAROKO","Both","Taiwan, night","Cheek to cheek by the lit temple"],
 i064:[4,"VN-SAPA","Both","Sapa, Vietnam","His arm around her in the jungle"],
 i065:[3,"SE-HOME","Jennie","Stockholm","Burgers and a big smile"],
 i066:[3,"SE-SEASONS","Both","Sweden","Outdoor lunch, sunglasses"],
 i068:[3,"VN-SAPA","Both","Love Waterfall, Sapa","Posing at the falls"],
 i069:[4,"EU","Both","Gdansk, Poland","Old-town street in winter coats"],
 i070:[3,"SE-HOME","Both","Stockholm","Cocktails, a dinner date"],
 i081:[4,"SPECIAL","-","Where it began","The dating profile that started it all","Where it all began"],
 i084:[3,"SE-HOME","-","Stockholm","A bouquet - just because"],
 i092:[3,"SE-HOME","Gunnar","Stockholm","A smiley-face breakfast surprise"],
 i099:[3,"SE-HOME","Friends","Stockholm","Group selfie, all smiles"],
 i100:[3,"SE-HOME","Friends","Stockholm","Cooking together at home"],
 i103:[3,"SE-HOME","Friends","Stockholm","Friends around the dinner table"],
 i105:[3,"SE-HOME","Friends","Stockholm","Dinner party at home"],
 i109:[3,"SE-HOME","Gunnar","Stockholm","Cheeky face over dinner with family"],
 i110:[3,"SE-SEASONS","Friends","Vasa Museum, Stockholm","Family visit to the Vasa"],
 i111:[3,"SE-SEASONS","Friends","Stockholm harbour","Showing family around Stockholm"],
 i122:[3,"SE-HOME","Friends","Stockholm","Dinner with friends"],
 i132:[3,"SE-SEASONS","Both","Stockholm","After the football match"],
 i163:[3,"VN-MEKONG","Gunnar","Vietnam","A feast of spring rolls"],
 i174:[3,"SE-HOME","Gunnar","Stockholm","A goofy morning grin"],
 i178:[3,"SE-HOME","Gunnar","Stockholm","A silly selfie"]
};
DATA.images = (window.IMG_BASE||[]).map(function(b){
  const id=b[0], o=O[id], date=b[3]||"";
  if(o) return {id:id,file:b[1],orient:b[2],date:date,rating:o[0],event:o[1],people:o[2],loc:o[3],ctx:o[4],beat:o[5]||""};
  return {id:id,file:b[1],orient:b[2],date:date,rating:1,event:"MISC",people:"-",loc:"Camera-roll misc",ctx:"Accidental / low-quality capture",beat:""};
});

/* ---- timeline: real dates from photo EXIF; videos inherit their trip's date ---- */
const _byEv={};
DATA.images.forEach(function(m){ if(m.date && m.event!=="MISC"){ (_byEv[m.event]=_byEv[m.event]||[]).push(m.date); } });
DATA.eventDate={};
Object.keys(_byEv).forEach(function(k){ const a=_byEv[k].sort(); DATA.eventDate[k]=a[Math.floor(a.length/2)]; });
const EVENT_FALLBACK={ "QA-DOHA":"2025-11-14","SE-LAPLAND":"2025-01-30","SE-GOTLAND":"2024-07-15","SPECIAL":"2023-11-01","EU":"2023-12-31" };
const VID_DATE={ v06:"2025-04-30", v01:"2025-04-30", v26:"2025-04-30", v27:"2025-04-30", v05:"2025-04-27", v23:"2025-04-27", v24:"2025-04-27" };
DATA.videos.forEach(function(v){
  if(VID_DATE[v.id]){ v.date=VID_DATE[v.id]; v.dateApprox=false; }
  else { v.date = DATA.eventDate[v.event] || EVENT_FALLBACK[v.event] || ""; v.dateApprox=true; }
});

/* ---- STORY VERSIONS: pick one in the Story Builder ---- */
DATA.stories = {};
/* -- First draft (Claude's arc to the summits) -- */
DATA.stories.draft1 = { name:"Version 1 (first draft)", chapters:[
 {title:"Act I · Where it began", items:[
   {item:"i081",beat:"Where it all began - one profile, one 'serious pasta addiction'.",dur:4},
   {item:"v02", beat:"“Happy to have found you.”",dur:5},
   {item:"v14", beat:"The everyday joy of us.",dur:3}
 ]},
 {title:"Act II · Home & everyday", items:[
   {item:"v08", beat:"Sunday means cooking together.",dur:3},
   {item:"v10", beat:"",dur:2},
   {item:"v18", beat:"Baking through the long dark winter.",dur:3},
   {item:"i019",beat:"Little gestures - flowers, for no reason.",dur:3},
   {item:"i006",beat:"Dressed up, just the two of them.",dur:3}
 ]},
 {title:"Act III · Our Sweden, season by season", items:[
   {item:"v15", beat:"Warm water, frozen lake.",dur:4},
   {item:"i034",beat:"A night inside the ICEHOTEL.",dur:3},
   {item:"v17", beat:"Under the Arctic lights.",dur:2},
   {item:"v33", beat:"Midsummer - flower crowns and all.",dur:4},
   {item:"i008",beat:"A rooftop kiss over the city.",dur:3},
   {item:"v39", beat:"Every summer, somewhere new.",dur:3}
 ]},
 {title:"Act IV · We go everywhere together", items:[
   {item:"v20", beat:"Paddling through paradise - Ha Long Bay.",dur:4},
   {item:"v21", beat:"Jump first, think later.",dur:3},
   {item:"v38", beat:"Say yes to (almost) everything.",dur:4},
   {item:"v46", beat:"Always up for a laugh.",dur:3},
   {item:"v32", beat:"Walking on air in Sapa.",dur:3},
   {item:"v34", beat:"Swinging over the edge -",dur:3},
   {item:"v35", beat:"- her turn.",dur:3},
   {item:"v43", beat:"Dancing down the road, because why not.",dur:3},
   {item:"v41", beat:"Night-market joy.",dur:3},
   {item:"v53", beat:"Golden Bangkok, Christmas 2025.",dur:3}
 ]},
 {title:"Act V · Reaching the top", items:[
   {item:"v55", beat:"Some climbs you do in the dark -",dur:3},
   {item:"v54", beat:"- one step at a time, together -",dur:3},
   {item:"v56", beat:"- until you're above the clouds.",dur:4},
   {item:"v50", beat:"Sunrise, earned.",dur:3},
   {item:"v26", beat:"We made it.",dur:3},
   {item:"v27", beat:"Proof: they reach every summit together.",dur:4},
   {item:"v01", beat:"On top of the world.",dur:4}
 ]},
 {title:"Act VI · Forever starts now", items:[
   {item:"v24", beat:"This view - with you, always.",dur:5}
 ]}
]};

/* -- Jennie's story (from her storyline doc + breakdown; grouped into bigger chunks) -- */
DATA.stories.jennie = { name:"Version 2 (Jennie's story)", chapters:[
 {title:"Act I · How we met (2023)", items:[
   {item:"i081", beat:"How it started - one Bumble profile, and a new flat that happened to be 1 km from his.", dur:4},
   {item:"i003", beat:"Castle dates became our thing - Ulriksdal on the 2nd date, then Drottningholm.", dur:4},
   {item:"i006", beat:"A month in - after painting each other's nails - he asked her to be his girlfriend.", dur:4},
   {item:"v02", beat:"“Happy to have found you.”", dur:4}
 ]},
 {title:"Act II · First trips - Poland & the far north (Christmas 2023)", items:[
   {item:"i009", beat:"Our first trip together - Christmas in Kraków.", dur:4},
   {item:"i069", beat:"Gdańsk old town.", dur:3},
   {item:"i034", beat:"Then the far north - a night inside the ICEHOTEL,", dur:3},
   {item:"v17", beat:"under the Arctic lights in Kiruna,", dur:3},
   {item:"v12", beat:"and island days on Gotland.", dur:3}
 ]},
 {title:"Act III · Moving in - life at home (June 2024)", items:[
   {item:"v14", beat:"June 2024 - we move in together.", dur:3},
   {item:"v08", beat:"Cooking became our daily ritual…", dur:3},
   {item:"v18", beat:"…the baking, the 1500-piece puzzles, the Watermelon Fund. 🍉", dur:3},
   {item:"i036", beat:"Zombie walk in Uppsala - we even made the local paper. 🧟", dur:4},
   {item:"i132", beat:"Cheering him on at football.", dur:3},
   {item:"i103", beat:"Friends round the table, always something on the stove.", dur:3}
 ]},
 {title:"Act IV · Castles, occasions & family", items:[
   {item:"v37", beat:"Castles all over Sweden - she's got a jump for every one. 🏰", dur:4},
   {item:"i110", beat:"Showing his family around Stockholm,", dur:3},
   {item:"i109", beat:"long dinners with family,", dur:3},
   {item:"v33", beat:"Midsummer, first anniversary, every little occasion.", dur:4}
 ]},
 {title:"Act V · Back to Vietnam - & engaged (Dec 2024 → Jan 2025)", items:[
   {item:"v31", beat:"Dec 2024 - she's sent home to Vietnam. He follows. (A stop in Doha.)", dur:4},
   {item:"v35", beat:"On a swing at sunset in Phú Quốc he knelt: “Will you be my one Bubu forever?” 💍  ⟨swap in the real proposal clip⟩", dur:5},
   {item:"i012", beat:"Engaged. 🌅", dur:3}
 ]},
 {title:"Act VI · Exploring Vietnam together", items:[
   {item:"v38", beat:"Say yes to everything - even a python. 🐍", dur:4},
   {item:"i163", beat:"Meeting her brother, family in Đà Nẵng, Tết together.  ⟨+ the Củ Chi tunnel & shooting-range clips⟩", dur:4},
   {item:"i007", beat:"Boat rides through the karsts,", dur:3},
   {item:"v46", beat:"the Hà Giang loop - always up for a laugh,", dur:3},
   {item:"v45", beat:"…then sending him off again.", dur:3}
 ]},
 {title:"Act VII · Long distance → conquering peaks (2025)", items:[
   {item:"v41", beat:"A year of long distance - but we found our way back, three times over.", dur:4},
   {item:"v55", beat:"When he visited, we climbed - in the dark,", dur:3},
   {item:"v54", beat:"one step at a time,", dur:3},
   {item:"v56", beat:"above the clouds.", dur:4},
   {item:"v27", beat:"the highest peak in Vietnam -", dur:3},
   {item:"v50", beat:"- and the highest in Taiwan.", dur:3},
   {item:"v01", beat:"On top of the world, together.", dur:4},
   {item:"v53", beat:"Taiwan and Thailand, reunited.", dur:3}
 ]},
 {title:"Act VIII · Back to Sweden - the next chapter", items:[
   {item:"v39", beat:"Back to Sweden - this summer, still exploring.", dur:3},
   {item:"v24", beat:"Ready for the next chapter. 💛", dur:5}
 ]}
]};
DATA.story = DATA.stories.draft1.chapters; /* back-compat */

window.DATA = DATA;
})();
