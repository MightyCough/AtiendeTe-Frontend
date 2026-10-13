import type { Categoria } from '../tipos'

interface AdicionalFuente {
  id: number
  precioExtra: number
  nombre: string
}

interface IngredienteFuente {
  id: number
  nombre: string
}

interface ProductoFuente {
  id: number
  precio: number
  imagenUrl: string | null
  disponible: boolean
  nombre: string
  descripcion: string
  adicionales: AdicionalFuente[]
  ingredientes: IngredienteFuente[]
}

interface CategoriaFuente {
  id: number
  nombre: string
  productos: ProductoFuente[]
}

const huevo: AdicionalFuente = { id: 101, precioExtra: 3, nombre: 'Huevo frito' }
const papas: AdicionalFuente = { id: 103, precioExtra: 5, nombre: 'Porción de papas' }
const arroz: AdicionalFuente = { id: 104, precioExtra: 4, nombre: 'Arroz extra' }
const ajiExtra: AdicionalFuente = { id: 105, precioExtra: 1.5, nombre: 'Ají extra' }
const palta: AdicionalFuente = { id: 106, precioExtra: 4, nombre: 'Palta extra' }
const yuca: AdicionalFuente = { id: 107, precioExtra: 5, nombre: 'Yuca extra' }
const salsa: AdicionalFuente = { id: 108, precioExtra: 2.5, nombre: 'Salsa criolla extra' }
const carne: AdicionalFuente = { id: 109, precioExtra: 6, nombre: 'Carne extra' }
const porcion: AdicionalFuente = { id: 110, precioExtra: 8, nombre: 'Porción extra' }
const shot: AdicionalFuente = { id: 111, precioExtra: 2.5, nombre: 'Shot de café' }
const leche: AdicionalFuente = { id: 112, precioExtra: 1.5, nombre: 'Leche' }
const miel: AdicionalFuente = { id: 113, precioExtra: 2, nombre: 'Miel extra' }
const fruta: AdicionalFuente = { id: 114, precioExtra: 3, nombre: 'Fruta extra' }

const cebolla: IngredienteFuente = { id: 201, nombre: 'Cebolla' }
const aji: IngredienteFuente = { id: 202, nombre: 'Ají' }
const cilantro: IngredienteFuente = { id: 203, nombre: 'Cilantro' }
const aceituna: IngredienteFuente = { id: 204, nombre: 'Aceituna' }
const tomate: IngredienteFuente = { id: 205, nombre: 'Tomate' }
const azucar: IngredienteFuente = { id: 206, nombre: 'Azúcar' }
const limon: IngredienteFuente = { id: 207, nombre: 'Limón' }

