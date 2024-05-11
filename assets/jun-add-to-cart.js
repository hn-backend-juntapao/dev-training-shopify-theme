class JunAddToCart extends HTMLElement {
  constructor() {
    super();
    this.modal = document.getElementById('modal-product');
    this.modalProductQuantity = document.getElementById('modal-product-quantity');
    this.modalProductPrice = document.getElementById('modal-product-price');
    this.modalProductId = document.getElementById('modal-product-id');
    this.addCartPath = '/cart/add';
  }

  connectedCallback() {
    // this.addButton();
    this.setClose();
    // this.setCheckOut();
    this.setForm();
  }

  addButton() {
    const button = document.createElement('button');
    button.textContent = 'Add to Cart';
    button.setAttribute('type', 'button');
    button.addEventListener('click', this.showModal.bind(this));
    this.appendChild(button);
  }

  setClose() {
    const closeButton = document.getElementById('modal-product-close');
    closeButton.addEventListener('click', this.hideModal.bind(this));
  }

  // setCheckOut() {
  //   const checkOutButton = document.getElementById('modal-checkout');

  //   checkOutButton.addEventListener('click', async () => {
  //     const cartContents = await fetch(window.Shopify.routes.root + 'cart.js')
  //       .then(response => response.json())
  //       .then(data => { 
  //         fetch('/cart', {
  //           method: 'post',
  //           body: new FormData(data),
  //         });
  //         return data
  //       });
  //   });
  // }

  setForm() {
    const forms = document.querySelectorAll('form[action="' + this.addCartPath + '"]');
    forms.forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        await fetch(this.addCartPath, {
          method: 'post',
          body: new FormData(form),
        });
        
        await fetch(window.Shopify.routes.root + 'cart.js')
          .then(response => response.json())
          .then(data => { 
            data.items.map((item) => {
              // console.log(item.id, this.modalProductId.value, item.id == this.modalProductId.value);
              if(item.id == this.modalProductId.value) {
                this.modalProductQuantity.innerHTML = item.quantity;
                this.modalProductPrice.innerHTML = this.setMoneyFormat(item.line_price / 100);
                // console.log(item);
              }
            });
          });

        this.showModal();
      });
    });
  }

  setMoneyFormat(number) {
    const money = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
    });
    return money.format(number);
  }

  setImage() {
    const productTitle = document.getElementById('product-image');
    const modalProductTitle = document.getElementById('modal-product-image');
    modalProductTitle.value = productTitle.innerHTML;
  }


  setTitle() {
    const productTitle = document.getElementById('product-title');
    const modalProductTitle = document.getElementById('modal-product-title');
    modalProductTitle.innerHTML = productTitle.innerHTML;
  }

  setPrice() {
    const productPrice = document.getElementById('product-price');
    // const modalProductPrice = document.getElementById('modal-product-price');
    modalProductPrice.innerHTML = productPrice.innerHTML;
  }

  setQuantity() {
    const productQuantity = document.getElementById('product-quantity');
    // const modalProductQuantity = document.getElementById('modal-product-quantity');
    this.modalProductQuantity.innerHTML = productQuantity.value;
  }

  sendToCart() {
    // var cartContents = fetch(window.Shopify.routes.root + 'cart.js')
    // .then(response => response.json())
    // .then(data => { return data });

    // console.log(cartContents);

    // const form = document.getElementById('product_form_8628504821925');
    // console.log(form.submit());

    // const params = 'id=8628500856997&quantity=1';
    // const params = {
    //   'id': 36110175633573,
    //   'quantity': 2
    // }
    // const xhttp = new XMLHttpRequest();
    // xhttp.open('POST', '/cart/add');
    // xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // // xhttp.setRequestHeader('Content-type', 'application/json');
    // xhttp.send(params);

    // console.log(window.Shopify.routes.root+ 'cart/add.js');

    // let formData = {
    //   'items': [{
    //     'id': 36110175633573,
    //     'quantity': 2
    //   }]
    // };

    // fetch(window.Shopify.routes.root + 'cart.js', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(formData)
    // }).then(response => {
    //    return response.json();
    // }).catch((error) => {
    //    console.error('Error:', error);
    // });
  }

  showModal() {
    this.setTitle();
    // this.setPrice();
    // this.setQuantity();
    this.sendToCart();
    this.modal.classList.remove('hidden');
  }

  hideModal() {
    this.modal.classList.add('hidden');
  }
}

customElements.define('jun-add-to-cart', JunAddToCart);
