# Taller 1.1 (Asincrónico): Deconstruyendo la Diversión

## Tema: El "Qué" y el "Dónde" – Análisis de Sistemas con el Framework MDA

**Nombres:** Dario Palma – Ángel Cabezas

Como grupo, analizamos distintos videojuegos usando el framework **MDA (Mecánicas, Dinámicas y Estéticas)**. Nuestro objetivo fue entender **qué hace divertido a cada juego** (el “qué”) y **en qué contexto ocurre esa experiencia** (el “dónde”), comparando géneros distintos pero también encontrando puntos en común.

---

## 🎮 Ficha de Análisis: Tabla Comparativa MDA

Seleccionamos juegos canónicos que representan muy bien a sus géneros y los desarmamos en **Mecánicas (M)**, **Dinámicas (D)** y **Estéticas (A)**.

| Género                 | Juego Seleccionado (y Año)                      | Mecánicas Clave (M) (¿Cuáles son los “verbos” y reglas principales?)                                                                                                                                                                                                 | Dinámicas Emergentes (D) (¿Qué estrategias o comportamientos surgen?)                                                                                                                                                                                                                                                                                | Estética Dominante (A) (¿Cuál es la “diversión” o el objetivo emocional principal?)                                                                                                                                         |
| :--------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Acción**             | **Celeste (2018)**                              | • `Saltar()`  • `Dash()` (en 8 direcciones) • `Escalar()` (resistencia limitada) • Regla: el **dash se resetea** al tocar el suelo o ciertas superficies.                                                                                                            | • Encadenamiento de saltos y dashes para superar secciones difíciles (*speedrunning*). • “Bailar” entre trampas y enemigos con movimientos muy precisos. • Búsqueda de rutas óptimas para completar niveles en menos tiempo.                                                                                                                         | • **Desafío** (precisión y timing). • **Dominio** (sentirse cada vez más hábil a través de la práctica y el error). • También una fuerte sensación de **superación personal**.                                              |
| **Aventura**           | **The Legend of Zelda: Ocarina of Time (1998)** | • `Explorar()` (mundo semiabierto con zonas bloqueadas). • `UsarObjeto()` (ganchos, arco, bombas, ocarina, etc.). • `CombateZTargeting()` (fijar enemigos para atacar/defender). • `ResolverPuzleAmbiente()` (activar interruptores, mover bloques, usar la física). | • Deducción de la **secuencia correcta de ítems** para poder avanzar. • Tácticas de posicionamiento en combate para aprovechar debilidades. • Patrón de **“cadena de llaves”**: obtener un objeto → desbloquear un área → nuevo puzle → nuevo objeto.                                                                                                | • **Descubrimiento** (explorar el mapa, hallar secretos). • **Fantasía** (vivir la aventura como héroe de un mundo mágico). • **Narrativa** (progresar en la historia y en el crecimiento del personaje).                   |
| **RPG (Juego de Rol)** | **Final Fantasy VII (1997)**                    | • `CombatePorTurnos()` (sistema ATB – Active Time Battle). • `SubirNivel()` (aumentar HP, MP, ATK, MAG, etc.). • `EquiparMateria()` (personalizar magia y habilidades). • `GestionarInventario()` (consumibles, armas, armaduras).                                   | • **Grinding**: repetir combates para subir de nivel y obtener recursos. • Optimización de **builds** combinando materia, equipo y personajes. • Estrategia por turno: decidir el comando óptimo considerando vida, PM y estado del enemigo.                                                                                                         | • **Progresión** (ver cómo el grupo se vuelve más fuerte). • **Narrativa** (historia profunda y desarrollo emocional de los personajes). • **Dominio** del sistema de combate y sus sinergias.                              |
| **Estrategia**         | **StarCraft: Brood War (1998)**                 | • `RecolectarRecursos()` (minerales y gas vespeno). • `ConstruirUnidad()` (según árbol tecnológico). • `MoverUnidad()` (control de grupo y *micromanagement*). • `AtacarObjetivo()` o defender posiciones clave.                                                     | • Creación de **build orders** (órdenes de construcción óptimas según estrategia). • Equilibrio entre **macromanagement** (economía, expansión, producción) y **micromanagement** (control fino de unidades en batalla). • Estrategias como **“rush”** (ataque temprano) vs. **“tech”** (apostar por tecnología avanzada y unidades más fuertes).    | • **Desafío** (toma de decisiones bajo presión en tiempo real). • **Dominio** (sentir superioridad estratégica sobre el rival). • **Tensión** constante por la competencia directa y la posibilidad de un contraataque.     |
| **Simulación**         | **The Sims 4 (2014)**                           | • `SatisfacerNecesidad()` (hambre, higiene, social, diversión, etc.). • `ConstruirCasa()` (diseño, compra y venta de muebles y habitaciones). • `IrATrabajo()` / `SubirHabilidad()`. • `InteractuarSocialmente()` (amistad, romance, conflictos).                    | • **“God-playing”**: decidir el destino de los Sims (desde la vida perfecta hasta el caos total). • **Optimización del tiempo**: organizar rutinas diarias para maximizar progreso laboral, habilidades y relaciones. • **Historias emergentes**: crear familias, dramas, situaciones cómicas o trágicas sin que el juego las guione explícitamente. | • **Crecimiento / Logro** (mejorar la vida, la casa y la carrera de los Sims). • **Fantasía** (vivir una vida alternativa o idealizada). • **Expresión** (diseñar personajes, casas y estilos de vida a gusto del jugador). |
| **Puzle**              | **Tetris (1984)**                               | • `RotarPieza()` (90°). • `MoverHorizontalmente()` (izquierda/derecha). • `DejarCaer()` (caída suave o dura). • Regla: se llama `EliminarFila()` cuando una fila está completa.                                                                                      | • **“Stacking”**: apilar piezas dejando un “pozo” para la barra larga. • **Respuesta de crisis**: limpiar rápidamente cuando la torre está muy alta. • **Planificación multi-pieza**: pensar en las próximas 2–3 piezas para evitar errores.                                                                                                         | • **Desafío** (retos espaciales y de velocidad). • **Satisfacción** al limpiar varias líneas seguidas. • **Dominio** al resistir la subida constante de la velocidad y la dificultad.                                       |

