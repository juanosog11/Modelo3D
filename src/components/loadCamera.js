import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export const loadCamera = (scene, url, cameraRef, onLoad) => {
    const loader = new OBJLoader();
    loader.load(url, (object) => {
        object.scale.set(0.1, 0.1, 0.1); // Escala el objeto cargado
        cameraRef.current = object; // Asigna el objeto cargado a la referencia
        scene.add(object);
        if (onLoad) {
            onLoad(object.position); // Llama a la función de carga si se proporciona
        }
    }, undefined, (error) => {
        console.error('Error cargando el modelo de la cámara:', error);
    });
};
