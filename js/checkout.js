const checkboxActiveClass = 'checkbox--checked';
let productInCardIds = ['1', '2', '3'];
const discountsMap = {
    1: {
        id: 1,
        multiplier: 0.55,
    },
    2: {
        id: 2,
        multiplier: 0.1,
    },
};
const productsMap = {
    1: {
        id: 1,
        inStock: 2,
        currentCount: 1,
        appliedDiscountIds: [1, 2],
        price: 1051,
    },
    2: {
        id: 2,
        inStock: 300,
        currentCount: 255,
        appliedDiscountIds: [1, 2],
        price: 9020,
    },
    3: {
        id: 3,
        inStock: 2,
        currentCount: 2,
        appliedDiscountIds: [1, 2],
        price: 475,
    },
};

const getPrettyNumber = num => num
    .toLocaleString()
    .split(',')
    .join(' ');

const calculateProductPrices = productId => {
    const {
        currentCount,
        appliedDiscountIds,
        price,
    } = productsMap[productId];
    let totalDisountMultiplier = 0;

    appliedDiscountIds.forEach(id => {
        totalDisountMultiplier = discountsMap[id].multiplier;
    });

    let total = price * currentCount;
    let totalDiscount = Math.ceil(
        total * totalDisountMultiplier,
    );
    let totalWithDiscount = total - totalDiscount;

    return { total, totalDiscount, totalWithDiscount };
};

const updateProductPrice = productId => {
    const productNode = document.querySelector(
        `[data-product-id='${productId}']`,
    );
    const priceNode = productNode.querySelector(
        '[data-price]',
    );
    const oldPriceNode = productNode.querySelector(
        '[data-old-price]',
    );

    const {
        total,
        totalWithDiscount,
    } = calculateProductPrices(productId);

    priceNode.textContent = getPrettyNumber(
        totalWithDiscount,
    );
    oldPriceNode.textContent = getPrettyNumber(total);
};

const updateCheckout = () => {
    let total = 0;
    let totalDiscount = 0;
    let totalWithDiscount = 0;
    let totalProductsAmount = 0;

    productInCardIds.forEach(id => {
        const productPrices = calculateProductPrices(id);

        total += productPrices.total;
        totalDiscount += productPrices.totalDiscount;
        totalWithDiscount += productPrices.totalWithDiscount;
        totalProductsAmount += productsMap[id].currentCount;
    });

    const totalWithDiscountNodes = Array.from(
        document.querySelectorAll(
            '[data-summary-total-with-discount]',
        )
    );
    const productsCountNode = document.querySelector(
        '[data-summary-products-count]',
    );
    const totalNodes = Array.from(
        document.querySelectorAll(
            '[data-summary-total]',
        )
    );
    const totalDiscountNode = document.querySelector(
        '[data-summary-total-discount]',
    );
    const totalProductsAmountNode = document.querySelector(
        '[data-summary-products-amount]',
    );

    totalWithDiscountNodes.forEach(
        node => node.textContent = getPrettyNumber(
            totalWithDiscount,
        ),
    );
    productsCountNode.textContent = productInCardIds.length;
    totalNodes.forEach(
        node => node.textContent = getPrettyNumber(total),
    );
    totalDiscountNode.textContent = getPrettyNumber(
        totalDiscount,
    );
    totalProductsAmountNode.textContent = getPrettyNumber(
        totalProductsAmount,
    );
};

const controlDisabledClass = 'count-controls__control--disabled';
const decrementProductControls = Array.from(
    document.querySelectorAll('[data-product-decrement]')
);
const incrementProductControls = Array.from(
    document.querySelectorAll('[data-product-increment]')
);

function decrementProductCount (decrementControlNode) {
    if (decrementControlNode.classList.contains(
        controlDisabledClass
    )) {
        return;
    }

    const productNode = decrementControlNode.closest(
        '[data-product-id]',
    );
    const { productId } = productNode.dataset;
    const countNode = productNode.querySelector(
        '[data-product-count]',
    );
    const product = productsMap[productId];

    product.currentCount--;

    countNode.textContent = product.currentCount;

    if (product.currentCount === 1) {
        decrementControlNode.classList.add(
            controlDisabledClass,
        );
    }

    const incrementControlNode = productNode.querySelector(
        '[data-product-increment]',
    );

    incrementControlNode.classList.remove(
        controlDisabledClass,
    );

    updateProductPrice(productId);
    updateCheckout();
}

