# Framework de Pruebas Automatizadas - Sistema Joyería Wilma

Framework de automatización de pruebas end-to-end desarrollado con Playwright para validar las funcionalidades críticas del sistema de joyería Wilma.

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/Allure-FF6C37?style=for-the-badge&logo=allure&logoColor=white)](https://docs.qameta.io/allure/)

##  Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Manual de Instalación](#-manual-de-instalación)
  - [Requisitos Previos](#requisitos-previos-del-sistema)
  - [Pasos de Instalación](#-proceso-de-instalación-paso-a-paso)
  - [Solución de Problemas](#-solución-de-problemas-comunes)
- [Manual de Usuario](#-manual-de-usuario)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Ejecución de Pruebas](#ejecución-de-pruebas)
  - [Uso de Etiquetas](#uso-de-comandos-por-etiquetas)
  - [Reportes Allure](#interpretación-de-reportes-allure)
  - [Crear Nuevos Casos](#creación-de-nuevos-casos-de-prueba)
  - [Buenas Prácticas](#buenas-prácticas-para-el-mantenimiento)

---

##  Descripción del Proyecto

Este framework automatiza la validación de los módulos principales del sistema Joyería Wilma:

| Módulo | Descripción | Casos de Prueba |
|--------|-------------|-----------------|
| **Login** | Autenticación y control de acceso | 4 |
| **Ventas** | Gestión de transacciones de venta | 13 |
| **Compras** | Registro y administración de compras | 17 |
| **Parámetros** | Configuración del sistema (formas de pago, proveedores, etc.) | 65 |
| **Reportes** | Generación de informes financieros | 22 |
| **E2E** | Flujos completos de negocio | 2 |

** Cobertura total**: 123 casos de prueba automatizados

---

#  Manual de Instalación

## Requisitos Previos del Sistema

Antes de comenzar, asegúrate de tener instalado:

| Herramienta | Versión Mínima | Descarga |
|-------------|----------------|----------|
| **Node.js** | v18.x o superior | [nodejs.org](https://nodejs.org/) |
| **Git** | v2.x o superior | [git-scm.com](https://git-scm.com/) |
| **Visual Studio Code** | Última versión | [code.visualstudio.com](https://code.visualstudio.com/) |

### Verificar Instalaciones
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version
```

---

##  Proceso de Instalación Paso a Paso

### Paso 1: Clonar el Repositorio
```bash
# Clonar el repositorio
git clone https://github.com/AdrianEstradaU/Framework-automatizado-joyeria-playwright-NodeJS


```

### Paso 2: Instalar Dependencias de Node.js
```bash
npm install
```

**¿Qué hace este comando?**
- Instala Playwright y todas sus dependencias
- Instala Allure Playwright Reporter
- Configura las dependencias necesarias

 **Tiempo estimado**: 2-5 minutos

### Paso 3: Instalar Navegadores de Playwright
```bash
npx playwright install
```

**¿Qué hace este comando?**
- Descarga Chromium, Firefox y WebKit
- Configura los navegadores para Playwright

 **Tiempo estimado**: 3-7 minutos  
 **Espacio requerido**: ~500 MB

### Paso 4: Instalar Allure Command Line

#### Windows:
```bash
npm install -g allure-commandline
```

#### macOS:
```bash
brew install allure
```

#### Linux (Ubuntu/Debian):
```bash
# Instalar Java (requerido por Allure)
sudo apt-get update
sudo apt-get install default-jre

# Instalar Allure
sudo apt-get install allure
```

### Paso 5: Configurar Variables de Entorno (Opcional)

Crea un archivo `.env` en la raíz del proyecto:
```env
BASE_URL=https://pruebas-3-3hjs.onrender.com/
TIMEOUT=30000
HEADLESS=false
```

> **Nota**: Este paso es opcional. El framework funciona con la configuración por defecto en `playwright.config.js`.

### Paso 6: Verificar la Instalación
```bash
# Ejecutar prueba de login con navegador visible
npx playwright test tests/login.spec.js --headed
```

** Resultado esperado**:
- Se abre un navegador
- Se ejecutan 4 pruebas de login
- Se muestra resumen en consola: `4 passed`

---

##  Solución de Problemas Comunes

### Error: "playwright: command not found"

**Solución**:
```bash
npm install
npx playwright install
```

### Error: "Cannot find module '@playwright/test'"

**Solución**:
```bash
npm install @playwright/test --save-dev
```

##  Checklist de Instalación

- [ ] Node.js instalado (v18+)
- [ ] Git instalado
- [ ] VS Code instalado
- [ ] Repositorio clonado
- [ ] `npm install` ejecutado correctamente
- [ ] Navegadores instalados (`npx playwright install`)
- [ ] Allure instalado y verificado
- [ ] Prueba de verificación exitosa
- [ ] Extensiones de VS Code instaladas

---

#  Manual de Usuario

## Estructura del Proyecto
```
framework-joyeria-wilma/
│
├── .github/
│   └── workflows/              # GitHub Actions (CI/CD)
│       └── playwright.yml      # Pipeline de integración continua
│
├── data/                       # Datos de prueba (JSON)
│   ├── login-data.json
│   ├── ventas-data.json
│   ├── compras-data.json
│   ├── formas-pago-data.json
│   ├── proveedores-data.json
│   ├── tipos-ingreso-data.json
│   ├── tipos-egreso-data.json
│   ├── tipos-producto-data.json
│   ├── gestion-data.json
│   └── reportes-data.json
│
├── downloads/                  # Reportes PDF descargados
│
├── fixtures/                   # Estado de autenticación
│   └── auth.json               # Sesión guardada de login
│
├── pages/                      # Page Object Model
│   ├── BasePage.js             # Clase base con métodos comunes
│   ├── LoginPage.js
│   ├── VentasPage.js
│   ├── ComprasPage.js
│   ├── ModeloParametrosPage.js # Clase reutilizable para parámetros
│   ├── FormasPagoPage.js
│   ├── ProveedoresPage.js
│   ├── TiposIngresoPage.js
│   ├── TiposEgresoPage.js
│   ├── TiposProductoPage.js
│   ├── GestionPage.js
│   ├── IngresosPage.js
│   ├── EgresosPage.js
│   ├── GraficosPage.js
│   └── UtilidadesPage.js
│
├── tests/                      # Casos de prueba automatizados
│   ├── auth.setup.js           # Configuración de autenticación
│   ├── login.spec.js           # Pruebas de login
│   ├── ventas.spec.js          # Pruebas de ventas
│   ├── compras.spec.js         # Pruebas de compras
│   ├── parametros/
│   │   ├── formas-pago.spec.js
│   │   ├── proveedores.spec.js
│   │   ├── tipos-ingreso.spec.js
│   │   ├── tipos-egreso.spec.js
│   │   ├── tipos-producto.spec.js
│   │   └── gestion.spec.js
│   ├── reportes/
│   │   ├── ingresos.spec.js
│   │   ├── egresos.spec.js
│   │   ├── graficos.spec.js
│   │   └── utilidades.spec.js
│   └── e2e/
│       ├── flujo-compras.spec.js
│       └── flujo-ventas.spec.js
│
├── utils/                      # Utilidades y helpers
│   ├── allure-logger.js        # Logger para Allure Reports
│   └── teardown.js             # Limpieza de datos después de pruebas
│
├── playwright.config.js        # Configuración de Playwright
├── package.json                # Dependencias del proyecto
└── README.md                   # Este archivo
```

---

## Ejecución de Pruebas

### Comandos Básicos
```bash
# Ejecutar TODAS las pruebas
npx playwright test

# Ejecutar con navegador visible
npx playwright test --headed

# Ejecutar en modo debug
npx playwright test --debug

# Ejecutar con UI interactiva
npx playwright test --ui
```

### Ejecutar Pruebas por Módulo
```bash
# Solo pruebas de login
npx playwright test tests/login.spec.js

# Solo pruebas de ventas
npx playwright test tests/ventas.spec.js

# Solo pruebas de compras
npx playwright test tests/compras.spec.js

# Todos los parámetros
npx playwright test tests/parametros/

# Todos los reportes
npx playwright test tests/reportes/

# Pruebas E2E
npx playwright test tests/e2e/
```

### Ejecutar una Prueba Específica
```bash
# Por nombre del test
npx playwright test -g "Login exitoso con credenciales válidas"

# Por archivo y navegador específico
npx playwright test tests/login.spec.js --project=chromium
```

---

## Uso de Comandos por Etiquetas

El framework utiliza etiquetas para categorizar las pruebas:

### Etiquetas Disponibles

| Etiqueta | Descripción | Ejemplo de Uso |
|----------|-------------|----------------|
| `@smoke` | Pruebas críticas básicas | Login, crear venta/compra |
| `@regression` | Suite de regresión completa | Todas las funcionalidades |
| `@positive` | Casos de éxito | Formularios con datos válidos |
| `@negative` | Casos de error | Validaciones, campos vacíos |
| `@e2e` | Flujos completos | Proceso completo de venta |

### Comandos por Etiqueta
```bash
# Ejecutar solo pruebas @smoke
npx playwright test --grep @smoke

# Ejecutar solo pruebas @regression
npx playwright test --grep @regression

# Ejecutar solo pruebas @negative
npx playwright test --grep @negative

# Ejecutar solo pruebas @positive
npx playwright test --grep @positive

# Ejecutar pruebas @e2e
npx playwright test --grep @e2e
```

### Combinar Etiquetas
```bash
# Ejecutar @smoke O @regression
npx playwright test --grep "@smoke|@regression"

# Ejecutar @smoke Y @positive (ambas etiquetas)
npx playwright test --grep "(?=.*@smoke)(?=.*@positive)"

# Excluir @negative
npx playwright test --grep-invert @negative
```

---

## Interpretación de Reportes Allure

### Generar y Abrir Reporte
```bash
# 1. Ejecutar pruebas (genera allure-results/)
npx playwright test

# 2. Generar reporte HTML
npx allure generate allure-results --clean

# 3. Abrir reporte en navegador
npx allure open allure-report
```

### Elementos del Reporte Allure

#### 1. **Overview** (Vista General)
- Total de pruebas ejecutadas
- Porcentaje de éxito/fallo
- Duración total de ejecución
- Tendencias históricas

#### 2. **Suites** (Organización por Archivos)
- Agrupa pruebas por archivo `.spec.js`
- Estado de cada suite (passed/failed)
- Tiempo de ejecución por suite

#### 3. **Graphs** (Gráficos)
- **Severity**: Distribución por criticidad
  - Blocker (crítico)
  - Critical (alto)
  - Normal (medio)
  - Minor (bajo)
- **Status**: Distribución passed/failed/skipped
- **Duration**: Pruebas más lentas

#### 4. **Timeline** (Línea de Tiempo)
- Visualiza cuándo se ejecutó cada prueba
- Identifica pruebas que toman más tiempo
- Detecta cuellos de botella


#### . **Packages** (Estructura de Carpetas)
- Vista jerárquica de tests/

### Ejemplo de Interpretación
```
 117 passed (95.9%)
 6 failed (4.1%)
 Duration: 15m 32s

Failures:
- Reportes/Egresos: Validación de rango de fechas
- Reportes/Ingresos: Validación de rango de fechas
-Error al validar campos vacíos al crear Tipo de Egreso
-
```

**Acción recomendada**: Revisar módulo Reportes, priorizar corrección de validaciones de fecha.

---

## Creación de Nuevos Casos de Prueba

### Paso 1: Crear Archivo de Datos

Crea o edita un archivo JSON en `data/`:
```json
// data/mi-modulo-data.json
{
  "casoPositivo": {
    "campo1": "Valor válido",
    "campo2": "Otro valor",
    "numero": "123"
  },
  "casoNegativo": {
    "campo1": "",
    "campo2": "Texto en campo numérico",
    "numero": "abc"
  },
  "casoLimite": {
    "campo1": "Texto de exactamente 50 caracteres para validar",
    "campo2": "Límite máximo",
    "numero": "999999"
  }
}
```

### Paso 2: Crear Page Object

Crea un archivo en `pages/`:
```javascript
// pages/MiModuloPage.js
import { BasePage } from './BasePage.js';

export class MiModuloPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Localizadores
    this.inputCampo1 = '#campo1';
    this.inputCampo2 = '#campo2';
    this.inputNumero = '#numero';
    this.btnGuardar = 'button:has-text("Guardar")';
    this.btnCancelar = 'button:has-text("Cancelar")';
    this.mensajeExito = '.alert-success';
    this.mensajeError = '.alert-danger';
  }

  // Métodos específicos del módulo
  async completarFormulario(datos) {
    await this.fill(this.inputCampo1, datos.campo1);
    await this.fill(this.inputCampo2, datos.campo2);
    await this.fill(this.inputNumero, datos.numero);
  }

  async guardar() {
    await this.click(this.btnGuardar);
  }

  async verificarRegistroExitoso() {
    await this.verifyText(this.mensajeExito, 'Registro guardado exitosamente');
  }

  async verificarError(mensaje) {
    await this.verifyText(this.mensajeError, mensaje);
  }
}
```

### Paso 3: Crear Archivo de Prueba

Crea un archivo en `tests/`:
```javascript
const { test, expect } = require('@playwright/test');
const { ComprasPage } = require('../../pages/ComprasPage.js');
const { ComprasData } = require('../../data/ComprasData.js');
const logger = require("../../utils/loggers.js");
const { allure } = require('allure-playwright');

test.describe('Módulo Compras', () => {
  let comprasPage;

  test.beforeEach(async ({ page }) => {
    comprasPage = new ComprasPage(page);
    await page.goto('/');
    logger.info('Página principal cargada correctamente.');
    logger.info('Ingresando al módulo Compras...');
    await comprasPage.abrirModulo();
    logger.info('Módulo Compras abierto exitosamente.');
  });

  test('AE-TC-83: Crear compra válida y verificar existencia @Smoke @Regression @positive', async () => {
    // Configuración Allure
    allure.owner('Andres Adrian Estrada Uzeda');
    allure.severity('critical');

    const data = ComprasData.valid;
    logger.info(`Creando compra con: descripcion="${data.descripcion}", precio=${data.precio}, cantidad=${data.cantidad}, tipoEgreso=${data.tipoEgreso}, proveedor=${data.proveedor}, tipoProducto=${data.tipoProducto}`);
    
    await comprasPage.crearCompra(
      data.descripcion,
      data.precio,
      data.cantidad,
      data.tipoEgreso,
      data.proveedor,
      data.tipoProducto
    );

    await comprasPage.toastExito.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Compra creada exitosamente, verificando existencia en el listado...');
    const existe = await comprasPage.verificarCompraExiste(data.descripcion);
    expect(existe).toBeTruthy();
    logger.info('Compra verificada correctamente en el listado.');
  });
});
```

---

## Actualización de Datos de Prueba

### Ubicación de Archivos

Los datos están en `data/` en formato JSON:
```
data/
├── LoginData.json
├── VentasData.json
├── ComprasData.json
└── ...
```

### Modificar Datos Existentes
```json
// data/ventas-data.json
{
  "ventaValida": {
    "descripcion": "Anillo de oro 18k",  // ← Modificar aquí
    "precio": "1500",                    // ← O aquí
    "cantidad": "1",
    "formaPago": "Efectivo",
    "tipoVenta": "Ventas Normales",
    "tipoProducto": "Anillos"
  }
}
```

### Agregar Nuevos Casos
```json
{
  "ventaValida": { /* ... */ },
  "ventaNueva": {              // ← Nuevo caso
    "descripcion": "Collar de plata",
    "precio": "800",
    "cantidad": "2",
    "formaPago": "Tarjeta",
    "tipoVenta": "Ventas Normales",
    "tipoProducto": "Collares"
  }
}
```

**Importante**: Mantén la estructura JSON válida (comas, llaves, comillas).

---

## Buenas Prácticas para el Mantenimiento

### 1. Organización de Código

####  Hacer
```javascript
// Usar Page Object Model
const loginPage = new LoginPage(page);
await loginPage.login(usuario, password);

// Nombres descriptivos
async verificarMensajeExito() { /* ... */ }

// Métodos reutilizables en BasePage
await this.fill(selector, value);
await this.click(selector);
```

####  Evitar
```javascript
// No usar selectores directamente en tests
await page.click('div > span:nth-child(3) > button');

// Nombres genéricos
async doSomething() { /* ... */ }

// Código duplicado
await page.fill('#campo1', 'valor');
await page.fill('#campo2', 'valor');
// Mejor: await completarFormulario(datos);
```

---

### 2. Selectores y Localizadores

####  Preferir (en orden)
```javascript
// 1. Data attributes (más estables)
await page.click('[data-testid="guardar-btn"]');

// 2. ID únicos
await page.click('#btn-guardar');

// 3. Texto visible
await page.click('button:has-text("Guardar")');

// 4. Clases CSS específicas
await page.click('.btn-primary');
```

####  Evitar
```javascript
// Selectores frágiles (cambian fácilmente)
await page.click('div > div > button:nth-child(2)');

// XPath complejos
await page.click('//div[@class="container"]/button[2]');
```

---

### 3. Esperas 

####  Hacer
```javascript
// Esperas inteligentes (Playwright las hace automáticamente)
await page.click('#boton');

// Esperar condición específica
await page.waitForSelector('#resultado', { state: 'visible' });
await page.waitForLoadState('networkidle');

// Esperar por respuesta de API
await page.waitForResponse(response => 
  response.url().includes('/api/ventas') && response.status() === 200
);
```

---

### 4. Assertions (Verificaciones)
```javascript
import { expect } from '@playwright/test';

//  Assertions de Playwright (con auto-retry)
await expect(page.locator('#mensaje')).toHaveText('Éxito');
await expect(page.locator('#boton')).toBeVisible();
await expect(page.locator('#lista li')).toHaveCount(5);

//  Verificar múltiples condiciones
await expect(page.locator('#formulario')).toBeVisible();
await expect(page.locator('#formulario')).toBeEnabled();
```

---

### 5. Manejo de Datos de Prueba

####  Hacer
```javascript
// Datos externos en JSON
import testData from '../data/ventas-data.json';
await ventasPage.crearVenta(testData.ventaValida);

// Generar datos únicos cuando sea necesario
const timestamp = Date.now();
const descripcion = `Producto Test ${timestamp}`;

// Limpiar datos después de pruebas
test.afterEach(async () => {
  await eliminarDatosPrueba();
});
```

####  Evitar
```javascript
// Datos hardcodeados en tests
await ventasPage.crearVenta({
  descripcion: "Anillo",  // ← Difícil de mantener
  precio: "1000"
});

// No limpiar datos (contamina siguientes ejecuciones)
```
---

### 6. Estructura de Tests
```javascript
test.describe('Módulo de Ventas', () => {
  
  // Configuración común
  test.beforeEach(async ({ page }) => {
    const ventasPage = new VentasPage(page);
    await ventasPage.navigateTo('/ventas');
  });
  
  // Test descriptivo con steps
  test('CP001 - Crear venta exitosamente @smoke', async ({ page }) => {
    await allure.epic('Ventas');
    await allure.feature('CRUD Ventas');
    await allure.severity('critical');
    
    await test.step('Abrir formulario', async () => {
      // código
    });
    
    await test.step('Completar datos', async () => {
      // código
    });
    
    await test.step('Verificar resultado', async () => {
      // código
    });
  });
});
```

---

### 7. Reportes y Evidencia
```javascript
//  Usar steps de Allure para claridad
await test.step('Descripción del paso', async () => {
  // código del test
});

//  Agregar capturas importantes
await allure.attachment(
  'Estado Final', 
  await page.screenshot(), 
  'image/png'
);

//  Logs descriptivos
console.log(' Venta creada exitosamente');
console.log(' Error al guardar:', error.message);
```

---

### 8. Revisión de Código (Code Review)

Antes de hacer commit, verifica:

- [ ] ¿El código sigue el patrón Page Object Model?
- [ ] ¿Los selectores son estables?
- [ ] ¿Los datos están en archivos JSON?
- [ ] ¿Las pruebas tienen etiquetas (@smoke, @regression)?
- [ ] ¿Se agregaron steps de Allure?
- [ ] ¿Se eliminan datos de prueba después?
- [ ] ¿El código está comentado donde es necesario?
- [ ] ¿Las pruebas pasan localmente?

---

### 9. Mantenimiento Continuo

#### Cada Sprint:
- Ejecutar suite completa de regresión
- Revisar y actualizar casos obsoletos
- Agregar pruebas para nuevas funcionalidades

#### Cada Mes:
- Revisar y optimizar pruebas lentas
- Actualizar dependencias (`npm update`)
- Revisar y archivar casos deprecated

#### Cada Trimestre:
- Auditoría completa de cobertura
- Refactorización de código duplicado
- Actualización de documentación

---

##  Comandos Útiles de Reportes
```bash
# Generar reporte después de ejecución
npx allure generate allure-results --clean

# Abrir último reporte
npx allure open allure-report

# Limpiar reportes anteriores
rm -rf allure-results allure-report

# Ver reporte HTML de Playwright
npx playwright show-report

# Generar reporte en CI/CD
npx allure generate allure-results -o allure-report --clean
```

---

##  Configuración Avanzada

### Modificar Timeout Global

Edita `playwright.config.js`:
```javascript
export default {
  timeout: 60000,  // 60 segundos por test
  expect: {
    timeout: 10000  // 10 segundos para assertions
  }
}
```

### Ejecutar en Múltiples Navegadores
```bash
# Solo Chrome
npx playwright test --project=chromium

# Solo Firefox
npx playwright test --project=firefox

# Solo WebKit (Safari)
npx playwright test --project=webkit

# Todos los navegadores
npx playwright test --project=chromium --project=firefox --project=webkit
```
### Configurar Retrys Automáticos

En `playwright.config.js`:
```javascript
export default {
  retries: 2,  // Reintentar 2 veces si falla
}
```

---
