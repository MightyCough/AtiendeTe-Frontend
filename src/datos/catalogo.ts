import type { Idioma, MenuRespuesta } from '../tipos'

interface Texto {
  es: string
  en: string
}

interface AdicionalFuente {
  id: number
  precioExtra: number
  nombre: Texto
}

interface IngredienteFuente {
  id: number
  nombre: Texto
}

interface ProductoFuente {
  id: number
  precio: number
  imagenUrl: string | null
  disponible: boolean
  nombre: Texto
  descripcion: Texto
  adicionales: AdicionalFuente[]
  ingredientesRemovibles: IngredienteFuente[]
}

interface CategoriaFuente {
  id: number
  nombre: Texto
  productos: ProductoFuente[]
}

const huevo: AdicionalFuente = { id: 101, precioExtra: 3, nombre: { es: 'Huevo frito', en: 'Fried egg' } }
const papas: AdicionalFuente = { id: 103, precioExtra: 5, nombre: { es: 'Porción de papas', en: 'Extra fries' } }
const arroz: AdicionalFuente = { id: 104, precioExtra: 4, nombre: { es: 'Arroz extra', en: 'Extra rice' } }
const ajiExtra: AdicionalFuente = { id: 105, precioExtra: 1.5, nombre: { es: 'Ají extra', en: 'Extra chili' } }
const palta: AdicionalFuente = { id: 106, precioExtra: 4, nombre: { es: 'Palta extra', en: 'Extra avocado' } }
const yuca: AdicionalFuente = { id: 107, precioExtra: 5, nombre: { es: 'Yuca extra', en: 'Extra yuca' } }
const salsa: AdicionalFuente = { id: 108, precioExtra: 2.5, nombre: { es: 'Salsa criolla extra', en: 'Extra salsa' } }
const carne: AdicionalFuente = { id: 109, precioExtra: 6, nombre: { es: 'Carne extra', en: 'Extra beef' } }
const porcion: AdicionalFuente = { id: 110, precioExtra: 8, nombre: { es: 'Porción extra', en: 'Extra portion' } }
const shot: AdicionalFuente = { id: 111, precioExtra: 2.5, nombre: { es: 'Shot de café', en: 'Extra shot' } }
const leche: AdicionalFuente = { id: 112, precioExtra: 1.5, nombre: { es: 'Leche', en: 'Milk' } }
const miel: AdicionalFuente = { id: 113, precioExtra: 2, nombre: { es: 'Miel extra', en: 'Extra syrup' } }
const fruta: AdicionalFuente = { id: 114, precioExtra: 3, nombre: { es: 'Fruta extra', en: 'Extra fruit' } }

const cebolla: IngredienteFuente = { id: 201, nombre: { es: 'Cebolla', en: 'Onion' } }
const aji: IngredienteFuente = { id: 202, nombre: { es: 'Ají', en: 'Chili' } }
const cilantro: IngredienteFuente = { id: 203, nombre: { es: 'Cilantro', en: 'Cilantro' } }
const aceituna: IngredienteFuente = { id: 204, nombre: { es: 'Aceituna', en: 'Olive' } }
const tomate: IngredienteFuente = { id: 205, nombre: { es: 'Tomate', en: 'Tomato' } }
const azucar: IngredienteFuente = { id: 206, nombre: { es: 'Azúcar', en: 'Sugar' } }
const limon: IngredienteFuente = { id: 207, nombre: { es: 'Limón', en: 'Lime' } }

