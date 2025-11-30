# 🗺️ Mapa de Historias: Estrategia de Lanzamiento - Diablo

**Asignatura:** Proyecto de Juegos (GR3SW)

**Integrantes:**
* Dario Palma
* Angel Cabezas

---

## Introducción
Como equipo de gestión del proyecto, hemos organizado las historias de usuario en tres fases de lanzamiento. Esta estructura prioriza la validación del "Core Loop" (MVP) antes de introducir la complejidad del sistema RPG y la infraestructura comercial de expansiones.

---

### 🚀 Fase 1: Prototipo Jugable (MVP)
**Objetivo:** Validar el bucle principal (Moverse -> Matar -> Recibir Recompensa) y los pilares técnicos (DRLG y sistema de turnos).

1.  **Movimiento Básico:** Como Jugador, quiero mover a mi personaje haciendo clic izquierdo en una casilla del suelo, **para** desplazarme por el entorno utilizando automáticamente la ruta más corta posible.
2.  **Motor por Turnos:** Como Jugador, quiero que el juego funcione estrictamente por turnos (yo muevo, luego los enemigos mueven), **para** poder planificar mis tácticas de combate sin la presión del tiempo real.
3.  **Combate Melee (Guerrero):** Como Guerrero, quiero atacar a un enemigo adyacente simplemente haciendo clic izquierdo sobre él, **para** infligir daño e interactuar ofensivamente de forma intuitiva.
4.  **Generación de Niveles (DRLG):** Como Jugador, quiero que el diseño de la mazmorra se genere aleatoriamente cada vez que entro en un nuevo nivel, **para** asegurar que ninguna partida sea igual a la anterior.
5.  **Recolección de Loot:** Como Jugador, quiero recoger armas, objetos mágicos y oro que encuentro en la mazmorra, **para** equiparme mejor y tener posibilidades de sobrevivir.

---

### 📦 Fase 2: Juego Completo (Experiencia Estándar)
**Objetivo:** Implementar la profundidad RPG, la persistencia de datos y el ciclo económico (Ciudad/Mazmorra).

6.  **Sistema de Magia:** Como Mago, quiero lanzar el hechizo que tengo preparado haciendo clic derecho en una ubicación o enemigo, **para** utilizar mis habilidades mágicas a distancia.
7.  **Niebla de Guerra:** Como Jugador, quiero que las áreas no exploradas estén ocultas en la oscuridad y se revelen dinámicamente según mi línea de visión, **para** mantener la sensación de misterio.
8.  **Ciudad y Comercio:** Como Jugador, quiero interactuar con una tienda general en la ciudad, **para** comprar equipamiento estándar, vender el botín que me sobra y reparar mis armas dañadas.
9.  **Selección de Clases:** Como Jugador, quiero elegir entre distintas clases (Guerrero, Ladrón, Mago) al crear mi personaje, **para** tener ventajas específicas y variedad de juego.
10. **Progresión de Stats:** Como Jugador, quiero distribuir puntos discrecionales en mis estadísticas (Fuerza, Magia, Destreza, Vitalidad) al inicio y al progresar, **para** personalizar el desarrollo de mi héroe.
11. **Persistencia (Menú/Guardar):** Como Jugador, quiero una pantalla de menú principal con opciones claras de "Nuevo Personaje" y "Cargar Personaje", **para** poder iniciar o continuar una sesión.

---

### ✨ Fase 3: Pulido y Extras (Enhancements)
**Objetivo:** Añadir calidad de vida, contenido avanzado y preparar la arquitectura para el modelo de negocio.

12. **Control de Cámara:** Como Jugador, quiero usar las teclas de flecha para desplazar la cámara independientemente de la posición del personaje, **para** poder observar el mapa más allá de mi ubicación.
13. **Variedad de Niveles (Set Pieces):** Como Diseñador de Niveles, quiero poder insertar áreas pre-diseñadas ("piezas de conjunto") dentro de los mapas aleatorios, **para** incluir puzles específicos y narrativa ambiental.
14. **Modo Hardcore (Permadeath):** Como Jugador Hardcore, quiero que mi personaje sea borrado permanentemente del disco duro si muero, **para** que la experiencia de supervivencia sea tensa.
15. **Soporte para Expansiones:** Como Jugador, quiero poder instalar "Discos de Expansión" comprados externamente, **para** inyectar nuevos objetos y criaturas directamente en mi partida actual.