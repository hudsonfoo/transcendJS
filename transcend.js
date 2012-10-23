/*
 * The MIT License (MIT)
 * Copyright © 2012 David Hudson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {
    // transcendJS is responsible for recursing through the siteObject, managing styles, and other general duties
    transcendJS = function(siteObject, settings) {
        settings = $.extend({
            isDebug: true
        }, settings);

        if (settings.isDebug) {
            var start = new Date();
        }

        function recurseThroughNodes(builder, parentNode) {
            var inheritElement;

            for (var key in builder) {
                builder[key]['node'] = new element($.extend(builder[key], {
                    'id': key
                }));

                builder[key]['node'].css(elementUtils.resetCSS);

                if (builder[key]['inheritStylesFrom']) {
                    inheritElement = elementUtils.findElement(siteObject, builder[key]['inheritStylesFrom']);
                    if (inheritElement) {
                        builder[key]['node'].css($.extend(elementUtils.resetCSS, elementUtils.generateCSS($.extend(inheritElement.style, builder[key]['style']))));
                    }
                } else if (!builder[key]['inheritStylesFrom'] && builder[key]['style']) {
                    builder[key]['node'].css(elementUtils.generateCSS(builder[key]['style']));
                }

                parentNode.append(builder[key]['node']);
                if (builder[key]['children']) {
                    recurseThroughNodes(builder[key]['children'], builder[key]['node']);
                }
            }
        }

        recurseThroughNodes(siteObject, $('body'));

        if (settings.isDebug) {
            console.log('transcendJS site object loaded in: ' + Math.abs(new Date() - start) + " ms");;
        }
    };

    // element is the basic building block of transcend
    element = function(builder) {
        var elementCanvas = jQuery('<div/>', {
            text: builder['text'],
            id: builder['id']
        });

        // Setup events
        if (typeof builder['onClick'] == 'function') {
            elementCanvas.click(builder['onClick']);
        }

        return elementCanvas;
    };

    elementUtils = {};

    // CSS reset object. FIXME: Needs a bunch more most likely
    elementUtils.resetCSS = {
        'margin': '0',
        'padding': '0',
        'border': '0',
        'font-size': '100%',
        'font': 'inherit',
        'vertical-align': 'baseline',
        'font-weight': 'normal',
        'font-style': 'normal',
        'list-style':'none'
    };

    // Generates CSS from transcend style properties
    elementUtils.generateCSS = function(styles) {
        var cssStyles = {};
        for (var styleName in styles) {
            switch (styleName) {
            default:
                cssStyles[styleName] = styles[styleName];
                break;

            case "alignment":
                switch (styles["alignment"]) {
                case "left":
                    cssStyles['float'] = 'left';
                    break;

                case "center":
                    // Requires a width to be set
                    if (!styles['width']) {
                        // FIXME: Find a way to set width automatically in this case?
                        console.warn('Element cannot be centered without a set width', styles);
                    } else {
                        cssStyles['margin-left'] = 'auto';
                        cssStyles['margin-right'] = 'auto';
                    }
                    break;

                case "right":
                    cssStyles['float'] = 'right';
                    break;
                }
                break;
            }
        }

        return cssStyles;
    }

    // Finds an element in the given builder
    elementUtils.findElement = function(builder, elementId) {
        var result;
        for (var i in builder) {
            // If this object is correct, return it
            if (i == elementId) {
                return builder[i];
            }

            if (builder[i]['children']) {
                result = elementUtils.findElement(builder[i]['children'], elementId);
                if (result) {
                    return result;
                }
            }
        }

        return false;
    }
})(jQuery);
