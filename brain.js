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

//Tempo Inicial do jogo
let tempoRestante = 10;

let jogoIniciado = false;
let pausado = false; // Variável para controlar o estado de pausa do jogo

// Função para mover a personagem
function moverPersonagem(direcao) {
  console.log(`Posição inicial: (${posicaoX}, ${posicaoY})`);

  if (!jogoIniciado || tempoRestante <= 0 || pausado || emMovimento) {
    return;
  }

  if (emMovimento) {
    return;
  }

  emMovimento = true;
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

  console.log(`Nova posição: (${posicaoX}, ${posicaoY})`);

  // Lidar com o término da animação
  setTimeout(() => {
    emMovimento = false; // Marcar que o movimento terminou
  }, velocidadeMovimento);

  gerarQuadrados();
}



// Lidar com eventos de pressionamento de tecla para as setas do teclado
document.addEventListener("keydown", (event) => {
  // Verificar se a personagem está em movimento
  if (emMovimento) {
    return;
  }
  if (!jogoIniciado) {
    return; // Impedir movimento se o jogo não tiver sido iniciado
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

function gerarQuadrados(posX, posY) {
  // Remova todos os quadrados existentes
  const quadradosExistents = document.querySelectorAll('.square');
  quadradosExistents.forEach(quadrado => quadrado.remove());

  // Gere três quadrados aleatórios em locais aleatórios do tabuleiro
  const celulas = document.querySelectorAll('.celula');

  for (let i = 0; i < 3; i++) {
    const indiceCelula = Math.floor(Math.random() * celulas.length);
    const celula = celulas[indiceCelula];
    const celulaX = parseInt(celula.dataset.x);
    const celulaY = parseInt(celula.dataset.y);

    // Verifique se a célula é a posição da personagem ou já contém um quadrado
    if ((celulaX === posX && celulaY === posY) || celula.querySelector('.square')) {
      i--; // Se a célula escolhida já contém um quadrado ou é a posição da personagem, gere outra
      continue;
    }

    const quadrado = document.createElement('div');
    quadrado.classList.add('square');

    // Adicione uma função para gerar uma cor aleatória
    const corAleatoria = gerarCorAleatoria();
    quadrado.style.backgroundColor = corAleatoria;

    celula.appendChild(quadrado);
  }
}

function gerarCorAleatoria() {
  // Lista de cores permitidas
  const coresPermitidas = ['#FFFFFF', '#FFFF00', '#FF0000', '#0000FF', '#008000'];

  // Escolha aleatoriamente uma cor da lista de cores permitidas
  const indiceCor = Math.floor(Math.random() * coresPermitidas.length);

  return coresPermitidas[indiceCor];
}


function atualizarTemporizador() {
  tempoRestante--; // Reduz o tempo restante em 1 segundo
  const tempoElement = document.getElementById('tempo');
  const gameOverElement = document.getElementById('game-over');

  if (tempoRestante <= 0) {
    clearInterval(temporizador); // Para o temporizador quando o tempo acaba
    tempoElement.textContent = 'Game Over!'; // Exibe "Game Over"
    gameOverElement.style.display = 'block'; // Exibe o elemento "Game Over"
    
    // Esconda a personagem definindo a visibilidade como oculta
    personagem.style.visibility = 'hidden';
  } else {
    tempoElement.textContent = tempoRestante + ' seconds'; // Atualiza o elemento HTML com o tempo restante
  }
}

let temporizador = null; // Variável para controlar o temporizador, inicializada como null

// Função para iniciar o temporizador
function iniciarTemporizador() {
  // Verifique se já existe um temporizador em execução
  if (temporizador) {
    clearInterval(temporizador); // Pare o temporizador anterior
  }
  temporizador = setInterval(atualizarTemporizador, 1000); // Inicie um novo temporizador
}

// Função para iniciar o jogo
function iniciarJogo() {
  // Redefina as variáveis do jogo
  tempoRestante = 10; // Defina o tempo inicial novamente (ou o valor que desejar)
  posicaoX = 0; // Posição X inicial da personagem
  posicaoY = 0; // Posição Y inicial da personagem
  const startButton = document.getElementById('start');
  const pauseButton = document.getElementById('pause');

  // Oculte o "Game Over"
  const gameOverElement = document.getElementById('game-over');
  gameOverElement.style.display = 'none';

  // Reposicione a personagem para a posição inicial
  personagem.style.transform = 'translate(0, 0)'; // Mova de volta para a posição inicial
  personagem.style.visibility = 'visible'; // Tornar a personagem visível novamente
  startButton.style.display = 'none'; // Oculte o botão "Start"
  pauseButton.style.marginTop = '64px';

  document.querySelectorAll(".square").forEach((quadrado) => quadrado.remove());

  gerarQuadrados(posicaoX, posicaoY);

  // Atualize o temporizador
  const tempoElement = document.getElementById('tempo');
  tempoElement.textContent = tempoRestante + ' seconds';

  // Inicie o temporizador novamente
  iniciarTemporizador();

  pausado = false; // Certifique-se de que o jogo não esteja em pausa
}

function reiniciarJogo() {
  const pauseButton = document.getElementById('pause');
  // Redefina as variáveis do jogo e inicie o temporizador novamente
  iniciarJogo();
  pauseButton.textContent = 'Pause';
}

document.getElementById('restart').addEventListener('click', reiniciarJogo);


document.getElementById('start').addEventListener('click', () => {
  iniciarJogo();
  jogoIniciado = true; // Marque o jogo como iniciado
});

// Função para pausar/resumir o jogo
function pausarJogo() {
  const pauseButton = document.getElementById('pause');

  if (pausado) {
    // Retomar o jogo
    pausado = false;
    pauseButton.textContent = 'Pause'; // Atualize o texto do botão
    personagem.style.pointerEvents = 'auto'; // Ative a movimentação da personagem
    temporizador = setInterval(atualizarTemporizador, 1000); // Retome o temporizador
  } else {
    // Pausar o jogo
    pausado = true;
    pauseButton.textContent = 'Resume'; // Atualize o texto do botão
    personagem.style.pointerEvents = 'none'; // Desative a movimentação da personagem
    clearInterval(temporizador); // Pausar o temporizador
  }
}

// Event listener para o botão "Pause"
document.getElementById('pause').addEventListener('click', pausarJogo);

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
  const gameOver = document.getElementById('game-over');
  const personagem__mouth = document.querySelector('.personagem');

  //Cores da primeira skin
  const corSkinDoBodyPrimeira= '#2e2530';
  const corSkinDosBotoesPrimeira = '#b1949c';
  const corSkinDaPersonagemPrimeira = '#b1949c';
  const corSkinContainerPrimeira = '#2e2530';
  const corSkinInventarioPrimeira = '#b1949c';
  const corSkinCirculo1Primeira = '#b1949c';
  const corSkinCirculo2Primeira= '#b1949c';
  const corSkinTempoPrimeira = '#b1949c';
  const corBorderTopCirculoPrimeira = '#000000';
  const corSkinGameOverPrimeira = '#b1949c';
  const corSkinBocaPersonagemPrimeira = '#2e2530';

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
  const corSkinGameOverSegunda = '#fe6f27';
  const corSkinBocaPersonagemSegunda = '#2f2f2f';

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
  const corSkinGameOverTerceira = '#9fafce';
  const corSkinBocaPersonagemTerceira = '#10377a';
  

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
      gameover: corSkinGameOverPrimeira,
      boca: corSkinBocaPersonagemPrimeira,
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
      gameover: corSkinGameOverSegunda,
      boca: corSkinBocaPersonagemSegunda,
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
      gameover: corSkinGameOverTerceira,
      boca: corSkinBocaPersonagemTerceira,
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
  gameOver.style.color = coresSkins[estadoSkin].gameover;
  personagem.querySelector('.personagem__mouth').style.backgroundColor = coresSkins[estadoSkin].boca;
  inventario.querySelectorAll('td').forEach((td) => {
    td.style.backgroundColor = coresSkins[estadoSkin].inventario;
  });

  // Incrementar o estado da skin (circular entre 0, 1 e 2)
  estadoSkin = (estadoSkin + 1) % coresSkins.length;
}

// Event listener para o botão "Skin"

const botaoSkin = document.getElementById("skin");
botaoSkin.addEventListener("click", mudarSkin);








