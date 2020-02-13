/**
 * Events dispatchable on target
 *
 * vtkdataloaded: VTK File has been fully loaded and processed
 *
 * selectionstart: Mouse down on canvas
 * selectionupdating: Selection size is changing
 * selectionhidden: Use has clicked on selection rect -> Rect is invisible
 * selectionend: Mouse up on canvas
 *
 * sliderdestroyed: Persistence bounds slider has been destroyed (happens upon loading a new vtk file)
 * slidercreated: Slider has been created (after new vtk file load)
 *
 * persistenceboundsupdating: Slider handles are changing (event details field contains handle values)
 * persistenceboundsset: Slider values set (event details field contains handle values)
 *
 * pointsdrawn: All vtk points drawn
 * pointscleared: Canvas cleared before re-draw
 */
export declare enum EventType {
    DataLoaded = "dataloaded",
    SelectionStart = "selectionstart",
    SelectionUpdating = "selectionupdating",
    SelectionHidden = "selectionhidden",
    SelectionEnd = "selectionend",
    SliderDestroyed = "sliderdestroyed",
    SliderCreated = "slidercreated",
    PersistenceBoundsUpdating = "persistenceboundsupdating",
    PersistenceBoundsSet = "persistenceboundsset",
    PointsDrawn = "pointsdrawn",
    PointsCleared = "pointscleared"
}
export default class EventDispatcher {
    /**
     * The container holding all control elements
     */
    private readonly target;
    constructor(target: Element);
    /**
     * Dispatches an event of type {EventType} on the target element
     * @param type {EventType}
     * @param data {undefined|{}} Any data passed to CustomEvent.detail
     */
    dispatch(type: EventType, data?: any | undefined): void;
}
