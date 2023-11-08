// Obtenha referências aos elementos HTML que você precisa
const personagem = document.getElementById("personagem");
const tabuleiro = document.getElementById("tabuleiro");

// Defina as dimensões do tabuleiro e a posição inicial da personagem
const larguraQuadrado = 122; // Largura de cada quadrado do tabuleiro
const alturaQuadrado = 122; // Altura de cada quadrado do tabuleiro
const linhas = 3; // Número de linhas no tabuleiro
const colunas = 3; // Número de colunas no tabuleiro
const velocidadeMovimento = 250; // Velocidade de movimento em milissegundos

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

// Variável para controlar o estado da skin
let skinAlterada = false;

// Variável para controlar o estado da skin
let estadoSkin = 0; // 0 para a primeira skin, 1 para a segunda, 2 para a terceira

function mudarSkin() {
  // Obtenha referências aos elementos HTML que você deseja modificar a cor
  const body = document.body;
  const buttons = document.querySelectorAll('button');
  const personagem = document.getElementById('personagem');
  const container = document.querySelector('.container');
  const inventario = document.querySelector('.inventario');
  const circulo1 = document.querySelector('.circle1');
  const circulo2 = document.querySelector('.circle2');
  const tempo = document.getElementById('tempo');
  const pontuacao = document.getElementById('pontuacao');
  const vidas = document.getElementById('vidas');

  //Cores da primeira skin
  const corSkinDoBodyPrimeira= 'rgb(46, 37, 48)';
  const corSkinDosBotoesPrimeira = '#b1949c';
  const corSkinDaPersonagemPrimeira = '#b1949c';
  const corSkinContainerPrimeira = 'rgb(46, 37, 48)';
  const corSkinInventarioPrimeira = '#b1949c';
  const corSkinCirculo1Primeira = '#b1949c';
  const corSkinCirculo2Primeira= '#b1949c';
  const corSkinTempoPrimeira = '#b1949c';
  const corBorderTopCirculoPrimeira = '#000000';

  //Cores da segunda skin
  const corSkinDoBodySegunda = '#2f2f2f';
  const corSkinDosBotoesSegunda = '#fe6f27';
  const corSkinDaPersonagemSegunda = '#fe6f27';
  const corSkinContainerSegunda= '#2f2f2f';
  const corSkinInventarioSegunda = '#fe6f27';
  const corSkinCirculo1Segunda = '#fe6f27';
  const corSkinCirculo2Segunda = '#fe6f27';
  const corSkinTempoSegunda = '#fe6f27';
  const corBorderTopCirculoSegunda = '#000000';

  //Cores da terceira skin
  const corSkinDoBodyTerceira = '#10377a'; 
  const corSkinDosBotoesTerceira = '#9fafce';
  const corSkinDaPersonagemTerceira = '#9fafce';
  const corSkinContainerTerceira = '#10377a'; 
  const corSkinInventarioTerceira = '#9fafce'; 
  const corSkinCirculo1Terceira = '#9fafce'; 
  const corSkinCirculo2Terceira = '#9fafce'; 
  const corSkinTempoTerceira = '#9fafce'; 
  const corBorderTopCirculoTerceira = '#000000';
  

  //Array para armazenar as cores de cada skin
  const coresSkins = [
    {
      body: corSkinDoBodyPrimeira,
      buttons: corSkinDosBotoesPrimeira,
      personagem: corSkinDaPersonagemPrimeira,
      container: corSkinContainerPrimeira,
      inventario: corSkinInventarioPrimeira,
      circulo1: corSkinCirculo1Primeira,
      circulo2: corSkinCirculo2Primeira,
      tempo: corSkinTempoPrimeira,
      borderTopColor: corBorderTopCirculoPrimeira,
      },
    {
      body: corSkinDoBodySegunda,
      buttons: corSkinDosBotoesSegunda,
      personagem: corSkinDaPersonagemSegunda,
      container: corSkinContainerSegunda,
      inventario: corSkinInventarioSegunda,
      circulo1: corSkinCirculo1Segunda,
      circulo2: corSkinCirculo2Segunda,
      tempo: corSkinTempoSegunda,
      borderTopColor: corBorderTopCirculoSegunda,
      },
    {
      body: corSkinDoBodyTerceira,
      buttons: corSkinDosBotoesTerceira,
      personagem: corSkinDaPersonagemTerceira,
      container: corSkinContainerTerceira,
      inventario: corSkinInventarioTerceira,
      circulo1: corSkinCirculo1Terceira,
      circulo2: corSkinCirculo2Terceira,
      tempo: corSkinTempoTerceira,
      borderTopColor: corBorderTopCirculoTerceira,
      }
  ];

  // Alterne entre as skins com base no estado atual
  body.style.backgroundColor = coresSkins[estadoSkin].body;
  buttons.forEach((button) => {
    button.style.backgroundColor = coresSkins[estadoSkin].buttons;
  });
  personagem.style.backgroundColor = coresSkins[estadoSkin].personagem;
  container.style.backgroundColor = coresSkins[estadoSkin].container;
  circulo1.style.borderColor = coresSkins[estadoSkin].circulo1;
  circulo1.style.borderTopColor = coresSkins[estadoSkin].borderTopColor;
  circulo2.style.borderColor = coresSkins[estadoSkin].circulo2;
  circulo2.style.borderTopColor = coresSkins[estadoSkin].borderTopColor;
  tempo.style.color = coresSkins[estadoSkin].tempo;
  pontuacao.style.color = coresSkins[estadoSkin].tempo;
  vidas.style.color = coresSkins[estadoSkin].tempo;
  inventario.querySelectorAll('td').forEach((td) => {
    td.style.backgroundColor = coresSkins[estadoSkin].inventario;
  });

  // Incrementar o estado da skin (circular entre 0, 1 e 2)
  estadoSkin = (estadoSkin + 1) % coresSkins.length;
}

// Event listener para o botão "Skin"

const botaoSkin = document.getElementById("skin");
botaoSkin.addEventListener("click", mudarSkin);








