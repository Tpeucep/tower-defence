export class Movable {
  element: HTMLDivElement | undefined;
  x: number = 0;
  y: number = 0;
  speed = 30;
  isMoving = false;
  targetX: number | undefined;
  targetY: number | undefined;
  distancePassed = 0;
  constructor() {}
  update(dt: number) {
    this.isMoving = false;
    if (this.targetX === undefined || this.targetY === undefined) return;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceToMove = this.speed * dt;

    if (distance < distanceToMove) {
      // console.log('kill');
      this.x = this.targetX;
      this.y = this.targetY;
      this.onEnd();
    } else {
      const relativePosition = distanceToMove / distance;
      this.x = this.x + dx * relativePosition;
      this.y = this.y + dy * relativePosition;
      this.distancePassed += distanceToMove;
      //console.log(this.startX, this.x);
    }
    this.isMoving = true;
  }
  moveTo(x: number, y: number) {
    this.distancePassed = 0;
    this.targetX = x;
    this.targetY = y;
  }

  render() {
    if (!this.element) return;
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
  onEnd() {
    this.targetX = undefined;
    this.targetY = undefined;
  }
  delete() {}
}