---

## Análisis Comparativo MDA

En esta sección comparamos cómo cambian el **bucle de juego**, la **presión sobre el jugador** y la **emoción principal** en diferentes géneros, y cómo una misma mecánica puede transformarse según el contexto del juego.

---

### 1. Diferencias: Acción (*Celeste*) vs Estrategia (*StarCraft*)

| Aspecto                    | Acción – *Celeste*                                                                                                         | Estrategia – *StarCraft: Brood War*                                                                                                                               |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bucle de juego**         | **Reflejo → Ejecución → Muerte → Reintento**. Ciclos muy cortos: fallas, reapareces casi al instante y vuelves a intentar. | **Evaluación → Planificación → Ejecución → Resultado**. Ciclos más largos: planear economía, producir, atacar y recién después ver si la estrategia funcionó.     |
| **Tipo de presión**        | Se centra en la **precisión motora** y la velocidad de reacción. Un pequeño error en un salto puede costar el intento.     | Se centra en la **planificación a largo plazo** y la **multitarea** (macro y micro). Equivocarse en la estrategia puede costar la partida varios minutos después. |
| **Consecuencia del error** | **Inmediata**: caes, mueres y el juego te devuelve al último punto de control.                                             | **Diferida**: una mala decisión económica o de posicionamiento se traduce en desventaja de recursos y territorio más adelante.                                    |
| **Estética primaria**      | **Desafío** y **Dominio** corporal (sentir que tus manos “aprenden” el nivel).                                             | **Dominio** y **Tensión** estratégica (sentir que entiendes mejor el mapa, el rival y la economía).                                                               |

Aunque los dos juegos son desafiantes, el **“dónde”** ocurre la diversión es distinto:

