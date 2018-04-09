window.CommerceModules = window.CommerceModules || [];
window.CommerceModules.push({
    'name': 'CommerceDymo',
    'create': function() {
        return new CommerceDymo();
    },
    'onRender': 'init'
});

class CommerceDymo {
    constructor () {
        console.log('constructed')
    }

    init(dom) {
        console.log('dymo init');
        let btns = dom.querySelectorAll('.commerce-dymo-print-btn');

        if (btns.length > 0) {

            // See if we have any printers
            try {
                let printers = dymo.label.framework.getPrinters();

                let printerName = '';
                for (let i = 0; i < printers.length; ++i) {
                    let printer = printers[i];
                    if (printer.printerType == "LabelWriterPrinter") {
                        printerName = printer.name;
                        break;
                    }
                }

                for (let i = 0; i < btns.length; i++) {
                    let btn = btns[i];

                    if (printerName === '') {
                        btn.style.display = 'none';
                        console.warn('[Commerce/Dymo] Unable of loading any Dymo printers - are you sure it is connected?');
                    }
                    else {
                        btn.querySelector('.printer-name').innerText = printerName;
                        btn.setAttribute('data-printer', printerName);
                        btn.addEventListener('click', this.printLabel);
                        btn.style.display = 'initial';
                    }
                }
            }
            catch (e){
                alert(e.message || e);
            }
        }
    }

    printLabel() {
        try {
            // open label
            let labelXml = document.getElementById('commerce-address-label').text,
                label = dymo.label.framework.openLabelXml(labelXml),
                btnTarget = this.getAttribute('data-content'),
                address = document.querySelector(btnTarget).textContent.trim();

            // set label text
            label.setObjectText("Address", address);

            // finally print the label
            label.print(this.getAttribute('data-printer'));
        }
        catch(e)
        {
            console.error(e);
            alert(e.message || e);
        }
    }
}