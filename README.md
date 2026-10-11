# AtiendeTe

Carta digital para el curso de IoT de la **Universidad de Huánuco**. Cada mesa tiene un QR. El cliente pide desde el celular, la cocina cambia el estado del pedido y un ESP32 con LED RGB (en el backend, no en este repo) repite ese estado en la mesa.

Todo corre en la red local: el portátil sirve esta interfaz y el API; los celulares entran por la WiFi del salón.

## Rutas

| Ruta | Quién | Qué hace |
| --- | --- | --- |
| `/menu?mesa=N` | Cliente | Carta, carrito y confirmación. Si `mesa` falta o no es válida, muestra un error. |
| `/pedido/:id` | Cliente | Estado en vivo: Recibido → En preparación → Listo → Entregado. |
| `/cocina` | Cocina | Tablero solo en español. Pedidos nuevos con sonido y botones grandes para avanzar. |
| `/admin` | Caja | Pedidos de hoy, total vendido, productos más pedidos y mesas en línea / fuera de línea. |
| `/admin/qr` | Caja | Hoja para imprimir un QR por mesa. |

Los textos de cliente y administración están en español e inglés. La cocina queda en español porque los nombres de los platos llegan así desde el API. Comentarios del código, en español.

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
cp .env.example .env.development.local
```

Variables:

| Variable | Default | Uso |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000` | Origen del backend y de Socket.IO. |
| `VITE_USE_MOCK` | `false` | `true` usa datos locales y no abre socket. |

En `npm run dev` el archivo `.env.development` ya deja `VITE_USE_MOCK=true`. Para hablar con el backend real durante el desarrollo, crea `.env.development.local` (no se versiona) con `VITE_USE_MOCK=false` y la URL del API.

## Desarrollo en la red local

```bash
npm run dev
```

Vite escucha en `0.0.0.0:5173`. En el portátil abre `http://localhost:5173`. En el celular usa la IP del portátil, por ejemplo `http://192.168.1.20:5173/menu?mesa=1`.

El celular no entiende `localhost`. Si el API corre en el portátil, `VITE_API_URL` tiene que ser `http://192.168.1.20:3000` **antes** de arrancar Vite (las variables se hornean al iniciar). El backend debe aceptar CORS desde `http://192.168.1.20:5173`. Si el firewall bloquea el puerto, ábrelo.

Para sacar la IP en Linux: `hostname -I`.

## Modo mock

Con `VITE_USE_MOCK=true` la interfaz no necesita backend:

- La carta, las mesas 1–8 y cuatro pedidos de ejemplo viven en `localStorage` (`atiendete-mock-db-v1`).
- Los eventos `pedido:nuevo`, `pedido:actualizado` y `mesa:conexion` se reparten entre pestañas del mismo navegador con `BroadcastChannel`.
- La mesa 8 alterna en línea / fuera de línea cada ~18 s para ver el tablero de administración en vivo.
- En Administración hay un enlace para reiniciar los datos de demostración.

Abre la carta y la cocina en dos ventanas del mismo navegador para ver el pedido aparecer con sonido. Cada celular tiene su propia memoria: el mock no cruza dispositivos. Para la demo con varios teléfonos hace falta el backend.

El idioma elegido por el cliente se guarda en `sessionStorage` para esa pestaña.

## Scripts

```bash
npm run dev       # desarrollo, host 0.0.0.0, puerto 5173
npm test          # pruebas unitarias
npm run build     # verificación de tipos y build de producción
npm run preview   # sirve dist/ en 0.0.0.0:5173
```

El build de producción no activa el mock salvo que `VITE_USE_MOCK=true` esté en el entorno al construir.

## Contrato del API

Base: `VITE_API_URL`. Precios en soles. Estados: `RECIBIDO`, `EN_PREPARACION`, `LISTO`, `ENTREGADO`. El campo `idioma` del pedido recuerda el idioma de la pantalla; los nombres de platos, adicionales e ingredientes **dentro de un pedido** van siempre en español.

