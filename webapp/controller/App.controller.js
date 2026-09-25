sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (
    Controller,
    MessageToast,
    MessageBox,
    Fragment
) {
    "use strict";

    return Controller.extend("mi.app.controller.App", {

        onInit: function () {
            this._actualizarContadores();
        },

        onAgregarTarea: async function () {

            this._modoEdicion = false;
            this._tareaEditada = null;

            await this._abrirDialogo();

            this._limpiarFormulario();

            this.oTaskDialog.setTitle("Nueva tarea");
            this.oTaskDialog.getEndButton().setText("Guardar");
        },

        _abrirDialogo: async function () {

            if (!this.oTaskDialog) {

                this.oTaskDialog = await Fragment.load({
                    name: "mi.app.view.TaskDialog",
                    controller: this
                });

                this.getView().addDependent(this.oTaskDialog);
            }

            this.oTaskDialog.open();
        },

        onEditarTarea: async function (oEvent) {

            const oContext = oEvent
                .getSource()
                .getBindingContext();

            const oTarea = oContext.getObject();

            this._modoEdicion = true;
            this._tareaEditada = oTarea;

            await this._abrirDialogo();

            sap.ui.getCore()
                .byId("taskTitleInput")
                .setValue(oTarea.titulo);

            sap.ui.getCore()
                .byId("taskStatusSelect")
                .setSelectedKey(oTarea.estado);

            this.oTaskDialog.setTitle("Editar tarea");
            this.oTaskDialog.getEndButton().setText("Guardar cambios");
        },

        onGuardarTarea: function () {

            const oModel = this.getView().getModel();
            const aTareas = oModel.getProperty("/Tareas");

            const oInput = sap.ui.getCore()
                .byId("taskTitleInput");

            const oSelect = sap.ui.getCore()
                .byId("taskStatusSelect");

            const sTitulo = oInput.getValue().trim();
            const sEstado = oSelect.getSelectedKey();

            if (!sTitulo) {
                MessageBox.warning(
                    "Introduce un título para la tarea."
                );
                return;
            }

            const sTipo = this._obtenerTipoEstado(sEstado);

            if (this._modoEdicion) {

                this._tareaEditada.titulo = sTitulo;
                this._tareaEditada.estado = sEstado;
                this._tareaEditada.tipo = sTipo;

                oModel.refresh(true);

                MessageToast.show(
                    "Tarea actualizada correctamente"
                );

            } else {

                const oNuevaTarea = {
                    id: this._obtenerNuevoId(aTareas),
                    titulo: sTitulo,
                    estado: sEstado,
                    tipo: sTipo
                };

                aTareas.push(oNuevaTarea);

                oModel.setProperty("/Tareas", aTareas);

                MessageToast.show(
                    "Tarea añadida correctamente"
                );
            }

            this._guardarDatos();

            this.oTaskDialog.close();

            this._limpiarFormulario();

            this._actualizarContadores();
        },

        onCancelarTarea: function () {

            this._limpiarFormulario();

            this.oTaskDialog.close();
        },

        onEliminarTarea: function (oEvent) {

            const oContext = oEvent
                .getSource()
                .getBindingContext();

            const oTarea = oContext.getObject();

            MessageBox.confirm(
                "¿Seguro que quieres eliminar la tarea \"" +
                oTarea.titulo +
                "\"?",
                {
                    title: "Eliminar tarea",

                    actions: [
                        MessageBox.Action.DELETE,
                        MessageBox.Action.CANCEL
                    ],

                    emphasizedAction: MessageBox.Action.DELETE,

                    onClose: function (sAction) {

                        if (
                            sAction === MessageBox.Action.DELETE
                        ) {
                            const oModel =
                                this.getView().getModel();

                            const aTareas =
                                oModel.getProperty("/Tareas");

                            const iIndex =
                                aTareas.indexOf(oTarea);

                            if (iIndex !== -1) {
                                aTareas.splice(iIndex, 1);
                            }

                            oModel.setProperty(
                                "/Tareas",
                                aTareas
                            );

                            this._guardarDatos();

                            this._actualizarContadores();

                            MessageToast.show(
                                "Tarea eliminada"
                            );
                        }
                    }.bind(this)
                }
            );
        },

        onBuscarTarea: function (oEvent) {

            const sQuery = oEvent
                .getParameter("query")
                .toLowerCase();

            const oTable =
                this.byId("taskTable");

            const oBinding =
                oTable.getBinding("items");

            if (!sQuery) {
                oBinding.filter([]);
                return;
            }

            const oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter(
                        "titulo",
                        sap.ui.model.FilterOperator.Contains,
                        sQuery
                    ),
                    new sap.ui.model.Filter(
                        "estado",
                        sap.ui.model.FilterOperator.Contains,
                        sQuery
                    )
                ],
                and: false
            });

            oBinding.filter([oFilter]);
        },

        _obtenerTipoEstado: function (sEstado) {

            switch (sEstado) {

                case "Completado":
                    return "Success";

                case "En Proceso":
                    return "Warning";

                default:
                    return "Error";
            }
        },

        _obtenerNuevoId: function (aTareas) {

            if (!aTareas.length) {
                return "1";
            }

            const aIds = aTareas.map(function (oTarea) {
                return Number(oTarea.id);
            });

            return String(Math.max.apply(null, aIds) + 1);
        },

        _limpiarFormulario: function () {

            const oInput =
                sap.ui.getCore().byId("taskTitleInput");

            const oSelect =
                sap.ui.getCore().byId("taskStatusSelect");

            if (oInput) {
                oInput.setValue("");
            }

            if (oSelect) {
                oSelect.setSelectedKey("Pendiente");
            }
        },

        _guardarDatos: function () {

            const oModel =
                this.getView().getModel();

            localStorage.setItem(
                "miAppTareas",
                JSON.stringify(oModel.getData())
            );
        },

        _actualizarContadores: function () {

            const oModel = this.getView().getModel();

            if (!oModel) {
                return;
            }

            const aTareas =
                oModel.getProperty("/Tareas") || [];

            const iTotal = aTareas.length;

            const iPendientes =
                aTareas.filter(function (oTarea) {
                    return oTarea.estado === "Pendiente";
                }).length;

            const iProceso =
                aTareas.filter(function (oTarea) {
                    return oTarea.estado === "En Proceso";
                }).length;

            const iCompletadas =
                aTareas.filter(function (oTarea) {
                    return oTarea.estado === "Completado";
                }).length;

            oModel.setProperty(
                "/Resumen",
                {
                    total: iTotal,
                    pendientes: iPendientes,
                    proceso: iProceso,
                    completadas: iCompletadas
                }
            );
        }

    });
});