/** Carta de demostración, con precios en soles y platos de la sierra. */
export const CATALOGO: CategoriaFuente[] = [
  {
    id: 1,
    nombre: 'Entradas',
    productos: [
      {
        id: 1,
        precio: 14,
        imagenUrl: null,
        disponible: true,
        nombre: 'Papa a la huancaína',
        descripcion: 'Papa amarilla, salsa de ají amarillo y queso fresco, con huevo y aceituna.',
        adicionales: [huevo, ajiExtra],
        ingredientes: [aceituna, aji],
      },
      {
        id: 2,
        precio: 16,
        imagenUrl: null,
        disponible: true,
        nombre: 'Tequeños de lomo',
        descripcion: 'Rollitos crocantes de lomo y queso, con salsa criolla al costado.',
        adicionales: [salsa],
        ingredientes: [cebolla],
      },
      {
        id: 3,
        precio: 15,
        imagenUrl: null,
        disponible: true,
        nombre: 'Causa de pollo',
        descripcion: 'Causa de papa amarilla rellena de pollo, con palta y un toque de limón.',
        adicionales: [palta],
        ingredientes: [aceituna, limon],
      },
      {
        id: 4,
        precio: 22,
        imagenUrl: null,
        disponible: true,
        nombre: 'Chicharrón de pota',
        descripcion: 'Pota crocante, yuca dorada y salsa criolla.',
        adicionales: [yuca, salsa],
        ingredientes: [cebolla, aji],
      },
    ],
  },
  {
    id: 2,
    nombre: 'Platos de fondo',
    productos: [
      {
        id: 5,
        precio: 32,
        imagenUrl: null,
        disponible: true,
        nombre: 'Lomo saltado',
        descripcion: 'Lomo, cebolla y tomate salteados, con papas fritas y arroz.',
        adicionales: [huevo, papas, arroz],
        ingredientes: [cebolla, aji, tomate],
      },
      {
        id: 6,
        precio: 28,
        imagenUrl: null,
        disponible: true,
        nombre: 'Ají de gallina',
        descripcion: 'Crema de ají amarillo y gallina deshilachada, con arroz y aceituna.',
        adicionales: [huevo, arroz],
        ingredientes: [aceituna, aji],
      },
      {
        id: 7,
        precio: 36,
        imagenUrl: null,
        disponible: true,
        nombre: 'Pachamanca de la casa',
        descripcion: 'Carnes y tubérculos al estilo de la sierra, con hierba buena y ají.',
        adicionales: [porcion, ajiExtra],
        ingredientes: [cilantro, aji],
      },
      {
        id: 8,
        precio: 30,
        imagenUrl: null,
        disponible: true,
        nombre: 'Tallarín saltado',
        descripcion: 'Tallarines salteados con lomo, verduras y sillao.',
        adicionales: [huevo, carne],
        ingredientes: [cebolla, aji],
      },
      {
        id: 9,
        precio: 34,
        imagenUrl: null,
        disponible: false,
        nombre: 'Trucha frita',
        descripcion: 'Trucha del día, yuca y ensalada. Hoy no hay en cocina.',
        adicionales: [yuca, { id: 115, precioExtra: 1, nombre: 'Limón extra' }],
        ingredientes: [limon],
      },
    ],
  },
  {
    id: 3,
    nombre: 'Bebidas',
    productos: [
      {
        id: 10,
        precio: 8,
        imagenUrl: null,
        disponible: true,
        nombre: 'Chicha morada',
        descripcion: 'Jarra de maíz morado, piña y canela.',
        adicionales: [],
        ingredientes: [azucar],
      },
      {
        id: 11,
        precio: 7,
        imagenUrl: null,
        disponible: true,
        nombre: 'Limonada',
        descripcion: 'Limón fresco, hierbabuena y hielo.',
        adicionales: [],
        ingredientes: [azucar],
      },
      {
        id: 12,
        precio: 6,
        imagenUrl: null,
        disponible: true,
        nombre: 'Inca Kola',
        descripcion: 'Botella bien fría.',
        adicionales: [],
        ingredientes: [],
      },
      {
        id: 13,
        precio: 5,
        imagenUrl: null,
        disponible: true,
        nombre: 'Café pasado',
        descripcion: 'Café de la mañana, servido en taza grande.',
        adicionales: [shot, leche],
        ingredientes: [azucar],
      },
    ],
  },
  {
    id: 4,
    nombre: 'Postres',
    productos: [
      {
        id: 14,
        precio: 12,
        imagenUrl: null,
        disponible: true,
        nombre: 'Picarones',
        descripcion: 'Aros de zapallo y camote, con miel de chancaca.',
        adicionales: [miel],
        ingredientes: [],
      },
      {
        id: 15,
        precio: 14,
        imagenUrl: null,
        disponible: true,
        nombre: 'Suspiro a la limeña',
        descripcion: 'Manjar blanco y merengue de oporto, con canela.',
        adicionales: [],
        ingredientes: [],
      },
      {
        id: 16,
        precio: 10,
        imagenUrl: null,
        disponible: true,
        nombre: 'Mazamorra morada',
        descripcion: 'Postre de maíz morado y frutas, tibio o frío.',
        adicionales: [fruta],
        ingredientes: [],
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

/** La carta de demostración sale siempre en español. Misma forma que GET /api/menu: un arreglo. */
export function localizarMenu(): Categoria[] {
  return CATALOGO.map((categoria) => ({
    id: categoria.id,
    nombre: categoria.nombre,
    productos: categoria.productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagenUrl: producto.imagenUrl,
      disponible: producto.disponible,
      adicionales: producto.adicionales.map((extra) => ({
        id: extra.id,
        nombre: extra.nombre,
        precioExtra: extra.precioExtra,
      })),
      ingredientes: producto.ingredientes.map((ingrediente) => ({
        id: ingrediente.id,
        nombre: ingrediente.nombre,
      })),
    })),
  }))
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
