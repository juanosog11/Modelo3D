import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export const loadPerson = (scene, path, personRef) => {
    const objLoader = new OBJLoader();
    objLoader.load(
        `${path}`, // Asumiendo que ya estás pasando la ruta correcta del .obj
        (obj) => {
            obj.scale.set(1, 1, 1); // Ajusta el tamaño según sea necesario
            obj.position.set(0, 0, 0); // Ajusta la posición según sea necesario
            scene.add(obj);
            personRef.current = obj; // Guarda la referencia del objeto
        },
        undefined,
        (error) => {
            console.error('Error al cargar el modelo OBJ:', error);
        }
    );
};
