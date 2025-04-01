document.addEventListener("DOMContentLoaded", function () {
    const fixedBtn = document.querySelector(".fixed-btn"); // Open button
    const bundleWrapper = document.querySelector(".bundle-wrapper"); // Target div
    const closeBundle = document.querySelector(".close-bundle"); // Close button
    const overlay = document.querySelector(".overlay"); // Overlay div

    // Add 'open' to bundle-wrapper and 'active' to overlay
    fixedBtn.addEventListener("click", function () {
        bundleWrapper.classList.add("open");
        overlay.classList.add("active");
    });

    // Remove 'open' from bundle-wrapper and 'active' from overlay
    closeBundle.addEventListener("click", function () {
        bundleWrapper.classList.remove("open");
        overlay.classList.remove("active");
    });
});