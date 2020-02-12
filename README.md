# Persistence Renderer
Visualize and interact with VTK.js persistence data.

## Requirements
* [vtk.js](https://kitware.github.io/vtk-js/index.html)
* vkt [HttpDataSetReader](https://kitware.github.io/vtk-js/api/IO_Core_HttpDataSetReader.html) compatible data
* [noUiSlider](https://refreshless.com/nouislider/)
  * If persistence filtering is enabled

## Persistence Renderer Class

#### `constructor(container: HTMLElement | string, id: string, settings: ISettings = {})`
`container`: The element where the canvas and all control element will be placed into.  
This can be an actual HTMLElement or a query string passed to `document.querySelector`.

`id`: A unique id that will be used to identify the canvas and control elements.  
Canvas id will be build as: `persistence_canvas_${id}`.

`settings`: Customized settings. Refer to the settings documentation below.

### `async load(fileName: string): Promise<void>`
Loads a given filename using the default HttpDataSetReader.  
`fileName: string`: The file name / url to load.

A `dataloaded`-event will be dispatched on the containing element.  
This method returns a promise.

### `update(): void`
Draws all loaded points and updates enabled control element.

### `filteredPoints(): PersistencePointTuple[]`
Returns the points filtered by persistence and selection.

### `get points(): PersistencePointTuple[]`
Returns the loaded vtk data as an array of PersistencePointsTuples. Refer to the documentation below.

### `get bounds(): number[]`
Returns the computed point bounds as an one-dimensional array.  
Example: `[x-min, x-max, y-min, y-max, z-min, z-max]`  
If no points were loaded min/max will default to -inf | inf. 

### `get persistenceBounds(): Bounds`
Returns the computed persistence bounds as an object with keys `min` and `max`. 

```typescript
class Bounds {
  public readonly min: number;
  public readonly max: number;
}
```

## Settings
Default settings:
```json
{
  "padding": {
    "left": 20,
    "top": 10,
    "right": 10,
    "bottom": 20
  },

  "canvasWidth": 500,
  "canvasHeight": 500,
  "strokeStyle": "#000",
  "fillStyle": "#000",

  "pointDrawFunction": "undefined",

  "enableSelectionFilter": false,
  "enablePersistenceFilter": false,
  "enableAxes": true,

  "axesTickCount": 5,
  "axesTickLength": 5,
  "axesColor": "#000",
  "axesTickColor": "#000"
}
```
`padding: number | Padding`: Padding of the canvas  

`canvasWidth: number`: Canvas width in px  
`canvasHeight: number`: Canvas height in px  
`strokeStyle: string`: Stroke color   
`fillStyle: string`: Fill color  

`pointDrawFunction: Function`: Custom function for drawing persistence points on the canvas

`enableSelectionFilter: bool`: Enable / Disable Selection control element 
`enablePersistenceFilter: bool`: Enable / Disable Slider control element 
`enableAxes: bool`: Enable / Disable Axes drawn on the canvas 

`axesTickCount: number | number[]`: Number of ticks on the x/y axis. If argument is an array first index corresponds to number of x-axis ticks  
`axesTickLength: number`: Length of ticks in px. If argument is an array first index corresponds to the length of x-axis ticks  
`axesColor: string`: Color of the axes  
`axesTickColor: string`: Color of ticks  

### `pointDrawFunction(point: PersistencePointTuple, renderer: IRenderer)`
A custom draw function can be passed to the rendering instance to change / extend the way points are drawn.  
The function gets two arguments:
* `point: PersistencePointTuple` the current point to draw
* `renderer: IRenderer` the current rendering instance
See the example section for further information.

## `PersistencePointTuple`
```typescript
class PersistencePointTuple {
    readonly persistence: number;
    
    readonly criticalType: {
        readonly lower: number;
        readonly upper: number;
    };
    
    readonly coordinates: {
        readonly lower: {
            readonly x: number;
            readonly y: number;
            readonly z: number;
        };
        readonly upper: {
            readonly x: number;
            readonly y: number;
            readonly z: number;
        };
    };

    /**
     * Lower Point
     */
    readonly lower: {
        readonly x: number;
        readonly y: number;
        readonly z: number;
    };

    /**
     * Upper Point
     */
    readonly upper: {
        readonly x: number;
        readonly y: number;
        readonly z: number;
    };
}
```

## `IRenderer`
```typescript
interface IRenderer {
    getCanvas(): HTMLCanvasElement;
    getContext(): CanvasRenderingContext2D;
    
    readonly defaultDrawFunction;
    
    /**
     * Maps a x-position point to a canvas coordinate 
     */
    xPos(x: number): number;
    /**
     * Maps a y-position point to a canvas coordinate 
     */
    yPos(y: number): number;
}
```

## `defaultDrawFunction`
This is the default function used to draw persistence points:
```typescript
(point, renderer) => {
    renderer.getContext().beginPath();
    renderer.getContext().moveTo(renderer.xPos(point.lower.x), renderer.yPos(point.lower.y));
    renderer.getContext().lineTo(renderer.xPos(point.upper.x), renderer.yPos(point.upper.y));
    renderer.getContext().stroke();
}
```

## Persistence Filter
The persistence filter is a two-handled slider below the canvas. Its lower and upper bounds equal to the lowest and highest point persistence.  
Updating the slider handles will automatically re-draw the canvas with the newly filtered points.

## Selection Filter
The selection filter allows to select an arbitrary sized rectangle on the canvas. After the selection has ended only points inside the selection will be drawn.  

## Events
TBD.

## Examples
Minimum needed dependencies:
```html
<head>
    ...
    <script src="https://unpkg.com/vtk.js@13.7.1/dist/vtk.js"></script>
    <script src="PersistenceRenderer.js"></script>
    ...
</head>
```

### Simple usage:
```javascript
const renderer = new PersistenceRenderer(document.body, 'unique_id');

renderer.load('url / path to vtk.js data').then(()=>{
    renderer.update();
});
```

### With persistence filter enabled:
The persistence filter adds a two-handled slider below the canvas. The lower bound equals to the lowest persistence, the upper bounds equals to the biggest persistence.  
After updating the slider the canvas will re-draw automatically.

```html
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.0.3/nouislider.min.js" integrity="sha256-1ubcV7PzqcMhAz7jsoU3QlAfCnUaY7SUffeHa4Nq3ws=" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/vtk.js@13.7.1/dist/vtk.js"></script>
    <script src="PersistenceRenderer.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.0.3/nouislider.min.css" integrity="sha256-IQnSeew8zCA+RvM5fNRro/UY0Aib18qU2WBwGOHZOP0=" crossorigin="anonymous" />
    ...
</head>
```

```javascript
const renderer = new PersistenceRenderer(document.body, 'unique_id', {
    enablePersistenceFilter: true
});

renderer.load('url / path to vtk.js data').then(()=>{
    renderer.update();
});

// After using the slider filteredPoints will contain the updated selection
const points = renderer.filteredPoints();
```

### Custom drawing function:
```javascript
const renderer = new PersistenceRenderer(document.body, 'unique_id', {
    /* This function will be called for each point */
    pointDrawFunction: (point, renderer) => {
        /**
        * This function first calls the default drawing function accessible on the Renderer Interface
        */
        renderer.defaultDrawFunction(point,renderer);

        /**
        * Example: Don't add custom elements if point persistence is lower than 0.2
        */
        if (point.persistence < 0.2) {
            return;
        }

        /**
        * This draws a blue circle with a radius of 2px on the upper point position
        */
        const context = renderer.getContext();
        context.save();
        context.strokeStyle = 'blue';
        context.beginPath();
        context.ellipse(renderer.xPos(point.upper.x), renderer.yPos(point.upper.y), 2, 2, 0, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
});
```

### All control elements enabled:
```javascript
const renderer = new PersistenceRenderer(document.body, 'unique_id', {
    enablePersistenceFilter: true,
    enableSelectionFilter: true
});
```

### Fully custom settings:
```javascript
const renderer = new PersistenceRenderer('#exampleDiv', 'id', {
    canvasWidth: 1500,
    canvasHeight: 250,
    enablePersistenceFilter: true,
    padding: {
        left: 100,
        top: 10,
        right: 10,
        bottom: 30,
    },
    axesTickLength: [10, 25],
    axesTickCount: [25, 8],
    axesColor: 'red',
    axesTickColor: 'green',
    pointDrawFunction: (point, renderer) => {
        const context = renderer.getContext();
        context.save();
        context.strokeStyle = 'blue';
        context.beginPath();
        context.ellipse(renderer.xPos(point.upper.x), renderer.yPos(point.upper.y), 2, 2, 0, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
});
```
