document.addEventListener("DOMContentLoaded", function () {
    const selectAllCheckbox = document.querySelector("thead input[type='checkbox']");
    const rowCheckboxes = document.querySelectorAll("tbody input[type='checkbox']");

    selectAllCheckbox.addEventListener("change", function () {
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            selectAllCheckbox.checked = [...rowCheckboxes].every(cb => cb.checked);
        });
    });
});