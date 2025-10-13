// ramenData.js
// Mock catalog for a "Build-Your-Own Ramen" personalizer.
// ESM module; switch to module.exports if you need CommonJS.

export const ramenData = {
  optionGroups: [
    { id: "size", name: "Size", selection: "single", required: true },
    { id: "broth", name: "Broth", selection: "single", required: true },
    { id: "noodles", name: "Noodles", selection: "single", required: true },
    { id: "proteins", name: "Proteins", selection: "multiple", min: 0, max: 3 },
    { id: "toppings", name: "Toppings", selection: "multiple", min: 0, max: 10 },
    { id: "heat", name: "Heat Level", selection: "single", required: false },
    { id: "extras", name: "Extras", selection: "multiple", min: 0, max: 5 }
  ],

  sizes: [
    { id: "size_sm", name: "Small (12 oz)", basePrice: 1099, volumeOz: 12 },
    { id: "size_md", name: "Regular (16 oz)", basePrice: 1299, volumeOz: 16 },
    { id: "size_lg", name: "Large (20 oz)", basePrice: 1499, volumeOz: 20 }
  ],

  broths: [
    {
      id: "broth_tonkotsu",
      name: "Tonkotsu",
      description: "Pork marrow, rich & creamy.",
      priceDelta: 150,
      tags: ["pork"],
      allergens: ["soy", "gluten"]
    },
    {
      id: "broth_shoyu",
      name: "Shoyu",
      description: "Clear soy sauce chicken/pork blend.",
      priceDelta: 0,
      tags: ["soy"],
      allergens: ["soy", "gluten"]
    },
    {
      id: "broth_shio",
      name: "Shio",
      description: "Light salt broth, clean finish.",
      priceDelta: 0,
      tags: [],
      allergens: []
    },
    {
      id: "broth_miso",
      name: "Miso",
      description: "Toasted miso depth, savory body.",
      priceDelta: 100,
      tags: ["soy"],
      allergens: ["soy"]
    },
    {
      id: "broth_spicy_miso",
      name: "Spicy Miso",
      description: "Miso base with chili & garlic.",
      priceDelta: 150,
      defaultHeat: "heat_med",
      tags: ["soy", "spicy"],
      allergens: ["soy"]
    },
    {
      id: "broth_tantanmen",
      name: "Tantanmen (Sesame Chili)",
      description: "Creamy sesame with Sichuan chili.",
      priceDelta: 200,
      defaultHeat: "heat_hot",
      tags: ["sesame", "spicy"],
      allergens: ["sesame", "soy"]
    },
    {
      id: "broth_vegan_miso",
      name: "Vegan Miso",
      description: "Kombu & shiitake umami, no animal products.",
      priceDelta: 100,
      tags: ["vegan", "soy"],
      allergens: ["soy"]
    }
  ],

  noodles: [
    {
      id: "noodle_hakata",
      name: "Extra-Thin Straight (Hakata)",
      priceDelta: 0,
      tags: ["wheat"],
      allergens: ["gluten"],
      donenessOptions: ["firm", "regular", "soft"]
    },
    {
      id: "noodle_tokyo",
      name: "Medium Curly (Tokyo)",
      priceDelta: 50,
      tags: ["wheat"],
      allergens: ["gluten"],
      donenessOptions: ["firm", "regular", "soft"]
    },
    {
      id: "noodle_sapporo",
      name: "Medium-Thick Wavy (Sapporo)",
      priceDelta: 75,
      tags: ["wheat"],
      allergens: ["gluten"],
      donenessOptions: ["firm", "regular", "soft"]
    },
    {
      id: "noodle_udon",
      name: "Udon Thick",
      priceDelta: 100,
      tags: ["wheat"],
      allergens: ["gluten"],
      donenessOptions: ["regular", "soft"]
    },
    {
      id: "noodle_rice",
      name: "Gluten-Free Rice Noodles",
      priceDelta: 125,
      tags: ["gluten-free"],
      allergens: [],
      donenessOptions: ["regular"]
    }
  ],

  proteins: [
    {
      id: "prot_chashu_pork",
      name: "Chashu Pork (2 slices)",
      priceDelta: 250,
      qty: 2,
      allergens: []
    },
    {
      id: "prot_chicken_thigh",
      name: "Soy-Glazed Chicken",
      priceDelta: 225,
      allergens: ["soy"]
    },
    {
      id: "prot_tofu",
      name: "Crispy Tofu",
      priceDelta: 175,
      tags: ["vegan"],
      allergens: ["soy"]
    },
    {
      id: "prot_ajitama",
      name: "Marinated Soft-Boiled Egg",
      priceDelta: 150,
      allergens: ["egg", "soy"]
    },
    {
      id: "prot_shrimp",
      name: "Shrimp",
      priceDelta: 275,
      allergens: ["shellfish"]
    },
    {
      id: "prot_extra_chashu",
      name: "Extra Chashu Pork (+2)",
      priceDelta: 250,
      qty: 2,
      allergens: []
    }
  ],

  toppings: [
    { id: "top_nori", name: "Nori Sheet", priceDelta: 75, allergens: [] },
    { id: "top_menma", name: "Menma (Bamboo Shoots)", priceDelta: 100, allergens: [] },
    { id: "top_kikurage", name: "Wood Ear Mushroom", priceDelta: 100, allergens: [] },
    { id: "top_corn", name: "Sweet Corn", priceDelta: 75, allergens: [] },
    { id: "top_scallion", name: "Scallions", priceDelta: 50, allergens: [] },
    { id: "top_bean_sprout", name: "Bean Sprouts", priceDelta: 50, allergens: [] },
    { id: "top_spinach", name: "Blanched Spinach", priceDelta: 75, allergens: [] },
    { id: "top_naruto", name: "Narutomaki (Fish Cake)", priceDelta: 100, allergens: ["fish"] },
    { id: "top_butter", name: "Butter Pat", priceDelta: 75, allergens: ["dairy"] },
    { id: "top_sesame", name: "Toasted Sesame", priceDelta: 50, allergens: ["sesame"] },
    { id: "top_garlic_chip", name: "Crispy Garlic Chips", priceDelta: 75, allergens: [] },
    { id: "top_black_garlic_oil", name: "Black Garlic Oil (Mayu)", priceDelta: 100, allergens: [] },
    { id: "top_chili_oil", name: "Chili Oil Drizzle", priceDelta: 50, tags: ["spicy"], allergens: [] }
  ],

  heatLevels: [
    { id: "heat_none", name: "No Heat", scovilleHint: 0 },
    { id: "heat_mild", name: "Mild", scovilleHint: 1000 },
    { id: "heat_med", name: "Medium", scovilleHint: 3000 },
    { id: "heat_hot", name: "Hot", scovilleHint: 8000 },
    { id: "heat_nuclear", name: "Nuclear", scovilleHint: 20000 }
  ],

  // A few curated presets to showcase full builds (IDs reference entries above).
  presetBowls: [
    {
      id: "preset_classic_tonkotsu",
      name: "Classic Tonkotsu",
      thumbnail: "/img/presets/tonkotsu.jpg",
      selections: {
        size: "size_md",
        broth: "broth_tonkotsu",
        noodles: { id: "noodle_hakata", doneness: "firm" },
        proteins: ["prot_chashu_pork", "prot_ajitama"],
        toppings: ["top_nori", "top_menma", "top_scallion", "top_black_garlic_oil"],
        heat: "heat_mild"
      }
    },
    {
      id: "preset_spicy_tan",
      name: "Spicy Tantanmen",
      thumbnail: "/img/presets/tantan.jpg",
      selections: {
        size: "size_md",
        broth: "broth_tantanmen",
        noodles: { id: "noodle_sapporo", doneness: "regular" },
        proteins: ["prot_chicken_thigh"],
        toppings: ["top_kikurage", "top_sesame", "top_chili_oil", "top_scallion"],
        heat: "heat_hot"
      }
    },
    {
      id: "preset_vegan_miso",
      name: "Vegan Miso Comfort",
      thumbnail: "/img/presets/vegan-miso.jpg",
      selections: {
        size: "size_lg",
        broth: "broth_vegan_miso",
        noodles: { id: "noodle_rice", doneness: "regular" },
        proteins: ["prot_tofu"],
        toppings: ["top_spinach", "top_corn", "top_garlic_chip", "top_scallion", "top_sesame"],
        heat: "heat_med"
      }
    }
  ]
};

// Convenience named exports (optional)
export const {
  optionGroups,
  sizes,
  broths,
  noodles,
  proteins,
  toppings,
  heatLevels,
  presetBowls
} = ramenData;

export default ramenData;
