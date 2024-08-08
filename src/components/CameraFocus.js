// src/CameraFocus.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CameraFocus = ({ camera, scene, renderer }) => {
    const focusRef = useRef();

    useEffect(() => {
        // Crear un renderTarget para la vista de la cámara
        const renderTarget = new THREE.WebGLRenderTarget(512, 512);

        // Crear un material que utilizará la textura de la vista de la cámara
        const material = new THREE.MeshBasicMaterial({ map: renderTarget.texture });

        // Crear un plano para mostrar la vista de la cámara
        const planeGeometry = new THREE.PlaneGeometry(2, 2); // Tamaño del plano
        const plane = new THREE.Mesh(planeGeometry, material);
        plane.position.set(-3, 2, 0); // Ajustar la posición del plano

        // Añadir el plano a la escena
        scene.add(plane);

        // Renderizar la vista de la cámara en el renderTarget
        const render = () => {
            renderer.setRenderTarget(renderTarget);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
        };

        // Crear un intervalo para actualizar la vista
        const interval = setInterval(render, 100); // Actualizar cada 100 ms

        return () => {
            clearInterval(interval);
            scene.remove(plane);
        };
    }, [camera, scene, renderer]);

    return (
        <div ref={focusRef} style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            width: '200px',
            height: '200px',
            border: '2px solid #000',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }} />
    );
};

export default CameraFocus;