/** Carta de demostración, con precios en soles y platos de la sierra. */
export const CATALOGO: CategoriaFuente[] = [
  {
    id: 1,
    nombre: { es: 'Entradas', en: 'Starters' },
    productos: [
      {
        id: 1,
        precio: 14,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Papa a la huancaína', en: 'Huancaína potatoes' },
        descripcion: {
          es: 'Papa amarilla, salsa de ají amarillo y queso fresco, con huevo y aceituna.',
          en: 'Yellow potato, yellow chili and fresh cheese sauce, with egg and olive.',
        },
        adicionales: [huevo, ajiExtra],
        ingredientesRemovibles: [aceituna, aji],
      },
      {
        id: 2,
        precio: 16,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Tequeños de lomo', en: 'Beef tequeños' },
        descripcion: {
          es: 'Rollitos crocantes de lomo y queso, con salsa criolla al costado.',
          en: 'Crisp rolls of beef and cheese, served with salsa criolla.',
        },
        adicionales: [salsa],
        ingredientesRemovibles: [cebolla],
      },
      {
        id: 3,
        precio: 15,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Causa de pollo', en: 'Chicken causa' },
        descripcion: {
          es: 'Causa de papa amarilla rellena de pollo, con palta y un toque de limón.',
          en: 'Yellow potato causa filled with chicken, avocado, and a touch of lime.',
        },
        adicionales: [palta],
        ingredientesRemovibles: [aceituna, limon],
      },
      {
        id: 4,
        precio: 22,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Chicharrón de pota', en: 'Crispy squid' },
        descripcion: {
          es: 'Pota crocante, yuca dorada y salsa criolla.',
          en: 'Crispy squid, fried yuca, and salsa criolla.',
        },
        adicionales: [yuca, salsa],
        ingredientesRemovibles: [cebolla, aji],
      },
    ],
  },
  {
    id: 2,
    nombre: { es: 'Platos de fondo', en: 'Mains' },
    productos: [
      {
        id: 5,
        precio: 32,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Lomo saltado', en: 'Lomo saltado' },
        descripcion: {
          es: 'Lomo, cebolla y tomate salteados, con papas fritas y arroz.',
          en: 'Stir-fried beef, onion, and tomato, with fries and rice.',
        },
        adicionales: [huevo, papas, arroz],
        ingredientesRemovibles: [cebolla, aji, tomate],
      },
      {
        id: 6,
        precio: 28,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Ají de gallina', en: 'Ají de gallina' },
        descripcion: {
          es: 'Crema de ají amarillo y gallina deshilachada, con arroz y aceituna.',
          en: 'Yellow chili cream and shredded chicken, with rice and olive.',
        },
        adicionales: [huevo, arroz],
        ingredientesRemovibles: [aceituna, aji],
      },
      {
        id: 7,
        precio: 36,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Pachamanca de la casa', en: 'House pachamanca' },
        descripcion: {
          es: 'Carnes y tubérculos al estilo de la sierra, con hierba buena y ají.',
          en: 'Highland-style meats and tubers, with herbs and chili.',
        },
        adicionales: [porcion, ajiExtra],
        ingredientesRemovibles: [cilantro, aji],
      },
      {
        id: 8,
        precio: 30,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Tallarín saltado', en: 'Stir-fried noodles' },
        descripcion: {
          es: 'Tallarines salteados con lomo, verduras y sillao.',
          en: 'Noodles stir-fried with beef, vegetables, and soy sauce.',
        },
        adicionales: [huevo, carne],
        ingredientesRemovibles: [cebolla, aji],
      },
      {
        id: 9,
        precio: 34,
        imagenUrl: null,
        disponible: false,
        nombre: { es: 'Trucha frita', en: 'Fried trout' },
        descripcion: {
          es: 'Trucha del día, yuca y ensalada. Hoy no hay en cocina.',
          en: 'Trout of the day, yuca, and salad. Sold out today.',
        },
        adicionales: [yuca, { id: 115, precioExtra: 1, nombre: { es: 'Limón extra', en: 'Extra lime' } }],
        ingredientesRemovibles: [limon],
      },
    ],
  },
  {
    id: 3,
    nombre: { es: 'Bebidas', en: 'Drinks' },
    productos: [
      {
        id: 10,
        precio: 8,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Chicha morada', en: 'Purple corn drink' },
        descripcion: {
          es: 'Jarra de maíz morado, piña y canela.',
          en: 'Purple corn, pineapple, and cinnamon.',
        },
        adicionales: [],
        ingredientesRemovibles: [azucar],
      },
      {
        id: 11,
        precio: 7,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Limonada', en: 'Limeade' },
        descripcion: {
          es: 'Limón fresco, hierbabuena y hielo.',
          en: 'Fresh lime, mint, and ice.',
        },
        adicionales: [],
        ingredientesRemovibles: [azucar],
      },
      {
        id: 12,
        precio: 6,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Inca Kola', en: 'Inca Kola' },
        descripcion: {
          es: 'Botella bien fría.',
          en: 'A cold bottle.',
        },
        adicionales: [],
        ingredientesRemovibles: [],
      },
      {
        id: 13,
        precio: 5,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Café pasado', en: 'Drip coffee' },
        descripcion: {
          es: 'Café de la mañana, servido en taza grande.',
          en: 'Morning coffee, served in a large cup.',
        },
        adicionales: [shot, leche],
        ingredientesRemovibles: [azucar],
      },
    ],
  },
  {
    id: 4,
    nombre: { es: 'Postres', en: 'Desserts' },
    productos: [
      {
        id: 14,
        precio: 12,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Picarones', en: 'Picarones' },
        descripcion: {
          es: 'Aros de zapallo y camote, con miel de chancaca.',
          en: 'Squash and sweet-potato rings with cane syrup.',
        },
        adicionales: [miel],
        ingredientesRemovibles: [],
      },
      {
        id: 15,
        precio: 14,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Suspiro a la limeña', en: 'Suspiro limeño' },
        descripcion: {
          es: 'Manjar blanco y merengue de oporto, con canela.',
          en: 'Dulce de leche and port meringue, with cinnamon.',
        },
        adicionales: [],
        ingredientesRemovibles: [],
      },
      {
        id: 16,
        precio: 10,
        imagenUrl: null,
        disponible: true,
        nombre: { es: 'Mazamorra morada', en: 'Purple corn pudding' },
        descripcion: {
          es: 'Postre de maíz morado y frutas, tibio o frío.',
          en: 'Purple corn and fruit pudding, warm or cold.',
        },
        adicionales: [fruta],
        ingredientesRemovibles: [],
      },
    ],
  },
]

