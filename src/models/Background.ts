export class Background {
  bgImage: HTMLImageElement;
  seaImage: HTMLImageElement;

  constructor() {
    const bgImage = new Image();
    bgImage.src = "../assets/img/background.png";
    const seaImage = new Image();
    seaImage.src = "../assets/img/sea.png";
    if (bgImage && seaImage) {
      this.bgImage = bgImage;
      this.seaImage = seaImage;
    }
  }
}