* En *Celeste* está en el **control preciso del personaje en pantalla**, casi íntimo entre jugador y nivel.
* En *StarCraft*, está en el **campo de batalla compartido**, muchas veces en un entorno competitivo online contra otro jugador humano.

---

### 2. Similitudes: Polimorfismo de la Mecánica `GestionarRecursos()`

Vimos que una misma idea de diseño (gestionar recursos) puede adquirir **formas y significados diferentes** dependiendo del tipo de juego. Es decir, la mecánica es “polimórfica”: cambia su “sentido” según el sistema donde vive.

| Género                                | Contexto de la Mecánica `GestionarRecursos()`                                                                  | Dinámica Generada                                                                                                                                                            | Estética Dominante                                                                                                          |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **RPG – Final Fantasy VII**           | Recursos finitos de supervivencia: PM, pociones, objetos curativos y limitados en cantidad.                    | **Decisión crítica de gasto**: el jugador se pregunta “¿Uso ahora la poción o la guardo para el jefe?”. Esto genera tensión turno a turno dentro de cada combate o mazmorra. | **Desafío / Dominio** del encuentro específico y sensación de **alivio** cuando la decisión fue correcta.                   |
| **Estrategia – StarCraft: Brood War** | Recursos renovables pero escasos: minerales, gas y *supply*, que permiten producir más unidades y estructuras. | **Decisión económica y de producción**: expandirse, invertir en tecnología, producir ejército o defender. Surgen estilos agresivos (rush) o más económicos (macro).          | **Crecimiento / Dominio** del mapa, del ritmo de la partida y del rival. El jugador siente que controla el flujo del juego. |

En ambos casos hablamos de “recursos”, pero:

* En el RPG se viven como **vida o muerte inmediata** (supervivencia del grupo).
* En el RTS se viven como **economía y poder a largo plazo** (control del escenario y del oponente).

---

### 3. Híbridos: Aventura (*Zelda*) y RPG (*Final Fantasy VII*)

También notamos que los juegos actuales rara vez son “puros”; casi todos mezclan mecánicas de varios géneros. La diferencia de género no está tanto en **qué mecánicas existen**, sino en **qué mecánicas pesan más en el bucle central**.

#### 🔹 *The Legend of Zelda: Ocarina of Time* (Aventura con elementos de RPG)

* **Toma prestado del RPG:**

  * Contenedores de corazón (más HP).
  * Medidor de magia (MP).
  * Inventario con objetos y equipo.
* Pero el **núcleo del juego** es:

  * Explorar el mundo.
  * Entrar a templos.
  * Resolver puzles de entorno usando el objeto correcto.
* La **estética principal** es el **Descubrimiento** y la sensación de vivir una **gran aventura heroica**. Subir “estadísticas” es secundario; lo que realmente desbloquea el avance son los objetos y la resolución de puzles.

#### 🔹 *Final Fantasy VII* (RPG con elementos de Aventura)

* **Toma prestado de la Aventura:**

  * Exploración de ciudades y mapas.
  * Puzles ligeros en escenarios.
  * Momentos de exploración narrativa.
* Pero el **núcleo del juego** es:

  * `SubirNivel()`, `EquiparMateria()` y optimizar el grupo.
  * Ganar combates cada vez más difíciles.
* La **estética principal** es la **Progresión/Crecimiento** (numérico y emocional) y la **Narrativa**. La exploración sirve principalmente para alimentar la historia y conseguir más recursos para los combates.

---

## Conclusión del Taller

Como grupo, al desarmar estos juegos con el framework **MDA**, llegamos a varias ideas clave:

* El **“qué”** de un juego (lo que el jugador hace: mecánicas y dinámicas) está profundamente conectado con el **“dónde”** (el contexto: género, tipo de pantalla, si es competitivo, cooperativo, solitario, etc.).
* La misma mecánica, como `GestionarRecursos()`, puede provocar emociones muy distintas según el sistema: **estrés táctico** en un RPG o **tensión económica y estratégica** en un RTS.
* Los géneros modernos son híbridos, y se diferencian más por el **peso** que le dan a ciertas mecánicas en su bucle central que por tener o no una mecánica específica.
