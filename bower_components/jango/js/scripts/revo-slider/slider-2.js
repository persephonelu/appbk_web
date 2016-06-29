$(document).ready(function() {
    var slider = $('.c-layout-revo-slider .tp-banner');

    var cont = $('.c-layout-revo-slider .tp-banner-container');

    var api = slider.show().revolution({
        delay: 15000,    
        startwidth:1170,
        startheight: App.getViewPort().height,
       
        navigationType: "hide",
        navigationArrows: "solo",

        touchenabled: "on",
        onHoverStop: "on",

        keyboardNavigation: "off",

        navigationStyle: "circle",
        navigationHAlign: "center",
        navigationVAlign: "bottom",

        spinner: "spinner2",

        fullScreen: 'on',       
        fullScreenAlignForce:"on",
        fullScreenOffsetContainer: '',

        shadow: 0,
        fullWidth: "off",
        forceFullWidth: "on",
        hideTimerBar:"on",

        hideThumbsOnMobile: "on",
        hideNavDelayOnMobile: 1500,
        hideBulletsOnMobile: "on",
        hideArrowsOnMobile: "on",
        hideThumbsUnderResolution: 0
    });
}); //ready