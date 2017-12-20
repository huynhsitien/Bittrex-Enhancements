// ==UserScript==
// @name Bittrex fav charts on homescreen
// @description Adds two tradingView widgets on bittrex home screen.
// 1. USDT to most common cryptocoins
// 1. BCT to most common cryptocoins
// @author toneffectory
// @version 1.0
// @namespace https://github.com/toneffectory/bittrexEnhancements
// @match        https://bittrex.com/Home/Markets
// @run-at document-end
// @grant none
// Copyright (c) 2017 toneffectory, licensed under the MIT License
// ==/UserScript==

function createWidget(nodeId,symbols) {
    console.log('ADDING NODE --> ' + symbols);
    var favNode = document.createElement('div');
    favNode.id = nodeId;
    var node = document.createElement('script');
    node.innerHTML = 'new TradingView.MediumWidget({';
    node.innerHTML += '"container_id": "' + nodeId + '",';
    node.innerHTML += '"symbols": [';
    node.innerHTML += symbols;
    node.innerHTML += '],';
    node.innerHTML += '"greyText": "Quotes by",';
    node.innerHTML += '"gridLineColor": "##dbeffb",';
    node.innerHTML += '"fontColor": "#83888D",';
    node.innerHTML += '"underLineColor": "#dbeffb",';
    node.innerHTML += '"trendLineColor": "#4bafe9",';
    node.innerHTML += '"width": "100%",';
    node.innerHTML += '"height": "350px",';
    node.innerHTML += '"locale": "en"';
    node.innerHTML += '});';
    favNode.appendChild(node);
    favNode.style.width = "50%";
    favNode.style.float = "left";
    return favNode;
}

(function() {
    'use strict';
    var rootNode = document.getElementsByClassName('connected-carousels')[0];
    var favCharts = document.createElement('div');
    favCharts.id = 'favcharts';
    var js = document.createElement('script');
    js.onload = function(){
        favCharts.appendChild(createWidget('USDT','["BTCUSDT","BITTREX:BTCUSDT|1m"],["ETHUSDT","BITTREX:ETHUSDT|1m"],["NEOUSDT","BITTREX:NEOUSDT|1m"],["XRPUSDT","BITTREX:XRPUSDT|1m"],["OMGUSDT","BITTREX:OMGUSDT|1m"],["BCCUSDT","BITTREX:BCCUSDT|1m"],["LTCUSDT","BITTREX:LTCUSDT|1m"],["DASHUSDT","BITTREX:DASHUSDT|1m"],["ZECUSDT","BITTREX:ZECUSDT|1m"],["EHCUSDT","BITTREX:EHCUSDT|1m"]'));
        favCharts.appendChild(createWidget('BTC','["ETHBTC","BITTREX:ETHBTC|1m"],["NEOBTC","BITTREX:NEOBTC|1m"],["XRPBTC","BITTREX:XRPBTC|1m"],["OMGBTC","BITTREX:OMGBTC|1m"],["BCCBTC","BITTREX:BCCBTC|1m"],["LTCBTC","BITTREX:LTCBTC|1m"],["DASHBTC","BITTREX:DASHBTC|1m"],["ZECBTC","BITTREX:ZECBTC|1m"],["EHCBTC","BITTREX:EHCBTC|1m"]'));
    };
    js.src = 'https://s3.tradingview.com/tv.js';
    rootNode.appendChild(js);
    rootNode.append(favCharts);
})();
