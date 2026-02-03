<template>
  <div ref="containerRef" class="w-full h-full relative">
    <!-- Loading Indicator -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10"
    >
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-white text-sm">Cargando escena 3D...</p>
      </div>
    </div>

    <!-- Controls Info -->
    <div
      class="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 z-10"
    >
      <p class="font-bold text-brand-purple mb-2">Controles 3D</p>
      <p>🖱️ Click izquierdo: Rotar cámara</p>
      <p>🖱️ Click derecho: Mover cámara</p>
      <p>🔍 Scroll: Zoom</p>
      <p>👆 Click en objeto: Seleccionar</p>
    </div>

    <!-- Stats (FPS, etc) -->
    <div
      v-if="showStats"
      class="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 z-10 font-mono"
    >
      <p>FPS: {{ fps }}</p>
      <p>Objetos: {{ objectCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { StudioItem } from '@/types'

interface Props {
  items?: StudioItem[]
  selectedItemId?: number | string | null
  viewMode?: '2D' | '3D'
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  selectedItemId: null,
  viewMode: '3D',
})

const emit = defineEmits<{
  itemSelected: [id: number | string]
  itemMoved: [id: number | string, x: number, y: number]
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)
const showStats = ref(true)
const fps = ref(0)
const objectCount = ref(0)

// Three.js core
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let raycaster: THREE.Raycaster
let mouse: THREE.Vector2

// Loaders
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

// Scene objects
const productMeshes = new Map<number | string, THREE.Object3D>()
let deskMesh: THREE.Mesh
let selectedObject: THREE.Object3D | null = null

// Animation
let animationFrameId: number
let lastTime = 0
let frameCount = 0

const initScene = () => {
  if (!containerRef.value) return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)
  scene.fog = new THREE.Fog(0x0a0a0a, 10, 50)

  // Camera
  const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
  camera.position.set(0, 8, 12)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  containerRef.value.appendChild(renderer.domElement)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 5
  controls.maxDistance = 30
  controls.maxPolarAngle = Math.PI / 2.2
  controls.target.set(0, 0, 0)

  // Raycaster for object picking
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Lights
  setupLighting()

  // Desk
  createDesk()

  // Grid helper
  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
  gridHelper.position.y = -0.01
  scene.add(gridHelper)

  // Event listeners
  renderer.domElement.addEventListener('click', onCanvasClick)
  window.addEventListener('resize', onWindowResize)

  isLoading.value = false
}

const setupLighting = () => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  // Main directional light (sun)
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
  mainLight.position.set(5, 10, 5)
  mainLight.castShadow = true
  mainLight.shadow.camera.left = -10
  mainLight.shadow.camera.right = 10
  mainLight.shadow.camera.top = 10
  mainLight.shadow.camera.bottom = -10
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  scene.add(mainLight)

  // Fill light (purple accent)
  const fillLight = new THREE.DirectionalLight(0x8b5cf6, 0.4)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)

  // Rim light
  const rimLight = new THREE.DirectionalLight(0x00c2ff, 0.3)
  rimLight.position.set(0, 3, -8)
  scene.add(rimLight)
}

const createDesk = () => {
  // Desk surface
  const deskGeometry = new THREE.BoxGeometry(10, 0.2, 6)

  // Wood texture (you can replace with actual texture)
  const deskMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a1810,
    roughness: 0.7,
    metalness: 0.1,
  })

  deskMesh = new THREE.Mesh(deskGeometry, deskMaterial)
  deskMesh.receiveShadow = true
  deskMesh.position.y = 0
  scene.add(deskMesh)

  // Desk edge highlight
  const edgeGeometry = new THREE.EdgesGeometry(deskGeometry)
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    opacity: 0.3,
    transparent: true,
  })
  const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial)
  deskMesh.add(edges)
}

