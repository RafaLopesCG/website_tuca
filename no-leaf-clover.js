document.addEventListener("DOMContentLoaded", () => {
  const PASSWORD = "zxnmpo9012!&";
  const SESSION_KEY = "no_leaf_clover_access";

  const accessOverlay = document.getElementById("accessOverlay");
  const accessForm = document.getElementById("accessForm");
  const passwordInput = document.getElementById("passwordInput");
  const accessError = document.getElementById("accessError");

  function unlockPage() {
    accessOverlay.classList.remove("is-active");
    sessionStorage.setItem(SESSION_KEY, "granted");
  }

  function lockPage() {
    accessOverlay.classList.add("is-active");
  }

  if (sessionStorage.getItem(SESSION_KEY) === "granted") {
    accessOverlay.classList.remove("is-active");
  } else {
    lockPage();
  }

  accessForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (passwordInput.value === PASSWORD) {
      accessError.textContent = "";
      unlockPage();
      passwordInput.value = "";
    } else {
      accessError.textContent = "Senha incorreta.";
    }
  });
});