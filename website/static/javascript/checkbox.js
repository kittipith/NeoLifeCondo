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

function openPopup(url,userid) {
    var popup = document.getElementById("popup");
    var iframe = document.getElementById("ContentIframe");
    iframe.src = `${url}?userid=${encodeURIComponent(userid)}`;
    popup.style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    window.parent.location.href = "/admin";
}

function swap(url,id) {
    let urlformat = `${url}/${id}`
    window.open(urlformat);
}