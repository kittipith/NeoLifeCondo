function toggleList() {
    var list = document.querySelector(".hidden-list");
    var button = document.querySelector(".see-more");

    if (list.style.display === "none" || list.style.display === "") {
      list.style.display = "block";
      button.innerText = "...ดูน้อยลง";
    } else {
      list.style.display = "none";
      button.innerText = "...ดูเพิ่มเติม";
    }
  }