// Obtenha referências aos elementos HTML que você precisa
const personagem = document.getElementById("personagem");
const tabuleiro = document.getElementById("tabuleiro");

// Defina as dimensões do tabuleiro e a posição inicial da personagem
const larguraQuadrado = 150; // Largura de cada quadrado do tabuleiro
const alturaQuadrado = 150; // Altura de cada quadrado do tabuleiro
const linhas = 3; // Número de linhas no tabuleiro
const colunas = 3; // Número de colunas no tabuleiro
const velocidadeMovimento = 500; // Velocidade de movimento em milissegundos

// Posição inicial da personagem
let posicaoX = 0;
let posicaoY = 0;

let emMovimento = false; // Variável para controlar se a personagem está em movimento

// Função para mover a personagem
function moverPersonagem(direcao) {
  // Verificar se a personagem já está em movimento, se sim, sair
  if (emMovimento) {
    return;
  }

  emMovimento = true; // Marcar que a personagem está em movimento

  let novoX = posicaoX;
  let novoY = posicaoY;

  // Calcular a nova posição com base na direção
  switch (direcao) {
    case "cima":
      novoY = Math.max(0, posicaoY - 1);
      break;
    case "baixo":
      novoY = Math.min(linhas - 1, posicaoY + 1);
      break;
    case "esquerda":
      novoX = Math.max(0, posicaoX - 1);
      break;
    case "direita":
      novoX = Math.min(colunas - 1, posicaoX + 1);
      break;
    default:
      return; // Direção inválida
  }

  // Calcular as coordenadas em pixels da nova posição
  const novoXPixel = novoX * larguraQuadrado;
  const novoYPixel = novoY * alturaQuadrado;

  // Animação de movimento
  personagem.style.transition = `transform ${velocidadeMovimento}ms linear`;
  personagem.style.transform = `translate(${novoXPixel}px, ${novoYPixel}px)`;

  // Atualizar a posição atual da personagem
  posicaoX = novoX;
  posicaoY = novoY;

  // Lidar com o término da animação
  setTimeout(() => {
    emMovimento = false; // Marcar que o movimento terminou
  }, velocidadeMovimento);
}

// Lidar com eventos de pressionamento de tecla para as setas do teclado
document.addEventListener("keydown", (event) => {
  // Verificar se a personagem está em movimento
  if (emMovimento) {
    return;
  }

  switch (event.key) {
    case "ArrowUp":
      moverPersonagem("cima");
      break;
    case "ArrowDown":
      moverPersonagem("baixo");
      break;
    case "ArrowLeft":
      moverPersonagem("esquerda");
      break;
    case "ArrowRight":
      moverPersonagem("direita");
      break;
  }
});
