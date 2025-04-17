document.addEventListener("DOMContentLoaded", function () {
    const drawer = document.createElement("div");
    drawer.id = "bundleDrawer";
    drawer.style.cssText = `
      position: fixed;
      right: -300px;
      top: 0;
      width: 300px;
      height: 100vh;
      background: #fff;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: right 0.3s ease-in-out;
      overflow-y: auto;
    `;
  
    drawer.innerHTML = `
      <h3>Bundle Cart</h3>
      <ul id="bundleItemsList"></ul>
      <input type="text" id="bundleName" placeholder="Enter Bundle Name" style="width: 100%; padding: 8px; margin-top: 10px;">
      <button id="createBundle" style="margin-top: 10px; padding: 10px; background: #007bff; color: #fff; border: none; width: 100%;">Create Bundle</button>
    `;
  
    document.body.appendChild(drawer);
  
    const toggleButton = document.createElement("button");
    toggleButton.innerText = "🛒 View Bundle";
    toggleButton.style.cssText = `
      z-index:999;
      position: fixed;
      right: 20px;
      bottom: 20px;
      padding: 10px 15px;
      background-color: #28a745;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
  
    toggleButton.addEventListener("click", function () {
      drawer.style.right = drawer.style.right === "0px" ? "-300px" : "0px";
      loadBundleItems();
    });
  
    document.body.appendChild(toggleButton);
  
    function loadBundleItems() {
      const bundleItems = JSON.parse(localStorage.getItem("bundleItems")) || [];
      const bundleItemsList = document.getElementById("bundleItemsList");
      bundleItemsList.innerHTML = "";
  
      bundleItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `Variant: ${item.variantId} | Qty: ${item.quantity} <button data-index="${index}" style="margin-left: 10px;">❌</button>`;
        bundleItemsList.appendChild(li);
  
        li.querySelector("button").addEventListener("click", function () {
          removeBundleItem(index);
        });
      });
    }
  
    function removeBundleItem(index) {
      let bundleItems = JSON.parse(localStorage.getItem("bundleItems")) || [];
      bundleItems.splice(index, 1);
      localStorage.setItem("bundleItems", JSON.stringify(bundleItems));
      loadBundleItems();
    }
  
    document.getElementById("createBundle").addEventListener("click", async function () {
      const bundleName = document.getElementById("bundleName").value.trim();
      if (!bundleName) {
        alert("Please enter a bundle name");
        return;
      }
  
      const bundleItems = JSON.parse(localStorage.getItem("bundleItems")) || [];
      if (bundleItems.length === 0) {
        alert("No items in bundle!");
        return;
      }
  
      const response = await fetch("https://dev-rfq.myshopify.com/apps/proxyhit", {
        method: "POST",
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://dev-rfq.myshopify.com/',
      },
        body: JSON.stringify({ name: bundleName, items: bundleItems }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert("Bundle created successfully!");
        localStorage.removeItem("bundleItems");
        document.getElementById("bundleName").value = "";
        loadBundleItems();
  
        // Automatically add bundle to cart
        addToCart(result.product.variants[0].id);
      } else {
        alert("Failed to create bundle");
      }
    });
  
    async function addToCart(variantId) {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: variantId,
          quantity: 1,
        }),
      });
  
      if (response.ok) {
        alert("Bundle added to cart!");
      } else {
        alert("Failed to add bundle to cart.");
      }
    }
  });
  