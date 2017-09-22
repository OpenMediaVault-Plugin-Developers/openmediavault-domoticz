/**
 * Copyright (C) 2015-2017 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")

Ext.define("OMV.module.admin.service.domoticz.Settings", {
    extend : "OMV.workspace.form.Panel",

    rpcService   : "Domoticz",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    getFormItems : function() {
        var me = this;
        return [{
            xtype    : "fieldset",
            title    : "General settings",
            defaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            }]
        },{
            xtype    : "fieldset",
            title    : "HTTP settings",
            defaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "httpenable",
                fieldLabel : _("HTTP Enable"),
                checked    : true,
                listeners: {
                    scope: me,
                    change: function(field) {
                        if (field.value == false) {
                            var https = me.findField("httpsenable");
                            https.setValue(true);
                        }
                    }
                }
            },{
                xtype: 'numberfield',
                name: 'httpport',
                fieldLabel: _('HTTP Port'),
                minValue: 8000,
                maxValue: 10000,
                allowDecimals: false,
                allowBlank: true
            }]
        },{
            xtype    : "fieldset",
            title    : "HTTPS settings",
            defaults : {
                labelSeparator : ""
            },
            items : [{
                xtype      : "checkbox",
                name       : "httpsenable",
                fieldLabel : _("HTTPS Enable"),
                checked    : true,
                listeners: {
                    scope: me,
                    change: function(field) {
                        if (field.value == false) {
                            var http = me.findField("httpenable");
                            http.setValue(true);
                        }
                    }
                }
            },{
                xtype: 'numberfield',
                name: 'httpsport',
                fieldLabel: _('HTTPS Port'),
                minValue: 8000,
                maxValue: 10000,
                allowDecimals: false,
                allowBlank: true
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/domoticz",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.domoticz.Settings"
});
