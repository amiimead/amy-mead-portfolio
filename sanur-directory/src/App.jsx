import { useState, useMemo, useEffect } from "react";

const C = {
  sage:    "#7B9669",
  mist:    "#E6E6E6",
  steel:   "#6C8480",
  mint:    "#BAC8B1",
  forest:  "#404E3B",
  cream:   "#F4F3EE",
  white:   "#FFFFFF",
  text:    "#2C3529",
  textMid: "#5a6b55",
  textSoft:"#8a9d84",
};

const categories = [
  { id: "all",       label: "All",               emoji: "✨" },
  { id: "home",      label: "Home & Living",      emoji: "🏠" },
  { id: "kids",      label: "Kids & Family",      emoji: "👨‍👩‍👧" },
  { id: "wellness",  label: "Health & Wellness",  emoji: "🌿" },
  { id: "food",      label: "Food & Shopping",    emoji: "🛒" },
  { id: "learning",  label: "Learning",           emoji: "📚" },
  { id: "transport", label: "Getting Around",     emoji: "🛵" },
  { id: "work",      label: "Work & Coworking",   emoji: "💻" },
];

const STORAGE_KEY = "sanur_parent_recs_v4";
const ADMIN_PASSWORD = "sanur2024";

const defaultRecs = [
  { id: 101, category: "home", name: "Yan aj Handyman", description: "Reliable local handyman available for a wide range of jobs around the home.", contact: "WA: +62 857-3780-7305", tags: ["handyman", "repairs", "home"], amyNote: "We used Mr Yan to build our pool fence when we first moved to Bali. He helped us come up with a solution that worked with our rental. He is easy to work with and reliable!", reviewUrl: "" },
  { id: 702, category: "home", name: "Therry – Villa & House Rentals", description: "If you're looking for a place to rent in Sanur, whether you're just arriving or ready to move somewhere new, Therry is your first call. Knows the local market well and is great for both long-term rentals and villas for visiting family.", contact: "WA: +62 813-3994-4830", tags: ["rental", "villa", "housing", "property"], amyNote: "Therry helped us find our first Rental. He took our requests on board and only showed us houses that fit our requirements.", reviewUrl: "" },
  { id: 201, category: "kids", name: "Feby'lous Nanny Care & Babysitter", description: "Professional nanny care and babysitting service. Ad hoc and regular bookings available.", contact: "WA: +62 822-3770-8666", tags: ["nanny", "babysitter", "childcare"], amyNote: "We have used Feby'ulous multiple times and we have always had a good experience. We also appreciate the profiles they share ahead of the time so that you can pick the nanny you feel suits your family and your child.", reviewUrl: "https://www.google.com/search?q=febylous+bali+nanny+care+%26+babysitting+reviews" },
  { id: 303, category: "kids", name: "Bali Mobile Swim School", description: "Swimming lessons for kids and adults across Bali. They come to your pool — focused on water safety as a core life skill.", contact: "WA: +62 821-3535-1308", tags: ["swimming", "kids", "lessons", "safety"], amyNote: "", reviewUrl: "https://www.google.com/search?q=playfulpods+-+bali+private+swim+school+for+kids+%26+adults+gianyar+regency+reviews" },
  { id: 703, category: "kids", name: "Mogi Artperience", description: "Such a fun one for the kids — it's a colourful art space about 10 mins from Sanur Beach. Drop in or book a session, they do all kinds of creative activities. Also brilliant for kids' birthday parties (find them as @mogipartsy for that).", contact: "WA: +62 877-3405-8169 · IG: @mogiartperience", tags: ["kids", "art", "activities", "creative"], amyNote: "", reviewUrl: "https://www.google.com/search?q=mogi+artperience+denpasar+city+reviews" },
  { id: 601, category: "wellness", name: "Pediatrics & Women's Clinic – BIH", description: "Pediatrics and Women's Clinic at Bali International Hospital. English-speaking staff, expat-friendly.", contact: "WA: +62 811-3831-8582", tags: ["pediatrics", "hospital", "health"], amyNote: "", reviewUrl: "https://www.google.com/search?sca_esv=70b9ad83839e321e&rlz=1CDGOYI_enGB1083GB1083&hl=en-GB&sxsrf=ANbL-n4HMLOGPsxEe6RValk_MeUG-nhbEg:1780289989349&q=bali+international+hospital+reviews&uds=ALYpb_nVgzGTExOO6Dd7oGD3h_gcnENFWwGx8k8nlGWudmy6H9WdyqxD9vT4bfMPtk3oOgd9OV5kM4wMvoUizOmk6oLVe26U82vx40jzwMlJ9hmXo678CmzkGpVhaxG-dYPmqdg-ZgP5kwaPoWm_hdT-nPm_3qbJvW_7Ry8moZ30GCRPoiC9Je4JCi9JwunM2tMR-Gu9ZFOMa-QWp6rf0hZWM7mLXqwLLQ1GsiAcy39uJI3J4VUqVRm9ribHhPN0KZSxtWFtIzec7CvomdyrrS4eT85xjc94A7HGjrbK7TT4Ft411CtP528_z1gkCvKi8B2noow9arrCAA3hDtq02LhfYmExdvopqUD5yeABrKXQEHrKXhhrglYPKbw3DGHPyPFIjhy3vBEbhBCtMMH4ShJ8ODGvMAOSO0dAOvaqyw_ivKi8sJnqpz3J6YxlWh07bdYGEP-pnDCRlcKUy7Da7Xt4uWUSv7nrb2NMumtM8qtUJKJbNLhZes0&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOdOOXCHALGZ7jYzoC2J86mEJw-JQwLDq2b1CKd612Uj5HrTuyaohiRPUq6T5irGkNLWZXY5CoxXhx-tvnYNmYSWKEqfHQkxhkqyfLWR_a2CZFQCOqA%3D%3D&sa=X&ved=2ahUKEwi50aWDoeWUAxX_xzgGHbbkF_IQk8gLegQIHhAB&ictx=1&biw=393&bih=773&dpr=3#ebo=1" },
  { id: 602, category: "wellness", name: "SOS Medika Klinik Bali", description: "Local clinic in Sanur Kaja, open 8am–10pm daily. General practitioners, nurses, dental, X-ray and lab.", contact: "WA: +62 812-3805-452", tags: ["clinic", "GP", "dental", "sanur"], amyNote: "", reviewUrl: "https://www.google.com/search?q=sos+medika+klinik-+bali+reviews" },
  { id: 701, category: "wellness", name: "Tanah House Collective", description: "Jaz Norton owns this gem — it's Bali's non-tox salon in Sanur and we absolutely love it. Go for the scalp treatments (genuinely life-changing) and they're brilliant for cut and colour too. Low-tox products, beautiful space, proper expertise.", contact: "WA: +62 812-2714-2612 · tanahhouse.com", tags: ["hair", "salon", "scalp", "non-tox"], amyNote: "", reviewUrl: "https://www.google.com/search?q=tanah+house+collective+denpasar+city+reviews" },
  { id: 501, category: "food", name: "Island Organics Bali", description: "Farm-direct organic fruit and veg boxes delivered to Sanur. Subscribe weekly or order one-off. Real quality produce straight from their farm.", contact: "WA: +62 812-3787-6584 · islandorganicsbali.com", tags: ["organic", "delivery", "vegetables", "fruit"], amyNote: "We've been ordering every Sunday for months. Quality is consistently amazing.", reviewUrl: "https://www.google.com/search?sca_esv=70b9ad83839e321e&rlz=1CDGOYI_enGB1083GB1083&hl=en-GB&sxsrf=ANbL-n7E8z8DhL4sGODS5qgZIHMgRuaU6Q:1780290080431&q=island+organics+bali+reviews&uds=ALYpb_nUvCfqk-IzRnoBS6o90ZrK--GgpHxr7AdehMODs3BS759Kbdf-r49_zn4RvX_GncS-iClxRGFrXUHieAf5IhNgqWwz7opmqGIBm7Yuri9kWR-lPMW2gc_JpTZz-TUBBIQUso-HPqaPBvaUA1P1_W0ifBDSLE4lLaszDj5SyW99pBVRwV_1aEuAXDEhJcfsJ8CGTiM1Kx2oavFLW0mhI20lRRs8V45ZkzTdRiugBdapo0-_Z5540qzjnygLvKZApcaWAtGRnK_xYxKJt26e0wmMCOgljS7x-RcHRbL_p7p7rg-icZUYUMS9PmO5lVqiGeu-yxT6RlgOk9k4JC9YtMH0crm6thk_u2L5nDNy9E8vYm7B73icwHv5NsvkPGMWUj9zrG7R&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOX-XR88sPzrK5z3BgaOtRLFNFEUscTmHDCdJdvZ1DyKATim2X4pt5aNzW_ue0tK2u6Rw2V1O4tHznTFA3iDaWzcn06du4jRMEDVoviAVb1Df0i7CdA%3D%3D&sa=X&ved=2ahUKEwibmt2uoeWUAxW0xTgGHawTNkAQk8gLegQIGRAB&ictx=1&biw=393&bih=773&dpr=3#ebo=2" },
  { id: 502, category: "food", name: "LEKKER Biltong in Bali", description: "South African biltong and droëwors made in Bali. Perfect if you're missing a taste of home or just want a great high-protein snack.", contact: "WA: +62 878-6485-8887", tags: ["biltong", "south-african", "snacks", "delivery"], amyNote: "The best boerewors we have had in ages and the biltong and droewors are delicious", reviewUrl: "" },
  { id: 503, category: "food", name: "Hunters Bali – Meat Delivery", description: "Quality meat delivered to your door in Sanur. Order by 11am for delivery between 3–5pm the same day.", contact: "WA: +62 811-3889-819", tags: ["meat", "delivery", "butcher"], amyNote: "Great quality meat delivered to your home.", reviewUrl: "https://www.google.com/search?sca_esv=70b9ad83839e321e&rlz=1CDGOYI_enGB1083GB1083&hl=en-GB&sxsrf=ANbL-n63WPbOEMw6eFy-JvZ8cX55g1kT0Q:1780290221709&q=hunters+bali+reviews&uds=ALYpb_kf096hFp8bCHkGpSCKDa2jDDcQr9te9Au0n9P3Tqe7o-YU8NX-lZ7m67ROj8cxmoDlEWoACl2KoqrscxgGotE70i-poywRva-1uZHxUgE31VYdEMqUVSuVE2-5zh9NPCnwS8ImSPhk9YcYFaZfnohDr2DnB_Thw5I0WI9JHgUFZouxbl2OW_O3WcdFSSlU9d_8yF-1Ffgs4bZFScxg7oUXGJQ0uk4Y30E3UavawGdNkt2fCADjLgJcRgjW2IHAw2qCXwTBml_31fELD5sHh-AFb6VwLK-bidCAN7VaGcLCbFj2XQFoEVUS20InLuqfpdKnBSNcifGzKb7nGu0G1yw2Z3eRHH0do_TZnC2N3sfy3FNwQaxk08eklSMDGWNgUBAn-WVK8u9HE8k7pGaL800YxzkTqkLnef2AuhJ7dQjyKvqXRXlC4AJSgQXmeCOkvWtLQrrqf6w8c9VMD4jFeAf0S8BNCZtkJB4nOgM9T6DHSFXzsd2CR88TjZ-FtYvql-WLc31HR6GCXHMc9uNKH60N3-B1MA&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOcYxKL9sUnayo_e0w_pk6TLrLr39F6t82i_InIpRms89XM55v965s5c_FLHDMrn9UkWRMA3gb9cDrpleV5bjbRZ4CA5T&sa=X&ved=2ahUKEwi2gYzyoeWUAxVq1TgGHfjqIXYQk8gLegQIGBAB&ictx=1&biw=393&bih=773&dpr=3#ebo=1" },
  { id: 401, category: "food", name: "Custom Helmet 69", description: "Custom and standard helmets made to order. Great for getting the kids (and yourself) properly kitted out on the bike.", contact: "WA: +62 821-4456-9409", tags: ["helmets", "custom", "motorbike"], amyNote: "Our son adores his custom helmet with sparkles and stickers. Measured to fit his head.", reviewUrl: "https://www.google.com/search?q=custom+helmet+69+reviews&rlz=1CDGOYI_enGB1083GB1083&oq=custom&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIGCAEQRRg7MgYIAhBFGDkyBggDEEUYQTIGCAQQRRhBMgwIBRAjGCcYgAQYigUyDAgGEAAYQxiABBiKBTIPCAcQABhDGLEDGIAEGIoFMg8ICBAAGEMYsQMYgAQYigUyCggJEAAYsQMYgATSAQgyNTAyajBqOagCE7ACAeIDBBgBIF_xBRH7loGdRqX_8QUR-5aBnUal_w&hl=en-GB&sourceid=chrome-mobile&ie=UTF-8#ebo=4" },
  { id: 301, category: "learning", name: "Ensiklomusika Music School Bali", description: "Music school in Sanur offering piano, guitar, drum, violin, vocal and toddler classes. Also has branches in Berawa and Jimbaran.", contact: "WA: +62 878-8819-9069", tags: ["music", "kids", "lessons", "sanur"], amyNote: "", reviewUrl: "https://www.google.com/search?sca_esv=70b9ad83839e321e&rlz=1CDGOYI_enGB1083GB1083&hl=en-GB&sxsrf=ANbL-n6f4S2lsZ8hhxgWLIMZIDZTL1WEyg:1780290350084&q=ensiklomusika+music+school+sanur+sanur+kaja+reviews&uds=ALYpb_k3DmbEexfMeHiXNxzbxZNmBVMRgF2jARHD28k7wZwiWcWHtLFLtsVm53cmkXuuUpHCWaE21PSbAi7BXggx5aRCHy6XLhbW8Qq0s1BbxJWw6Xx7osVbCuQgJDog8xdsuN1MuuF8Oa1L43DRKxIGVmOSWgXFvLZwfqCiR3ddxufdQyTcHj5UjanSP_vu6Z3BDxw3e77ZbRLct1tNdRHnl111aO4Toc_TYApYftyOeUcwYRKnrNnSPy79-Lf6b2nQ38WQaQ3kz89c8q7M5Fobaia97bQLUUpzh6IJE27CndyogLey4udTyyjCo85nrnb445IsCWAtIEofC4JqF8PXs2o3a-CfUhOJ6dLVX0a9VR8Z1RlSKQN0CdKr9_Uou6UB8b9c1oAWyxqqLGModogI7yCwSPaj1lj2_Fqb5JLszXBT2ZkiKYK4Xdb7KxPlX2JPuLwi-q_rx8lsq9YpbTKXRcGMo7GsevnzFHf0kLw2pISdHYjOIq7ZSM1ryXj3kboT3-8m0Fh2beQOYyF1Bp6DHGdOo0ZZTChBmFcuj1SBwyL7pKpVPDvuLCpINKbjyly-g6xVPreUzb5nzLgAtajpp-9YdLE51Q&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOYtkkM1S2W_IqNXMXMo1AebdeIbNXS5WDSEZFrqZ70Ym-dxd1ZUrMPFhjAzVFGaMNxToGdUrVioChFin7oMnBSQKdvh1_kYnFcMSIUvZDWCuL3hhi5_X3ZhcLZuSUf81eLkYcXs%3D&sa=X&ved=2ahUKEwjMraevouWUAxXV3TgGHXT9M3IQk8gLegQIHRAB&ictx=1&stq=1&cs=0&lei=LhMdaszeBNW74-EP9PrPkQc#ebo=1" },
  { id: 302, category: "learning", name: "Better Learn Now - Indonesian lessons", description: "Indonesian language lessons, by appointment only. Great for expat families wanting to learn Bahasa.", contact: "WA: +62 811-3891-222", tags: ["Indonesian", "language", "tutor"], amyNote: "", reviewUrl: "https://www.google.com/search?q=better+learn+now+denpasar+city+reviews&rlz=1CDGOYI_enGB1083GB1083&oq=better+lea&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIGCAEQRRg7MgYIAhBFGEEyBggDEEUYOTIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDMxMDBqMGo5qAITsAIB4gMEGAEgX_EFGjFQWcpBdCPxBRoxUFnKQXQj&hl=en-GB&sourceid=chrome-mobile&ie=UTF-8#ebo=1" },
  { id: 901, category: "transport", name: "Moped – School Moped Rental", description: "Reliable moped rental — this is the guy to call when you need a bike for the school run or just getting around Sanur. Good rates, easy to deal with.", contact: "WA: +62 819-9981-1117", tags: ["moped", "scooter", "rental"], amyNote: "", reviewUrl: "https://www.google.com/search?q=family+cell+sanur+bali&rlz=1CDGOYI_enGB1083GB1083&oq=family+cell&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIICAEQRRgnGDsyBggCEEUYOTINCAMQLhivARjHARiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDIyNTJqMGo5qAITsAIB4gMEGAEgX_EFhJhDcOGJLAbxBYSYQ3DhiSwG&hl=en-GB&sourceid=chrome-mobile&ie=UTF-8#smwie=1&sv=CAESzQEKuQEStgEKd0FNbjMteVNfc0RjczVwNEpCRTBtUDhTWjFNN0xtMnM0ZnQ3VFZkLUJvZUJyd1BxOFFkQWs2U1FyYTg1dlh5eGxFWUMtaFYtUkkwNlBaRGh6X0ZqX3dCYWRJMEtUOU1uU2w3cS16TXBZOUZUdEVvNE5XYUMwN00wEhdxeGdkYXJXWExJeU80LUVQdTZDbTJBZxoiQUpLTEZtSjZrU1BUbHItdExxTUlyLTlnZGpDNFpvMjJEQRIEODA1MRoBMyoAMAA4AUAAGAAg6JPyiAxKAhAC" },
  { id: 902, category: "transport", name: "Kai Koa – Fast Boat to Lembongan", description: "The fastest and most premium way to get to Nusa Lembongan from Sanur in only 16 mins! Just 8 passengers per trip so no chaos, and they check in from Asian Pantry at Matahari Terbit Beach. Three departures daily. Great for a day trip or weekend away with the family.", contact: "kaikoaindonesia.com", tags: ["boat", "lembongan", "day-trip"], amyNote: "", reviewUrl: "https://www.google.com/search?q=kai+koa+boat+reviews&rlz=1CDGOYI_enGB1083GB1083&oq=kai+koa&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRg8MgYIAhBFGDwyBggDEEUYPDIVCAQQLhhDGK8BGMcBGLoCGIAEGIoFMgcIBRAAGIAEMgwIBhAAGEMYgAQYigUyBwgHEAAYgAQyBwgIEAAYgAQyBwgJEAAYgATSAQgyNjg2ajBqOagCE7ACAeIDBBgBIF_xBZp7Kr8knhWj8QWaeyq_JJ4Vow&hl=en-GB&sourceid=chrome-mobile&ie=UTF-8#ebo=1" },
  { id: 801, category: "work", name: "Livit Hub", description: "The coworking space in Sanur with 4 floors inside a converted building, 5 mins walk to the beach. Reliable fast internet, rooftop with hammocks, and a café downstairs. They also help with company setup and employer of record if you need it.", contact: "IG: @livit.hub • +62 811-3971-628", tags: ["coworking", "wifi", "community", "rooftop"], amyNote: "", reviewUrl: "https://www.google.com/search?q=livit+hub+-+coworking+space+denpasar+city+reviews&rlz=1CDGOYI_enGB1083GB1083&oq=livit+hub&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIJCAEQRRg7GKABMhAIAhAuGK8BGMcBGLoCGIAEMggIAxAAGBYYHjIICAQQABgWGB4yDQgFEAAYhgMYgAQYigUyBwgGECEYoAEyCggHEAAYgAQYogQyBwgIEAAY7wUyBwgJECEYjwLSAQg4MDcxajBqOagCE7ACAeIDBBgBIF_xBU830GcAFV_l8QVPN9BnABVf5Q&hl=en-GB&sourceid=chrome-mobile&ie=UTF-8#ebo=1" },
  { id: 802, category: "work", name: "FLOW Workspace", description: "Coworking space right in the heart of Sanur on Jl. Danau Poso. Open 24/7, with private offices, quiet zones, phone booths, standing desks and a wellness area. Day passes available if you just need somewhere decent to work for the day.", contact: "WA: +62 823-4098-9176 · flowworkspacebali.com · Jl. Danau Poso No.66, Sanur", tags: ["coworking", "24/7", "private-office", "wifi"], amyNote: "", reviewUrl: "https://www.google.com/search?q=flow+workspace+reviews&rlz=1CDGOYI_enGB1083GB1083&oq=flow&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIICAEQRRgnGDsyBggCEEUYOzIGCAMQRRg5MhIIBBAuGEMYrwEYxwEYgAQYigUyBggFEEUYPDIGCAYQRRg8Mg0IBxAAGJIDGIAEGIoFMg0ICBAAGJIDGIAEGIoFMg8ICRAAGEMYyQMYgAQYigXSAQg3MzQ3ajBqOagCE7ACAeIDBBgBIF_xBZKSkpqN1sUw8QWSkpKajdbFMPEFK6kihZnlKWTxBSupIoWZ5Slk8QUrqSKFmeUpZA&hl=en-GB&sourceid=chrome-mobile&ie=UTF-8#ebo=1" },
];

