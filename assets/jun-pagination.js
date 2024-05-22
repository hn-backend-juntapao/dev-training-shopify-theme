class JunPagination extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const pageLinks = this.querySelectorAll('.pagination-page-link');
    pageLinks.forEach(pageLink => {
      pageLink.addEventListener('click', () => this.updateCollection(pageLink));
    });
  }

  updateCollection(pageLink) {
    const COLLECTION_STRING = '__collection';
    const section = document.querySelector(`[id$='${COLLECTION_STRING}']`);
    const sectionId = section.id.substring('shopify-section-'.length);
    const link = pageLink.getAttribute('data-link');

    fetch(`${link}&section_id=${sectionId}`)
      .then(response => response.text())
      .then(responseText => {
        const newHtml = new DOMParser()
          .parseFromString(responseText, 'text/html')
          .querySelector(`[id$='${COLLECTION_STRING}']`)
          .innerHTML;
        section.innerHTML = newHtml;

        // CHANGE URL IN WITHOUT RELOADING
        if (link.startsWith(window.location.origin)) {
          window.history.pushState({}, '', link);
        } else {
          window.location.href = link;
        }
      });
  }
}

customElements.define('jun-pagination', JunPagination);