function incrementProductCount (incrementControlNode) {
    if (incrementControlNode.classList.contains(
        controlDisabledClass
    )) {
        return;
    }

    const productNode = incrementControlNode.closest(
        '[data-product-id]',
    );
    const { productId } = productNode.dataset;
    const product = productsMap[productId];
    const countNode = productNode.querySelector(
        '[data-product-count]',
    );

    product.currentCount++;

    countNode.textContent = product.currentCount;

    if (product.currentCount === product.inStock) {
        incrementControlNode.classList.add(
            controlDisabledClass,
        );
    }

    const decrementControlNode = productNode.querySelector(
        '[data-product-decrement]',
    );

    decrementControlNode.classList.remove(
        controlDisabledClass,
    );

    updateProductPrice(productId);
    updateCheckout();
}

decrementProductControls.forEach(
    controlNode => controlNode.addEventListener(
        'click',
        e => decrementProductCount(e.target),
    ),
);

incrementProductControls.forEach(
    controlNode => controlNode.addEventListener(
        'click',
        e => incrementProductCount(e.target),
    ),
);

const favoriteControls = Array.from(
    document.querySelectorAll(
        '[data-product-favorite]',
    )
);

favoriteControls.forEach(
    controlNode => controlNode.addEventListener(
        'click',
        function() {
            this.classList.toggle('card__heart--active');
        },
    ),
);

function removeProduct (removeControlNode) {
    const productNode = removeControlNode.closest(
        '[data-product-id]',
    );
    const { productId } = productNode.dataset;

    productInCardIds = productInCardIds.filter(
        id => id !== productId,
    );

    productNode.remove();
    updateCheckout();
}

const removeControls = Array.from(
    document.querySelectorAll(
        '[data-product-remove]',
    ),
);

removeControls.forEach(
    controlNode => controlNode.addEventListener(
        'click',
        e => removeProduct(e.target),
    ),
);

const paymentTimeToggle = document.querySelector(
    '[data-payment-time-toggle]',
);
const payImmediatelyNode = document.querySelector(
    '[data-summary-pay-immediately]',
);
const payLaterNode = document.querySelector(
    '[data-summary-pay-later]',
);

paymentTimeToggle.addEventListener(
    'click',
    function() {
        const checkboxNode = this.querySelector(
            '.checkbox',
        );

        checkboxNode.classList.toggle(checkboxActiveClass);

        if (checkboxNode.classList.contains(checkboxActiveClass)) {
            payImmediatelyNode.classList.remove('hidden');
            payLaterNode.classList.add('hidden');
        } else {
            payImmediatelyNode.classList.add('hidden');
            payLaterNode.classList.remove('hidden');
        }
    },
);

const cardCheckboxNodes = Array.from(
    document.querySelectorAll(
        '[data-card-checkbox]',
    ),
);

const cardSelectAllCheckboxNode = document.querySelector(
    '[data-card-select-all-checkbox]',
);

cardCheckboxNodes.forEach(
    node => node.addEventListener(
        'click',
        function() {
            this.classList.toggle(checkboxActiveClass);

            const { productId } = this.closest(
                '[data-product-id]',
            ).dataset;

            if (this.classList.contains(
                checkboxActiveClass,
            )) {
                productInCardIds.push(productId);

                const allChecked = cardCheckboxNodes.every(
                    node => node.classList.contains(
                        checkboxActiveClass,
                    ),
                );

                if (allChecked) {
                    cardSelectAllCheckboxNode.classList.add(
                        checkboxActiveClass,
                    );
                }
            } else {
                productInCardIds = productInCardIds.filter(
                    id => id !== productId,
                );

                cardSelectAllCheckboxNode.classList.remove(
                    checkboxActiveClass,
                );
            }

            updateCheckout();
        },
    ),
);

cardSelectAllCheckboxNode.addEventListener(
    'click',
    function() {
        this.classList.toggle(checkboxActiveClass);

        const cards = Array.from(
            document.querySelectorAll('[data-product-list] .card'),
        );
        const cardIds = [];

        cards.forEach(card => {
            const { productId } = card.dataset;
            const checkbox = card.querySelector('.checkbox');

            if (this.classList.contains(checkboxActiveClass)) {
                cardIds.push(productId);
                checkbox.classList.add(checkboxActiveClass);
            } else {
                checkbox.classList.remove(checkboxActiveClass);
            }
        });

        productInCardIds = cardIds;
        updateCheckout();
    },
);

const dropdownToggleNodes = Array.from(
    document.querySelectorAll(
        '.dropdown .dropdown__icon',
    ),
);

dropdownToggleNodes.forEach(
    node => node.addEventListener(
        'click',
        function() {
            const dropdown = this.closest('.dropdown');

            dropdown.classList.toggle('dropdown--expanded')
        },
    ),
);

// TODO: Add remove element from out of stock
let outOfStockProductsCount = 3;