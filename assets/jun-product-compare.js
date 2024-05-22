class JunProductCompare extends HTMLElement {
  constructor() {
    super();
    this.productId = this.getAttribute('data-product-id');
    this.productTitle = document.getElementById('product-title').innerHTML;
    this.productPrice = document.getElementById('product-price').innerHTML;
    this.productImage = document.getElementById('product-image').getAttribute('data-image');
    this.productComparison = document.getElementById('product-comparison');
    this.cooKey1 = 'product-compare-object-1';
    this.cooKey2 = 'product-compare-object-2';
    this.button = document.createElement('button');
    this.setProductCompareVariables();
    this.productSpecifications = this.getSpecifications();
    this.productCompare = document.getElementById('product-compare');
    this.combinedSpecifications = new Array;
  }

  connectedCallback() {
    // const button = document.createElement('button');
    const classes = this.getAttribute('class');
    this.button.setAttribute('type', 'button');
    this.button.setAttribute('class', classes);
    this.button.setAttribute('data-product-id', this.productId);
    this.button.addEventListener('click', this.addToCompare.bind(this));
    this.button.innerHTML = this.innerHTML;
    this.innerHTML = '';
    this.removeAttribute('class');
    this.removeAttribute('data-product-id');
    this.appendChild(this.button);
    this.checkIfAdded();
    this.showComparison();

    // this.productCompareObject1 = new Object; this.productCompareObject1.productId = null; this.setCookieObject(this.cooKey1, this.productCompareObject1, 3);
    // this.productCompareObject2 = new Object; this.productCompareObject2.productId = null; this.setCookieObject(this.cooKey2, this.productCompareObject2, 3);
    // console.log('On Load Product ID: ' + this.productId);
    // console.log('On Load Compare 1: ' + JSON.stringify(this.productCompareObject1));
    // console.log('On Load Compare 2: ' + JSON.stringify(this.productCompareObject2));
  }

  showComparison() {
    this.setProductCompareVariables();
    
    if(this.productCompareObject2.productId) {
      this.setComparison(0, this.productCompareObject1);
      this.setComparison(1, this.productCompareObject2);
      this.setSpecificationsComparison();
    }

    if(!this.productCompareObject2.productId) {
      this.productCompare.parentElement.classList.add('hidden');
    }
  }

  setSpecificationsComparison() {
    // LOOP FIRST PRODUCT
    this.productCompareObject1.specifications.forEach((specification) => {
      let array = new Object;
      array.id = specification.id;
      array.product1 = specification.value;
      this.combinedSpecifications.push(array);
      // console.log('1: ' + JSON.stringify(specification));
    });

    // LOOP SECOND PRODUCT
    this.productCompareObject2.specifications.forEach((specification) => {
      this.combinedSpecifications.forEach((combinedSpecification) => {
        if (combinedSpecification.id == specification.id) {
          combinedSpecification.product2 = specification.value;
        }
      });
      // console.log('2: ' + JSON.stringify(specification));
    });

    // ADD ELEMENTS IN PAGE AND POPULATE DATA
    this.combinedSpecifications.forEach((specification) => {
      if (specification.product2) { // SHOW COMPARISON ONLY WITH THE SAME CRITERIA
        const divLabel = document.createElement('div');
        const divProduct1 = document.createElement('div');
        const divProduct2 = document.createElement('div');

        divLabel.setAttribute('class', 'text-indigo-800 md:text-right text-left md:text-base text-sm');
        divProduct1.setAttribute('class', 'col-span-2 specs-brake-system md:text-base text-sm text-center');
        divProduct2.setAttribute('class', 'col-span-2 specs-brake-system md:text-base text-sm text-center');

        divLabel.innerHTML = this.capitalizeFirstLetter(specification.id.replaceAll('_', ' '));
        divProduct1.innerHTML = specification.product1;
        divProduct2.innerHTML = specification.product2;

        this.productCompare.appendChild(divLabel);
        this.productCompare.appendChild(divProduct1);
        this.productCompare.appendChild(divProduct2);

        divLabel.classList.add('uppercase'); // NOT WORKING
      }
    });

    // console.log(this.combinedSpecifications);
  }

  setComparison(elementIndex, productCompareObject) {
    this.productCompare
      .querySelectorAll('.compare-image')[elementIndex]
      .setAttribute('style', `background-image: url('${productCompareObject.productImage}');`);
    this.productCompare
      .querySelectorAll('.compare-title')[elementIndex]
      .innerHTML = productCompareObject.productTitle;
    this.productCompare
      .querySelectorAll('.compare-price')[elementIndex]
      .innerHTML = productCompareObject.productPrice;
  }

  addToCompare() {
    if (!this.productCompareObject2.productId && this.productCompareObject1.productId) {
      this.setCookieObject(this.cooKey2, this.productCompareObject1, 3);
      this.setCompareObject1();
    }

    if (!this.productCompareObject1.productId) {
      this.setCompareObject1();
    }

    if (this.productCompareObject1.productId != this.productCompareObject2.productId && this.productCompareObject1.productId != null && this.productCompareObject2.productId != null) {
      this.setCookieObject(this.cooKey2, this.productCompareObject1, 3);
      this.setCompareObject1();
    }

    this.setProductCompareVariables();
    this.checkIfAdded();
    this.checkIfTwoProducts()

    // console.log('After Compare Product ID: ' + this.productId);
    // console.log('After Compare Compare 1: ' + JSON.stringify(this.productCompareObject1));
    // console.log('After Compare Compare 2: ' + JSON.stringify(this.productCompareObject2));
  }

  setCompareObject1() {
    this.productCompareObject1.productId = this.productId;
    this.productCompareObject1.productTitle = this.productTitle;
    this.productCompareObject1.productPrice = this.productPrice;
    this.productCompareObject1.productImage = this.productImage;
    this.productCompareObject1.specifications = this.productSpecifications;
    this.setCookieObject(this.cooKey1, this.productCompareObject1, 3);
  }

  async checkIfTwoProducts() {
    // console.log('pasok');
    if(this.productCompareObject1.productId != null && this.productCompareObject2.productId != null) {
      window.location.reload();
      // await fetch(window.location.pathname + '?sections=shopify-section-template--17152071336101__products-comparison')
      //   .then(response => {
      //     // console.log(response);
      //     const dom = new DOMParser();
      //     console.log(dom.parseFromString(response, 'text/html'));
            
          
      //     // this.productCompare.innerHTML = newHtml;
      //   })
      // console.log('done');
    }
  }

  checkIfAdded() {
    this.setProductCompareVariables();

    // REMOVE HOVER ELEMENTS
    if (this.productCompareObject1.productId == this.productId || this.productCompareObject2.productId == this.productId) {
      this.button.innerHTML = 'Added for Comparison';
      this.button.setAttribute('disabled', 'disabled');
      let classesToBeRemoved = [];
      this.button.classList.forEach((className) => {
        if (className.substring(0, 6) == 'hover:') {
          classesToBeRemoved.push(className);
        }
      });
      classesToBeRemoved.forEach((className) => {
        this.button.classList.remove(className);
      });
    }
  }

  getSpecifications() {
    const specificationsElement = document.getElementsByName('specifications[]');
    let specificationsArray = new Array;
    specificationsElement.forEach((element) => {
      let specification = new Object;
      specification.id = element.getAttribute('data-id');
      specification.value = element.value;
      specificationsArray.push(specification);
    });
    return specificationsArray;
  }

  setProductCompareVariables() {
    this.productCompareObject1 = this.getCookieObject(this.cooKey1);
    this.productCompareObject2 = this.getCookieObject(this.cooKey2);

    // ON FIRST ENCOUNTER
    if (!this.productCompareObject1) {
      this.productCompareObject1 = new Object;
      this.productCompareObject1.productId = null;
      this.setCookieObject(this.cooKey1, this.productCompareObject1, 3);
    }
    if (!this.productCompareObject2) {
      this.productCompareObject2 = new Object;
      this.productCompareObject2.productId = null;
      this.setCookieObject(this.cooKey2, this.productCompareObject2, 3);
    }
  }

  setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    // document.cookie = name + '=' + (value || '') + expires + '; path=/';
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  getCookie(search) {
    const cookieKey = search + '=';
    const cookieArray = document.cookie.split(';');
    let cookieString = '';

    // return cookieArray.some(cookie => {
    //   console.log(cookie.trim());
    //   return cookie.trim().startsWith(search + '=');
    // });

    // console.log(cookieArray);
    cookieArray.forEach((cookie) => {
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(cookieKey) == 0) {
        cookieString = cookie.substring(cookieKey.length, cookie.length);
      }
    });

    // for(var i = 0; i < cookieArray.length; i++) {
    //   var c = cookieArray[i];
    //   while(c.charAt(0) == ' ') {
    //     c = c.substring(1, c.length);
    //   }
    //   if(c.indexOf(nameEQ) == 0) {
    //     return c.substring(nameEQ.length, c.length);
    //   }
    // }
    return cookieString;
  }

  setCookieObject(name, object, days) {
    const jsonString = JSON.stringify(object);
    this.setCookie(name, jsonString, days);
    // console.log('SET: ' + jsonString);
  }

  getCookieObject(name) {
    const jsonString = this.getCookie(name);
    // console.log('GET OBJECT: ' + jsonString);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  }

  capitalizeFirstLetter(sentence) {
    let words = sentence.split(' ');
    words.forEach((word, index) => {
      words[index] = word.charAt(0).toUpperCase() + word.slice(1);
    });
    return words.join(' ');
  }
}

customElements.define('jun-product-compare', JunProductCompare);