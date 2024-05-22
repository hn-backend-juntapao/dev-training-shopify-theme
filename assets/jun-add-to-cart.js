class JunAddToCart extends HTMLElement {
  constructor() {
    super();
    this.modal = document.getElementById('modal-product');
    this.modalTitle = document.getElementById('modal-title');
    this.modalContent = document.getElementById('modal-content');
    this.modalMessage = document.getElementById('modal-message');
    this.modalProductQuantity = document.getElementById('modal-product-quantity');
    this.modalProductPrice = document.getElementById('modal-product-price');
    this.modalProductId = document.getElementById('modal-product-id');
    this.currency = document.getElementById('product-currency').value;
    this.addCartPath = '/cart/add';
  }

  connectedCallback() {
    this.setClose();
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

  setForm() {
    const forms = document.querySelectorAll(`form[action="${this.addCartPath}"]`);
    forms.forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formElements = form.querySelectorAll('[name]');
        let formData = {
          'items': [{
            'id': 0,
            'quantity': 0
          }]
        };

        formElements.forEach(formElement => {
          const name = formElement.getAttribute('name');
          const value = formElement.value;
          if(name == 'id') {
            formData.items[0].id = value;
          }
          if(name == 'quantity') {
            formData.items[0].quantity = value;
          }
        })
       
        const cartReponse = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
          }
        ).then(response => { return response.json(); });

        // if(cartReponse.status == 422) {
        //   this.modalContent.classList.add('hidden');
        //   this.modalMessage.classList.remove('hidden');
        //   this.modalTitle.innerHTML = cartReponse.message;
        //   this.modalMessage.innerHTML = cartReponse.description;
        // } else {
        //   this.modalContent.classList.remove('hidden');
        //   this.modalMessage.classList.add('hidden');
        //   this.modalTitle.innerHTML = 'Added to cart';
        //   this.modalProductQuantity.innerHTML = cartReponse.items[0].quantity;
        //   this.modalProductPrice.innerHTML = this.setMoneyFormat(cartReponse.items[0].line_price / 100, this.currency);
        // }
        if(cartReponse.status == 422) {
          this.modalContent.classList.add('hidden');
          this.modalMessage.classList.remove('hidden');
          this.modalTitle.innerHTML = cartReponse.message;
          this.modalMessage.innerHTML = cartReponse.description;
          this.showModal();
          return;
        } 

        this.modalContent.classList.remove('hidden');
        this.modalMessage.classList.add('hidden');
        this.modalTitle.innerHTML = 'Added to cart';
        this.modalProductQuantity.innerHTML = cartReponse.items[0].quantity;
        this.modalProductPrice.innerHTML = this.setMoneyFormat(cartReponse.items[0].line_price / 100, this.currency);
        this.showModal();
        
        // await fetch(this.addCartPath, {
        //   method: 'post',
        //   body: new FormData(form),
        // });
        
        // await fetch(window.Shopify.routes.root + 'cart.js')
        //   .then(response => response.json())
        //   .then(data => { 
        //     data.items.map((item) => {
        //       // console.log(item.id, this.modalProductId.value, item.id == this.modalProductId.value);
        //       if(item.id == this.modalProductId.value) {
        //         this.modalProductQuantity.innerHTML = item.quantity;
        //         this.modalProductPrice.innerHTML = this.setMoneyFormat(item.line_price / 100, this.currency);
        //         // console.log(item);
        //       }
        //     });
        //   });
      });
    });
  }

  setMoneyFormat(number, currency) {
    const money = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });
    return money.format(number);
  }

  setTitle() {
    const productTitle = document.getElementById('product-title');
    const modalProductTitle = document.getElementById('modal-product-title');
    modalProductTitle.innerHTML = productTitle.innerHTML;
  }

  showModal() {
    this.setTitle();
    this.modal.classList.remove('hidden');
  }

  hideModal() {
    this.modal.classList.add('hidden');
  }
}

customElements.define('jun-add-to-cart', JunAddToCart);
