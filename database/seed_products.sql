-- Очистка таблиц перед вставкой новых данных
TRUNCATE TABLE product_sizes CASCADE;
TRUNCATE TABLE products CASCADE;

-- Сброс последовательности id
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Вставка товаров
INSERT INTO products (
  id, 
  name, 
  description, 
  price, 
  catalog_image_url,
  detail_image_url_1,
  detail_image_url_2,
  cart_image_url,
  pixel_bg_url,
  has_size_selection
) VALUES
(1, '"Doll Life" Motorcycle Gloves', E'“Doll Life” Motorcycle Gloves (v.3) (one size)\n\n 1× Finger-cut glove, Textile-reinforced Kevlar® weave\n 1× Hook-and-loop wrist strap, Hypoallergenic neoprene backing\n\nUnisex cut for intimate "second-skin" fit. Each fingertip etched with hand-drawn Doll & Life sigils in phosphorescent ink.\nLimited edition run of 333 pairs, serialized "DL-XXX" on inner cuff.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nStore flat in cool, dry place. Avoid prolonged UV exposure to preserve reactive pigments.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 59, 
  '/src/assets/products/gloves-catalog.png',
  '/src/assets/products/gloves-detail-1.png',
  '/src/assets/products/gloves-detail-2.png',
  '/src/assets/products/gloves-cart.png',
  '/src/assets/products/gloves-pixel-bg.png',
  false
),
(2, '"Doll Life" Player 11 Jersey', E'“Doll Life” Player 11 Jersey (v.1) (S-XL)\n\n 1× Crew-neck jersey, 100 % organic cotton pique\n 2× Reflective side panels, "Amygdala Damage" in micro-print\n 1× Oversized back-print "11" in reactive UV ink\n\nUnisex fit with dropped shoulders for that second-skin silhouette.\nLimited-run of 333 pieces, each serialized "DL-JRS-XX" on inner hem.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nStore folded in dry, dark place—avoid direct heat to preserve reactive pigments.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 99,
  '/src/assets/products/jersey-black-catalog.png',
  '/src/assets/products/jersey-black-detail-1.png',
  '/src/assets/products/jersey-black-detail-2.png',
  '/src/assets/products/jersey-black-cart.png',
  '/src/assets/products/jersey-black-pixel-bg.png',
  true
),
(3, '"God Made Me Your Toy" Tee', E'“God Made Me Your Toy” Tee (v.1) (S-XL)\n\n 1× Crew-neck tee, 100 % organic cotton\n 1× Soft-touch silicone printed phrase\n 1× Central 3D-embossed torso patch in tactile nylon\n\nSlim unisex cut with dropped shoulders and elongated hem.\nLimited-edition run of 333 pieces, each serialized "GMT-XXX" on inner hem tape.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nStore folded, away from direct sunlight, to preserve silicone prints.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 79,
  '/src/assets/products/tee-white-catalog.png',
  '/src/assets/products/tee-white-detail-1.png',
  '/src/assets/products/tee-white-detail-2.png',
  '/src/assets/products/tee-white-cart.png',
  '/src/assets/products/tee-white-pixel-bg.png',
  true
),
(4, '"Doll Life" Sigil Shorts', E'“Doll Life” Sigil Shorts (v.1) (S-XL)\n\n 1× Lightweight quick-dry polyester knit with waistband\n 2× Print "Doll Life" in reactive UV ink\n 2× Micro-printed Amygdala Damage sigil on left hem\n\nUnisex athletic cut with a 6″ inseam for unrestricted movement.\nLimited-run of 333 pairs, each serialized "DL-SHT-XXX" on the drawcord tip.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nMachine wash cold, gentle cycle to preserve reactive inks and reflective panels.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 99,
  '/src/assets/products/shorts-black-catalog.png',
  '/src/assets/products/shorts-black-detail-1.png',
  '/src/assets/products/shorts-black-detail-2.png',
  '/src/assets/products/shorts-black-cart.png',
  '/src/assets/products/shorts-black-pixel-bg.png',
  true
),
(5, '"Doll Life" Black Boxers', E'“Doll Life” Black Boxers (v.1) (S-XL)\n\n 1× Supima® cotton / 5 % Elastane blend for next-to-skin comfort\n 1× Branded elastic waistband with soft-touch silicone "Doll Life" script\n\nUnisex ergonomic cut with contoured pouch and mid-thigh inseam for a sleek.\nLimited edition of 333 pieces, each serialized "DL-BB-XXX" on the drawcord tip.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nMachine wash cold, tumble dry low. Avoid bleach and direct heat to preserve stretch integrity.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 29,
  '/src/assets/products/boxers-black-catalog.png',
  '/src/assets/products/boxers-black-detail-1.png',
  '/src/assets/products/boxers-black-detail-2.png',
  '/src/assets/products/boxers-black-cart.png',
  '/src/assets/products/boxers-black-pixel-bg.png',
  true
),
(6, '"Doll Life" White Boxers', E'“Doll Life” White Boxers (v.1) (S-XL)\n\n 1× Supima® cotton / 5 % Elastane blend for next-to-skin comfort\n 1× Branded elastic waistband with soft-touch silicone "Doll Life" script\n\nUnisex ergonomic cut with contoured pouch and mid-thigh inseam for a sleek.\nLimited edition of 333 pieces, each serialized "DL-WB-XXX" on the drawcord tip.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nMachine wash cold, tumble dry low. Avoid bleach and direct heat to preserve stretch integrity.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 29,
  '/src/assets/products/boxers-white-catalog.png',
  '/src/assets/products/boxers-white-detail-1.png',
  '/src/assets/products/boxers-white-detail-2.png',
  '/src/assets/products/boxers-white-cart.png',
  '/src/assets/products/boxers-white-pixel-bg.png',
  true
),
(7, '"Amygdala Damage" Logo White Socks', E'“Amygdala Damage” Logo White Socks (v.1) (one size)\n\n 1× Premium combed cotton blend (75 % cotton, 20 % nylon, 5 % elastane) for breathable comfort and lasting shape\n 1× Reinforced heel & toe panels for extra durability\n 1× Seamless toe closure to eliminate irritation\n 1× Subtle Amygdala Damage sigil embroidered on outer cuff\n\nUnisex, mid-calf height with snug arch support band for a "second-skin" fit.\n\nCrafted in Osaka (JP) & Turin (IT).\nAssembled, hand-stitched and heat-sealed in Copenhagen (DK).\n\nMachine wash cold, tumble dry low. Avoid bleach and direct heat to preserve stretch integrity.\n\n™ AMY DMG Collective 2025\nBorn from cracks in perfection—wear your vulnerability.', 19,
  '/src/assets/products/socks-white-catalog.png',
  '/src/assets/products/socks-white-detail-1.png',
  '/src/assets/products/socks-white-detail-2.png',
  '/src/assets/products/socks-white-cart.png',
  '/src/assets/products/socks-white-pixel-bg.png',
  false
),
(8, '* file not found *', NULL, 0,
  '/src/assets/loading1.gif',
  NULL,
  NULL,
  NULL,
  NULL,
  false
);

-- Сброс последовательности id для product_sizes
ALTER SEQUENCE product_sizes_id_seq RESTART WITH 1;

-- Вставка размеров для одежды
INSERT INTO product_sizes (product_id, size) VALUES
-- Jersey sizes
(2, 'S'),
(2, 'M'),
(2, 'L'),
(2, 'XL'),
-- Tee sizes
(3, 'S'),
(3, 'M'),
(3, 'L'),
(3, 'XL'),
-- Shorts sizes
(4, 'S'),
(4, 'M'),
(4, 'L'),
(4, 'XL'),
-- Black boxers sizes
(5, 'S'),
(5, 'M'),
(5, 'L'),
(5, 'XL'),
-- White boxers sizes
(6, 'S'),
(6, 'M'),
(6, 'L'),
(6, 'XL'); 