// ============================================================================
// CLASE PRINCIPAL DEL JUEGO - BODEGA COMPLETA CON SISTEMAS AVANZADOS
// ============================================================================

class WarehouseGame {
    constructor() {
        // Configuración del juego
        this.config = {
            currentLevel: 1,
            totalLevels: 5,
            fuelConsumptionRate: 0.05,
            baseFuelConsumption: 0.1,
            movementSpeed: 0.15,
            rotationSpeed: 0.03,
            palletsPerLevel: [3, 5, 7, 10, 12],
            warehouseSize: 50,
            maxFuel: 100,
            timeLimit: null // null = sin límite de tiempo
        };
        
        // Elementos del juego
        this.canvas = document.getElementById('renderCanvas');
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null;
        this.forklift = null;
        
        // Colecciones de objetos
        this.pallets = [];
        this.shelves = [];
        this.boxes = [];
        this.obstacles = [];
        this.trucks = [];
        this.lights = [];
        this.decorations = [];
        
        // Estado del juego
        this.score = 0;
        this.gameTime = 0;
        this.fuel = 100;
        this.isPaused = false;
        this.gameCompleted = false;
        this.currentPallets = 0;
        this.lightsOn = false;
        this.cameraMode = 0; // 0: 3ra persona, 1: 1ra persona, 2: superior
        
        // Control de entrada
        this.inputMap = {};
        this.movementVector = new BABYLON.Vector3(0, 0, 0);
        this.speedKmh = 0;
        
        // Audio
        this.audioContext = null;
        this.sounds = {};
        
        // Tiempo
        this.startTime = Date.now();
        this.lastFuelUpdate = Date.now();
        this.lastMovementTime = Date.now();
        
        // Inicializar el juego
        this.init();
    }
    
    async init() {
        try {
            await this.createScene();
            this.setupAudio();
            this.setupControls();
            this.setupGameLoop();
            this.updateUI();
            console.log('✅ Juego inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar:', error);
            this.showErrorScreen();
        }
    }
    
    async createScene() {
        // Crear escena básica
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color4(0.05, 0.1, 0.15, 1);
        
        // Configurar cámaras
        this.setupCameras();
        
        // Configurar iluminación básica
        this.setupLighting();
        
        // Crear bodega completa
        this.createWarehouse();
        
        // Crear montacargas
        this.createForklift();
        
        // Crear objetos según nivel
        this.loadLevel(this.config.currentLevel);
        
        return this.scene;
    }
    
    setupCameras() {
        // Cámara en tercera persona (principal)
        this.thirdPersonCamera = new BABYLON.ArcRotateCamera(
            "thirdPersonCamera",
            -Math.PI / 2,
            Math.PI / 3,
            25,
            new BABYLON.Vector3(0, 5, 0),
            this.scene
        );
        this.thirdPersonCamera.attachControl(this.canvas, true);
        this.thirdPersonCamera.lowerRadiusLimit = 15;
        this.thirdPersonCamera.upperRadiusLimit = 40;
        this.thirdPersonCamera.lowerBetaLimit = 0.1;
        this.thirdPersonCamera.upperBetaLimit = Math.PI / 2 - 0.1;
        
        // Cámara en primera persona
        this.firstPersonCamera = new BABYLON.FreeCamera(
            "firstPersonCamera",
            new BABYLON.Vector3(0, 2, 0),
            this.scene
        );
        this.firstPersonCamera.inputs.clear();
        
        // Cámara superior
        this.topCamera = new BABYLON.FreeCamera(
            "topCamera",
            new BABYLON.Vector3(0, 40, 0),
            this.scene
        );
        this.topCamera.setTarget(BABYLON.Vector3.Zero());
        this.topCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.topCamera.orthoTop = 25;
        this.topCamera.orthoBottom = -25;
        this.topCamera.orthoLeft = -35;
        this.topCamera.orthoRight = 35;
        this.topCamera.inputs.clear();
        
        // Establecer cámara inicial
        this.cameras = [this.thirdPersonCamera, this.firstPersonCamera, this.topCamera];
        this.scene.activeCamera = this.cameras[this.cameraMode];
    }
    
    setupLighting() {
        // Luz ambiental
        const ambientLight = new BABYLON.HemisphericLight(
            "ambientLight",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        ambientLight.intensity = 0.6;
        ambientLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.2);
        
        // Luz direccional principal (simula luz del sol)
        const mainLight = new BABYLON.DirectionalLight(
            "mainLight",
            new BABYLON.Vector3(-1, -2, -1),
            this.scene
        );
        mainLight.intensity = 0.8;
        mainLight.position = new BABYLON.Vector3(20, 40, 20);
        
        // Luces de la bodega
        this.createWarehouseLights();
    }
    
    createWarehouse() {
        const size = this.config.warehouseSize;
        
        // Suelo de la bodega
        const ground = BABYLON.MeshBuilder.CreateGround(
            "warehouseFloor",
            { width: size, height: size },
            this.scene
        );
        
        const groundMat = new BABYLON.StandardMaterial("floorMat", this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        ground.material = groundMat;
        
        // Crear líneas de demarcación
        this.createFloorMarkings(size);
        
        // Crear paredes
        this.createWalls(size);
        
        // Crear columnas estructurales
        this.createColumns(size);
        
        // Crear áreas específicas
        this.createStorageArea();
        this.createLoadingArea();
        this.createOfficeArea();
    }
    
    createFloorMarkings(size) {
        const lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        lineMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        lineMat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        
        // Líneas de carril
        const spacing = 5;
        const halfSize = size / 2;
        
        // Líneas horizontales
        for (let z = -halfSize + spacing; z < halfSize; z += spacing) {
            const line = BABYLON.MeshBuilder.CreateBox(`line_h_${z}`, 
                { width: size - 2, height: 0.05, depth: 0.2 }, this.scene);
            line.position = new BABYLON.Vector3(0, 0.02, z);
            line.material = lineMat;
        }
        
        // Líneas verticales
        for (let x = -halfSize + spacing; x < halfSize; x += spacing) {
            const line = BABYLON.MeshBuilder.CreateBox(`line_v_${x}`, 
                { width: 0.2, height: 0.05, depth: size - 2 }, this.scene);
            line.position = new BABYLON.Vector3(x, 0.02, 0);
            line.material = lineMat;
        }
        
        // Áreas de estacionamiento
        this.createParkingSpaces();
    }
    
    createParkingSpaces() {
        const parkMat = new BABYLON.StandardMaterial("parkMat", this.scene);
        parkMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.8);
        parkMat.alpha = 0.3;
        
        // Crear 4 espacios de estacionamiento
        const positions = [
            new BABYLON.Vector3(15, 0.01, 15),
            new BABYLON.Vector3(15, 0.01, -15),
            new BABYLON.Vector3(-15, 0.01, 15),
            new BABYLON.Vector3(-15, 0.01, -15)
        ];
        
        positions.forEach((pos, i) => {
            const space = BABYLON.MeshBuilder.CreateGround(`park_${i}`, 
                { width: 6, height: 4 }, this.scene);
            space.position = pos;
            space.material = parkMat;
            this.decorations.push(space);
        });
    }
    
