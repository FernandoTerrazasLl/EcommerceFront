export abstract class Block extends HTMLElement {
connectedCallback() {
    this.render();
    this.initialize();
  }

  abstract getHTML(): string;
  abstract getCSS(): string;

  render() {
    this.innerHTML = `
      <style>${this.getCSS()}</style>
      ${this.getHTML()}
    `;
  }

  initialize() { }
}
