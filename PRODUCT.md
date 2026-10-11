# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quien opera el portátil del local o de la demo del curso abre el inicio: cocina, administración o mesas de prueba. El cliente no usa esa pantalla; entra por el QR de su mesa y pide desde el teléfono. La cocina cambia el estado del pedido en español.

## Product Purpose

AtiendeTe es el frente web de un proyecto de IoT de la Universidad de Huánuco. Cada mesa tiene un QR. El cliente arma el pedido en el teléfono, la cocina cambia el estado y una luz RGB en la mesa lo acompaña. El éxito es que un pedido salga de la carta, aparezca en cocina y el cliente vea el mismo estado, en la red local.

## Positioning

El pedido, el tablero de cocina y la luz de la mesa comparten un solo estado. No es una carta genérica ni un panel de restaurante suelto: el teléfono pide y la mesa responde con luz.

## Operating Context

Corre en la red WiFi de un portátil, sin nube del restaurante. Vite en el puerto 5173, API en el puerto 3000, o datos de demostración si no hay backend. Precios en soles. Estados del pedido: Recibido, En preparación, Listo, Entregado.

## Capabilities and Constraints

Carta por mesa, carrito, seguimiento del pedido, tablero de cocina, ventas del día, mesas en línea y códigos QR imprimibles. Interfaz solo en español. El cliente no elige idioma. La luz física la controla un ESP32 en otro repositorio; esta web solo muestra y cambia el estado.

## Brand Commitments

Nombre AtiendeTe. Universidad de Huánuco. Voz en español, directa, de local y no de startup. Paleta que el proyecto ya usa y que se queda: crema `#f3ecdf`, papel `#fffaf3`, tinta `#241c16`, oliva `#243228`, terracota `#c24e24`, oro `#a67c3d`, miel `#e7b15a`. Un fondo de circuitos con una luz que recorre las pistas es una idea a probar, no un compromiso cerrado.

## Evidence on Hand

Carta de demostración con platos de Huánuco, pedidos de ejemplo y mesas 1 a 8. No hay fotos reales del local ni testimonios. No inventar clientes, ventas ni premios.

## Product Principles

- El estado del pedido es la pieza que une mesa, cocina y luz.
- El cliente pide en el teléfono; el personal opera en el portátil.
- Español de local, sin traductor.
- La demo tiene que entenderse sin el hardware enchufado.
