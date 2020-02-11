export default interface IRenderer {
    getCanvas(): HTMLCanvasElement;
    getContext(): CanvasRenderingContext2D;
}
