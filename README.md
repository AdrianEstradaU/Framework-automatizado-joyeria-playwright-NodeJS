# JOYERIA WILMA

## Instrucciones para configurar el proyecto

### Requisitos
* Node.js
* Visual Studio Code

###  Instalación
Instalar las dependencias por medio de la terminal utilizando el comando: 
```
npm install
```
### Ejecución
La ejecución de pruebas se realiza, depende al módulo que se requiera probar.

* Comando para ejecutar pruebas UI 

```
npx playwright test 
```

* Comando para visualizar resultados en allure 

```
allure serve allure-results
```
npx playwright test --grep "@Regression"
O para varios tags combinados:

bash
Copiar código
# Solo @Regression y @Smoke
npx playwright test --grep "@Regression|@Smoke"

# Solo los @negative
npx playwright test --grep "@negative"