const tagPalette = [
  { bg: "#e8efe4", text: "#404E3B" },
  { bg: "#dde8e5", text: "#3a5a55" },
  { bg: "#edf2eb", text: "#5a7050" },
  { bg: "#d8e4d4", text: "#404E3B" },
];
function tagColor(tag) {
  let h = 0; for (const c of tag) h += c.charCodeAt(0);
  return tagPalette[h % tagPalette.length];
}

// ── Smart contact parser ──────────────────────────────────────
function parseContacts(contactStr) {
  const parts = contactStr.split(/\s*[·•|]\s*|\s+or\s+/);
  return parts.map(part => {
    const p = part.trim();
    // WhatsApp / phone number
    const waMatch = p.match(/WA:\s*([\+\d\-\s]+)/i) || p.match(/^(\+62[\d\-\s]+)$/);
    if (waMatch) {
      const num = waMatch[1].replace(/[\s\-]/g, "");
      return { label: p.startsWith("WA:") ? p : `WA: ${p}`, href: `https://wa.me/${num.replace("+","")}`, icon: "💬" };
    }
    // Email
    if (p.includes("@") && !p.includes("IG:") && !p.includes("instagram")) {
      return { label: p, href: `mailto:${p}`, icon: "✉️" };
    }
    // Instagram
    const igMatch = p.match(/IG:\s*(@[\w.]+)/i);
    if (igMatch) {
      return { label: p, href: `https://instagram.com/${igMatch[1].replace("@","")}`, icon: "📸" };
    }
    // Website
    if (p.match(/\.(com|id|app|co|net|org)/i) && !p.includes(" ")) {
      const url = p.startsWith("http") ? p : `https://${p}`;
      return { label: p, href: url, icon: "🌐" };
    }
    // Phone (call)
    const phoneMatch = p.match(/\+62[\s\d\-]+/);
    if (phoneMatch) {
      const num = phoneMatch[0].replace(/[\s\-]/g, "");
      return { label: p, href: `tel:${num}`, icon: "📞" };
    }
    // Address or other — no link
    return { label: p, href: null, icon: "📍" };
  }).filter(x => x.label);
}

