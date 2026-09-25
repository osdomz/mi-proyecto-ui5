# Panel de Gestión de Tareas

Aplicación web desarrollada con OpenUI5 para gestionar tareas mediante una interfaz sencilla y responsive.

El proyecto permite crear, editar, eliminar y buscar tareas, mostrando su estado de forma visual. Los datos se almacenan localmente en el navegador para mantener la información después de recargar la aplicación.

## Tecnologías

* OpenUI5
* JavaScript
* XML Views
* JSONModel
* UI5 CLI
* HTML
* CSS

## Funcionalidades

* Listado de tareas mediante binding de datos.
* Creación de nuevas tareas.
* Edición y eliminación de tareas.
* Búsqueda por título o estado.
* Contadores de tareas según su estado.
* Persistencia de datos mediante localStorage.
* Diálogo reutilizable mediante Fragment.

## Estructura

```text
webapp/
├── Component.js
├── index.html
├── manifest.json
├── controller/
│   └── App.controller.js
└── view/
    ├── App.view.xml
    └── TaskDialog.fragment.xml
```

## Instalación

Clonar el repositorio y ejecutar:

```bash
npm install
npm start
```

La aplicación se abrirá mediante el servidor de desarrollo de UI5.

## Objetivo

Proyecto realizado como práctica para trabajar con la arquitectura y los principales conceptos de desarrollo de aplicaciones con OpenUI5.
