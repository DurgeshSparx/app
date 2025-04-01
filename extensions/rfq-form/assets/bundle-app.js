document.addEventListener("DOMContentLoaded", function () {
    //const bundleButton = document.querySelector('.bundle_product_CTA')
    const bundleButton = document.createElement("button");
    bundleButton.innerText = "Add to Bundle";
    bundleButton.style.cssText = `
      padding: 10px 15px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    `;
   
    bundleButton.addEventListener("click", function () {
      // Shopify Product Page se Variant ID & Quantity lena
      const variantId = document.querySelector('input[name="id"]').value;
      const quantity = document.querySelector('input[name="quantity"]')?.value || 1;
  
      // Pehle se Local Storage me bundle items hai ya nahi
      let bundleItems = JSON.parse(localStorage.getItem("bundleItems")) || [];
  
      // New Product ko add karna
      bundleItems.push({ variantId, quantity });
  
      // Local Storage me Save karna
      localStorage.setItem("bundleItems", JSON.stringify(bundleItems));
  
      alert("Product added to bundle!");
    });
  
    // Button ko Product Form ke andar Insert karna
    const productForm = document.querySelector("form[action*='/cart/add']");
    if (productForm) {
      productForm.appendChild(bundleButton);
    }
  });