// ==UserScript==
// @name bittrex-chart-enhancements
// @description Adds enhancements to bittrex charts:
//  1. save chart settings (including studies and candleperiods!) in local storage and auto-restore on loading chart
//  2. save chart annotations (drawings) in local storage and auto-restore on loading chart
//  3. add chart reload button
// @author toneffectory
// @version 1.0
// @namespace https://github.com/toneffectory/bittrexEnhancements
// @include https://bittrex.com/market/MarketStandardChart?*
// @run-at document-end
// @grant none
// Copyright (c) 2017 toneffectory, licensed under the MIT License
// ==/UserScript==

(function() {
    'use strict';
    function initDialogBox(){
        var dialogBox = document.createElement('div');
        dialogBox.id = 'customDialog';
        dialogBox.className = 'stx-dialog';
        dialogBox.style = 'display:none; width:400px;text-align:center;';
        dialogBox.innerHTML = '<h4 class="title"></h4><div onclick="STX.DialogManager.dismissDialog()" class="stx-btn stx-ico"><span class="stx-ico-close">Close</span></div><div id="dialogBody"></div>';
        $(dialogBox).prependTo('.stx-dialog-container');
    }
    function showDialogBox(title, body){
        $('#customDialog .title').html(title);
        $('#customDialog #dialogBody').html(body);
        STX.DialogManager.displayDialog("customDialog");
    }

    function getMarket(){
        let market = document.location.search.substring(1).split('=')[1];
        return market;
    }

    function chartReload(){
        document.location.href = document.location.href;
    }

    function chartSettingsSave(){
        var chartSettings = stxx.exportLayout();
        localStorage.setItem('chartSettings', JSON.stringify(chartSettings));
        showDialogBox('Layout saved','The chart settings and indicators have been succesfully saved and will be automatically reloaded next time you visit this chart.');
    }

    function chartAnnotationsSave(){
        var chartAnnotations = stxx.serializeDrawings();
        var savedChartAnnotations = {};
        savedChartAnnotations = JSON.parse(localStorage.getItem('chartAnnotations'));
        if (savedChartAnnotations !== null) {
            if (savedChartAnnotations.hasOwnProperty(getMarket()) !== null) {
                delete savedChartAnnotations[getMarket()];
            }
            savedChartAnnotations[getMarket()] = chartAnnotations;
        }
        else {
            savedChartAnnotations = {};
            savedChartAnnotations[getMarket()] = chartAnnotations;
        }
        localStorage.setItem('chartAnnotations', JSON.stringify(savedChartAnnotations));
        showDialogBox('Annotations saved','The annotations in this chart have been succesfully saved and will be automatically reloaded next time you visit this chart.');
    }

    function chartSettingsRestore() {
        var periods;
        var savedChartSettings = JSON.parse(localStorage.getItem('chartSettings'));
        if (savedChartSettings) {
            delete savedChartSettings.panels;
            delete savedChartSettings.candleWidth;
            switch (savedChartSettings.timeUnit){
                case 'minute':
                    periods = savedChartSettings.interval * savedChartSettings.periods;
                    break;
                case 'day':
                    if (savedChartSettings.interval == 3){
                        periods = '3d';
                    } else if (savedChartSettings.interval == 7){
                        periods = 'week';
                    } else {
                        periods = 'day';
                    }
                    break;
                case 'hour':
                case 'month':
                    periods = savedChartSettings.timeUnit;
                    break;
            }
            stxx.importLayout(savedChartSettings);
            if (periods) changePeriodicity(periods);
        }
    }

    function chartAnnotationsRestore(){
        var savedChartAnnotations = JSON.parse(localStorage.getItem('chartAnnotations'));
        if (savedChartAnnotations !== null) {
            if (savedChartAnnotations.hasOwnProperty(getMarket())) {
                stxx.reconstructDrawings(savedChartAnnotations[getMarket()]);
            }
        }
    }

    function chartRestore() {
        chartSettingsRestore();
        chartAnnotationsRestore();
    }

    function createMenuItem(type, attr, attrfunc, name, clickfunc) {
        var item = document.createElement(type);
        item.setAttribute(attr,attrfunc);
        item.innerHTML = name;
        $(item).on('click', clickfunc);
        return item;
    }
    function createSaveMenu() {
        var chartSaveButton = document.createElement('div');
        chartSaveButton.className = 'stx-btn stx-menu-btn stxMenu';
        chartSaveButton.innerHTML = 'Save/Restore<em></em>';
        var list = document.createElement('ul');
        list.id = 'chart-save';
        list.className = 'chart-display menuSelect menuOutline';
        list.style = 'display: none;';
        var divider = document.createElement('li');
        divider.className = 'stx-menu-divider';
        $(list).append(createMenuItem('li', 'stxtoggle', '', 'Save chart Settings', chartSettingsSave));
        $(list).append(createMenuItem('li', 'stxtoggle', '', 'Save annotations', chartAnnotationsSave));
        $(list).append(divider);
        $(list).append(createMenuItem('li', 'stxtoggle', '', 'Restore chart settings', chartSettingsRestore));
        $(chartSaveButton).append(list).prependTo('.stx-nav .stx-menus');
        STX.MenuManager.makeMenus();
    }

    function createReloadButton() {
        var chartReloadButton = document.createElement('div');
        chartReloadButton.className = 'fa fa-refresh stx-btn stx-menu-btn';
        chartReloadButton.style = 'width:16px; padding:0 10px';
        chartReloadButton.title = 'Reload';
        $(chartReloadButton).on('click', chartReload).prependTo('.stx-nav .stx-menus');
    }

    // main function
    try{
        setTimeout(chartRestore, 1000);
        initDialogBox();
        createSaveMenu();
        createReloadButton();
    } catch (e){ console.log(e); }
})();

