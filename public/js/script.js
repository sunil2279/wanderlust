// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


let textSwitch = document.getElementById("flexSwitchCheckDefault");
  textSwitch.addEventListener("click", () => {
    let taxinfo = document.getElementsByClassName("tax-info");
    for (const info of taxinfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });

  const filters = document.querySelectorAll(".filter");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.category;
      window.location.href = `/listings?category=${category}`;
    });
  });

  const container = document.getElementById("filters");

  document.getElementById("scrollLeft").onclick = () => {
    container.scrollBy({ left: -250, behavior: "smooth" });
  };

  document.getElementById("scrollRight").onclick = () => {
    container.scrollBy({ left: 250, behavior: "smooth" });
  };