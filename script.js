function round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const currencies = [
    { value: "USD", text: "US Dollar", factor: 1 },
    { value: "EUR", text: "Euro", factor: 0.85 },
    { value: "UZS", text: "Uzbekistani Som", factor: 12185.53 },
    { value: "GEL", text: "Georgian Lari", factor: 2.68 },
    { value: "KGS", text: "Kyrgyz som", factor: 87.45 }
]; //game-changer

let max_rows = currencies.length - 1;

document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("main_btn");
    const whole_box = document.getElementById("whole_box");

    const main_input = document.getElementById("main_input");
    const main_select = document.getElementById("main_select");
    main_input.addEventListener("input", function () {
        let divisor = currencies.find(currency => currency.value === main_select.value).factor;
        let in_usd = main_input.value / divisor;
        for (let i = 1; i < currencies.length - max_rows; i++) {
            const index = currencies.findIndex(currency => currency.value === document.getElementById(`child_select${i}`).value);
            document.getElementById(`child_input${i}`).value = round(in_usd * currencies[index].factor, 5);
        }
    }) //update all if main row is changed

    main_select.addEventListener("change", function () {
        main_input.dispatchEvent(new Event("input"));
    })

    btn.addEventListener("click", function () {
        if (max_rows > 0) {
            const child_box = document.createElement("div");
            child_box.classList.add("child_box");
            const child_input = document.createElement("input");
            child_input.classList.add("child_input");
            child_input.id = `child_input${currencies.length - max_rows}`;

            child_input.addEventListener("input", function () {
                let divisor = currencies.find(currency => currency.value === child_select.value).factor;
                let in_usd = child_input.value / divisor;
                //change main row
                main_input.value = round(in_usd * currencies.find(currency => currency.value === main_select.value).factor, 5);
                // Trigger main input's listener to update all other rows
                main_input.dispatchEvent(new Event("input"));
            }); //should be written right after creation
            const child_select = document.createElement("select");
            child_select.classList.add("child_select");
            child_select.id = `child_select${currencies.length - max_rows}`

            child_select.addEventListener("change", function () {
                let divisor = currencies.find(currency => currency.value === main_select.value).factor;
                let in_usd = main_input.value / divisor;
                child_input.value = round(in_usd * currencies.find(currency => currency.value === child_select.value).factor, 5);
            });

            currencies.forEach(currency => {
                const option = document.createElement("option");
                option.value = currency.value;
                option.text = currency.text;
                option.classList.add("currency_option");
                child_select.appendChild(option);
            });

            whole_box.appendChild(child_box);
            child_box.appendChild(child_input);
            child_box.appendChild(child_select);

            child_input.value = round(main_input.value * currencies.find(currency => currency.value === child_select.value).factor, 5);

            max_rows--;

        } else {
            alert("You've reached the maximum amount of rows")
        }
    })
})
