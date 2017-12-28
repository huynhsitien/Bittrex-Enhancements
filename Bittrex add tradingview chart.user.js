// ==UserScript==
// @name Bittrex add tradingview chart
// @description Adds chart tab with tradingview chart widget
// @author toneffectory
// @version 1.0
// @namespace https://github.com/toneffectory/bittrexEnhancements
// @match        https://bittrex.com/Market/*
// @run-at document-end
// @grant none
// Copyright (c) 2017 toneffectory, licensed under the MIT License
// ==/UserScript==

function getMarket(){
    var query = (location.search+'').replace(/^\?/,'').split('&').reduce(function(dest, pairRaw){
        var pair = pairRaw.split('=');
        dest[pair[0]] = pair[1];
		return dest;
    }, {});
    var bittrexMarketName = query.MarketName;
    var tradingPair = bittrexMarketName.split('-');
    var market = tradingPair[0];
    var currency = tradingPair[1];
    var tradingViewMarketName = 'BITTREX:'+currency+market;
    return tradingViewMarketName;
}

(function() {
    'use strict';
    var marketName = getMarket();
    var tabRootNode = document.getElementsByClassName('nav nav-tabs nav-info-tab')[0];
    var bittrexchartTab = tabRootNode.firstChild.nextSibling.nextSibling.nextSibling;
    var tradingviewTab = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#tabTradingview';
    link.setAttribute('data-toggle','tab');
    var div = document.createElement('div');
    div.className = 'market-tab-header';
    var title = document.createElement('strong');
    title.className = 'visible-lg visible-md hidden-sm hidden-xs tab-title';
    title.innerHTML = 'Tradingview';
    var button = document.createElement('i');
    button.className = 'fa fa-bar-chart tab-icon';
    div.appendChild(title);
    div.appendChild(button);
    link.appendChild(div);
    tradingviewTab.appendChild(link);
    bittrexchartTab.parentNode.insertBefore(tradingviewTab, bittrexchartTab.nextSibling);

    var chartRootNode = document.getElementsByClassName('tab-content')[0];
    var chartpane = document.createElement('div');
    var chartwrapper = document.createElement('div');
    var tradingviewIframe = document.createElement('iframe');
    chartpane.className = 'tab-pane';
    chartpane.id = 'tabTradingview';
    chartwrapper.className = 'chart-wrapper';
    chartwrapper.id = 'tradingviewWrapper';
    chartwrapper.style = 'height:400px;';
    chartwrapper.appendChild(tradingviewIframe);
    chartpane.appendChild(chartwrapper);
    chartRootNode.appendChild(chartpane);

    var s = document.createElement('script');
    s.onload = function(){
        var tradingViewWidget = new TradingView.widget({
            container_id:'tradingviewWrapper',
            "symbol": marketName,
            "autosize": true,
            "interval": "30",
            "timezone": "Etc/UTC",
            "theme": "Light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "hide_side_toolbar": false,
            "hideideas": true
        });

    };
    s.src = 'https://s3.tradingview.com/tv.js';
    document.body.appendChild(s);
})();
