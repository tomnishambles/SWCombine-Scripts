// ==UserScript==
// @name         Request page assistant
// @version      2.0
// @description  Allows selecting by user inputted filter & clicking anywhere on a row to toggle the checkbox on the permission pages for facilities/stations/cities
// @icon         https://www.swcombine.com/favicon.ico
// @author       Mordus Nordstroem (SWC)
// @match        *://www.swcombine.com/members/inventory/managePermissions.php*
// @homepage        https://github.com/tomnishambles/SWCombine-Scripts
// @homepageURL     https://github.com/tomnishambles/SWCombine-Scripts
// @icon            https://www.swcombine.com/favicon.ico
// @updateURL       https://github.com/tomnishambles/SWCombine-Scripts/raw/main/requestAssistant.user.js
// @downloadURL     https://github.com/tomnishambles/SWCombine-Scripts/raw/main/requestAssistant.user.js
// @supportURL      https://github.com/tomnishambles/SWCombine-Scripts/
// ==/UserScript==



(function() {
    'use strict';

    /** Utility to normalize text for matching */
    function normalize(text) {
        return text.trim().replace(/\s+/g, ' ').toLowerCase();
    }

    /** Add interactive pseudobutton for filtering*/

    // Find header cell matching "manage * permission requests"
    const headerCells = document.querySelectorAll("td, th");
    let headerCell = null;
    headerCells.forEach(cell => {
        const normalized = normalize(cell.textContent);
        if (/^manage .* permission requests$/.test(normalized)) {
            headerCell = cell;
        }
    });

    if (!headerCell) {
        console.log("[Userscript] Could not find the header text.");
        return;
    }

    // Create a styled span as button to avoid form submission
    const button = document.createElement("span");
    button.textContent = "Select Matching Requests";
    button.style.marginLeft = "10px";
    button.style.padding = "4px 8px";
    button.style.backgroundColor = "#4285f4";
    button.style.color = "white";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.style.userSelect = "none";
    button.style.fontSize = "90%";

    headerCell.appendChild(button);

    button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const userInput = prompt("Enter text to match in rows:");
        if (!userInput) return;

        const needle = normalize(userInput);

        const form = document.querySelector('form[name="requests"]');
        if (!form) {
            alert("Could not find the requests form.");
            return;
        }

        const table = form.querySelector('table');
        if (!table) {
            alert("Could not find the table inside the form.");
            return;
        }

        const rows = table.querySelectorAll('tr');
        let count = 0;

        rows.forEach(row => {
            const text = normalize(row.textContent);
            if (text.includes(needle)) {
                // Only look in the *first* top-level TD for the correct checkbox
                const firstTd = row.querySelector('td');
                if (!firstTd) return;

                const correctCheckbox = Array.from(firstTd.children).find(el =>
                    el.tagName === 'INPUT' &&
                    el.type === 'checkbox' &&
                    el.name === 'requests[]'
                );

                if (correctCheckbox) {
                    correctCheckbox.checked = true;
                    correctCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                    count++;
                }
            }
        });

        alert(`Selected ${count} matching request(s).`);
    });

    /** Allow clicks anywhere in a row to select that checkbox */

    document.addEventListener('click', function(e) {
        let tr = e.target.closest('tr');
        if (!tr) return;

        // No toggle when clicking directly on interactive elements
        if (['INPUT', 'BUTTON', 'SELECT', 'A', 'OPTION'].includes(e.target.tagName)) return;

        let checkbox = tr.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }

    });




    /** Highlight rows when checbox is ticked */

    function updateRowBackground(checkbox) {
        const tr = checkbox.closest('tr');
        if (tr) {
            tr.style.backgroundColor = checkbox.checked ? '#41B6E6' : '';
        }
    }

    // Listen for checkbox state changes
    document.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) {
            updateRowBackground(e.target);
        }
    });

    // Set initial backgrounds
    document.querySelectorAll('input[type="checkbox"]').forEach(updateRowBackground);

})();