    createWalls(size) {
        const wallMat = new BABYLON.StandardMaterial("wallMat", this.scene);
        wallMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.85);
        wallMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        
        const wallHeight = 12;
        const halfSize = size / 2;
        const wallThickness = 0.5;
        
        // Pared norte
        const northWall = BABYLON.MeshBuilder.CreateBox("northWall", 
            { width: size, height: wallHeight, depth: wallThickness }, this.scene);
        northWall.position = new BABYLON.Vector3(0, wallHeight/2, halfSize);
        northWall.material = wallMat;
        
        // Pared sur
        const southWall = BABYLON.MeshBuilder.CreateBox("southWall", 
            { width: size, height: wallHeight, depth: wallThickness }, this.scene);
        southWall.position = new BABYLON.Vector3(0, wallHeight/2, -halfSize);
        southWall.material = wallMat;
        
        // Pared este
        const eastWall = BABYLON.MeshBuilder.CreateBox("eastWall", 
            { width: wallThickness, height: wallHeight, depth: size }, this.scene);
        eastWall.position = new BABYLON.Vector3(halfSize, wallHeight/2, 0);
        eastWall.material = wallMat;
        
        // Pared oeste
        const westWall = BABYLON.MeshBuilder.CreateBox("westWall", 
            { width: wallThickness, height: wallHeight, depth: size }, this.scene);
        westWall.position = new BABYLON.Vector3(-halfSize, wallHeight/2, 0);
        westWall.material = wallMat;
        
