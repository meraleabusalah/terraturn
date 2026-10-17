
const TerraCarbon = (() => {
    const TOTAL_KEY = "terraturnCarbonTotalKg";
    const COUNT_KEY = "terraturnCarbonActions";

    // Illustrative estimates in kg CO2e avoided per completed action.
    // These are prototype values, not verified lifecycle measurements.
    const estimates = {
        repair: {
            shirt: 1.5, shoes: 2, phone: 10, box: 0.2, can: 0.05,
            plasticBottle: 0.1, paper: 0.1, glass: 0.1,
            battery: 0.1, electronics: 5, other: 0.2
        },
        reuse: {
            shirt: 2, shoes: 3, phone: 15, box: 0.3, can: 0.1,
            plasticBottle: 0.1, paper: 0.1, glass: 0.2,
            battery: 0.1, electronics: 8, other: 0.3
        },
        rehome: {
            shirt: 2, shoes: 3, phone: 15, box: 0.3, can: 0.1,
            plasticBottle: 0.1, paper: 0.1, glass: 0.2,
            battery: 0.1, electronics: 8, other: 0.3
        },
        recycle: {
            shirt: 0.5, shoes: 0.3, phone: 1, box: 0.1, can: 0.05,
            plasticBottle: 0.05, paper: 0.05, glass: 0.05,
            battery: 0.1, electronics: 0.5, other: 0.05
        }
    };

    function getTotal() {
        return Number(localStorage.getItem(TOTAL_KEY)) || 0;
    }

    function getCount() {
        return Number(localStorage.getItem(COUNT_KEY)) || 0;
    }

    function getEstimate(item, action) {
        return estimates[action]?.[item] ?? estimates[action]?.other ?? 0;
    }

    function addCompletedAction(item, action) {
        const amount = getEstimate(item, action);

        localStorage.setItem(TOTAL_KEY, getTotal() + amount);
        localStorage.setItem(COUNT_KEY, getCount() + 1);

        window.dispatchEvent(new Event("terraturnCarbonUpdated"));

        return amount;
    }

    function updateDisplays() {
        document.querySelectorAll("[data-carbon-total]").forEach(element => {
            element.textContent = getTotal().toFixed(1) + " kg CO₂e";
        });

        document.querySelectorAll("[data-carbon-count]").forEach(element => {
            element.textContent = getCount();
        });
    }

    window.addEventListener("storage", updateDisplays);
    window.addEventListener("terraturnCarbonUpdated", updateDisplays);

    return {
        getTotal,
        getCount,
        getEstimate,
        addCompletedAction,
        updateDisplays
    };
})();

window.TerraCarbon = TerraCarbon;

document.addEventListener("DOMContentLoaded", function () {
    TerraCarbon.updateDisplays();
});
