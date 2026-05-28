**Documento Técnico de Ejecución: Blindaje y Seguridad de Paquetes NPM/PNPM (Defense in Depth 2026)**

Este documento está estructurado para ser interpretado y ejecutado secuencialmente por un agente de automatización u OpenCode, aplicando las configuraciones de seguridad multicapa para el consumo y publicación de paquetes de Node.js.

### FASE 1: Configuración Global del Entorno (Consumidor)

**Objetivo:** Deshabilitar la ejecución automática de scripts maliciosos o implícitos (como `postinstall`) a nivel global.

**Acciones de ejecución:**

1. Modificar la configuración global de NPM para ignorar scripts por defecto:

   ```bash
   npm config set ignore-scripts true
   ```

   _Nota de validación:_ El archivo `.npmrc` resultante debe contener `ignore-scripts=true` y es recomendable también incluir `audit=true`.

### FASE 2: Migración de NPM a PNPM

**Objetivo:** Transicionar a PNPM, recomendado por su modelo de almacenamiento seguro mediante enlaces simbólicos y sus capacidades avanzadas de seguridad nativa.

**Secuencia de comandos de migración:**
Ejecutar los siguientes comandos en la raíz del proyecto para importar y fijar las dependencias de forma segura sin borrar los `lockfiles` antiguos a ciegas:

```bash
npm install -g pnpm --ignore-scripts
pnpm import
pnpm install --ignore-scripts
pnpm install --frozen-lockfile --ignore-scripts
```

### FASE 3: Políticas de Espacio de Trabajo en PNPM

**Objetivo:** Implementar tiempo de enfriamiento (Cooldown) y listas de compilación permitidas en el manifiesto del espacio de trabajo.

**Acciones de ejecución:**

1. Crear o modificar el archivo `pnpm-workspace.yaml` (o `.npmrc` si se usa npm) en la raíz del proyecto.
2. Inyectar la siguiente configuración de seguridad:

   ```yaml
   # Cooldown nativo: Evita instalar paquetes publicados hace menos de 3 días (4320 minutos)
   minimumReleaseAge: '4320'

   # Configuración de dependencias de compilación explícitas
   strictDepBuilds: true
   # Definir arreglo allow-list de paquetes permitidos para compilar/ejecutar build
   onlyBuildDependencies: []
   ```

   _Nota:_ Estos parámetros evitan ataques de cadena de suministro inmediatos tras la publicación de un paquete comprometido.

### FASE 4: Blindaje del Proceso de Publicación (Publisher)

**Objetivo:** Asegurar el pipeline de Integración Continua (CI) mediante autenticación OIDC, firmas de procedencia (Provenance) y listas blancas de archivos.

**Acciones de ejecución:**

1. **Limitar archivos publicados:** En el archivo `package.json`, definir explícitamente el arreglo `files` para evitar la publicación accidental de archivos con secretos (como `.env`):

   ```json
   {
     "files": ["dist/", "lib/", "README.md"]
   }
   ```

2. **Configurar GitHub Actions (OIDC + Provenance):** Modificar el workflow YAML de publicación (`.github/workflows/publish.yml`) para usar tokens temporales por trabajo en lugar de tokens permanentes. Otorgar el permiso estricto `id-token: write` e incluir la bandera `--provenance` en el comando de publicación.
3. **Validación requerida:** Asegurar que la cuenta de npmjs.com asociada tenga habilitada la Autenticación de Dos Factores (2FA) o Passkeys obligatorias para publicar, y configurar el repositorio como un "Trusted Publisher".

### FASE 5: Validaciones de Integridad y Herramientas CI (Opcional según stack)

**Objetivo:** Auditar dependencias y evitar URLs maliciosas inyectadas en los lockfiles.

**Acciones de ejecución:**

1. **Regla de instalación estricta:** Al instalar paquetes individuales de forma manual o automatizada, nunca usar el tag `latest`; se debe usar siempre una versión exacta con los scripts apagados.

   ```bash
   npm install <paquete>@<version-exacta> --ignore-scripts
   ```

2. **Validación de Lockfile (Solo si se mantiene NPM o Yarn):** Ejecutar `lockfile-lint` para verificar que los hosts provengan de orígenes de confianza con HTTPS.

   ```bash
   npx lockfile-lint --path package-lock.json --allowed-hosts npm --validate-https
   ```

   _Nota:_ Este paso se puede omitir si se utiliza exclusivamente PNPM, ya que PNPM no mantiene la URL del tarball de cada paquete en el lockfile de la misma forma que npm, mitigando este vector de ataque por defecto.
