--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-05 03:08:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4877 (class 0 OID 17260)
-- Dependencies: 232
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, product_id, quantity, size) FROM stdin;
6	1	3	1	XL
8	1	4	1	S
4	1	1	1	S
5	1	7	1	S
7	1	5	1	S
9	1	1	2	OS
\.


--
-- TOC entry 4875 (class 0 OID 17248)
-- Dependencies: 230
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, user_id) FROM stdin;
1	1
\.


--
-- TOC entry 4873 (class 0 OID 17181)
-- Dependencies: 228
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price_each) FROM stdin;
\.


--
-- TOC entry 4871 (class 0 OID 17166)
-- Dependencies: 226
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, status, total_amount, delivery_address) FROM stdin;
\.


--
-- TOC entry 4869 (class 0 OID 17139)
-- Dependencies: 224
-- Data for Name: posters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posters (id, image_url) FROM stdin;
1	/assets/images/poster-1.png
2	/assets/images/poster-2.png
3	/assets/images/poster-3.png
\.


--
-- TOC entry 4867 (class 0 OID 17127)
-- Dependencies: 222
-- Data for Name: product_sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sizes (id, product_id, size) FROM stdin;
1	2	S
2	2	M
3	2	L
4	2	XL
5	3	S
6	3	M
7	3	L
8	3	XL
9	4	S
10	4	M
11	4	L
12	4	XL
13	5	S
14	5	M
15	5	L
16	5	XL
17	6	S
18	6	M
19	6	L
20	6	XL
\.


--
-- TOC entry 4865 (class 0 OID 17117)
-- Dependencies: 220
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, catalog_image_url, detail_image_url_1, detail_image_url_2, cart_image_url, pixel_bg_url, has_size_selection) FROM stdin;
8	* file not found *	0	/src/assets/loading1.gif	\N	\N	\N	\N	f
1	"Doll Life" Motorcycle Gloves	59	/assets/products/gloves-catalog.png	/assets/products/gloves-detail-1.png	/assets/products/gloves-detail-2.svg	/assets/products/gloves-cart.png	/assets/products/gloves-pixel-bg.png	f
2	"Doll Life" Player 11 Jersey	99	/assets/products/jersey-black-catalog.png	/assets/products/jersey-black-detail-1.png	/assets/products/jersey-black-detail-2.svg	/assets/products/jersey-black-cart.png	/assets/products/jersey-black-pixel-bg.png	t
3	"God Made Me Your Toy" Tee	79	/assets/products/tee-white-catalog.png	/assets/products/tee-white-detail-1.png	/assets/products/tee-white-detail-2.svg	/assets/products/tee-white-cart.png	/assets/products/tee-white-pixel-bg.png	t
4	"Doll Life" Sigil Shorts	99	/assets/products/shorts-black-catalog.png	/assets/products/shorts-black-detail-1.png	/assets/products/shorts-black-detail-2.svg	/assets/products/shorts-black-cart.png	/assets/products/shorts-black-pixel-bg.png	t
5	"Doll Life" Black Boxers	29	/assets/products/boxers-black-catalog.png	/assets/products/boxers-black-detail-1.png	/assets/products/boxers-black-detail-2.svg	/assets/products/boxers-black-cart.png	/assets/products/boxers-black-pixel-bg.png	t
6	"Doll Life" White Boxers	29	/assets/products/boxers-white-catalog.png	/assets/products/boxers-white-detail-1.png	/assets/products/boxers-white-detail-2.svg	/assets/products/boxers-white-cart.png	/assets/products/boxers-white-pixel-bg.png	t
7	"Amygdala Damage" Logo White Socks	19	/assets/products/socks-white-catalog.png	/assets/products/socks-white-detail-1.png	/assets/products/socks-white-detail-2.svg	/assets/products/socks-white-cart.png	/assets/products/socks-white-pixel-bg.png	f
\.


--
-- TOC entry 4863 (class 0 OID 17104)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, country, full_address) FROM stdin;
1	111syro	ferrariwest420@outlook.com	$2a$10$Yrmmk7r/9xBZxemKA3GU6.c62/j/80L6w/ZaJfEx3FTCNNwTFxfj6	Russia	1st Baltisky Lane 6/21 b.3
\.


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 231
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 9, true);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 229
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 1, true);


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 227
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 225
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 223
-- Name: posters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posters_id_seq', 1, false);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 221
-- Name: product_sizes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_sizes_id_seq', 20, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 219
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, false);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


-- Completed on 2025-06-05 03:08:33

--
-- PostgreSQL database dump complete
--

