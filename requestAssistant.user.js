// ==UserScript==
// @name         Request page assistant
// @version      1.0
// @description  Allows clicking anywhere on a row to toggle the checkbox for that row on the permission pages for facilities/stations/cities
// @icon         https://www.swcombine.com/favicon.ico
// @author       Mordus Nordstroem (SWC)
// @match        *://www.swcombine.com/members/inventory/managePermissions.php*
// @homepage        https://github.com/tomnishambles/SWCombine-Scripts
// @homepageURL     https://github.com/tomnishambles/SWCombine-Scripts
// @icon            https://www.swcombine.com/favicon.ico
// @updateURL       x
// @downloadURL     x
// @supportURL      https://github.com/tomnishambles/SWCombine-Scripts/
// ==/UserScript==

(function() {
    'use strict';

    function updateRowBackground(checkbox) {
        const tr = checkbox.closest('tr');
        if (tr) {
            tr.style.backgroundColor = checkbox.checked ? '#41B6E6' : '';
        }
    }

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

    // Listen for checkbox state changes
    document.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) {
            updateRowBackground(e.target);
        }
    });

    // Initial background setup
    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        updateRowBackground(checkbox);
    });
})();
