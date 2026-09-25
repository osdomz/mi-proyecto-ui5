sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("mi.app.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            const sTareasGuardadas = localStorage.getItem("miAppTareas");

            let oData;

            if (sTareasGuardadas) {
                oData = JSON.parse(sTareasGuardadas);
            } else {
                oData = {
                    Tareas: [
                        {
                            id: "1",
                            titulo: "Migración de servidor",
                            estado: "Completado",
                            tipo: "Success"
                        },
                        {
                            id: "2",
                            titulo: "Revisar logs de OData",
                            estado: "En Proceso",
                            tipo: "Warning"
                        },
                        {
                            id: "3",
                            titulo: "Pruebas de interfaz UI5",
                            estado: "Pendiente",
                            tipo: "Error"
                        }
                    ]
                };
            }

            const oModel = new JSONModel(oData);

            this.setModel(oModel);

            oModel.attachPropertyChange(function () {
                localStorage.setItem(
                    "miAppTareas",
                    JSON.stringify(oModel.getData())
                );
            });
        }
    });
});