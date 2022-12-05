const modalActiveClass = 'modal--active';

const modalNode = document.querySelector('.modal');
const modalCloseNode = document.querySelector('.modal__close-icon');

modalCloseNode.addEventListener(
    'click',
    function() {
        modalNode.classList.remove(modalActiveClass);
        document.body.classList.remove('locked');
    }
);

const modalPaymentMethodsTriggerNodes = Array.from(
    document.querySelectorAll(
        '[data-modal-payment-methods-trigger]',
    ),
);
const modalDeliveryMethodsTriggerNodes = Array.from(
    document.querySelectorAll(
        '[data-modal-delivery-methods-trigger]',
    ),
);
const modalPaymentMethodsNodes = Array.from(
    document.querySelectorAll(
        '[data-modal-payment-methods]',
    ),
);
const modalDeliveryMethodsNodes = Array.from(
    document.querySelectorAll(
        '[data-modal-delivery-methods]',
    ),
);

modalPaymentMethodsTriggerNodes.forEach(
    node => node.addEventListener(
        'click',
        function() {
            document.body.classList.add('locked');
            modalNode.classList.add(modalActiveClass);

            modalDeliveryMethodsNodes.forEach(
                node => node.classList.add('hidden'),
            );

            modalPaymentMethodsNodes.forEach(
                node => node.classList.remove('hidden'),
            );
        },
    ),
);


modalDeliveryMethodsTriggerNodes.forEach(
    node => node.addEventListener(
        'click',
        function() {
            document.body.classList.add('locked');
            modalNode.classList.add(modalActiveClass);

            modalPaymentMethodsNodes.forEach(
                node => node.classList.add('hidden'),
            );

            modalDeliveryMethodsNodes.forEach(
                node => node.classList.remove('hidden'),
            );
        },
    ),
);