const createImagePlane = async (item: StudioItem) => {
  if (!item.image) return

  try {
    const texture = await textureLoader.loadAsync(item.image)
    const geometry = new THREE.PlaneGeometry(1.5, 1.5)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const plane = new THREE.Mesh(geometry, material)
    plane.castShadow = true
    plane.receiveShadow = true

    // Position
    const worldX = (item.x - 50) / 10
    const worldZ = (item.y - 50) / 10
    plane.position.set(worldX, 0.75, worldZ)
    plane.rotation.y = (item.rotation * Math.PI) / 180
    plane.scale.setScalar(item.scale)

    // Make it billboard (always face camera)
    plane.userData = { itemId: item.id, type: 'product', billboard: true }
    productMeshes.set(item.id, plane)
    scene.add(plane)
  } catch (err) {
    console.error('Error loading image plane for:', item.name, err)
  }
}

const loadProduct = async (item: StudioItem) => {
  // Remove existing mesh if any
  if (productMeshes.has(item.id)) {
    const oldMesh = productMeshes.get(item.id)!
    scene.remove(oldMesh)
    productMeshes.delete(item.id)
  }

  try {
    if (item.model3d) {
      // Load GLB/GLTF model
      const gltf = await gltfLoader.loadAsync(item.model3d)
      const model = gltf.scene

      // Setup model
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Scale and position
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1.5 / maxDim
      model.scale.setScalar(scale * item.scale)

      // Position on desk
      const worldX = (item.x - 50) / 10
      const worldZ = (item.y - 50) / 10
      model.position.set(worldX, 0.1, worldZ)
      model.rotation.y = (item.rotation * Math.PI) / 180

      // Store reference
      model.userData = { itemId: item.id, type: 'product' }
      productMeshes.set(item.id, model)
      scene.add(model)
    } else {
      // Fallback: Create a plane with image texture
      await createImagePlane(item)
    }
  } catch (error) {
    console.warn('Error loading 3D model, falling back to 2D image:', item.name, error)
    await createImagePlane(item)
  }

  objectCount.value = productMeshes.size
}

const onCanvasClick = (event: MouseEvent) => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Array.from(productMeshes.values()), true)

  if (intersects.length > 0) {
    let object = intersects[0].object
    while (object.parent && !object.userData.itemId) {
      object = object.parent
    }

    if (object.userData.itemId) {
      emit('itemSelected', object.userData.itemId)
      highlightObject(object)
    }
  }
}

const highlightObject = (object: THREE.Object3D) => {
  // Remove previous highlight
  if (selectedObject) {
    selectedObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          ;(mesh.material as THREE.MeshStandardMaterial).emissive?.setHex(0x000000)
        }
      }
    })
  }

  // Add new highlight
  selectedObject = object
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      if (mesh.material) {
        ;(mesh.material as THREE.MeshStandardMaterial).emissive?.setHex(0x8b5cf6)
        ;(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3
      }
    }
  })
}

const animate = (time: number) => {
  animationFrameId = requestAnimationFrame(animate)

  // FPS calculation
  frameCount++
  if (time - lastTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastTime = time
  }

  // Update controls
  controls.update()

  // Billboard effect for image planes
  productMeshes.forEach((mesh) => {
    if (mesh.userData.billboard) {
      mesh.lookAt(camera.position)
    }
  })

  // Render
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  if (!containerRef.value) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// Watch for item changes
watch(
  () => props.items,
  (newItems) => {
    // Remove items that no longer exist
    const newIds = new Set(newItems.map((item) => item.id))
    productMeshes.forEach((mesh, id) => {
      if (!newIds.has(id)) {
        scene.remove(mesh)
        productMeshes.delete(id)
      }
    })

    // Add or update items
    newItems.forEach((item) => {
      loadProduct(item)
    })
  },
  { deep: true },
)

watch(
  () => props.selectedItemId,
  (newId) => {
    if (newId && productMeshes.has(newId)) {
      highlightObject(productMeshes.get(newId)!)
    }
  },
)

onMounted(() => {
  initScene()
  animate(0)

  // Load initial items
  props.items.forEach((item) => {
    loadProduct(item)
  })
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  renderer?.domElement.removeEventListener('click', onCanvasClick)
  window.removeEventListener('resize', onWindowResize)

  controls?.dispose()
  renderer?.dispose()

  productMeshes.forEach((mesh) => {
    scene?.remove(mesh)
  })
  productMeshes.clear()
})
</script>

<style scoped>
canvas {
  display: block;
  outline: none;
}
</style>
