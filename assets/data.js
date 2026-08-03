/* Content data + first-draft story for the Jennie & Gunnar wedding film.
   Ratings here are Claude's first-pass defaults; users can override them in the app. */
(function(){
const DATA = { targetSec:135, appVersion:"1.3", appUpdated:"2026-08-03 22:10 WEST" };

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
  "VN-MEKONG":  {label:"Vietnam · Mekong/Cu Chi", color:"#9aa93b"},
  "VN-PHUQUOC": {label:"Vietnam · Phu Quoc",      color:"#4bb3a0"},
  "VN-DANANG":  {label:"Vietnam · Da Nang & Tet",  color:"#5cb37a"},
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
["v02","Valentine 2024.mp4",15,"P","SPECIAL","Both","-","A ready-made 'Happy to have found you' Valentine's reel with captions",4,"“Happy to have found you.”"],
["v03","39be167c-2cf3-4ee4-97fa-36a1c1684bbd.MP4",17,"P","VN-HAGIANG","Group","Vietnam countryside","Cycling a country road together",3,"Two wheels, one road"],
["v04","Friend.mov",72,"P","VN-SAPA","Both","Hotel, Vietnam","Goofing around on the chairs, completely at ease",3,"The easy, silly comfort of us"],
["v05","84ae4bdb-a9ef-4eb9-a68b-6656bad0dbfa.MP4",26,"P","VN-SAPA","Distant","Sapa, Vietnam","Hiking a rocky ridge in the mist",3,"Every trail, side by side"],
["v06","DJI_20250430124950_0002_D.MP4",118,"L","VN-SAPA","Both","Sapa (Apr 2025)","Pedalling a 'sky-bike' across cables over the misty forest",4,"Pedalling across the sky"],
["v07","FOODIE_1745322572.MP4",11,"P","VN-HALONG","Gunnar","Ha Long Bay cruise","Fine dining on the bay cruise",3,"Dinner drifting over Ha Long"],
["v08","Cooking 1.MP4",9,"P","SE-HOME","Hands","Stockholm home","Cooking a chicken & rice bake",2,"Sunday means cooking together"],
["v09","Cooking 2.MP4",5,"P","SE-HOME","Hands","Stockholm home","Simmering a stew",2,""],
["v10","Cooking 3.MP4",10,"P","SE-HOME","Hands","Stockholm home","Stirring a big pan of bolognese",2,""],
["v11","Cooking 4.MP4",9,"P","SE-HOME","Arm","Stockholm home","Frying chanterelles - Swedish autumn",2,"Chanterelle season"],
["v12","Gotland_.mov",6,"P","SE-GOTLAND","Gunnar","Gotland (Visby)","Wheeling a suitcase - off on another trip",2,"Bags packed, again"],
["v13","IMG_0377.MOV",12,"P","SE-HOME","Gunnar","Stockholm home","Cooking together, steam and laughter",2,""],
["v14","IMG_0619.MOV",6,"P","SE-HOME","Both","Car, Stockholm","Car selfie, Jennie beaming",4,"The everyday joy of us"],
["v15","IMG_0662.MOV",11,"P","SE-SEASONS","Both","Stockholm, winter","A frozen-lake outdoor spa in the snow",4,"Warm water, frozen lake"],
["v16","IMG_0677.MOV",15,"P","SE-SEASONS","Gunnar","Stockholm","Candle-lit design-restaurant dinner",2,"Date night"],
["v17","Kiruna 6.MOV",1,"P","SE-LAPLAND","Both","Kiruna, Lapland","Arctic night - reindeer and lights",4,"Under the Arctic lights"],
["v18","Cooking 6.MOV",6,"P","SE-HOME","Gunnar","Stockholm home","Baking a tray of saffron buns",3,"Baking through the dark winter"],
["v19","Cooking 8.MOV",9,"P","SE-HOME","Hands","Stockholm home","Cooking pad thai, wok steaming",2,""],
["v20","IMG_1900.MOV",8,"L","VN-HALONG","Both","Ha Long Bay","Kayak selfie, huge smiles under the karsts",5,"Paddling through paradise"],
["v21","IMG_2254.MOV",7,"P","VN-HALONG","Both+friends","Ha Long Bay","Leaping off the boat to swim",4,"Jump first, think later"],
["v22","IMG_2255.MOV",4,"P","VN-HALONG","Gunnar","Ha Long Bay","Swimming in the bay",3,""],
["v23","IMG_2456.MOV",14,"P","VN-SAPA","Gunnar","Sapa trek","Climbing a misty jungle trail",3,"Into the clouds"],
["v24","IMG_2515.MOV",8,"P","VN-SAPA","Both","Sapa, Vietnam","Mountaintop hug, pointing out the valley",4,"This view - with you, always"],
["v25","IMG_2538.MOV",6,"P","SE-SEASONS","Glimpse","North of Stockholm","Spring at a grand manor",2,""],
["v26","IMG_2631.MOV",6,"P","VN-SAPA","Gunnar","Fansipan summit","Proudly holding the summit certificate & medal",5,"We made it"],
["v27","IMG_2632.MOV",11,"P","VN-SAPA","Jennie","Fansipan summit","Beaming with her summit certificate & medal",5,"Proof: they reach every summit together"],
["v28","Cooking 10.mov",8,"P","SE-HOME","Hands","Stockholm home","Cooking chicken & rice",2,""],
["v29","IMG_3128.MOV",9,"P","SE-SEASONS","Both","Stockholm forest","A summer forest walk",3,"Slow summer walks"],
["v30","IMG_3202.MOV",1,"P","SE-SEASONS","Players","Stockholm","Watching a football match",2,""],
["v31","Doha 2.MOV",11,"P","QA-DOHA","-","Doha, Qatar","City lights on a layover",3,"Somewhere between here and there"],
["v32","IMG_3287.MOV",7,"P","VN-SAPA","Distant","Sapa, Vietnam","The glass skywalk over the cliffs",4,"Walking on air"],
["v33","IMG_3532.MOV",17,"P","SE-SEASONS","Gunnar+crowd","Stockholm (Södermalm)","Midsummer - flower crowns, arms waving",4,"Midsummer, flower crowns and all"],
["v34","IMG_3659.MOV",9,"P","VN-SAPA","Gunnar","Sapa, Vietnam","Cliffside swing out over the valley",4,"Swinging over the edge -"],
["v35","IMG_3662.MOV",11,"P","VN-SAPA","Jennie","Sapa, Vietnam","Her turn on the cliffside swing",4,"- her turn"],
["v36","Castle 9.MOV",7,"P","SE-SEASONS","Gunnar","South of Stockholm","Summer by the jetty",3,"Long light summer evenings"],
["v37","Castle 6.MOV",9,"P","SE-SEASONS","Jennie","South of Stockholm","Posing at a pastel palace",3,""],
["v38","VN 10.MOV",6,"P","VN-MEKONG","Gunnar","Mekong Delta","Draped in a giant python, grinning",5,"Say yes to (almost) everything"],
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
["v56","fafda0a7-9dd0-48ce-822a-c1b2b6f83492.MP4",15,"P","TW-YUSHAN","Both","Summit above the clouds","Standing at the edge of a sea of clouds",5,"- until you're above the clouds"],
["v57","Castle 3.MOV",11,"P","SE-SEASONS","-","Sweden, palace grounds","Walking the palace park",3,""],
["v58","Cooking 7.MOV",15,"P","SE-HOME","Both","Stockholm home","Plating dinner together",3,""],
["v59","Cooking 9.MOV",9,"P","SE-HOME","-","Stockholm home","Fresh cookies out of the oven",3,""],
["v60","Date- 1st date 2.mov",10,"P","SE-SEASONS","-","Bromma, Stockholm","The neighbourhood where they first met",3,""],
["v61","Errand 1.MOV",7,"P","SE-HOME","-","Stockholm","Everyday life - returning the bottles",3,""],
["v62","Errand 2.MOV",8,"P","SE-HOME","-","Stockholm","The bottle-deposit machine (pant)",2,""],
["v63","Friends 4.MOV",23,"L","SE-HOME","Friends","Stockholm","Friends piled on the couch, laughing",4,""],
["v64","Friends 7.mov",96,"P","SE-HOME","Friends","Stockholm","Game night with friends",2,""],
["v65","Horse riding.mov",17,"P","SE-SEASONS","-","Sweden","A horse-and-carriage ride",4,""],
["v66","Kiruna 5.mov",8,"P","SE-LAPLAND","Jennie","Kiruna, Lapland","Walking the frozen lake",4,""],
["v67","Kiruna 7.MOV",8,"P","SE-LAPLAND","-","Kiruna, Lapland","Out in the Arctic",3,""],
["v68","Phu Quoc 5.mov",24,"P","VN-PHUQUOC","-","Phu Quoc, Vietnam","Sunset on the beach where he proposed",5,""],
["v69","VN 12.mov",14,"P","VN-MEKONG","-","Vietnam","Vietnam streets, conical hats",3,""],
["v70","VN 13.mov",14,"P","VN-MEKONG","Both","Cu Chi, Vietnam","Climbing up out of the Cu Chi tunnels",5,""]
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
 i178:[3,"SE-HOME","Gunnar","Stockholm","A silly selfie"],
 i209:[3,"SE-SEASONS","-","Bromma, Stockholm","The willow by the water - first-date neighbourhood"],
 i210:[4,"SE-HOME","Family","Stockholm","Family gathered around the table"],
 i211:[2,"SE-HOME","-","Stockholm","Something on the table"],
 i212:[2,"SE-HOME","-","Stockholm","Food, the early days"],
 i213:[4,"SE-GOTLAND","Both","Visby, Gotland","Rooftop selfie over Visby"],
 i214:[1,"SE-GOTLAND","-","Gotland","Camera-roll misc"],
 i215:[2,"SE-SEASONS","-","Sweden","A jump shot"],
 i216:[1,"SE-SEASONS","-","Stockholm","Camera-roll misc"],
 i217:[3,"SE-SEASONS","Both","Uppsala","Zombie walk"],
 i218:[3,"SE-SEASONS","Both","Uppsala","Zombie walk"]
};
DATA.images = (window.IMG_BASE||[]).map(function(b){
  const id=b[0], o=O[id], date=b[3]||"";
  if(o) return {id:id,file:b[1],orient:b[2],date:date,rating:o[0],event:o[1],people:o[2],loc:o[3],ctx:o[4],beat:o[5]||""};
  return {id:id,file:b[1],orient:b[2],date:date,rating:1,event:"MISC",people:"-",loc:"Camera-roll misc",ctx:"Accidental / low-quality capture",beat:""};
});

/* ---- Jennie's-doc media (regenerated straight from her named files, guaranteed-correct) ---- */
/* [id,file,type,dur,orient,event,people,loc,ctx,rating,date] */
const JM=[
["jm01","Bumble 1.png","image",0,"P","SPECIAL","-","Bumble","Her Bumble profile",4,"2023-09-01"],
["jm02","Bumble 2.png","image",0,"P","SPECIAL","-","Bumble","His Bumble profile (Gunnar, 30)",4,"2023-09-01"],
["jm03","Date- 1st date","image",0,"L","SE-SEASONS","-","Bromma, Stockholm","First date - the neighbourhood he grew up in",4,"2023-09-15"],
["jm04","Date- 1st date 2.mov","video",10,"P","SE-SEASONS","-","Bromma, Stockholm","First-date walk",3,"2023-09-15"],
["jm07","Poland 2.jpg","image",0,"P","EU","-","Krakow, Poland","Kraków",4,"2023-12-24"],
["jm08","Poland 4.jpg","image",0,"L","EU","Both","Gdansk, Poland","Gdańsk old town",4,"2023-12-27"],
["jm09","Kiruna 2.jpg","image",0,"L","SE-LAPLAND","Both","Kiruna, Lapland","A snowy night up north",4,"2024-01-15"],
["jm10","Kiruna 6.MOV","video",1,"P","SE-LAPLAND","Both","Kiruna, Lapland","Under the Arctic lights",4,"2024-01-15"],
["jm11","Gotland 3","image",0,"L","SE-GOTLAND","Both","Visby, Gotland","Island days on Gotland",4,"2024-07-20"],
["jm12","Cooking 1.MP4","video",9,"P","SE-HOME","Hands","Stockholm home","Cooking together",3,"2024-07-10"],
["jm13","Cooking 6.MOV","video",6,"P","SE-HOME","Gunnar","Stockholm home","Baking saffron buns",3,"2024-11-01"],
["jm14","Cooking 8.MOV","video",9,"P","SE-HOME","Hands","Stockholm home","Pad thai night",3,"2024-08-01"],
["jm15","Puzzle 2.jpg","image",0,"L","SE-HOME","Both","Stockholm home","A 1500-piece puzzle - the Watermelon Fund",3,"2024-08-15"],
["jm16","Errand 1.MOV","video",7,"P","SE-HOME","-","Stockholm","Returning the bottles (pant)",3,"2024-08-20"],
["jm17","Zombie 2.HEIC","image",0,"L","SE-SEASONS","Both","Uppsala","Zombie walk - we made the local paper",4,"2023-10-28"],
["jm19","IMG_3213.jpg","image",0,"P","SE-SEASONS","Both","Stockholm","At his football match",3,"2024-06-01"],
["jm20","Jump 2","image",0,"L","SE-SEASONS","Jennie","Sweden, castle","A jump at every castle",3,"2024-07-01"],
["jm21","Castle 10.HEIC","image",0,"L","SE-SEASONS","Both","Sweden, castle","Castle-date selfie",4,"2024-07-01"],
["jm22","Friends 8.jpg","image",0,"L","SE-HOME","Friends","Stockholm","Friends over for dinner",3,"2024-11-15"],
["jm23","First year anniversary 2.HEIC","image",0,"L","SE-SEASONS","Both","Stockholm","First-year anniversary",4,"2024-09-15"],
["jm24","Stockholm 2.jpg","image",0,"P","SE-SEASONS","Both","Stockholm","By the water",4,"2024-06-15"],
["jm25","Family 1.jpg","image",0,"L","SE-HOME","Family","Stockholm","Dinner with his family",3,"2024-12-01"],
["jm26","IMG_2946.heic","image",0,"P","SE-HOME","Both","Stockholm","Christmas by the tree",4,"2024-12-24"],
["jm27","Doha 1.HEIC","image",0,"L","QA-DOHA","Both","Doha, Qatar","A stop in Doha",3,"2024-12-20"],
["jm28","Engage 1.HEIC","image",0,"P","VN-PHUQUOC","Both","Phu Quoc, Vietnam","On the swing: “Will you be my one Bubu forever?”",5,"2025-01-15"],
["jm29","Engage 2.heic","image",0,"P","VN-PHUQUOC","Jennie","Phu Quoc, Vietnam","The ring",5,"2025-01-15"],
["jm30","Phu Quoc 5.mov","video",24,"P","VN-PHUQUOC","-","Phu Quoc, Vietnam","Phú Quốc sunset",4,"2025-01-15"],
["jm31","Brother family 1","image",0,"L","VN-DANANG","Family","Vietnam","Meeting her brother for the first time",4,"2025-01-20"],
["jm32","Danang Family 1.HEIC","image",0,"L","VN-DANANG","Family","Da Nang, Vietnam","Her family in Đà Nẵng",4,"2025-01-25"],
["jm33","Tet 1.HEIC","image",0,"P","VN-DANANG","Family","Da Nang, Vietnam","Tết together",4,"2025-01-29"],
["jm34","Tet 3","image",0,"L","VN-DANANG","Gunnar","Vietnam","Tết fireworks",4,"2025-01-29"],
["jm35","VN 10.MOV","video",6,"P","VN-MEKONG","Gunnar","Mekong Delta","Draped in a python",5,"2025-05-30"],
["jm36","VN 13.mov","video",14,"P","VN-MEKONG","Both","Cu Chi, Vietnam","Crawling up out of the Củ Chi tunnels",5,"2025-01-22"],
["jm38","VN 1.jpg","image",0,"L","VN-NINHBINH","Both","Ninh Binh, Vietnam","Boat through the karsts",4,"2025-05-25"],
["jm39","Long distance 1.PNG","image",0,"P","SE-HOME","Gunnar","-","A year of long distance, three reunions",3,"2025-06-01"]
];
JM.forEach(function(a){ const o={id:a[0],file:a[1],orient:a[4],event:a[5],people:a[6],loc:a[7],ctx:a[8],rating:a[9],date:a[10],beat:""}; if(a[2]==="video"){o.dur=a[3];o.dateApprox=true;DATA.videos.push(o);} else {DATA.images.push(o);} });

/* ---- timeline: real dates from photo EXIF; videos inherit their trip's date ---- */
const _byEv={};
DATA.images.forEach(function(m){ if(m.date && m.event!=="MISC"){ (_byEv[m.event]=_byEv[m.event]||[]).push(m.date); } });
DATA.eventDate={};
Object.keys(_byEv).forEach(function(k){ const a=_byEv[k].sort(); DATA.eventDate[k]=a[Math.floor(a.length/2)]; });
const EVENT_FALLBACK={ "QA-DOHA":"2025-11-14","SE-LAPLAND":"2025-01-30","SE-GOTLAND":"2024-07-15","SPECIAL":"2023-11-01","EU":"2023-12-31","VN-PHUQUOC":"2025-01-15","VN-DANANG":"2025-01-25" };
const VID_DATE={ v06:"2025-04-30", v01:"2025-04-30", v26:"2025-04-30", v27:"2025-04-30", v05:"2025-04-27", v23:"2025-04-27", v24:"2025-04-27", v68:"2025-01-15" };
DATA.videos.forEach(function(v){
  if(v.date){ return; } /* jm items already have an explicit date */
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
 {title:"Act I · How we met (Sep 2023)", items:[
   {item:"jm01", beat:"How it started - one Bumble profile,", dur:3},
   {item:"jm02", beat:"and his (Gunnar, 30).", dur:3},
   {item:"jm03", beat:"First date in Bromma - the neighbourhood he grew up in.", dur:4},
   {item:"jm04", beat:"", dur:3},
   {item:"jm21", beat:"Castle dates became our thing. A month in, after painting each other's nails, he asked her to be his girlfriend.  ⟨Drottningholm selfie IMG_0889 & nail photo IMG_1014 are in Jennie's Drive - add when downloaded⟩", dur:5}
 ]},
 {title:"Act II · First trip - Poland & the far north (Christmas 2023)", items:[
   {item:"jm07", beat:"Our first trip together - Christmas in Kraków.", dur:4},
   {item:"jm08", beat:"Gdańsk old town.", dur:3},
   {item:"jm09", beat:"Then the far north - Kiruna,", dur:3},
   {item:"jm10", beat:"under the Arctic lights,", dur:3},
   {item:"jm11", beat:"and island days on Gotland.", dur:3}
 ]},
 {title:"Act III · Moving in - life at home (June 2024)", items:[
   {item:"jm12", beat:"June 2024 - we move in together. Cooking becomes the daily ritual.", dur:4},
   {item:"jm13", beat:"", dur:2},
   {item:"jm14", beat:"", dur:2},
   {item:"jm15", beat:"The 1500-piece puzzles, the Watermelon Fund.", dur:3},
   {item:"jm16", beat:"Even the errands, together.", dur:3}
 ]},
 {title:"Act IV · Occasions, friends & family", items:[
   {item:"jm17", beat:"Zombie walk in Uppsala - we made the local paper.", dur:4},
   {item:"jm19", beat:"cheering him on at football,", dur:3},
   {item:"jm20", beat:"a jump at every castle,", dur:3},
   {item:"jm23", beat:"our first anniversary,", dur:3},
   {item:"jm22", beat:"friends round the table.", dur:3}
 ]},
 {title:"Act V · Back to Vietnam - & engaged (Dec 2024 → Jan 2025)", items:[
   {item:"jm27", beat:"Dec 2024 - she's sent home to Vietnam. He follows (a stop in Doha).", dur:4},
   {item:"jm28", beat:"On the swing he knelt: “Will you be my one Bubu forever?”", dur:5},
   {item:"jm29", beat:"Engaged.", dur:3},
   {item:"jm30", beat:"Phú Quốc sunset.", dur:3}
 ]},
 {title:"Act VI · Family in Vietnam - Tết", items:[
   {item:"jm31", beat:"Meeting her brother for the first time.", dur:3},
   {item:"jm32", beat:"Her family in Đà Nẵng.", dur:3},
   {item:"jm33", beat:"Tết together -", dur:3},
   {item:"jm34", beat:"- fireworks for our first Vietnamese New Year.", dur:3}
 ]},
 {title:"Act VII · Exploring Vietnam together", items:[
   {item:"jm36", beat:"Crawling up out of the Củ Chi tunnels.", dur:4},
   {item:"jm35", beat:"Say yes to everything - even a python.", dur:4},
   {item:"jm38", beat:"boat rides through the karsts,", dur:3},
   {item:"v46", beat:"the Hà Giang loop - always up for a laugh,", dur:3},
   {item:"v45", beat:"then sending him off again.", dur:3}
 ]},
 {title:"Act VIII · Long distance → conquering peaks (2025)", items:[
   {item:"jm39", beat:"A year of long distance - three reunions in twelve months.", dur:4},
   {item:"v06", beat:"When he visited, we climbed - sky-biking over Sapa,", dur:3},
   {item:"v55", beat:"then in the dark,", dur:3},
   {item:"v54", beat:"one step at a time,", dur:3},
   {item:"v56", beat:"above the clouds,", dur:3},
   {item:"v27", beat:"the highest peak in Vietnam - Fansipan,", dur:4},
   {item:"v50", beat:"and the highest in Taiwan.", dur:4},
   {item:"v01", beat:"On top of the world, together.", dur:4},
   {item:"v41", beat:"Taiwan nights,", dur:3},
   {item:"v43", beat:"", dur:2},
   {item:"v53", beat:"and Thailand - reunited.", dur:3}
 ]},
 {title:"Act IX · Back to Sweden - the next chapter", items:[
   {item:"jm26", beat:"Back to Sweden - Christmas by the tree,", dur:3},
   {item:"v33", beat:"Midsummer,", dur:3},
   {item:"jm25", beat:"friends and family,", dur:3},
   {item:"v39", beat:"preparing for the next chapter -", dur:3},
   {item:"jm24", beat:"- together. 💛", dur:4}
 ]}
]};
DATA.story = DATA.stories.draft1.chapters; /* back-compat */

window.DATA = DATA;
})();
