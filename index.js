const trackerStrings = [
    '<strong>Ultimate Contour T-Shirt Bra Bundle:</strong>',
    'Add #number More & Save #money',
    'You Get #money Off!',
]

const $trackerElements = {
    container: $('.cart-popup-tracker'),
    heading: $('.cart-popup-tracker-heading'),
    checkpoints: $(".cart-popup-tracker-checkpoints .checkpoints"),
    bar: $('.cart-popup-tracker-checkpoints .bar'),
    icon: `{% render "icon-tick" %}`
}

function fillTrackerProgressBar() {
    const activeCheckpoints = $('.checkpoint.completed').length
    const percentage = 100 * ((activeCheckpoints - 1) / 2)
    $trackerElements.bar.css('width', `${percentage}%`)
}

function renderHeadingText(itemsQuantity, quantityToBuy, money, bundles) {
    const [title, addMoreForDiscount, availableDiscount] = trackerStrings;

    const nextBundle = quantityToBuy * bundles;

    const quantityForNextBundle = itemsQuantity > nextBundle
        ? (nextBundle + quantityToBuy) - itemsQuantity
        : 0

    let discount = quantityForNextBundle === 0 ? bundles * money : (bundles + 1) * money
    discount = formatMoney(discount * 100);

    const text = quantityForNextBundle === 0
        ? availableDiscount.replace('#money', discount)
        : addMoreForDiscount.replace('#number', quantityForNextBundle).replace('#money', discount)

    $trackerElements.heading.html(`${title} ${text}`)
}

function renderTrackerCheckpoints() {
    const lineProperty = "buy:3 save:20";
    const quantityToBuy = 3;
    const saveMoney = 20;
    const itemsQuantity = cart.items.reduce((sum, item) => sum += item?.properties?._buy_x_for_y === lineProperty ? item.quantity : 0, 0)
    const bundles = Math.floor(itemsQuantity / quantityToBuy);

    const iteration = itemsQuantity > quantityToBuy * bundles
        ? quantityToBuy * (bundles + 1)
        : quantityToBuy * bundles

    const bundleGroup = [...Array(iteration).keys()].slice(-quantityToBuy)

    const html = bundleGroup.map((checkpoint) => {
        const index = checkpoint + 1
        const completed = itemsQuantity >= index ? ' completed' : ''
        return `
            <div class="checkpoint${completed}">
                <div>${$trackerElements.icon}</div>
                <p>${index} Bra${index > 1 ? 's' : ''}</p>
            </div>
        `
    }).join('')

    $trackerElements.container.toggleClass('hide', itemsQuantity === 0)
    $trackerElements.checkpoints.empty();
    $trackerElements.checkpoints.append(html)
    fillTrackerProgressBar();
    renderHeadingText(itemsQuantity, quantityToBuy, saveMoney, bundles)
}