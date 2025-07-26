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


document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("flash-close-btn");
  const alertBox = document.getElementById("flash-alert");

  if (closeBtn && alertBox) {
    closeBtn.addEventListener("click", () => {
      alertBox.remove(); // Instantly removes the alert div from the DOM
    });
  }
});
