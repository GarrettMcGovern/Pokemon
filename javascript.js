document.addEventListener("DOMContentLoaded", () => {

  // ----------------------
  // Region Tabs
  // ----------------------
  const regionTabs = document.querySelectorAll('#regions span');
  const regionSections = document.querySelectorAll('.region');

  for (let i = 0; i < regionTabs.length; i++) {
      const tab = regionTabs[i];
      tab.addEventListener('click', () => {
          // Remove active from all tabs
          for (let j = 0; j < regionTabs.length; j++) {
              regionTabs[j].classList.remove('active');
          }
          tab.classList.add('active');

          const region = tab.getAttribute('data-region');

          // Hide all regions
          for (let k = 0; k < regionSections.length; k++) {
              regionSections[k].classList.remove('active');
          }

          const activeRegion = document.getElementById(region);
          if (activeRegion) activeRegion.classList.add('active');

          updateCounter();
      });
  }

  // ----------------------
  // Add checkboxes under each Pokémon
  // ----------------------
  const pokemon = document.querySelectorAll(".column");

  for (let i = 0; i < pokemon.length; i++) {
    const column = pokemon[i];
    const nameTag = column.querySelector("h3");
    if (!nameTag) continue;

    const match = nameTag.textContent.match(/#(\d+)/);
    if (!match) continue;

    const dexNumber = match[1];
    const pagePrefix = document.body.getAttribute("data-variant") || "normal";
    const storageKey = `${pagePrefix}_caught_${dexNumber}`;

    const container = document.createElement("div");
    container.classList.add("caughtCheckbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = localStorage.getItem(storageKey) === "true";

    checkbox.addEventListener("change", () => {
        localStorage.setItem(storageKey, checkbox.checked);
        updateCounter();
    });

    const label = document.createElement("label");
    label.textContent = "Caught";
    label.style.marginLeft = "6px";

    container.appendChild(checkbox);
    container.appendChild(label);
    column.appendChild(container);
  }

  // ----------------------
  // Filter Buttons
  // ----------------------
  const filterButtons = document.querySelectorAll("#filters button"); 

  for (let i = 0; i < filterButtons.length; i++) {
      const btn = filterButtons[i];
      btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter");
          applyFilter(filter);
      });
  }

  function applyFilter(filter) {
      const monList = document.querySelectorAll(".column");

      for (let i = 0; i < monList.length; i++) {
          const column = monList[i];
          const nameTag = column.querySelector("h3");
          if (!nameTag) continue;

          const match = nameTag.textContent.match(/#(\d+)/);
          if (!match) continue;

          const dexNumber = match[1];
          const pagePrefix = document.body.getAttribute("data-variant") || "normal";
          const caught = localStorage.getItem(`${pagePrefix}_caught_${dexNumber}`) === "true";

          if (filter === "all") column.style.display = "";
          else if (filter === "caught") column.style.display = caught ? "" : "none";
          else if (filter === "notcaught") column.style.display = caught ? "none" : "";
      }

      updateCounter();
  }

  updateCounter();

  // ----------------------
  // Form Submission & Validation
  // ----------------------
  const form = document.querySelector("form");
  const article = document.querySelector("article");

  form.addEventListener("submit", function(e) {
      e.preventDefault(); // prevent default submit

      // Run validation
      validateFname();
      validateLname();
      validateEmail();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Replace form with thank-you message
      article.innerHTML = `
        <div id="thankYouMessage" style="opacity:0; transition: opacity 0.5s;">
          <h3>Thank You!</h3>
          <p role="alert">Your feedback has been received. We really appreciate your input!</p>
          <p><a href="index.html">Click here to return to the homepage</a>.</p>
        </div>
      `;

      setTimeout(() => {
        document.getElementById("thankYouMessage").style.opacity = 1;
      }, 50);
  });

  // ----------------------
  // Form validation functions
  // ----------------------
  function validateFname(){ 
    const fname = document.getElementById("fname"); 
    const hasNumber = /\d/;

    if(fname.validity.valueMissing){ 
      fname.setCustomValidity("Enter your first name");
    } 
    else if (fname.value.length < 2 || fname.value.length > 18){ 
      fname.setCustomValidity("First name must be between 2 and 18 characters");
    }
    else if (hasNumber.test(fname.value)) {
      fname.setCustomValidity("First name cannot contain numbers");
    } 
    else{ 
      fname.setCustomValidity("");
    } 
  } 

  function validateLname(){ 
    const lname = document.getElementById("lname"); 
    const hasNumber = /\d/;

    if(lname.validity.valueMissing){ 
      lname.setCustomValidity("Enter your last name");
    } 
    else if (lname.value.length < 2 || lname.value.length > 18){ 
      lname.setCustomValidity("Last name must be between 2 and 18 characters");
    } 
    else if (hasNumber.test(lname.value)) {
      lname.setCustomValidity("Last name cannot contain numbers");
    } 
    else{ 
      lname.setCustomValidity("");
    } 
  } 

  function validateEmail(){ 
    const email = document.getElementById("email");
    const value = email.value.trim();
    const emailRegex = /^[^@]+@[^@]+\.(com|org)$/i;

    if(email.validity.valueMissing){ 
      email.setCustomValidity("Enter your email address");
    } 
    else if (!emailRegex.test(value)) {
      email.setCustomValidity("Enter a valid email");
    } 
    else {
      email.setCustomValidity("");
    }
  }

}); // DOMContentLoaded end

// ----------------------
// Counter logic
// ----------------------
function updateCounter() {
  const activeRegion = document.querySelector(".region.active");
  if (!activeRegion) return; 

  const mons = activeRegion.querySelectorAll(".column");
  const total = mons.length;

  let caughtCount = 0;

  for (let i = 0; i < mons.length; i++) {
    const column = mons[i];
    const nameTag = column.querySelector("h3");
    if (!nameTag) continue; 

    const match = nameTag.textContent.match(/#(\d+)/);
    if (!match) continue; 

    const dexNumber = match[1];
    const pagePrefix = document.body.getAttribute("data-variant") || "normal";
    const caught = localStorage.getItem(`${pagePrefix}_caught_${dexNumber}`) === "true";

    if (caught) caughtCount++;
  }

  const counter = document.getElementById("counter");
  if (counter) {
    counter.textContent = `Caught: ${caughtCount} / ${mons.length}`;
  }
}

// ----------------------
// Shiny hover swap 
// ----------------------
const megaImgs = document.querySelectorAll("img[src*='images/mega/']");

megaImgs.forEach(img => {
  // Store original src once only
  img.dataset.originalSrc = img.src;

  img.addEventListener("mouseover", () => {
    if (!img.dataset.originalSrc) return;
    img.src = img.dataset.originalSrc.replace("/mega/", "/mega/shiny/");
  });

  img.addEventListener("mouseout", () => {
    if (img.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
    }
  });
});


const gmaxImgs = document.querySelectorAll("img[src*='images/g-max/']");

gmaxImgs.forEach(img => {
  // Store original src once only
  img.dataset.originalSrc = img.src;

  img.addEventListener("mouseover", () => {
    if (!img.dataset.originalSrc) return;
    img.src = img.dataset.originalSrc.replace("/g-max/", "/g-max/shiny/");
  });

  img.addEventListener("mouseout", () => {
    if (img.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
    }
  });
});

// ----------------------
// Search Bar
// ----------------------
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", searchPoke);

function searchPoke() { 
    const filter = searchInput.value.toLowerCase();

    // Active Region
    const activeRegion = document.querySelector(".region.active");
    if (!activeRegion) return;

    // Pokémon in active region
    const pokemon = activeRegion.querySelectorAll(".column");

    pokemon.forEach(card => {
        const nameTag = card.querySelector("h3");
        if (!nameTag) return;

        const text = nameTag.textContent.toLowerCase(); // "#1 - Bulbasaur"

        if (text.includes(filter)) {
            card.style.display = "";
        } 
        else {
            card.style.display = "none";
        }
    });

    // Update counter AFTER filtering
    updateCounter();
}

