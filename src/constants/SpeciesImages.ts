const commonsImage = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}?width=1200`;

export const SpeciesImages = {
  lion: commonsImage('African Lion (52108609574).jpg'),
  elephant: commonsImage('African Elephant (loxodonta africana).jpg'),
  tiger: commonsImage('DSC4466 Bengal tiger.jpg'),
  eagle: commonsImage('Bald eagle (44912386204).jpg'),
  penguin: commonsImage('Aptenodytes forsteri (Emperor Penguin) (48718946538).jpg'),
  turtle: commonsImage('Green-sea-turtle.jpg'),
  iguana: commonsImage('Green iguana, Iguana iguana.jpg'),
  shark: commonsImage('Great white shark, Carcharodon carcharias.jpg'),
  clownfish: commonsImage('Ocellaris clownfish (Amphiprion ocellaris) (35272133494).jpg'),
  panda: commonsImage('Giant panda.jpg'),
  giraffe: commonsImage('Giraffe giraffa camelopardalis.jpg'),
  dolphin: commonsImage('Bottlenose Dolphins.jpg'),
} as const;

export const WelcomeHeroImage = SpeciesImages.lion;
