import Controller from './controller.js';

const controller = new Controller();
await controller.getData();
controller.createDragEvent();
controller.makeBiggerEvent();
controller.createResizeEvent();
controller.makeSaveImgEvent();
controller.makeSavePdfEvent();
controller.createIntervalEvent();
controller.createEventListener();
