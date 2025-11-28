# 💻 Taller 1.3 (Asincrónico): Arqueología Digital  
**Tema:** La Evolución de la Industria – Cómo las Restricciones Crean Innovación  
**Integrantes:** [Nombre 1] y [Nombre 2]  

---

## 🕰 Era Asignada  
💥 **El Crash y el Amanecer de la 3.ª Generación (1983–1984)**  

## 🎮 Juego Seleccionado  
**Tetris**  
- **Año de lanzamiento:** 1984 (versión prototipo)  
- **Plataforma original:** Electrónika 60 (minicomputadora soviética sin tarjeta gráfica)  

---

## 1. Hito Tecnológico Clave  
### **El triunfo de la Lógica sobre los Gráficos**  

En 1984, mientras Occidente se recuperaba del "Crash del 83" —un mercado saturado de consolas y juegos de baja calidad—, en la Unión Soviética la innovación nacía de la escasez.  

- **Portabilidad Radical:**  
  Alexey Pajitnov escribió Tetris en Pascal, separando por completo la lógica del juego de su representación visual. Esto creó un código **"agnóstico al hardware"**, capaz de funcionar en cualquier sistema que pudiera mostrar texto.  

- **Independencia de la CPU:**  
  A diferencia de los arcades occidentales, que dependían de chips dedicados para sprites y gráficos, Tetris no necesitaba hardware especializado. Solo requería una terminal de texto, lo que facilitó su expansión viral a través de disquetes universitarios y estatales: una **"viralidad de disquete"** que anticipó décadas la distribución digital.

---

## 2. Análisis de Diseño (MDA Revisado)  

### **Mecánicas (Las Reglas)**  
- **Rotación y traslación:** Manipulación de tetrominós en una cuadrícula de 10×20.  
- **Gravedad forzada:** Las piezas caen automáticamente, creando una presión temporal constante.  
- **Eliminación de filas:** La única forma de ganar espacio (y tiempo) es destruir lo que uno mismo ha construido.  

### **Dinámicas (El Comportamiento del Jugador)**  
- **Gestión de riesgos:** El jugador debe elegir entre apilar alto para completar un "Tetris" (4 líneas a la vez, con la pieza 'I') y maximizar puntos, o jugar conservadoramente para evitar la derrota.  
- **Curva de pánico:** A medida que aumenta la velocidad, la estrategia evoluciona de **planificación deliberada** a **supervivencia reactiva instantánea**.  

### **Estéticas (La Experiencia Emocional)**  
- **Flow (Flujo):** Tetris induce un estado de concentración profunda donde acción y conciencia se fusionan.  
- **Efecto Tetris:** El juego genera una compulsión visual tan poderosa que los jugadores reportan "ver piezas cayendo" incluso después de dejar de jugar —una estética cognitiva que trasciende la pantalla.

---

## 3. Innovación Clave (El "Salto")  
### **La Abstracción Universal**  

Tetris rompió el paradigma dominante: los videojuegos no tenían que simular mundos (naves espaciales, deportes, guerras). Podían ser **puzles abstractos y autónomos**.  

- **El puzle infinito:**  
  No existe una condición de victoria. El objetivo no es "ganar", sino **posponer la derrota** el mayor tiempo posible.  
- **Legado anticipado:**  
  Esta filosofía —centrada en el *high score* y en la jugabilidad pura— definió el ADN de los futuros juegos casuales y móviles, décadas antes del nacimiento del smartphone.

---

## 4. La "Restricción Ingeniosa" (Arqueología del Código)  

### **La Restricción**  
> *"Una pantalla que no podía dibujar imágenes."*  

La Electrónika 60 carecía de capacidades gráficas rasterizadas: no podía renderizar píxeles, sprites ni colores. Solo mostraba texto alfanumérico monocromático en una terminal diseñada para hojas de cálculo.

### **La Solución (El Hack de 1984)**  
- **Paréntesis como píxeles:**  
  Pajitnov usó corchetes **`[ ]`** para representar bloques. En los monitores de fósforo verde de la época, dos corchetes adyacentes creaban la **ilusión óptica de un cuadrado** gracias a la relación de aspecto de los caracteres.  

- **Optimización de refresco:**  
  En lugar de redibujar toda la pantalla (demasiado lento para la CPU soviética), el código actualizaba únicamente las coordenadas que cambiaban, enviando comandos de texto para **borrar o escribir caracteres específicos**.  

### **Resultado**  
Convertir una limitación paralizante en una **estética minimalista y universal**. Tetris se volvió comprensible al instante en cualquier cultura, sin manuales, sin narrativa y sin barreras lingüísticas —una obra maestra nacida de la necesidad.
