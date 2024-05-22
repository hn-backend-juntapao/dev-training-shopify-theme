class JunProductVariant extends HTMLElement {
  constructor() {
    super();
    this.elementName = 'product-variant';
  }

  connectedCallback() {
    const select = document.createElement('select');
    const classes = this.getAttribute('class');
    select.setAttribute('id', this.elementName);
    // select.setAttribute('name', this.elementName);
    select.setAttribute('name', 'id');
    select.setAttribute('class', classes);
    select.addEventListener('change', this.changeProperties.bind(this));
    select.innerHTML = this.innerHTML;
    this.innerHTML = '';
    this.removeAttribute('class');
    this.appendChild(select);
  }

  changeProperties() {
    const select = document.getElementById(this.elementName);
    const selectedIndex = select.options[select.selectedIndex];
    const dataImage = selectedIndex.getAttribute('data-img');
    const dataId = selectedIndex.value;
    const divImage = document.getElementById('product-image');
    divImage.setAttribute('style', `background-image: url('${dataImage}');`);

    const modalProductImage = document.getElementById('modal-product-image');
    modalProductImage.setAttribute('style', `background-image: url('${dataImage}');`);

    const modalProductId = document.getElementById('modal-product-id');
    modalProductId.value = dataId;
  }
}

customElements.define('jun-product-variant', JunProductVariant);
