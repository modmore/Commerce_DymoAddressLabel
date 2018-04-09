window.CommerceModules = window.CommerceModules || [];
window.CommerceModules.push({
    'name': 'CommerceDymo',
    'create': function() {
        return new CommerceDymo();
    },
    'onRender': 'init'
});

class CommerceDymo {
    init(dom) {
        let addresses = dom.querySelectorAll('.commerce-order-address-wrapper');

        if (addresses.length > 0) {

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

                for (let i = 0; i < addresses.length; i++) {
                    let address = addresses[i],
                        btnWrap = address.querySelector('.commerce-address-actions'),
                        target = address.querySelector('.commerce-order-address');

                    if (!btnWrap || !target) {
                        console.warn('Can\'t add print with dymo button; action (commerce-address-actions) or target dom (commerce-order-address) not found');
                        continue;
                    }
                    if (printerName === '') {
                        console.warn('[Commerce/Dymo] Unable of loading any Dymo printers - are you sure it is connected?');
                        break;
                    }

                    // Create a button with an icon and label, and insert it into the actions wrapper
                    let btn = document.createElement('button'),
                        icon = document.createElement('i'),
                        label = document.createElement('span');

                    btn.classList.add('ui', 'small', 'icon', 'labeled', 'button');
                    btn.setAttribute('data-printer', printerName);
                    btn.setAttribute('data-content', '#' + target.getAttribute('id'));
                    btn.addEventListener('click', this.printLabel);

                    icon.classList.add('icon', 'icon-print');

                    label.innerText = printerName;

                    btn.appendChild(icon);
                    btn.appendChild(label);
                    btnWrap.appendChild(btn);
                }
            }
            catch (e){
                console.error(e);
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