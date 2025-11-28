💻 Taller 1.3 (Asincrónico): Arqueología Digital
Tema: La Evolución de la Industria - Cómo las Restricciones Crean Innovación
Integrantes: [Nombre 1] y [Nombre 2]

Era Asignada: 💥 El Crash y el Amanecer de la 3.ª Generación (1983-1984)
Juego Seleccionado: Tetris

Año de Lanzamiento: 1984 (Versión Prototipo)

Plataforma Original: Electrónika 60 (Minicomputadora soviética sin tarjeta gráfica)

1. Hito Tecnológico Clave
El triunfo de la Lógica sobre los Gráficos. Al analizar el contexto de 1984, identificamos que mientras Occidente sufría el "Crash del 83" saturado de consolas caseras, en la URSS la innovación nacía de la escasez.

Portabilidad Radical: La verdadera revolución de Tetris no fue visual, sino estructural. Alexey Pajitnov escribió el juego en Pascal. Al separar la lógica del juego de los gráficos, creó un código "agnóstico" al hardware.

Independencia de la CPU: A diferencia de los juegos de Arcade que dependían de chips específicos (sprites), Tetris podía correr en cualquier máquina que pudiera mostrar texto, lo que permitió su expansión viral ("viralidad de disquete") mucho antes de llegar a Nintendo.

2. Análisis de Diseño (MDA Revisado)
Para entender por qué funciona, desglosamos el juego usando el marco MDA completo:

Mecánicas (Las Reglas):
Rotación y Traslación: Manipulación de tetrominós en un espacio de cuadrícula de 10x20.

Gravedad Forzada: Las piezas caen automáticamente, imponiendo un límite de tiempo físico para la toma de decisiones.

Eliminación de Filas: La única forma de ganar espacio (y tiempo) es destruir lo que construyes.

Dinámicas (El Comportamiento del Jugador):
Este fue nuestro hallazgo clave: El juego genera una dinámica de "Gestión de Riesgos". El jugador debe decidir si apilar alto para esperar la pieza larga (la barra 'I') y ganar más puntos (un 'Tetris'), o jugar seguro y limpiar líneas simples para evitar perder.

La Curva de Pánico: A medida que la velocidad aumenta, la estrategia cambia de "planificación a largo plazo" a "supervivencia reactiva" instantánea.

Estéticas (La Experiencia Emocional):
Flow (Flujo): El juego induce un estado de trance cognitivo donde la acción y la conciencia se fusionan.

El "Efecto Tetris": Identificamos una estética de compulsión visual; el juego es tan geométricamente satisfactorio que el jugador sigue "jugando" en su mente incluso después de apagar la computadora.

3. Innovación Clave (El "Salto")
La Abstracción Universal. Consideramos que Tetris rompió el paradigma de que los videojuegos debían ser "simulaciones" (de naves, de guerras, de deportes).

El Puzle Infinito: Fue el primer juego masivo que no tenía "condición de victoria". No puedes ganar en Tetris, solo puedes posponer la derrota. Esta filosofía de diseño (el "high score" como única meta) definió el mercado de juegos casuales y móviles décadas antes de que existieran los smartphones. Demostró que la jugabilidad pura superaba a la narrativa.

4. La "Restricción Ingeniosa" (Arqueología del Código)
La Restricción:
"Una pantalla que no podía dibujar imágenes". La Electrónika 60 no tenía capacidad para gráficos rasterizados (no podía dibujar píxeles ni sprites). Solo podía mostrar líneas de texto alfanumérico monocromático. ¿Cómo creas un videojuego visual dinámico en una máquina diseñada para hojas de cálculo?

La Solución (El Hack de 1984):
El uso de Paréntesis como Píxeles.

El Hack Visual: Pajitnov no dibujó cuadrados. Utilizó un par de corchetes [ ] parpadeantes para representar los bloques. Al poner dos corchetes juntos, la relación de aspecto en los monitores de fósforo verde de la época creaba la ilusión de un "cuadrado" perfecto.

Optimización de Refresco: En lugar de redibujar toda la pantalla (lo cual era demasiado lento para la CPU soviética), el código calculaba solo las coordenadas que cambiaban y enviaba comandos de texto para borrar o escribir caracteres específicos.

Resultado: Convirtió una limitación de hardware paralizante (falta de gráficos) en una estética icónica y minimalista que permitió que el juego fuera comprensible instantáneamente en cualquier cultura, sin barreras de idioma ni necesidad de manuales.