### `GET /api/menu?lang=es|en`

```json
{
  "categorias": [
    {
      "id": 1,
      "nombre": "Entradas",
      "productos": [
        {
          "id": 1,
          "nombre": "Papa a la huancaína",
          "descripcion": "Papa amarilla y salsa de ají.",
          "precio": 14,
          "imagenUrl": null,
          "disponible": true,
          "adicionales": [{ "id": 101, "nombre": "Huevo frito", "precioExtra": 3 }],
          "ingredientesRemovibles": [{ "id": 204, "nombre": "Aceituna" }]
        }
      ]
    }
  ]
}
```

`imagenUrl` es una URL absoluta o `null`. Si viene vacía, la interfaz dibuja una ilustración.

### Mesas

`GET /api/mesas`

```json
[{ "numero": 1, "online": true, "ultimaConexion": "2026-10-10T18:00:00.000Z" }]
```

`GET /api/mesas/:numero` devuelve el mismo objeto. `404` si la mesa no existe. `ultimaConexion` puede ser `null`.

### Pedidos

`POST /api/pedidos`

```json
{
  "mesa": 1,
  "idioma": "es",
  "items": [
    {
      "productoId": 5,
      "cantidad": 2,
      "adicionales": [101],
      "sinIngredientes": [201],
      "nota": "Término medio"
    }
  ]
}
```

`nota` es opcional (máximo 140 caracteres). `cantidad` va de 1 a 20. Respuesta: el pedido creado.

```json
{
  "id": 12,
  "mesa": 1,
  "idioma": "es",
  "estado": "RECIBIDO",
  "total": 70,
  "creadoEn": "2026-10-10T18:05:00.000Z",
  "items": [
    {
      "productoId": 5,
      "nombre": "Lomo saltado",
      "cantidad": 2,
      "precioUnitario": 32,
      "adicionales": [{ "id": 101, "nombre": "Huevo frito", "precioExtra": 3 }],
      "sinIngredientes": [{ "id": 201, "nombre": "Cebolla" }],
      "nota": "Término medio",
      "subtotal": 70
    }
  ]
}
```

El total de una línea es `(precioUnitario + suma de precioExtra) × cantidad`.

`GET /api/pedidos/:id` devuelve el mismo objeto. `404` si no existe.

`GET /api/pedidos?estado=&fecha=` filtra por estado y por día civil del local (`fecha=YYYY-MM-DD`). Los dos parámetros son opcionales. Los nombres van en español.

`PATCH /api/pedidos/:id/estado`

```json
{ "estado": "EN_PREPARACION" }
```

Respuesta: el pedido actualizado.

### Reporte

`GET /api/reportes/hoy`

```json
{
  "pedidos": [],
  "totalVendido": 128.5,
  "topProductos": [
    { "productoId": 5, "nombre": "Lomo saltado", "cantidad": 4, "total": 140 }
  ]
}
```

`totalVendido` suma todos los pedidos del día, también los que siguen en cocina. `topProductos` ordena por unidades.

### Socket.IO

El cliente conecta al mismo origen que `VITE_API_URL`, path por defecto `/socket.io/`.

| Evento | Cuerpo |
| --- | --- |
| `pedido:nuevo` | Pedido completo, igual que el `POST`. |
| `pedido:actualizado` | `{ "id": 12, "mesa": 1, "estado": "LISTO" }` |
| `mesa:conexion` | `{ "numero": 1, "online": true }` |

## Pruebas

`npm test` cubre los totales del carrito (incluidos adicionales y céntimos), el cambio de idioma es/en, la lectura de `?mesa=` y que la carta de demostración coincida en ambos idiomas.

## Build

```bash
npm run build
npm run preview
```

`preview` también escucha en `0.0.0.0:5173`, así que el QR puede apuntar a ese puerto si no usan el servidor de desarrollo.
