/**
 * Shader GLSL que simula o "vertex wobble" característico do PlayStation 1.
 * Aplica uma ondulação senoidal nas posições dos vértices com base
 * no tempo (uTime) e intensidade (uIntensity), recriando a instabilidade
 * geométrica típica da renderização do PS1.
 *
 * Uso: aplicar como material customizado do Three.js via ShaderMaterial.
 */
export const vertexWobble = {
  vertexShader: `
    uniform float uTime;
    uniform float uIntensity;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      float wobble = sin(pos.x * 3.0 + uTime * 2.0) * 0.02 * uIntensity
                  + sin(pos.y * 4.0 + uTime * 1.5) * 0.02 * uIntensity
                  + sin(pos.z * 5.0 + uTime * 2.5) * 0.02 * uIntensity;
      pos += normal * wobble;
      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform vec3 uEmissive;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 lightDir = normalize(vec3(2.0, 3.0, 1.0));
      float diff = max(dot(vNormal, lightDir), 0.0);
      vec3 color = uColor * (0.4 + diff * 0.6) + uEmissive * 0.1;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
}