export function buscarProductoFuente(productoId: number): ProductoFuente | undefined {
  for (const categoria of CATALOGO) {
    const producto = categoria.productos.find((item) => item.id === productoId)
    if (producto) return producto
  }
  return undefined
}

export function localizarMenu(idioma: Idioma): MenuRespuesta {
  return {
    categorias: CATALOGO.map((categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre[idioma],
      productos: categoria.productos.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre[idioma],
        descripcion: producto.descripcion[idioma],
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        disponible: producto.disponible,
        adicionales: producto.adicionales.map((extra) => ({
          id: extra.id,
          nombre: extra.nombre[idioma],
          precioExtra: extra.precioExtra,
        })),
        ingredientesRemovibles: producto.ingredientesRemovibles.map((ingrediente) => ({
          id: ingrediente.id,
          nombre: ingrediente.nombre[idioma],
        })),
      })),
    })),
  }
}

/** Ilustración local cuando el producto no trae imagenUrl. */
const ARTE: Record<number, string> = {
  1: 'huancaina',
  2: 'tequenos',
  3: 'causa',
  4: 'pota',
  5: 'lomo',
  6: 'aji',
  7: 'pachamanca',
  8: 'tallarin',
  9: 'trucha',
  10: 'chicha',
  11: 'limonada',
  12: 'inca',
  13: 'cafe',
  14: 'picarones',
  15: 'suspiro',
  16: 'mazamorra',
}

export function varianteDe(productoId: number): string {
  return ARTE[productoId] ?? 'plato'
}
