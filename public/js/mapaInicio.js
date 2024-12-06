/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    // Coordenadas iniciales\r\n    const lat = 34.040967;\r\n    const lng = -118.1618621;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 14)\r\n\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa)\r\n\r\n   \r\n    \r\n\r\n    let propiedades = [];\r\n\r\n    const filtros = {\r\n        categoria: '',\r\n       precio: ''\r\n    }\r\n\r\n\r\n    const categoriasSelect = document.querySelector('#categorias')\r\n    const preciosSelect = document.querySelector('#precios')\r\n\r\n  \r\n   \r\n \r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    //Filtrado de categorias y precio\r\n\r\n   categoriasSelect.addEventListener('change', e => {\r\n        filtros.categoria = +e.target.value\r\n            filtrarPropiedades();\r\n   })\r\n\r\n   preciosSelect.addEventListener('change', e => {\r\n    filtros.precio = +e.target.value\r\n        filtrarPropiedades();\r\n    })\r\n\r\n\r\n  \r\n \r\n   \r\n \r\n    // Función para obtener las propiedades\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const url = '/api/propiedades';\r\n            const respuesta = await fetch(url);\r\n            propiedades = await respuesta.json();\r\n            console.log('Propiedades Obtenidas', propiedades);\r\n \r\n            // Llamada a la función para mostrar los pines\r\n            mostrarPropiedades(propiedades)\r\n \r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n     // Función para mostrar los pines de las propiedades\r\n     const mostrarPropiedades = (propiedades) => {\r\n\r\n        //Limpiar los markers\r\n        markers.clearLayers()\r\n\r\n        propiedades.forEach(propiedad => {\r\n            console.log(propiedad)\r\n            \r\n            // Agregar pines para cada propiedad\r\n            let marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan: true\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(\r\n                `\r\n                <p class=\"text-indigo-600 font-bold \">${propiedad?.categoria.nombre} </p>\r\n                <h1 class=\"text-xl font-extrabold uppercase my-3\">${propiedad?.titulo}</h1>\r\n                <img src=\"/uploads/${propiedad?.Imagen}\" alt=\"Imagen de la Propiedad: ${propiedad?.titulo}\">\r\n                <p class=\"text-gray-600 font-bold \">${propiedad?.precio.nombre} </p>\r\n                <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-700 block p-2 text-center font-bold uppercase size-1 text-sm \"> Ver Propiedad </a>\r\n               \r\n                `\r\n            )\r\n\r\n\r\n            markers.addLayer(marker)\r\n\r\n        })\r\n    }\r\n\r\n   const filtrarPropiedades = () => {\r\n       const resultado = propiedades.filter( filtrarCategoria).filter( filtrarPrecio)\r\n        mostrarPropiedades(resultado)\r\n      \r\n   }\r\n\r\n\r\n    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria :  propiedad\r\n\r\n    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio :  propiedad\r\n      \r\n   \r\n\r\n  \r\n \r\n    // Ejecutar la función para obtener las propiedades\r\n    obtenerPropiedades();\r\n})();\n\n//# sourceURL=webpack://bienesraicesnode/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;