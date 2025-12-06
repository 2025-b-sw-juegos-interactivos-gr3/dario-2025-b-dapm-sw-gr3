# 🚛 Examen 01 - Simulador de Montacargas 3D

**Asignatura:** Juegos Interactivos GR3  
**Estudiante:** Dario Andres Palma Mera 


## 🎯 Descripción del Proyecto

Simulador 3D de un operador de montacargas desarrollado con **Babylon.js** que cumple con los requisitos del examen "Recoger y Entregar". El jugador debe recoger palés de una bodega industrial y entregarlos en la zona de carga de un camión, gestionando combustible, tiempo y evitando obstáculos.

## 🏭 Características Principales

### ✅ **Requisitos Mínimos Cumplidos**
- **Jugador controlable**: Montacargas en 3ra persona (WASD/Flechas)
- **Objetos recogibles**: Palés de madera con física realista
- **Zona de recogida**: Área azul en la bodega
- **Zona de entrega**: Área verde con camión de carga
- **Mecánica de recoger**: Tecla E con detección de proximidad
- **Mecánica de entregar**: Tecla E en zona de entrega
- **Estado del juego**: Control de palés cargados/entregados

### 🚀 **Características Avanzadas**
- **5 niveles progresivos**: Dificultad creciente (3→12 palés por nivel)
- **Sistema de combustible**: Consumo por movimiento, tiempo y luces
- **Bodega completa**: Ambiente 3D con estantes, oficinas, columnas
- **Interfaz profesional**: UI compacta con estadísticas en tiempo real
- **Sistema de cámaras**: 3 modos (3ra persona, 1ra persona, vista superior)
- **Efectos visuales**: Luces, animaciones, partículas
- **Sistema de sonido**: Bocina, recolección, entrega
- **Guardado de progreso**: Persistencia entre sesiones

## 🕹️ Controles del Juego

### **Teclado**
| Tecla | Función |
|-------|---------|
| **W, A, S, D** | Movimiento del montacargas |
| **Flechas** | Movimiento (alternativa) |
| **E** | Recoger / Entregar palé |
| **L** | Encender/Apagar luces |
| **ESPACIO** | Tocar bocina |
| **C** | Cambiar vista de cámara |
| **R** | Reiniciar nivel |
| **P** | Pausar/Continuar |
| **F1** | Mostrar tutorial |

### **Interfaz Táctil**
- Botones flotantes para todas las funciones
- Controles adaptados para dispositivos móviles

## 🛠️ Tecnologías Utilizadas

- **Babylon.js 6.0+**: Motor gráfico 3D
- **HTML5/CSS3**: Interfaz y estilos
- **JavaScript ES6+**: Lógica del juego
- **Node.js/Express**: Servidor web (opcional)
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografía

---


## 🚀 Instalación y Ejecución


## Con Servidor Node.js
```bash

npm init -y

npm install express

node server.js

# 3. Abrir en navegador
# http://localhost:3000

```