        // Crear techo
        const roof = BABYLON.MeshBuilder.CreateBox("roof", 
            { width: size - 1, height: 0.5, depth: size - 1 }, this.scene);
        roof.position = new BABYLON.Vector3(0, wallHeight, 0);
        const roofMat = new BABYLON.StandardMaterial("roofMat", this.scene);
        roofMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.25);
        roof.material = roofMat;
    }
    
    createColumns(size) {
        const columnMat = new BABYLON.StandardMaterial("columnMat", this.scene);
        columnMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
        
        const columnSpacing = 10;
        const halfSize = size / 2 - 5;
        
        // Crear columnas en una grilla
        for (let x = -halfSize; x <= halfSize; x += columnSpacing) {
            for (let z = -halfSize; z <= halfSize; z += columnSpacing) {
                const column = BABYLON.MeshBuilder.CreateCylinder(`column_${x}_${z}`, 
                    { diameter: 1, height: 12 }, this.scene);
                column.position = new BABYLON.Vector3(x, 6, z);
                column.material = columnMat;
                this.decorations.push(column);
            }
        }
    }
    
    createWarehouseLights() {
        const lightMat = new BABYLON.StandardMaterial("lightMat", this.scene);
        lightMat.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
        lightMat.diffuseColor = new BABYLON.Color3(1, 1, 0.8);
        
        // Crear luces colgantes en el techo
        const lightSpacing = 10;
        const halfSize = this.config.warehouseSize / 2 - 5;
        
        for (let x = -halfSize; x <= halfSize; x += lightSpacing) {
            for (let z = -halfSize; z <= halfSize; z += lightSpacing) {
                // Cuerpo de la luz
                const lightBody = BABYLON.MeshBuilder.CreateCylinder(`light_${x}_${z}`, 
                    { diameter: 0.5, height: 0.3 }, this.scene);
                lightBody.position = new BABYLON.Vector3(x, 11.5, z);
                lightBody.material = lightMat;
                
                // Luz puntual
                const pointLight = new BABYLON.PointLight(`pointLight_${x}_${z}`,
                    new BABYLON.Vector3(x, 11, z),
                    this.scene
                );
                pointLight.intensity = 0.4;
                pointLight.diffuse = new BABYLON.Color3(1, 1, 0.9);
                pointLight.specular = new BABYLON.Color3(1, 1, 0.9);
                pointLight.range = 20;
                
                this.lights.push(pointLight);
            }
        }
    }
    
    createStorageArea() {
        // Área de almacenamiento con estantes
        const shelfMat = new BABYLON.StandardMaterial("shelfMat", this.scene);
        shelfMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        
        // Crear varios estantes
        for (let i = 0; i < 6; i++) {
            const shelf = this.createShelf(
                new BABYLON.Vector3(18, 0, -20 + i * 8),
                new BABYLON.Vector3(2, 6, 6)
            );
            this.shelves.push(shelf);
        }
        
        // Crear cajas en los estantes
        this.createBoxesOnShelves();
    }
    
    createShelf(position, dimensions) {
        const shelf = new BABYLON.TransformNode("shelf", this.scene);
        shelf.position = position;
        
        const shelfMat = new BABYLON.StandardMaterial("shelfMat", this.scene);
        shelfMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        
        // Base
        const base = BABYLON.MeshBuilder.CreateBox("shelfBase", 
            { width: dimensions.x, height: 0.3, depth: dimensions.z }, this.scene);
        base.parent = shelf;
        base.position = new BABYLON.Vector3(0, 0.15, 0);
        base.material = shelfMat;
        
        // Postes laterales
        const postPositions = [
            new BABYLON.Vector3(-dimensions.x/2 + 0.2, dimensions.y/2, -dimensions.z/2 + 0.2),
            new BABYLON.Vector3(dimensions.x/2 - 0.2, dimensions.y/2, -dimensions.z/2 + 0.2),
            new BABYLON.Vector3(-dimensions.x/2 + 0.2, dimensions.y/2, dimensions.z/2 - 0.2),
            new BABYLON.Vector3(dimensions.x/2 - 0.2, dimensions.y/2, dimensions.z/2 - 0.2)
        ];
        
        postPositions.forEach((pos, i) => {
            const post = BABYLON.MeshBuilder.CreateCylinder(`shelfPost_${i}`, 
                { diameter: 0.4, height: dimensions.y }, this.scene);
            post.parent = shelf;
            post.position = pos;
            post.material = shelfMat;
        });
        
        // Tablas horizontales (3 niveles)
        for (let level = 1; level <= 3; level++) {
            const board = BABYLON.MeshBuilder.CreateBox(`shelfBoard_${level}`, 
                { width: dimensions.x - 0.5, height: 0.2, depth: dimensions.z - 0.5 }, this.scene);
            board.parent = shelf;
            board.position = new BABYLON.Vector3(0, (dimensions.y/3) * level, 0);
            board.material = shelfMat;
        }
        
        return shelf;
    }
    
    createBoxesOnShelves() {
        const boxMat = new BABYLON.StandardMaterial("boxMat", this.scene);
        boxMat.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.3);
        
        // Crear cajas en posiciones aleatorias en los estantes
        this.shelves.forEach((shelf, shelfIndex) => {
            for (let i = 0; i < 4; i++) {
                const box = BABYLON.MeshBuilder.CreateBox(`box_${shelfIndex}_${i}`, 
                    { width: 1.5, height: 1.2, depth: 1.2 }, this.scene);
                box.parent = shelf;
                
                // Posición aleatoria en el estante
                const xPos = (Math.random() - 0.5) * 1.5;
                const zPos = (Math.random() - 0.5) * 5;
                const yPos = (Math.floor(Math.random() * 3) + 1) * 2;
                
                box.position = new BABYLON.Vector3(xPos, yPos, zPos);
                box.material = boxMat;
                
                // Rotación aleatoria
                box.rotation.y = Math.random() * Math.PI;
                
                this.boxes.push(box);
            }
        });
    }
    
    createLoadingArea() {
        // Área de carga con rampas y zonas de entrega
        const loadingMat = new BABYLON.StandardMaterial("loadingMat", this.scene);
        loadingMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
        
        // Crear rampa de carga
        const ramp = BABYLON.MeshBuilder.CreateBox("loadingRamp", 
            { width: 8, height: 0.2, depth: 4 }, this.scene);
        ramp.position = new BABYLON.Vector3(-20, 0.1, -20);
        ramp.rotation.x = -0.1; // Inclinación ligera
        ramp.material = loadingMat;
        
        // Zona de entrega (carga de camiones)
        const deliveryZone = BABYLON.MeshBuilder.CreateGround("deliveryZone", 
            { width: 15, height: 10 }, this.scene);
        deliveryZone.position = new BABYLON.Vector3(-20, 0.01, -20);
        
        const zoneMat = new BABYLON.StandardMaterial("zoneMat", this.scene);
        zoneMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        zoneMat.alpha = 0.3;
        zoneMat.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
        deliveryZone.material = zoneMat;
        
        // Crear camión de carga
        this.createDeliveryTruck(new BABYLON.Vector3(-20, 0.5, -25));
    }
    
    createOfficeArea() {
        // Área de oficina dentro de la bodega
        const officeMat = new BABYLON.StandardMaterial("officeMat", this.scene);
        officeMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        
        // Construir estructura de oficina
        const office = BABYLON.MeshBuilder.CreateBox("officeBuilding", 
            { width: 12, height: 4, depth: 8 }, this.scene);
        office.position = new BABYLON.Vector3(-20, 2, 15);
        office.material = officeMat;
        
        // Crear ventanas
        const windowMat = new BABYLON.StandardMaterial("windowMat", this.scene);
        windowMat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
        windowMat.alpha = 0.7;
        
        for (let i = 0; i < 3; i++) {
            const window = BABYLON.MeshBuilder.CreateBox(`officeWindow_${i}`, 
                { width: 1.5, height: 2, depth: 0.1 }, this.scene);
            window.position = new BABYLON.Vector3(-20, 2.5, 11 + i * 2);
            window.material = windowMat;
        }
    }
    
    createDeliveryTruck(position) {
        const truck = new BABYLON.TransformNode("deliveryTruck", this.scene);
        truck.position = position;
        
        const truckMat = new BABYLON.StandardMaterial("truckMat", this.scene);
        truckMat.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
        
        // Chasis del camión
        const chassis = BABYLON.MeshBuilder.CreateBox("truckChassis", 
            { width: 3, height: 2.5, depth: 8 }, this.scene);
        chassis.parent = truck;
        chassis.position = new BABYLON.Vector3(0, 1.25, 0);
        chassis.material = truckMat;
        
        // Cabina
        const cabin = BABYLON.MeshBuilder.CreateBox("truckCabin", 
            { width: 2.8, height: 2.5, depth: 3 }, this.scene);
        cabin.parent = truck;
        cabin.position = new BABYLON.Vector3(0, 1.25, -5.5);
        cabin.material = truckMat;
        
        // Ruedas
        const wheelPositions = [
            new BABYLON.Vector3(1.2, -1, 3),
            new BABYLON.Vector3(-1.2, -1, 3),
            new BABYLON.Vector3(1.2, -1, -3),
            new BABYLON.Vector3(-1.2, -1, -3),
            new BABYLON.Vector3(1.2, -1, -6),
            new BABYLON.Vector3(-1.2, -1, -6)
        ];
        
        wheelPositions.forEach((pos, i) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(`truckWheel_${i}`, 
                { diameter: 1.2, height: 0.4 }, this.scene);
            wheel.parent = truck;
            wheel.position = pos;
            wheel.rotation.z = Math.PI / 2;
            
            const wheelMat = new BABYLON.StandardMaterial("truckWheelMat", this.scene);
            wheelMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
            wheel.material = wheelMat;
        });
        
        this.trucks.push(truck);
        return truck;
    }
    
    createForklift() {
        this.forklift = {
            mesh: new BABYLON.TransformNode("forklift", this.scene),
            body: null,
            forks: null,
            wheels: [],
            lights: [],
            currentPallet: null
        };
        
        this.forklift.mesh.position = new BABYLON.Vector3(-15, 0.5, 0);
        
        // Cuerpo principal (amarillo industrial)
        const body = BABYLON.MeshBuilder.CreateBox("forkliftBody", 
            { width: 2.2, height: 1.4, depth: 4.5 }, this.scene);
        body.parent = this.forklift.mesh;
        
        const bodyMat = new BABYLON.StandardMaterial("forkliftBodyMat", this.scene);
        bodyMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0);
        bodyMat.specularColor = new BABYLON.Color3(0.5, 0.4, 0);
        body.material = bodyMat;
        this.forklift.body = body;
        
        // Cabina de operador
        const cabin = BABYLON.MeshBuilder.CreateBox("forkliftCabin", 
            { width: 1.8, height: 1.8, depth: 1.8 }, this.scene);
        cabin.parent = this.forklift.mesh;
        cabin.position = new BABYLON.Vector3(0, 1.1, -1.2);
        
        const cabinMat = new BABYLON.StandardMaterial("forkliftCabinMat", this.scene);
        cabinMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        cabin.material = cabinMat;
        
        // Ventanas de la cabina
        const windowMat = new BABYLON.StandardMaterial("forkliftWindowMat", this.scene);
        windowMat.diffuseColor = new BABYLON.Color3(0.3, 0.5, 0.8);
        windowMat.alpha = 0.6;
        
        const frontWindow = BABYLON.MeshBuilder.CreateBox("frontWindow", 
            { width: 1.6, height: 0.8, depth: 0.1 }, this.scene);
        frontWindow.parent = this.forklift.mesh;
        frontWindow.position = new BABYLON.Vector3(0, 1.5, -0.2);
        frontWindow.material = windowMat;
        
        // Horquillas (montaje)
        this.forklift.forks = new BABYLON.TransformNode("forkliftForks", this.scene);
        this.forklift.forks.parent = this.forklift.mesh;
        this.forklift.forks.position = new BABYLON.Vector3(0, 0.2, 2.8);
        
        const forkMat = new BABYLON.StandardMaterial("forkMat", this.scene);
        forkMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        
        // Horquilla izquierda
        const forkLeft = BABYLON.MeshBuilder.CreateBox("forkLeft", 
            { width: 0.25, height: 0.15, depth: 2 }, this.scene);
        forkLeft.parent = this.forklift.forks;
        forkLeft.position = new BABYLON.Vector3(-0.35, 0, 0);
        forkLeft.material = forkMat;
        
        // Horquilla derecha
        const forkRight = BABYLON.MeshBuilder.CreateBox("forkRight", 
            { width: 0.25, height: 0.15, depth: 2 }, this.scene);
        forkRight.parent = this.forklift.forks;
        forkRight.position = new BABYLON.Vector3(0.35, 0, 0);
        forkRight.material = forkMat;
        
        // Montaje de horquillas
        const forkMount = BABYLON.MeshBuilder.CreateBox("forkMount", 
            { width: 1, height: 0.3, depth: 0.5 }, this.scene);
        forkMount.parent = this.forklift.forks;
        forkMount.position = new BABYLON.Vector3(0, 0.225, -0.8);
        forkMount.material = forkMat;
        
        // Ruedas
        const wheelMat = new BABYLON.StandardMaterial("forkliftWheelMat", this.scene);
        wheelMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        
        const wheelPositions = [
            new BABYLON.Vector3(0.9, -0.6, 1.8),   // Delantera derecha
            new BABYLON.Vector3(-0.9, -0.6, 1.8),  // Delantera izquierda
            new BABYLON.Vector3(0.9, -0.6, -1.5),  // Trasera derecha
            new BABYLON.Vector3(-0.9, -0.6, -1.5)  // Trasera izquierda
        ];
        
        wheelPositions.forEach((pos, index) => {
            const wheel = BABYLON.MeshBuilder.CreateCylinder(`forkliftWheel_${index}`, 
                { diameter: 0.9, height: 0.4 }, this.scene);
            wheel.parent = this.forklift.mesh;
            wheel.position = pos;
            wheel.rotation.z = Math.PI / 2;
            wheel.material = wheelMat;
            this.forklift.wheels.push(wheel);
        });
        
        // Luces del montacargas
        this.createForkliftLights();
    }
    
    createForkliftLights() {
        // Luces delanteras
        const headlightLeft = new BABYLON.SpotLight("headlightLeft",
            new BABYLON.Vector3(-0.5, 0.8, 2.8),
            new BABYLON.Vector3(0, -0.1, 1),
            Math.PI / 4,
            2,
            this.scene
        );
        headlightLeft.parent = this.forklift.mesh;
        headlightLeft.intensity = 0;
        headlightLeft.diffuse = new BABYLON.Color3(1, 1, 0.9);
        headlightLeft.specular = new BABYLON.Color3(1, 1, 0.9);
        
        const headlightRight = new BABYLON.SpotLight("headlightRight",
            new BABYLON.Vector3(0.5, 0.8, 2.8),
            new BABYLON.Vector3(0, -0.1, 1),
            Math.PI / 4,
            2,
            this.scene
        );
        headlightRight.parent = this.forklift.mesh;
        headlightRight.intensity = 0;
        headlightRight.diffuse = new BABYLON.Color3(1, 1, 0.9);
        headlightRight.specular = new BABYLON.Color3(1, 1, 0.9);
        
        this.forklift.lights = [headlightLeft, headlightRight];
    }
    
    createPallet(position, id) {
        const pallet = {
            id: id,
            mesh: new BABYLON.TransformNode(`pallet_${id}`, this.scene),
            isLoaded: false,
            isDelivered: false,
            baseHeight: 0.5
        };
        
        pallet.mesh.position = position.clone();
        
        const woodMat = new BABYLON.StandardMaterial(`palletWood_${id}`, this.scene);
        woodMat.diffuseColor = new BABYLON.Color3(0.55, 0.27, 0.07);
        
        // Base del palé (madera)
        const base = BABYLON.MeshBuilder.CreateBox(`palletBase_${id}`, 
            { width: 1.2, height: 0.15, depth: 1.6 }, this.scene);
        base.parent = pallet.mesh;
        base.material = woodMat;
        
        // Tablones superiores (3 tablones)
        const plankWidth = 1.0;
        const plankDepth = 0.12;
        
        for (let i = -0.5; i <= 0.5; i += 0.5) {
            const plank = BABYLON.MeshBuilder.CreateBox(`palletPlank_${id}_${i}`, 
                { width: plankWidth, height: 0.08, depth: plankDepth }, this.scene);
            plank.parent = pallet.mesh;
            plank.position = new BABYLON.Vector3(0, 0.115, i * 0.6);
            plank.material = woodMat;
        }
        
        // Patas del palé (4 patas)
        const legPositions = [
            new BABYLON.Vector3(-0.4, -0.15, 0.5),
            new BABYLON.Vector3(0.4, -0.15, 0.5),
            new BABYLON.Vector3(-0.4, -0.15, -0.5),
            new BABYLON.Vector3(0.4, -0.15, -0.5)
        ];
        
        legPositions.forEach((pos, legId) => {
            const leg = BABYLON.MeshBuilder.CreateBox(`palletLeg_${id}_${legId}`, 
                { width: 0.15, height: 0.3, depth: 0.15 }, this.scene);
            leg.parent = pallet.mesh;
            leg.position = pos;
            leg.material = woodMat;
        });
        
        this.pallets.push(pallet);
        return pallet;
    }
    
    createObstacle(type, position, size) {
        const obstacle = {
            mesh: null,
            type: type,
            position: position
        };
        
        let mesh;
        const obstacleMat = new BABYLON.StandardMaterial("obstacleMat", this.scene);
        
        switch(type) {
            case 'crate':
                obstacleMat.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.2);
                mesh = BABYLON.MeshBuilder.CreateBox(`obstacle_crate_${this.obstacles.length}`, 
                    size, this.scene);
                break;
                
            case 'barrel':
                obstacleMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                mesh = BABYLON.MeshBuilder.CreateCylinder(`obstacle_barrel_${this.obstacles.length}`, 
                    { diameter: size.width, height: size.height }, this.scene);
                break;
                
            case 'cone':
                obstacleMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
                mesh = BABYLON.MeshBuilder.CreateCylinder(`obstacle_cone_${this.obstacles.length}`, 
                    { diameterTop: 0, diameterBottom: size.width, height: size.height }, this.scene);
                break;
        }
        
        mesh.position = position;
        mesh.material = obstacleMat;
        obstacle.mesh = mesh;
        
        this.obstacles.push(obstacle);
        return obstacle;
    }
    
    loadLevel(level) {
        console.log(`🎮 Cargando nivel ${level}...`);
        
        // Limpiar objetos del nivel anterior
        this.clearLevelObjects();
        
        // Actualizar configuración según nivel
        this.config.currentLevel = level;
        this.currentPallets = this.config.palletsPerLevel[level - 1] || 3;
        
        // Actualizar UI
        document.getElementById('currentLevel').textContent = level;
        document.getElementById('totalPallets').textContent = this.currentPallets;
        document.getElementById('score').textContent = '0';
        
        // Establecer dificultad
        let difficulty = 'FÁCIL';
        if (level >= 4) difficulty = 'MUY DIFÍCIL';
        else if (level >= 3) difficulty = 'DIFÍCIL';
        else if (level >= 2) difficulty = 'MEDIO';
        
        document.getElementById('difficulty').textContent = `DIFICULTAD: ${difficulty}`;
        
        // Crear palés según nivel
        this.createLevelPallets(level);
        
        // Crear obstáculos según nivel
        this.createLevelObstacles(level);
        
        // Crear áreas especiales según nivel
        this.createLevelSpecialAreas(level);
        
        // Reposicionar montacargas
        if (this.forklift && this.forklift.mesh) {
            this.forklift.mesh.position = new BABYLON.Vector3(-15, 0.5, 0);
            this.forklift.mesh.rotation = new BABYLON.Vector3(0, 0, 0);
            
            // Resetear horquillas
            if (this.forklift.forks) {
                this.forklift.forks.position.y = 0.2;
            }
        }
        
        // Resetear estado del juego
        this.score = 0;
        this.gameTime = 0;
        this.startTime = Date.now();
        this.fuel = 100;
        this.gameCompleted = false;
        
        console.log(`✅ Nivel ${level} cargado: ${this.currentPallets} palés`);
    }
    
    clearLevelObjects() {
        // Limpiar palés
        this.pallets.forEach(pallet => {
            if (pallet.mesh) {
                pallet.mesh.dispose();
            }
        });
        this.pallets = [];
        
        // Limpiar obstáculos
        this.obstacles.forEach(obstacle => {
            if (obstacle.mesh) {
                obstacle.mesh.dispose();
            }
        });
        this.obstacles = [];
    }
    
    createLevelPallets(level) {
        const halfSize = this.config.warehouseSize / 2;
        
        // Generar posiciones aleatorias para palés
        for (let i = 0; i < this.currentPallets; i++) {
            // Área de spawn: cuadrante noreste de la bodega
            const x = 5 + Math.random() * (halfSize - 10);
            const z = 5 + Math.random() * (halfSize - 10);
            
            // Asegurar que no esté muy cerca del borde
            const position = new BABYLON.Vector3(
                Math.min(x, halfSize - 5),
                0.5,
                Math.min(z, halfSize - 5)
            );
            
            this.createPallet(position, i);
        }
    }
    
    createLevelObstacles(level) {
        const halfSize = this.config.warehouseSize / 2;
        const obstacleCount = Math.min(level * 3, 15); // Máximo 15 obstáculos
        
        for (let i = 0; i < obstacleCount; i++) {
            const types = ['crate', 'barrel', 'cone'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            // Posición aleatoria (evitar áreas importantes)
            let position;
            let validPosition = false;
            
            while (!validPosition) {
                const x = (Math.random() - 0.5) * (halfSize * 1.8);
                const z = (Math.random() - 0.5) * (halfSize * 1.8);
                
                // Evitar áreas críticas
                const nearTruck = Math.abs(x + 20) < 10 && Math.abs(z + 20) < 10;
                const nearStart = Math.abs(x + 15) < 10 && Math.abs(z) < 10;
                const nearOffice = Math.abs(x + 20) < 8 && Math.abs(z - 15) < 8;
                
                if (!nearTruck && !nearStart && !nearOffice) {
                    position = new BABYLON.Vector3(x, 0.5, z);
                    validPosition = true;
                }
            }
            
            // Tamaño según tipo
            let size;
            switch(type) {
                case 'crate':
                    size = { width: 1.5 + Math.random(), height: 1 + Math.random(), depth: 1.5 + Math.random() };
                    break;
                case 'barrel':
                    size = { width: 1, height: 1.5, depth: 1 };
                    break;
                case 'cone':
                    size = { width: 1, height: 1.2, depth: 1 };
                    break;
            }
            
            this.createObstacle(type, position, size);
        }
    }
    
    createLevelSpecialAreas(level) {
        // En niveles avanzados, agregar áreas especiales
        if (level >= 3) {
            // Agregar zona de recogida adicional
            const pickupZone = BABYLON.MeshBuilder.CreateGround("additionalPickupZone", 
                { width: 10, height: 8 }, this.scene);
            pickupZone.position = new BABYLON.Vector3(20, 0.01, 20);
            
            const zoneMat = new BABYLON.StandardMaterial("additionalZoneMat", this.scene);
            zoneMat.diffuseColor = new BABYLON.Color3(0, 0.5, 1);
            zoneMat.alpha = 0.2;
            pickupZone.material = zoneMat;
        }
        
        if (level >= 4) {
            // Agregar segundo camión de carga
            this.createDeliveryTruck(new BABYLON.Vector3(20, 0.5, -25));
        }
    }
    
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Crear sonidos básicos
            this.createBeepSound('pickup', 800, 0.2);
            this.createBeepSound('delivery', 1200, 0.2);
            this.createBeepSound('horn', 400, 0.3);
            this.createBeepSound('engine', 100, 0.5);
            this.createBeepSound('error', 300, 0.1);
        } catch (e) {
            console.log('⚠️ Audio no disponible, continuando sin sonido');
        }
    }
    
    createBeepSound(name, frequency, duration) {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
            
            this.sounds[name] = { oscillator, gainNode };
        } catch (e) {
            // Silenciar error de audio
        }
    }
    
    playSound(name) {
        try {
            if (this.sounds[name]) {
                const freq = {
                    'pickup': 800,
                    'delivery': 1200,
                    'horn': 400,
                    'engine': 100,
                    'error': 300
                }[name] || 500;
                
                this.createBeepSound(name, freq, 0.3);
            }
        } catch (e) {
            // Ignorar errores de audio
        }
    }
    
    setupControls() {
        // Configurar controles de teclado
        this.scene.onKeyboardObservable.add((kbInfo) => {
            const key = kbInfo.event.key.toLowerCase();
            
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                this.inputMap[key] = true;
                
                // Manejar teclas especiales
                switch(key) {
                    case 'e':
                        this.handleInteraction();
                        break;
                    case 'l':
                        this.toggleLights();
                        break;
                    case ' ':
                        this.honk();
                        break;
                    case 'c':
                        this.changeCamera();
                        break;
                    case 'r':
                        this.restartLevel();
                        break;
                    case 'p':
                        this.togglePause();
                        break;
                    case 'f1':
                        showTutorial();
                        break;
                }
                
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                this.inputMap[key] = false;
            }
        });
    }
    
    setupGameLoop() {
        // Bucle principal del juego
        this.scene.onBeforeRenderObservable.add(() => {
            if (this.isPaused || this.gameCompleted) return;
            
            // Actualizar tiempo de juego
            this.updateGameTime();
            
            // Actualizar movimiento del montacargas
            this.updateForkliftMovement();
            
            // Actualizar combustible
            this.updateFuelConsumption();
            
            // Actualizar cámara
            this.updateCameraPosition();
            
            // Actualizar interfaz de usuario
            this.updateUI();
            
            // Verificar colisiones
            this.checkCollisions();
            
            // Verificar si se completó el nivel
            if (this.score >= this.currentPallets && !this.gameCompleted) {
                this.completeLevel();
            }
        });
        
        // Iniciar bucle de renderizado
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        
        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    updateGameTime() {
        const now = Date.now();
        this.gameTime = Math.floor((now - this.startTime) / 1000);
        
        // Formatear tiempo como MM:SS
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        document.getElementById('gameTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateForkliftMovement() {
        if (!this.forklift || !this.forklift.mesh) return;
        
        const speed = this.config.movementSpeed;
        const rotationSpeed = this.config.rotationSpeed;
        
        // Calcular vector de movimiento
        const forward = new BABYLON.Vector3(0, 0, 0);
        const rotation = 0;
        
        // Movimiento adelante/atrás
        if (this.inputMap['w'] || this.inputMap['arrowup']) {
            forward.z += 1;
        }
        if (this.inputMap['s'] || this.inputMap['arrowdown']) {
            forward.z -= 1;
        }
        
        // Rotación izquierda/derecha
        if (this.inputMap['a'] || this.inputMap['arrowleft']) {
            this.forklift.mesh.rotation.y -= rotationSpeed;
        }
        if (this.inputMap['d'] || this.inputMap['arrowright']) {
            this.forklift.mesh.rotation.y += rotationSpeed;
        }
        
        // Normalizar vector de movimiento
        if (forward.length() > 0) {
            forward.normalize();
            
            // Rotar vector según orientación del montacargas
            const rotationMatrix = BABYLON.Matrix.RotationY(this.forklift.mesh.rotation.y);
            const rotatedForward = BABYLON.Vector3.TransformNormal(forward, rotationMatrix);
            
            // Aplicar movimiento
            this.forklift.mesh.position.addInPlace(rotatedForward.scale(speed));
            
            // Calcular velocidad en km/h
            this.speedKmh = Math.round(speed * 3600 / 1000 * 100);
            
            // Animar ruedas
            this.animateWheels(speed);
        } else {
            this.speedKmh = 0;
        }
        
        // Limitar posición dentro de la bodega
        const limit = this.config.warehouseSize / 2 - 2;
        this.forklift.mesh.position.x = Math.max(-limit, Math.min(limit, this.forklift.mesh.position.x));
        this.forklift.mesh.position.z = Math.max(-limit, Math.min(limit, this.forklift.mesh.position.z));
        
        // Mantener altura constante
        this.forklift.mesh.position.y = 0.5;
    }
    
    animateWheels(speed) {
        // Animar rotación de ruedas según velocidad
        const rotationAmount = speed * 5;
        
        this.forklift.wheels.forEach((wheel, index) => {
            // Ruedas delanteras giran más para simular dirección
            if (index < 2) {
                wheel.rotation.x += rotationAmount * (this.inputMap['a'] ? -1.5 : this.inputMap['d'] ? 1.5 : 1);
            } else {
                wheel.rotation.x += rotationAmount;
            }
        });
    }
    
    updateFuelConsumption() {
        const now = Date.now();
        
        // Consumo base por segundo
        let consumption = this.config.baseFuelConsumption;
        
        // Consumo adicional por movimiento
        const isMoving = this.inputMap['w'] || this.inputMap['s'] || 
                        this.inputMap['a'] || this.inputMap['d'] ||
                        this.inputMap['arrowup'] || this.inputMap['arrowdown'] ||
                        this.inputMap['arrowleft'] || this.inputMap['arrowright'];
        
        if (isMoving) {
            consumption += this.config.fuelConsumptionRate * this.speedKmh / 10;
            this.lastMovementTime = now;
        }
        
        // Consumo adicional por luces encendidas
        if (this.lightsOn) {
            consumption += 0.2;
        }
        
        // Aplicar consumo (cada segundo)
        if (now - this.lastFuelUpdate > 1000) {
            this.fuel -= consumption;
            this.fuel = Math.max(0, this.fuel);
            this.lastFuelUpdate = now;
        }
        
        // Actualizar barra de combustible
        const fuelFill = document.getElementById('fuelFill');
        fuelFill.style.width = this.fuel + '%';
        document.getElementById('fuelPercent').textContent = Math.round(this.fuel) + '%';
        
        // Cambiar color según nivel
        if (this.fuel < 20) {
            fuelFill.style.background = '#f44336';
            if (this.fuel <= 0 && !this.gameCompleted) {
                this.gameOver('¡SIN COMBUSTIBLE!');
            }
        } else if (this.fuel < 50) {
            fuelFill.style.background = '#ff9800';
        } else {
            fuelFill.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
        }
    }
    
    updateCameraPosition() {
        if (!this.forklift || !this.forklift.mesh) return;
        
        const forkliftPos = this.forklift.mesh.position;
        
        switch(this.cameraMode) {
            case 0: // Tercera persona
                this.thirdPersonCamera.target = forkliftPos.clone();
                break;
                
            case 1: // Primera persona
                this.firstPersonCamera.position = forkliftPos.clone();
                this.firstPersonCamera.position.y += 1.5;
                this.firstPersonCamera.rotation.y = this.forklift.mesh.rotation.y;
                this.firstPersonCamera.rotation.x = -0.1;
                break;
                
            case 2: // Superior
                this.topCamera.position.x = forkliftPos.x;
                this.topCamera.position.z = forkliftPos.z;
                break;
        }
    }
    
    updateUI() {
        // Actualizar velocidad
        document.getElementById('speed').textContent = this.speedKmh + ' km/h';
        
        // Actualizar puntuación
        document.getElementById('score').textContent = this.score;
        
        // Actualizar estado de misión
        const remaining = this.currentPallets - this.score;
        let status = '';
        
        if (this.gameCompleted) {
            status = '¡NIVEL COMPLETADO!';
        } else if (this.fuel <= 0) {
            status = '¡SIN COMBUSTIBLE!';
        } else {
            status = `PALÉS RESTANTES: ${remaining}`;
        }
        
        document.getElementById('missionStatus').textContent = status;
    }
    
    checkCollisions() {
        if (!this.forklift || !this.forklift.mesh) return;
        
        const forkliftPos = this.forklift.mesh.position;
        const collisionRadius = 1.5;
        
        // Verificar colisión con obstáculos
        for (const obstacle of this.obstacles) {
            if (obstacle.mesh) {
                const distance = BABYLON.Vector3.Distance(forkliftPos, obstacle.mesh.position);
                
                if (distance < collisionRadius) {
                    // Aplicar retroceso
                    const direction = forkliftPos.subtract(obstacle.mesh.position).normalize();
                    this.forklift.mesh.position.addInPlace(direction.scale(0.5));
                    
                    // Consumir combustible extra
                    this.fuel -= 2;
                    
                    // Efecto visual de colisión
                    this.createCollisionEffect(obstacle.mesh.position);
                    break;
                }
            }
        }
        
        // Verificar límites de la bodega
        const limit = this.config.warehouseSize / 2 - 1;
        if (Math.abs(forkliftPos.x) > limit || Math.abs(forkliftPos.z) > limit) {
            // Empujar hacia adentro
            const center = new BABYLON.Vector3(0, 0, 0);
            const direction = center.subtract(forkliftPos).normalize();
            this.forklift.mesh.position.addInPlace(direction.scale(1));
        }
    }
    
    createCollisionEffect(position) {
        // Crear efecto de chispa
        const spark = BABYLON.MeshBuilder.CreateSphere("spark", 
            { diameter: 0.3 }, this.scene);
        spark.position = position.clone();
        spark.position.y += 1;
        
        const sparkMat = new BABYLON.StandardMaterial("sparkMat", this.scene);
        sparkMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
        sparkMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
        spark.material = sparkMat;
        
        // Animación
        BABYLON.Animation.CreateAndStartAnimation(
            'sparkAnimation',
            spark,
            'scaling',
            30,
            30,
            new BABYLON.Vector3(1, 1, 1),
            new BABYLON.Vector3(0, 0, 0),
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        // Eliminar después de la animación
        setTimeout(() => spark.dispose(), 500);
    }
    
    handleInteraction() {
        if (!this.forklift || !this.forklift.mesh) return;
        
        const forkliftPos = this.forklift.mesh.position;
        
        // Intentar recoger palé
        const palletToPickup = this.findNearbyPallet(forkliftPos, 2.5);
        if (palletToPickup && !palletToPickup.isLoaded && !palletToPickup.isDelivered) {
            this.pickupPallet(palletToPickup);
            return;
        }
        
        // Intentar entregar palé
        if (this.forklift.currentPallet) {
            const deliveryDistance = BABYLON.Vector3.Distance(forkliftPos, new BABYLON.Vector3(-20, 0, -20));
            if (deliveryDistance < 4) {
                this.deliverPallet(this.forklift.currentPallet);
                return;
            }
            
            // Verificar segundo camión (niveles altos)
            if (this.trucks.length > 1) {
                const secondTruckDistance = BABYLON.Vector3.Distance(forkliftPos, new BABYLON.Vector3(20, 0, -25));
                if (secondTruckDistance < 4) {
                    this.deliverPallet(this.forklift.currentPallet);
                    return;
                }
            }
        }
    }
    
    findNearbyPallet(position, maxDistance) {
        for (const pallet of this.pallets) {
            if (!pallet.isLoaded && !pallet.isDelivered) {
                const distance = BABYLON.Vector3.Distance(position, pallet.mesh.position);
                if (distance < maxDistance) {
                    return pallet;
                }
            }
        }
        return null;
    }
    
    pickupPallet(pallet) {
        if (this.forklift.currentPallet) return; // Ya lleva un palé
        
        pallet.isLoaded = true;
        this.forklift.currentPallet = pallet;
        
        // Parentear al montacargas
        pallet.mesh.parent = this.forklift.mesh;
        pallet.mesh.position = new BABYLON.Vector3(0, 1.2, 2);
        
        // Animación de levantamiento
        this.animateForks('up');
        
        // Sonido
        this.playSound('pickup');
        
        // Efecto visual
        this.createPickupEffect(pallet.mesh.position);
        
        // Actualizar UI
        document.getElementById('missionStatus').textContent = 'PALÉ RECOGIDO - Llévalo al camión';
    }
    
    deliverPallet(pallet) {
        if (!pallet.isLoaded || pallet.isDelivered) return;
        
        pallet.isLoaded = false;
        pallet.isDelivered = true;
        this.forklift.currentPallet = null;
        
        // Dejar de parentear
        pallet.mesh.parent = null;
        
        // Posicionar en zona de entrega (aleatorio cerca del camión)
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetZ = (Math.random() - 0.5) * 8;
        pallet.mesh.position = new BABYLON.Vector3(-20 + offsetX, 0.5, -20 + offsetZ);
        
        // Animación de bajada
        this.animateForks('down');
        
        // Sonido
        this.playSound('delivery');
        
        // Efecto visual
        this.createDeliveryEffect(pallet.mesh.position);
        
        // Incrementar puntuación
        this.score++;
        
        // Actualizar UI
        const remaining = this.currentPallets - this.score;
        document.getElementById('missionStatus').textContent = 
            remaining > 0 ? `¡ENTREGADO! ${remaining} palés restantes` : '¡ÚLTIMO PALÉ ENTREGADO!';
    }
    
    animateForks(direction) {
        if (!this.forklift.forks) return;
        
        const targetY = direction === 'up' ? 1.2 : 0.2;
        
        BABYLON.Animation.CreateAndStartAnimation(
            'forksAnimation',
            this.forklift.forks,
            'position.y',
            30,
            30,
            this.forklift.forks.position.y,
            targetY,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
    }
    
    createPickupEffect(position) {
        const effect = BABYLON.MeshBuilder.CreateSphere("pickupEffect", 
            { diameter: 1 }, this.scene);
        effect.position = position.clone();
        
        const effectMat = new BABYLON.StandardMaterial("pickupEffectMat", this.scene);
        effectMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        effectMat.alpha = 0.5;
        effect.material = effectMat;
        
        // Animación
        BABYLON.Animation.CreateAndStartAnimation(
            'pickupEffectAnimation',
            effect,
            'scaling',
            30,
            30,
            new BABYLON.Vector3(1, 1, 1),
            new BABYLON.Vector3(3, 3, 3),
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        setTimeout(() => effect.dispose(), 1000);
    }
    
    createDeliveryEffect(position) {
        const effect = BABYLON.MeshBuilder.CreateTorus("deliveryEffect", 
            { diameter: 2, thickness: 0.1 }, this.scene);
        effect.position = position.clone();
        effect.position.y += 1;
        
        const effectMat = new BABYLON.StandardMaterial("deliveryEffectMat", this.scene);
        effectMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
        effectMat.alpha = 0.7;
        effect.material = effectMat;
        
        // Animación
        BABYLON.Animation.CreateAndStartAnimation(
            'deliveryEffectAnimation',
            effect,
            'scaling',
            30,
            30,
            new BABYLON.Vector3(1, 1, 1),
            new BABYLON.Vector3(2, 2, 2),
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        setTimeout(() => effect.dispose(), 1000);
    }
    
    toggleLights() {
        this.lightsOn = !this.lightsOn;
        
        // Actualizar luces del montacargas
        this.forklift.lights.forEach(light => {
            light.intensity = this.lightsOn ? 3 : 0;
        });
        
        // Actualizar botón
        const lightsBtn = document.getElementById('lightsBtn');
        if (this.lightsOn) {
            lightsBtn.classList.add('active');
            lightsBtn.innerHTML = '<i class="fas fa-lightbulb"></i>';
        } else {
            lightsBtn.classList.remove('active');
            lightsBtn.innerHTML = '<i class="far fa-lightbulb"></i>';
        }
        
        // Efecto de sonido
        this.playSound('engine');
    }
    
    honk() {
        // Efecto visual de bocina
        this.createHornEffect();
        
        // Sonido
        this.playSound('horn');
        
        // Animar botón
        const hornBtn = document.getElementById('hornBtn');
        hornBtn.classList.add('shake');
        setTimeout(() => hornBtn.classList.remove('shake'), 500);
    }
    
    createHornEffect() {
        // Crear onda de sonido
        const soundWave = BABYLON.MeshBuilder.CreateTorus("soundWave", 
            { diameter: 1, thickness: 0.05 }, this.scene);
        
        soundWave.parent = this.forklift.mesh;
        soundWave.position = new BABYLON.Vector3(0, 1.5, -1);
        
        const waveMat = new BABYLON.StandardMaterial("waveMat", this.scene);
        waveMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
        waveMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
        waveMat.alpha = 0.5;
        soundWave.material = waveMat;
        
        // Animación de expansión
        BABYLON.Animation.CreateAndStartAnimation(
            'hornWaveAnimation',
            soundWave,
            'scaling',
            30,
            30,
            new BABYLON.Vector3(1, 1, 1),
            new BABYLON.Vector3(5, 5, 5),
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        BABYLON.Animation.CreateAndStartAnimation(
            'hornFadeAnimation',
            waveMat,
            'alpha',
            30,
            30,
            0.5,
            0,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        setTimeout(() => soundWave.dispose(), 1000);
    }
    
    changeCamera() {
        this.cameraMode = (this.cameraMode + 1) % this.cameras.length;
        this.scene.activeCamera = this.cameras[this.cameraMode];
        
        // Actualizar botón
        const cameraBtn = document.getElementById('cameraBtn');
        const icons = ['fa-camera', 'fa-eye', 'fa-satellite'];
        cameraBtn.innerHTML = `<i class="fas ${icons[this.cameraMode]}"></i>`;
        
        // Efecto visual
        cameraBtn.classList.add('glow');
        setTimeout(() => cameraBtn.classList.remove('glow'), 1000);
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            // Actualizar estadísticas en pantalla de pausa
            document.getElementById('pauseTime').textContent = document.getElementById('gameTime').textContent;
            document.getElementById('pauseScore').textContent = this.score;
            document.getElementById('pauseTotal').textContent = this.currentPallets;
            document.getElementById('pauseFuel').textContent = Math.round(this.fuel) + '%';
            document.getElementById('pauseLevel').textContent = this.config.currentLevel;
            
            // Mostrar pantalla de pausa
            document.getElementById('pauseScreen').classList.add('active');
            
            // Actualizar botón
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            // Ocultar pantalla de pausa
            document.getElementById('pauseScreen').classList.remove('active');
            
            // Actualizar botón
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
        }
    }
    
    restartLevel() {
        // Efecto visual en botón
        const restartBtn = document.getElementById('restartBtn');
        restartBtn.classList.add('pulse');
        setTimeout(() => restartBtn.classList.remove('pulse'), 1000);
        
        // Recargar nivel actual
        this.loadLevel(this.config.currentLevel);
        
        // Ocultar pantallas
        document.getElementById('levelCompleteScreen').classList.remove('active');
        document.getElementById('pauseScreen').classList.remove('active');
        
        this.isPaused = false;
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    completeLevel() {
        this.gameCompleted = true;
        
        // Calcular estadísticas
        const timeBonus = Math.max(0, 5000 - this.gameTime * 10);
        const fuelBonus = Math.round(this.fuel * 5);
        const levelBonus = this.config.currentLevel * 500;
        const finalScore = 1000 + timeBonus + fuelBonus + levelBonus;
        
        const efficiency = Math.round((this.currentPallets / (this.gameTime / 60)) * 100);
        
        // Actualizar pantalla de nivel completado
        document.getElementById('finalScore').textContent = finalScore.toLocaleString();
        document.getElementById('finalTime').textContent = document.getElementById('gameTime').textContent;
        document.getElementById('efficiency').textContent = efficiency + '%';
        document.getElementById('remainingFuel').textContent = Math.round(this.fuel) + '%';
        
        // Mostrar pantalla
        document.getElementById('levelCompleteScreen').classList.add('active');
        
        // Guardar progreso
        this.saveProgress();
    }
    
    gameOver(reason) {
        this.gameCompleted = true;
        
        // Mostrar mensaje de Game Over
        alert(`GAME OVER\n${reason}\n\nPuntuación final: ${this.score}/${this.currentPallets} palés\nTiempo: ${document.getElementById('gameTime').textContent}`);
        
        // Reiniciar después de 3 segundos
        setTimeout(() => {
            this.restartLevel();
        }, 3000);
    }
    
    saveProgress() {
        // Guardar progreso en localStorage
        const progress = {
            level: this.config.currentLevel,
            score: this.score,
            time: this.gameTime,
            date: new Date().toISOString()
        };
        
        localStorage.setItem('warehouseGameProgress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('warehouseGameProgress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                this.config.currentLevel = Math.min(progress.level, this.config.totalLevels);
                return progress.level;
            } catch (e) {
                return 1;
            }
        }
        return 1;
    }
    
    showErrorScreen() {
        const body = document.body;
        body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a1929 0%, #1a1a2e 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1 style="color: #f44336; font-size: 2.5em; margin-bottom: 20px;">
                        <i class="fas fa-exclamation-triangle"></i> ERROR
                    </h1>
                    <p style="font-size: 1.2em; margin-bottom: 30px;">
                        Ha ocurrido un error al cargar el juego.<br>
                        Por favor, recarga la página.
                    </p>
                    <button onclick="location.reload()" style="
                        background: linear-gradient(135deg, #4CAF50, #2E7D32);
                        color: white;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 12px;
                        font-size: 1.1em;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    ">
                        <i class="fas fa-redo"></i> RECARGAR JUEGO
                    </button>
                </div>
            </div>
        `;
    }
}

// ============================================================================
// FUNCIONES GLOBALES Y MANEJO DE EVENTOS
// ============================================================================

let game = null;

window.addEventListener('DOMContentLoaded', () => {
    console.log('🚛 Inicializando Simulador de Bodega...');
    
    // Crear instancia del juego
    game = new WarehouseGame();
    
    // Cargar progreso guardado
    const savedLevel = game.loadProgress();
    if (savedLevel > 1) {
        game.config.currentLevel = savedLevel;
        game.loadLevel(savedLevel);
    }
});

// Funciones globales accesibles desde HTML
function toggleLights() {
    if (game) game.toggleLights();
}

function honk() {
    if (game) game.honk();
}

function changeCamera() {
    if (game) game.changeCamera();
}

function restartGame() {
    if (game) game.restartLevel();
}

function togglePause() {
    if (game) game.togglePause();
}

function resumeGame() {
    if (game) game.togglePause(); // Misma función
}

function nextLevel() {
    if (game) {
        if (game.config.currentLevel < game.config.totalLevels) {
            game.config.currentLevel++;
            game.loadLevel(game.config.currentLevel);
            document.getElementById('levelCompleteScreen').classList.remove('active');
        } else {
            // Si es el último nivel, reiniciar desde el principio
            alert('¡FELICIDADES!\nHas completado todos los niveles del juego.\n\nEl juego se reiniciará desde el nivel 1.');
            game.config.currentLevel = 1;
            game.loadLevel(1);
            document.getElementById('levelCompleteScreen').classList.remove('active');
        }
    }
}

// Manejar tecla F1 para tutorial
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        showTutorial();
    }
});

// Manejar visibilidad de página
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game && !game.isPaused) {
        game.togglePause();
    }
});