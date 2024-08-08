import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadPerson } from './loadPerson';
import ControlsPanel from './ControlsPanel';
import { loadCamera } from './loadCamera';

const Modelo3D = () => {
    // Referencias
    const canvasRef = useRef(null);
    const cameraCanvasRef = useRef(null);
    const mainCameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const personRef = useRef(null);
    const keysPressed = useRef({});
    const selectedObject = useRef(null);
    const [isPersonLoaded, setIsPersonLoaded] = useState(false);
    const[isControlsVisible, setIsControlsVisible] = useState(true);
    const [selectedObjectInfo, setSelectedObjectInfo] = useState(null); // Nuevo estado para el objeto seleccionado
    const secondaryCameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const rendererRef = useRef();
    const personPositionRef = useRef(new THREE.Vector3());
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const sceneRef = useRef(null);
    const orbitControlsRef = useRef(null);

    useEffect(() => {
        const { scene, camera, renderer } = setupScene(canvasRef);
        const { renderer: cameraRenderer } = setupScene(cameraCanvasRef);

        sceneRef.current = scene;
        mainCameraRef.current = camera;
        rendererRef.current = renderer;

        // Cargar cámara y persona
        loadCameraAndPerson(scene);

        // Configuración de cámara y controles
        setupCameraAndControls(camera, renderer, new THREE.Vector3(0, 5, 10), scene);
        addHelpers(scene);

        // Configurar OrbitControls
        orbitControlsRef.current = new OrbitControls(mainCameraRef.current, canvasRef.current);
        orbitControlsRef.current.enableDamping = true;
        orbitControlsRef.current.dampingFactor = 0.05;

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);
            orbitControlsRef.current.update();
            updatePositions(camera);
            updateSecondaryCameraPosition(secondaryCameraRef.current);
            renderScenes(renderer, cameraRenderer, scene, camera, secondaryCameraRef.current);
        };

        animate();
        setupEventListeners(camera, renderer);

        return () => {
            orbitControlsRef.current.dispose();
            cleanupEventListeners();
        };
    }, []);

    const setupScene = (canvasRef) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
        });
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
        renderer.setClearColor(0x808080, 1);

        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        return { scene, camera, renderer };
    };

    const loadCameraAndPerson = (scene) => {
        loadCamera(scene, './Camara/Camera.obj', mainCameraRef, (position) => {
            mainCameraRef.current.position.set(0, 0, 5);
            mainCameraRef.current.rotation.y = Math.PI / 2;
            selectedObject.current = mainCameraRef.current;
            setSelectedObjectInfo("Cámara");
        });

        loadPerson(scene, '/Persona/Persona.obj', personRef, (position) => {
            setIsPersonLoaded(true);
            personPositionRef.current.copy(position);
        });
    };

    const setupCameraAndControls = (camera, renderer, position, scene) => {
        camera.position.copy(position);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    };

    const addHelpers = (scene) => {
        const axesHelper = new THREE.AxesHelper(10);
        axesHelper.name = 'AxesHelper';
        scene.add(axesHelper);

        const gridHelper = new THREE.GridHelper(1000, 100);
        gridHelper.material.color.set(0xffffff);
        scene.add(gridHelper);
    };

    const updatePositions = (camera) => {
        const moveAmount = 0.05;

        if (selectedObject.current) {
            handleObjectMovement(moveAmount);
            personPositionRef.current.copy(selectedObject.current.position);
        } else {
            console.warn('No hay objeto seleccionado para mover.');
        }
    };

    const handleObjectMovement = (moveAmount) => {
        if (keysPressed.current['w'] || keysPressed.current['8']) {
            selectedObject.current.position.z -= moveAmount;
        }
        if (keysPressed.current['s'] || keysPressed.current['2']) {
            selectedObject.current.position.z += moveAmount;
        }
        if (keysPressed.current['a'] || keysPressed.current['4']) {
            selectedObject.current.position.x -= moveAmount;
        }
        if (keysPressed.current['d'] || keysPressed.current['6']) {
            selectedObject.current.position.x += moveAmount;
        }
        if (keysPressed.current['x'] || keysPressed.current['9']) {
            selectedObject.current.position.y += moveAmount;
        }
        if (keysPressed.current['z'] || keysPressed.current['3']) {
            selectedObject.current.position.y -= moveAmount;
        }

        if (keysPressed.current['v']) {
            selectedObject.current.rotation.y += 0.05;
        }
        if (keysPressed.current['b']) {
            selectedObject.current.rotation.y -= 0.05;
        }

        if (keysPressed.current['n']) {
            selectedObject.current.rotation.x += 0.05;
        }
        if (keysPressed.current['m']) {
            selectedObject.current.rotation.x -= 0.05;
        }
    };

    const updateSecondaryCameraPosition = (secondaryCamera) => {
        secondaryCamera.position.copy(mainCameraRef.current.position);
        secondaryCamera.quaternion.copy(mainCameraRef.current.quaternion);
        secondaryCamera.position.y += 0.7;
        secondaryCamera.position.z -= 0.9;
        secondaryCamera.quaternion.multiplyQuaternions(secondaryCamera.quaternion, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)));
    };

    const renderScenes = (renderer, cameraRenderer, scene, camera, secondaryCamera) => {
        renderer.render(scene, camera);
        const originalVisible = mainCameraRef.current.visible;

        mainCameraRef.current.visible = false;
        cameraRenderer.render(scene, secondaryCamera);

        mainCameraRef.current.visible = originalVisible;
    };

    const setupEventListeners = (camera, renderer) => {
        window.addEventListener('resize', () => handleResize(camera, renderer));
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('click', onClick);
    };

    const cleanupEventListeners = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('click', onClick);
    };

    const handleResize = (camera, renderer) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width / 2, height);
    };

    const handleKeyDown = (event) => {
        keysPressed.current[event.key] = true;

        if (event.key === 'r') {
            // Cambia entre la persona y la cámara
            if (selectedObject.current === personRef.current) {
                selectedObject.current = mainCameraRef.current;
                // Actualiza el objeto seleccionado en el panel de controles
                setSelectedObjectInfo("Cámara");
            } else {
                selectedObject.current = personRef.current;
                // Actualiza el objeto seleccionado en el panel de controles
                setSelectedObjectInfo("Persona");
            }
        }
    };


    const handleKeyUp = (event) => {
        keysPressed.current[event.key] = false;
    };

    const onClick = (event) => {
        if (!selectedObject.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, mainCameraRef.current);
            const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                selectedObject.current = clickedObject;

                // Actualizar el objeto seleccionado en el panel de controles
                setSelectedObjectInfo(clickedObject.name || 'Objeto no nombrado');
            } else {
                selectedObject.current = null;
                setSelectedObjectInfo(null); // Limpiar el panel si no hay objeto
            }
        }
    };

    const toggleControls = () => {
        setIsControlsVisible((prev) => !prev); // Cambia el estado al hacer clic
    };

    const resetPositionsAndRotations = () => {
        // Restablecer posiciones
        if (personRef.current) {
            personRef.current.position.set(0, 0, 0);
            personRef.current.rotation.set(0, 0, 0);
        }

        if (mainCameraRef.current) {
            mainCameraRef.current.position.set(0, 0, 5);
            mainCameraRef.current.rotation.set(0, 0, 0);
            mainCameraRef.current.rotation.y = Math.PI / 2;
        }

    };


    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <ControlsPanel
                selectedObject={selectedObjectInfo}
                toggleControls={toggleControls}
                isControlsVisible={isControlsVisible}
            />
            <button
                onClick={resetPositionsAndRotations}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 15px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    zIndex: 10,
                }}
            >
                Restablecer
            </button>
            <div style={{ display: 'flex' }}>
                <canvas ref={canvasRef} style={{ width: '50vw', height: '100vh' }}></canvas>
                <canvas ref={cameraCanvasRef} style={{ width: '50vw', height: '100vh' }}></canvas>
            </div>
        </div>
    );


};

export default Modelo3D;
