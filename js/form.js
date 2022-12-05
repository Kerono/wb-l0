function updateInputError(inputNode, errorText = null) {
    const errorNodeClasses = [
        'form__description',
        'form__description--error',
    ];
    const formFieldNode = inputNode.closest('.form-field');
    const previousErrorNode = formFieldNode.querySelector(
        '.' + errorNodeClasses.join('.'),
    );

    if (previousErrorNode) {
        formFieldNode.removeChild(previousErrorNode);

        inputNode.classList.remove('form__input--error');
    }

    if (errorText === null) return;

    let errorNode = document.createElement('div');

    errorNode.classList.add(...errorNodeClasses);
    errorNode.textContent = errorText;

    formFieldNode.appendChild(errorNode);
    inputNode.classList.add('form__input--error');
}

function validateInput(inputNode) {
    const errors = [];
    const { value, dataset } = inputNode;

    if (String(value).length === 0) {
        errors.push('Поле должно быть заполнено');
    }

    if (dataset.minLength) {
        const minLength = Number(dataset.minLength);

        if (minLength && value.length < minLength) {
            errors.push(`Поле должно иметь не менее ${minLength} знаков`);
        }
    }

    if (dataset.regex) {
        const regex = new RegExp(dataset.regex);

        if (!value.match(regex)) {
            errors.push('Неверное значение поля');
        }
    }

    if (dataset.length) {
        const length = Number(dataset.length);

        if (length && value.length < length) {
            errors.push(`Поле должно иметь ${length} символов`);
        }
    }

    return errors;
}

const submitButton = document.getElementById('submit-button');
const recipientInputs = Array.from(
    document.querySelectorAll('form.form input'),
);

submitButton.addEventListener('click', () => {
    let wasScrolled = false;

    recipientInputs.forEach(
        input => {
            const errors = validateInput(input);

            updateInputError(input, errors[0]);

            if (!wasScrolled && errors.length !== 0) {
                input.focus();
                wasScrolled = true;
            }
        },
    );
});

recipientInputs.forEach(input => input.addEventListener(
    'input',
    function() {
        const errors = validateInput(input);

        updateInputError(input, errors[0]);
    },
))