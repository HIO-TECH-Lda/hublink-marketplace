/** Curated Pexels images aligned with Txova marketplace local positioning */

const pexels = (id: number | string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

export const pexelsImages = {
  marketScene: pexels(30179958),
  marketVendor: pexels(30464933),
  streetVendor: pexels(30275079),
  onlineShopping: pexels(4482900),
  vegetableMarket: pexels(2255935),
  vegetableMix: pexels(1300972),
  fruitPlatter: pexels(1132047),
  localProduce: pexels(36552911),

  tomato: pexels(1327838),
  carrot: pexels(143133),
  apple: pexels(102104),
  lettuce: pexels(1199562),
  banana: pexels(61127),
  pineapple: pexels(139259),
  redOnion: pexels(144206),
  rootVegetables: pexels(30179958),

  avatarWoman: pexels(774909),
  avatarMan: pexels(2379004),
  avatarManUrban: pexels(1681010),
  avatarWomanPro: pexels(1181690),
  avatarWomanGlasses: pexels(1239291),
} as const;