function ContactChips({ contact }) {
  const items = parseContacts(contact);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
      {items.map((item, i) => (
        item.href ? (
          <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 8, background: C.cream, borderRadius: 10, padding: "10px 12px", fontSize: "0.85rem", color: C.forest, textDecoration: "none", fontWeight: 500, border: `1px solid #d8e0d2` }}>
            <span>{item.icon}</span><span>{item.label}</span>
            <span style={{ marginLeft: "auto", color: C.textSoft, fontSize: "0.75rem" }}>tap to open →</span>
          </a>
        ) : (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: C.cream, borderRadius: 10, padding: "10px 12px", fontSize: "0.85rem", color: C.text }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </div>
        )
      ))}
    </div>
  );
}

function Card({ rec, onEdit, onDelete, isAdmin }) {
  const [open, setOpen] = useState(false);
  const cat = categories.find(c => c.id === rec.category);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: C.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 14px rgba(64,78,59,0.09)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", border: `2px solid ${C.forest}` }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${C.sage}, ${C.mint})` }} />
      <div style={{ padding: "18px 18px 16px" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: C.steel, marginBottom: 6, fontWeight: 600 }}>
          <span style={{ fontSize: 15 }}>{cat?.emoji}</span> {cat?.label}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.forest, margin: 0, lineHeight: 1.2 }}>{rec.name}</h3>
          <span style={{ color: C.sage, fontSize: "1.4rem", lineHeight: 1, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 2 }}>+</span>
        </div>
        <p style={{ color: C.textMid, fontSize: "0.88rem", marginTop: 8, lineHeight: 1.6, marginBottom: 0 }}>{rec.description}</p>
        {open && (
          <div style={{ marginTop: 14 }}>
            <ContactChips contact={rec.contact} />
            {rec.amyNote && (
              <div style={{ background: "#edf2eb", borderLeft: `3px solid ${C.sage}`, borderRadius: "0 10px 10px 0", padding: "10px 12px", marginTop: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.steel, fontWeight: 700, marginBottom: 4 }}>🙋 Community note</div>
                <p style={{ color: C.textMid, fontSize: "0.85rem", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>{rec.amyNote}</p>
              </div>
            )}
            {rec.reviewUrl && (
              <a href={rec.reviewUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "#edf2eb", borderRadius: 10, padding: "10px 12px", fontSize: "0.85rem", color: C.forest, textDecoration: "none", fontWeight: 600, border: `1px solid #c8ddc2`, marginTop: 8 }}>
                <span>⭐</span><span>See reviews</span>
                <span style={{ marginLeft: "auto", color: C.textSoft, fontSize: "0.75rem" }}>tap to open →</span>
              </a>
            )}
            {rec.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {rec.tags.map(t => { const tc = tagColor(t); return <span key={t} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 50, background: tc.bg, color: tc.text, fontWeight: 600 }}>{t}</span>; })}
              </div>
            )}
            {isAdmin && (
              <div style={{ display: "flex", gap: 8, marginTop: 14 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => onEdit(rec)} style={btnSm(C.sage)}>✏️ Edit</button>
                <button onClick={() => onDelete(rec.id)} style={btnSm("#c0392b")}>🗑 Delete</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const btnSm = (bg) => ({ padding: "6px 14px", borderRadius: 8, border: "none", background: bg, color: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" });
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid #d0d9cb`, fontSize: "0.9rem", color: C.text, background: C.cream, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" };

function Modal({ rec, onSave, onClose }) {
  const blank = { id: Date.now(), category: "tradies", name: "", description: "", contact: "", tags: [], amyNote: "", reviewUrl: "" };
  const [form, setForm] = useState(rec || blank);
  const [tagInput, setTagInput] = useState((rec?.tags || []).join(", "));
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function save() {
    if (!form.name.trim()) return;
    onSave({ ...form, tags: tagInput.split(",").map(t => t.trim()).filter(Boolean) });
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(40,55,35,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 18, padding: 24, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", fontFamily: "'DM Sans', sans-serif" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.forest, fontSize: "1.35rem", fontWeight: 700, margin: "0 0 20px" }}>{rec ? "Edit Recommendation" : "Add Recommendation"}</h2>
        {[
          { label: "Name *",                       key: "name",        placeholder: "e.g. Wayan Fix-It" },
          { label: "Description",                  key: "description", placeholder: "What they do, why you love them…" },
          { label: "Contact / Location",           key: "contact",     placeholder: "WA number, IG handle, address…" },
          { label: "🙋 Community note (optional)", key: "amyNote",     placeholder: "Why do you recommend this?" },
          { label: "⭐ Reviews link (optional)",   key: "reviewUrl",   placeholder: "Google Maps or TripAdvisor URL" },
          { label: "Tags (comma separated)",       key: "_tags",       placeholder: "e.g. plumbing, AC, reliable" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: C.steel, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</label>
            {f.key === "_tags" ? <input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder={f.placeholder} style={inputStyle} />
              : f.key === "description" || f.key === "amyNote" ? <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              : <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={inputStyle} />}
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: C.steel, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</label>
          <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
            {categories.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={save} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: C.forest, color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>{rec ? "Save Changes" : "Add Recommendation"}</button>
          <button onClick={onClose} style={{ padding: "12px 18px", borderRadius: 10, border: `1.5px solid ${C.mist}`, background: "transparent", color: C.textMid, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin, onClose }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  function attempt() { if (pw === ADMIN_PASSWORD) onLogin(); else { setErr(true); setPw(""); } }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(40,55,35,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 18, padding: 28, width: "100%", maxWidth: 340, fontFamily: "'DM Sans', sans-serif" }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.forest, fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px" }}>Admin Access</h2>
        <p style={{ color: C.textSoft, fontSize: "0.85rem", margin: "0 0 20px" }}>Enter your password to add or edit recommendations.</p>
        <input type="password" value={pw} placeholder="Password" onChange={e => { setPw(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && attempt()} style={{ ...inputStyle, marginBottom: err ? 6 : 16 }} />
        {err && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginBottom: 12 }}>Incorrect password — try again.</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={attempt} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: C.forest, color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>Enter</button>
          <button onClick={onClose} style={{ padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.mist}`, background: "transparent", color: C.textMid, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Lead Gen ──────────────────────────────────────────────────
function LeadGen() {
  const [mode, setMode] = useState("request"); // "request" | "recommend"
  const [name, setName] = useState("");
  const [need, setNeed] = useState("");
  const [wa, setWa] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    if (!name.trim() || !need.trim() || !wa.trim()) return;
    const msg = mode === "request"
      ? encodeURIComponent(`Hi! My name is ${name} and I'm looking for:\n\n${need}\n\nMy WhatsApp: ${wa}\n\n(Sent via Sanur Parents' Directory)`)
      : encodeURIComponent(`Hi! My name is ${name} and I'd like to recommend:\n\n${need}\n\nMy WhatsApp: ${wa}\n\n(Sent via Sanur Parents' Directory)`);
    window.open(`https://wa.me/6282221617634?text=${msg}`, "_blank");
    setSent(true);
  }

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid #d0d9cb`, fontSize: "0.9rem", color: C.text, background: C.cream, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" };
  const labelStyle = { fontSize: "0.75rem", fontWeight: 600, color: C.steel, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" };

  return (
    <div style={{ margin: "0 16px 32px", background: C.white, borderRadius: 16, padding: "24px 20px", border: `1.5px solid #d8e0d2`, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Toggle */}
      <div style={{ display: "flex", background: C.cream, borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
        {[["request","🔍 Request something"],["recommend","⭐ Recommend a place"]].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSent(false); setNeed(""); }}
            style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: "none", background: mode === m ? C.forest : "transparent", color: mode === m ? C.white : C.textMid, fontSize: "0.8rem", fontWeight: mode === m ? 700 : 400, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: C.forest, margin: "0 0 4px" }}>
        {mode === "request" ? "Can't find what you're looking for?" : "Know a great place?"}
      </h3>
      <p style={{ fontSize: "0.85rem", color: C.textMid, margin: "0 0 16px", lineHeight: 1.5 }}>
        {mode === "request"
          ? "Send us a note and we'll ask around and get back to you."
          : "Share it with us and we'll add it to the directory."}
      </p>

      {sent ? (
        <div style={{ background: "#edf2eb", borderRadius: 10, padding: "12px 16px", fontSize: "0.88rem", color: C.forest, fontWeight: 600 }}>
          ✅ Thanks {name}! We'll be in touch on WhatsApp.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={labelStyle}>Your name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="First name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{mode === "request" ? "What do you need?" : "What would you like to recommend?"}</label>
            <textarea value={need} onChange={e => setNeed(e.target.value)}
              placeholder={mode === "request" ? "e.g. A good dentist, kids' yoga class, dog groomer…" : "e.g. Amazing Thai restaurant on Jl. Tamblingan, super reliable electrician…"}
              rows={2} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div>
            <label style={labelStyle}>Your WhatsApp number</label>
            <input value={wa} onChange={e => setWa(e.target.value)} placeholder="+62 or +44…" style={inputStyle} />
          </div>
          <button onClick={submit} style={{ padding: "12px", borderRadius: 10, border: "none", background: C.forest, color: C.white, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
            Send via WhatsApp →
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [recs, setRecs] = useState(defaultRecs);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [editRec, setEditRec] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        // Only use stored data if it has entries; otherwise use defaults
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecs(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  function saveRecs(r) { setRecs(r); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(r)); } catch {} }
  function handleSave(rec) {
    const exists = recs.find(r => r.id === rec.id);
    saveRecs(exists ? recs.map(r => r.id === rec.id ? rec : r) : [...recs, { ...rec, id: Date.now() }]);
    setEditRec(null);
  }
  function handleDelete(id) { if (window.confirm("Remove this recommendation?")) saveRecs(recs.filter(r => r.id !== id)); }

  const filtered = useMemo(() => recs.filter(r => {
    const matchCat = activeCat === "all" || r.category === activeCat;
    const q = search.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q)));
  }), [recs, search, activeCat]);

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Hero */}
      <div style={{ background: C.sage, padding: "52px 24px 44px", textAlign: "center", position: "relative" }}>
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: 10, fontWeight: 600 }}>Sanur · Bali</div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.white, fontSize: "clamp(2rem, 7vw, 3rem)", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>Sanur Parents'<br/>Directory</h1>
        <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9rem", margin: "0 auto 28px", lineHeight: 1.6, maxWidth: 340 }}>Tried & tested recommendations for life in Sanur</p>
        <div style={{ position: "relative", maxWidth: 440, margin: "0 auto" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: 0.4, fontSize: "0.95rem" }}>🔍</span>
          <input type="text" placeholder="Search by name, service or tag…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "13px 14px 13px 40px", borderRadius: 12, border: "none", fontSize: "0.9rem", background: "rgba(255,255,255,0.95)", color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 3px 16px rgba(0,0,0,0.2)" }} />
        </div>
      </div>

      {isAdmin && (
        <div style={{ background: C.forest, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: C.white, fontSize: "0.85rem", fontWeight: 500 }}>✏️ Admin mode — add, edit & delete recommendations</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => {
              const data = JSON.stringify(recs, null, 2);
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "sanur-recs.json"; a.click();
              URL.revokeObjectURL(url);
            }} style={{ background: C.steel, color: C.white, border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>⬇️ Export</button>
            <button onClick={() => setEditRec(false)} style={{ background: C.sage, color: C.white, border: "none", borderRadius: 8, padding: "7px 16px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Space Grotesk', sans-serif" }}>+ Add New</button>
          </div>
        </div>
      )}

      {/* Category pills — sticky */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.cream, paddingTop: 12, paddingBottom: 8, boxShadow: "0 2px 8px rgba(64,78,59,0.07)" }}>
        <div style={{ position: "relative" }}>
          <div style={{ padding: "0 16px", overflowX: "auto", display: "flex", gap: 8, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(activeCat === cat.id && cat.id !== "all" ? "all" : cat.id)} style={{ whiteSpace: "nowrap", padding: "8px 16px", borderRadius: 50, border: activeCat === cat.id ? `2px solid ${C.forest}` : `1.5px solid #d0d9cb`, background: activeCat === cat.id ? C.forest : C.white, color: activeCat === cat.id ? C.white : C.textMid, fontSize: "0.82rem", fontWeight: activeCat === cat.id ? 700 : 400, cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
            <div style={{ minWidth: 32, flexShrink: 0 }} />
          </div>
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 48, background: `linear-gradient(to right, transparent, ${C.cream})`, pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ padding: "14px 20px 4px", color: C.textSoft, fontSize: "0.78rem" }}>
        {filtered.length} recommendation{filtered.length !== 1 ? "s" : ""}{search && ` for "${search}"`}
      </div>

      <div style={{ padding: "8px 16px 64px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, maxWidth: 920, margin: "0 auto" }}>
        {filtered.length > 0 ? filtered.map(rec => (
          <Card key={rec.id} rec={rec} isAdmin={isAdmin} onEdit={r => setEditRec(r)} onDelete={handleDelete} />
        )) : (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 20px", color: C.textSoft }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🌿</div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", color: C.forest, fontWeight: 700 }}>No results found</p>
            <p style={{ fontSize: "0.85rem", marginTop: 6 }}>Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Lead gen — end of list */}
      <LeadGen />

      {/* About */}
      <div style={{ margin: "0 16px 32px", background: C.white, borderRadius: 16, padding: "24px 20px", border: `1.5px solid #d8e0d2`, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <img src="https://raw.githubusercontent.com/amiimead/amy-mead-portfolio/main/IMG_6221.jpeg" alt="Amy" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", flexShrink: 0, border: `2px solid ${C.mint}` }} />
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1rem", color: C.forest }}>Hi, I'm Amy 👋</div>
            <div style={{ fontSize: "0.78rem", color: C.textSoft, marginTop: 2 }}>Bali expat · mum · rec-giver</div>
          </div>
        </div>
        <p style={{ fontSize: "0.875rem", color: C.textMid, lineHeight: 1.65, margin: 0 }}>
          When we moved to Bali, a friend's recommendations made those first overwhelming weeks so much easier. Over time we built our own list of the places we actually use, and kept sharing it with every new arrival who asked. This site is that list, made permanent. Whether you just landed or are still finding your feet, I hope it helps.
        </p>
      </div>

      <div style={{ borderTop: `1px solid #d8e0d2`, padding: "20px", textAlign: "center", color: C.textSoft, fontSize: "0.76rem", background: C.white }}>
        Tap any card to see details
        <br/>
        {isAdmin
          ? <span onClick={() => setIsAdmin(false)} style={{ cursor: "pointer", color: C.textSoft, marginTop: 8, display: "inline-block", textDecoration: "underline" }}>Exit admin mode</span>
          : <span onClick={() => setShowLogin(true)} style={{ cursor: "pointer", color: "#d8e0d2", marginTop: 8, display: "inline-block", padding: "8px 16px" }}>· · ·</span>
        }
      </div>

      {showLogin && <AdminLogin onLogin={() => { setIsAdmin(true); setShowLogin(false); }} onClose={() => setShowLogin(false)} />}
      {editRec !== null && <Modal rec={editRec || null} onSave={handleSave} onClose={() => setEditRec(null)} />}
    </div>
  );
}
