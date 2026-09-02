# AGENTS.md — Reglas del proyecto

Este archivo se carga SIEMPRE (ver `instructions` en opencode.json).
<!-- Completa esto con todos los detalles de tu proyecto con conocimiento general compartido -->
MeetingFinder es una app que permite a múltiples personas colocar sus puntos de origen (casa, universidad, etc.) donde se encuentren y, opcionalmente, proponer puntos de destino (su propia casa, universidad, restaurante, etc.) y finalmente, mediante algún algoritmo, se seleccione un botón y muestre cuál es el destino más céntrico para todos, donde no haya nadie que tenga una distancia exajerada hacia el punto, una locación céntrica para tomar una reunión presencial.

## Flujo de trabajo obligatorio (SDD)

1. No se escribe código sin un `plan.md` aprobado en `specs/<fecha>-<feature>/`.
2. Toda feature nueva empieza en una rama nueva desde `main`.
3. Antes de mergear: `test-writer` corrió y los tests pasan, `security-reviewer` no dejó hallazgos "high/critical" sin resolver.
4. Si el agente no está seguro de un requisito, pregunta — no asume.

## Convenciones técnicas
<!-- Completa esto una vez con tu stack real; ver specs/tech-stack.md -->
- Lenguaje / framework: NextJS
- Estilo de commits: Conventional Commits (`feat:`, `fix:`, `chore:`...)
- Gestor de paquetes: pnpm, npx u otro
- Cómo correr tests localmente: usa playwright u otras herramientas
- Cómo correr el linter: eslint? recomienda algo si no es la mejor práctica

## Seguridad — no negociable
- Nunca hardcodear secrets, tokens o API keys. Usar variables de entorno.
- Toda entrada de usuario se valida y sanitiza antes de tocar la BD.
- Nunca loguear PII (DNI, contraseñas, etc) en texto plano.
- Cualquier endpoint que toque datos sensibles requiere autenticación y autorización explícita — nunca "por defecto abierto".

## Disciplina de costo/tokens
- No leas archivos completos si con `grep`/`glob` alcanza para ubicar lo que necesitas.
- No repitas contexto que ya está en este archivo o en `specs/`.
- Para tareas mecánicas (tests, docs, refactors chicos) usa el subagente correspondiente con modelo económico — no el agente principal.
- Si una tarea puede resolverse leyendo 1 archivo, no listes todo el repo primero.
