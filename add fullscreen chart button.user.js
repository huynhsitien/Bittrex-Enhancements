// ==UserScript==
// @name Bittrex fullscreen charts
// @description Adds a fullscreen toggle button to bittrex charts.
// @author toneffectory
// @version 1.0
// @namespace https://github.com/toneffectory/bittrexEnhancements
// @match        https://bittrex.com/Market/*
// @run-at document-end
// @grant none
// Copyright (c) 2017 toneffectory, licensed under the MIT License
// ==/UserScript==
var fullscreen = false;

function openFullscreen(){
    const off = 'col-md-8 col-sm-12';
    const on = 'col-md-12 col-sm-12';
    const onheight = Math.round(0.8 * (window.innerHeight)) + 'px';
    const offheight = '100%';
    fullscreen = !fullscreen;
    var wrapper = document.getElementById('tab-wrapper').parentNode;
    var chart = document.getElementById('tabChartTimeline');
    wrapper.className = fullscreen ? on : off;
    chart.style.height = fullscreen ? onheight : offheight;
}

(function() {
    'use strict';
    var tabRootNode = document.getElementsByClassName('nav nav-tabs nav-info-tab')[0];
    var fullscreenTab = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#tabChartTimeLine';
    var div = document.createElement('div');
    div.className = 'market-tab-header';
    var title = document.createElement('strong');
    title.className = 'visible-lg visible-md hidden-sm hidden-xs tab-title';
    title.innerHTML = 'Fullscreen';
    var button = document.createElement('i');
    button.className = 'fa fa-arrows-alt tab-icon';

    div.appendChild(title);
    div.appendChild(button);
    link.appendChild(div);
    fullscreenTab.appendChild(link);
    $(fullscreenTab).on('click', openFullscreen);
    tabRootNode.appendChild(fullscreenTab);
})();
