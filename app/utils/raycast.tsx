import * as THREE from 'three';

export function raycast(event: any, gltf: any, raycastBehavior: RaycastBehavior = raycastHover) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  const rect = event.target.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, gltf.cameras[0]);
  const intersects = raycaster.intersectObjects(gltf.scene.children, true);

  if (intersects.length > 0) {
    const mesh = intersects[0].object as THREE.Mesh;
    raycastBehavior(mesh, event);
  }
}

export interface RaycastBehavior {
  (mesh: THREE.Mesh, event: any): void;
}
export function raycastHover(mesh: THREE.Mesh, event: any) {
  mesh.name.includes('target') ?
    event.target.style.cursor = 'pointer' :
    event.target.style.cursor = 'default';
}
export function raycastClick(mesh: THREE.Mesh, event: any) {
  mesh.name.includes('target') &&
    (mesh.material as THREE.Material & { color: THREE.Color }).color.set(0xff0000);
}
