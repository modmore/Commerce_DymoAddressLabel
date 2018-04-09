'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.CommerceModules = window.CommerceModules || [];
window.CommerceModules.push({
    'name': 'CommerceDymo',
    'create': function create() {
        return new CommerceDymo();
    },
    'onRender': 'init'
});

var CommerceDymo = function () {
    function CommerceDymo() {
        _classCallCheck(this, CommerceDymo);

        console.log('constructed');
    }

    _createClass(CommerceDymo, [{
        key: 'init',
        value: function init(dom) {
            console.log('dymo init');
            var btns = dom.querySelectorAll('.commerce-dymo-print-btn');

            if (btns.length > 0) {

                // See if we have any printers
                try {
                    var printers = dymo.label.framework.getPrinters();

                    var printerName = '';
                    for (var i = 0; i < printers.length; ++i) {
                        var printer = printers[i];
                        if (printer.printerType == "LabelWriterPrinter") {
                            printerName = printer.name;
                            break;
                        }
                    }

                    for (var _i = 0; _i < btns.length; _i++) {
                        var btn = btns[_i];

                        if (printerName === '') {
                            btn.style.display = 'none';
                            console.warn('[Commerce/Dymo] Unable of loading any Dymo printers - are you sure it is connected?');
                        } else {
                            btn.querySelector('.printer-name').innerText = printerName;
                            btn.setAttribute('data-printer', printerName);
                            btn.addEventListener('click', this.printLabel);
                            btn.style.display = 'initial';
                        }
                    }
                } catch (e) {
                    alert(e.message || e);
                }
            }
        }
    }, {
        key: 'printLabel',
        value: function printLabel() {
            try {
                // open label
                var labelXml = document.getElementById('commerce-address-label').text,
                    label = dymo.label.framework.openLabelXml(labelXml),
                    btnTarget = this.getAttribute('data-content'),
                    address = document.querySelector(btnTarget).textContent.trim();

                // set label text
                label.setObjectText("Address", address);

                // finally print the label
                label.print(this.getAttribute('data-printer'));
            } catch (e) {
                console.error(e);
                alert(e.message || e);
            }
        }
    }]);

    return CommerceDymo;
}();
