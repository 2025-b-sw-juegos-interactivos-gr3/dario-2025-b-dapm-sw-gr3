# 📄 Ficha de Análisis Técnico: Proyecto Diablo (1994)

**Asignatura:** Proyecto de Juegos (GR3SW) - Fase 1

**Integrantes:**
* Dario Palma
* Angel Cabezas

---

## 1. Visión Central (Elevator Pitch)

Tras analizar la propuesta, definimos a **Diablo** como un RPG isométrico de fantasía oscura diseñado para revitalizar el género "hack and slash"[cite: 7, 8]. Su núcleo se basa en la exploración de mazmorras generadas proceduralmente (DRLG), lo que garantiza que ninguna experiencia sea igual a la anterior.

Lo que más nos llamó la atención es su modelo de negocio: una rejugabilidad infinita apoyada por expansiones coleccionables baratas, inspiradas directamente en los sobres de cartas de *Magic: The Gathering*.

---

## 2. Resumen Estructural

Al desglosar el documento de diseño (GDD), identificamos cuatro pilares fundamentales sobre los que se sostiene el proyecto:

### 🎮 Diseño de Juego y Mecánicas
El documento detalla una perspectiva isométrica sobre una cuadrícula de diamantes. Nos parece clave destacar que, originalmente, el juego se concibió con un sistema **por turnos** estricto controlado por el ratón, dependiendo totalmente del sistema *Dynamic Random Level Generation* (DRLG) para mantener la frescura del juego.

### 🏰 Narrativa y Progresión
Se establece un tono de "fantasía gótica y oscura". La progresión ambiental está muy bien definida: el jugador desciende desde una iglesia abandonada, pasando por catacumbas, hasta llegar a las cámaras opulentas del infierno, enfrentándose a enemigos temáticos como no-muertos y demonios.

### 💰 Estrategia de Mercado (Expansiones)
El equipo de Condor propone algo innovador para la época: la venta de "discos de expansión" en los puntos de venta (cajas registradoras). Estos discos no son secuelas, sino inyecciones de contenido (nuevos ítems, monstruos y trampas) que se integran en el juego base para fomentar el coleccionismo.

### 📅 Plan de Desarrollo
Se presenta un cronograma (Gantt) de 12 meses. Notamos una fuerte carga de trabajo dividida en arte (intensiva en sprites SVGA), programación (enfocada en el motor DRLG y la interfaz) y diseño de niveles.

---

## 3. Análisis de Ingeniería

Desde nuestra perspectiva técnica, hemos evaluado qué tan viable es desarrollar este proyecto con la información proporcionada:

### ✅ Lo Claro (Listo para Prototipar)

* **Input Handling (Manejo de Entrada):** La lógica es explícita y fácil de implementar. Se define claramente el uso del *clic izquierdo* para mover/interactuar y el *clic derecho* para hechizos. Incluso se menciona el algoritmo de *pathfinding* para buscar la ruta más corta.
* **Game Loop (Bucle de Juego):** A diferencia del producto final que conocemos, este diseño especifica un sistema por turnos. La lógica de estado es clara: el jugador gasta puntos, luego los enemigos se mueven. Esto simplifica enormemente la programación de la IA inicial.
* **Motor de Renderizado:** Los requisitos gráficos están bien acotados: Modo Super VGA (640x480) y una vista isométrica que requiere sprites con 8 direcciones de movimiento.

### ⚠️ Riesgos y Ambigüedades Técnicas

* **Arquitectura de Red y Sincronización:** El documento promete multijugador vía módem con un sistema híbrido de turnos con límite de tiempo.
    * *Nuestra crítica:* No se define la topología (¿P2P o Cliente-Servidor?). Implementar turnos con temporizadores en una red de baja latencia es muy propenso a condiciones de carrera (*race conditions*) y desincronización si no diseñamos un modelo de "lockstep" riguroso.
* **Arquitectura de Datos para Expansiones:** Se menciona que los discos "instalan nuevos elementos directamente en el juego base".
    * *Nuestra crítica:* Esto es un reto enorme. Requiere una arquitectura *Data-Driven* robusta desde el día 1. El motor no puede tener lógica "hardcodeada"; debe ser capaz de ingerir definiciones de activos externos dinámicamente sin recompilar el ejecutable.
* **Persistencia y Seguridad:** Se menciona la muerte permanente (borrado del personaje del disco duro) y la carga de partidas.
    * *Nuestra crítica:* Faltan detalles sobre la serialización. Si el archivo de guardado es local y texto plano, será trivial para los usuarios "hackear" sus estadísticas o evitar la muerte permanente haciendo copias de seguridad manuales de los archivos.