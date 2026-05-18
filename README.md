# ⚡ Mental Calc Game

Aplicación móvil de **cálculo mental** desarrollada con React Native + Expo.  
Desafía tu mente resolviendo operaciones matemáticas bajo presión de tiempo.

---

## Instalación

```bash
# 1. Clonar / abrir el proyecto
cd MentalCalcGame

# 2. Instalar dependencias
npm install

# 3. Ejecutar
npm start          # abre el Expo Dev Server
npm run android    # ejecutar en Android
npm run ios        # ejecutar en iOS (requiere macOS)
npm run web        # ejecutar en navegador
```

### Requisitos previos
- Node.js 18+
- [Expo Go](https://expo.dev/go) instalado en el dispositivo, **o** un emulador Android/iOS

---

## Estructura del proyecto

```
MentalCalcGame/
├── App.tsx                     # Entry point — providers + navegación
├── index.ts                    # Registro de componente raíz
│
└── src/
    ├── types/
    │   └── index.ts            # Todos los tipos TypeScript del dominio
    │
    ├── constants/
    │   ├── theme.ts            # Design system (colores, tipografía, spacing)
    │   └── game.ts             # Constantes del juego (puntajes, rangos, keys)
    │
    ├── storage/
    │   └── storageService.ts   # Capa de persistencia (AsyncStorage)
    │
    ├── services/
    │   └── gameEngine.ts       # Generación de operaciones y validación
    │
    ├── utils/
    │   ├── scoreCalculator.ts  # Lógica de puntaje (puras, testeables)
    │   └── formatters.ts       # Formateo de fechas, tiempos, IDs
    │
    ├── context/
    │   ├── GameConfigContext.tsx  # Config global + persistencia
    │   └── StatsContext.tsx       # Estadísticas globales
    │
    ├── hooks/
    │   ├── useGame.ts          # Orquestación del ciclo de juego
    │   ├── useTimer.ts         # Timer countdown reutilizable
    │   ├── useScore.ts         # Acumulación reactiva de puntaje
    │   └── useStatistics.ts    # Lectura de estadísticas globales
    │
    ├── components/
    │   ├── AnswerInput.tsx     # Input numérico (modo clásico)
    │   ├── ChoiceButtons.tsx   # Botones múltiple opción y V/F
    │   ├── DifficultyBadge.tsx # Pill de dificultad
    │   ├── OperationCard.tsx   # Tarjeta principal de operación
    │   ├── PrimaryButton.tsx   # Botón con animación de presión
    │   ├── ProgressBar.tsx     # Barra de progreso de ronda
    │   ├── ResultModal.tsx     # Modal feedback correcto/incorrecto
    │   ├── ScoreBoard.tsx      # Display de puntaje animado
    │   ├── ScreenWrapper.tsx   # SafeAreaView + fondo compartido
    │   └── StatCard.tsx        # Tarjeta de estadística individual
    │
    ├── screens/
    │   ├── HomeScreen.tsx      # Pantalla principal con mejores scores
    │   ├── ConfigScreen.tsx    # Configuración de dificultad/modo/tiempo
    │   ├── GameScreen.tsx      # Pantalla principal del juego
    │   ├── ResultsScreen.tsx   # Estadísticas post-partida
    │   └── HistoryScreen.tsx   # Historial de partidas
    │
    └── navigation/
        └── AppNavigator.tsx    # Stack navigator configurado
```

---

## Funcionalidades

### Modos de juego
| Modo | Descripción |
|------|-------------|
| **Clásico** | El usuario escribe el resultado con teclado numérico |
| **Verdadero/Falso** | Se muestra una ecuación con resultado (correcto o no) y el usuario juzga |
| **Múltiple Opción** | 4 opciones, solo una correcta |
| **Contra el Reloj** | Operaciones infinitas hasta que se acabe el tiempo total |

### Dificultades
| Nivel | Operaciones | Rango | Tiempo |
|-------|-------------|-------|--------|
| Fácil | Suma, Resta | 1–20 | 20s |
| Medio | + Multiplicación | 2–50 | 15s |
| Difícil | + División | 5–99 | 8s |

### Sistema de puntaje
```
Respuesta rápida (<75% del tiempo)   →  +100 pts
Respuesta normal                     →   +70 pts
Respuesta incorrecta                 →   -30 pts
Sin responder (timeout)              →   -50 pts
Puntaje total mínimo                 →     0 pts
```

### Persistencia (100% offline)
Toda la información se guarda localmente con `AsyncStorage`:
- Historial completo de partidas (últimas 100)
- Estadísticas globales acumuladas
- Mejores scores por modo+dificultad
- Configuración del juego

---

## Decisiones de diseño

### Arquitectura
- **Separación estricta**: lógica de dominio (services/utils) completamente desacoplada de la UI.
- **Hooks como controladores**: `useGame` orquesta el ciclo completo; los componentes solo muestran estado.
- **Context API liviano**: dos contextos focalizados (config + stats) evitan re-renders innecesarios.

### Rendimiento
- Todos los componentes visuales envueltos en `React.memo`.
- Animaciones con `useNativeDriver: true` donde es posible.
- `FlatList` con `keyExtractor` optimizado para el historial.
- `useCallback` en todos los handlers para evitar re-renders en cadena.

### UI/UX
- Paleta oscura (`#0F0E17`) con acentos en púrpura (`#6C63FF`) y rojo (`#FF6584`).
- Animaciones de entrada (spring) en las tarjetas de operación.
- Timer visual con barra animada que cambia de color según urgencia.
- Feedback inmediato con modal animado tras cada respuesta.

### Seguridad
- No se generan ni consumen URLs externas.
- Sin dependencias de red; 100% local.
- Datos de usuario no sensibles, almacenados solo en el dispositivo.

---

## Scripts disponibles

```bash
npm start        # Expo Dev Server
npm run android  # Android
npm run ios      # iOS
npm run web      # Web (navegador)
```
