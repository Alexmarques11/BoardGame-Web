// Obtenha referências aos elementos HTML que você precisa
const personagem = document.getElementById("personagem");
const tabuleiro = document.getElementById("tabuleiro");

// Defina as dimensões do tabuleiro e a posição inicial da personagem
const larguraQuadrado = 122; // Largura de cada quadrado do tabuleiro
const alturaQuadrado = 122; // Altura de cada quadrado do tabuleiro
const linhas = 3; // Número de linhas no tabuleiro
const colunas = 3; // Número de colunas no tabuleiro

// Posição inicial da personagem
let posicaoX = 0;
let posicaoY = 0;

let emMovimento = false;

//Tempo Inicial do jogo
let tempoRestante = 60;

let score = 0;
let vidas = 10; // Ou qualquer valor inicial que você desejar

let jogoIniciado = false;
let pausado = false; // Variável para controlar o estado de pausa do jogo

let inventario = [
  { tecla: 1, acao: "Ação 1" },
  { tecla: 2, acao: "Ação 2" },
  { tecla: 3, acao: "Ação 3" }
];

let bestScore = 0;
const BEST_SCORE_KEY = 'bestScore';

// Função para mover a personagem
function moverPersonagem(direcao) {
  console.log(`Posição inicial: (${posicaoX}, ${posicaoY})`);

  if (!jogoIniciado || tempoRestante <= 0 || pausado || emMovimento || vidas <= 0) {
    return;
  }

  let animationClass = '';
  let novoX = posicaoX;
  let novoY = posicaoY;

  // Calcular a nova posição com base na direção
  switch (direcao) {
    case "cima":
        animationClass = 'move-up';
        novoX--;
      break;
    case "baixo":
          animationClass = 'move-down';
          novoX++;
      break;
    case "esquerda":
          animationClass = 'move-left';
          novoY--;
      break;
    case "direita":
        animationClass = 'move-right';
        novoY++;
      break;
    default:
      return; // Direção inválida
  }

  if (novoX < 0 || novoX > 2 || novoY < 0 || novoY > 2) return;
  emMovimento = true;

  // Atualizar a posição atual da personagem
  posicaoX = novoX;
  posicaoY = novoY;
  console.log(`Nova posição: (${posicaoX}, ${posicaoY})`);

  adicionarPontos(1);

  personagem.classList.add(animationClass);
  personagem.addEventListener('animationend', () => {
    emMovimento = false;
    
    const newCell = document.getElementById(`celula-${posicaoX}-${posicaoY}`);
    if (newCell) newCell.appendChild(personagem);
    
    personagem.classList.remove(animationClass);

    // Verifique se a personagem está na mesma célula que um quadrado ou estrela
    const celulaAtual = document.getElementById(`celula-${posicaoX}-${posicaoY}`);

    detectarColisoes(posicaoX, posicaoY);
      // Gere novos quadrados aleatórios
      gerarQuadrados(posicaoX, posicaoY);
 
  }, {once: true});

}
document.addEventListener("keyup", (event) => {

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

function detectarColisoes(posX, posY) {
  const celulaAtual = document.getElementById(`celula-${posX}-${posY}`);
  if (!celulaAtual) {
    // A célula não existe
    return;
  }

  const quadrado = celulaAtual.querySelector('.square');
  const estrela = celulaAtual.querySelector('.four-pointed-star');

  if (quadrado) { 
    const corQuadrado = quadrado.style.backgroundColor;
    // Adicione pontos com base na cor do quadrado
    console.log(`Colisão com quadrado ${corQuadrado}`);
    adicionarPontos(pontosPorCor(corQuadrado));
    // Remove o quadrado da célula
  } else if (estrela) {
    // Mova a estrela para o inventário
    moverParaInventario(estrela);
    // Remova a estrela da célula
    estrela.remove();
  } else {
    // A personagem não colidiu com nada especial
  }
}

function pontosPorCor(cor) {
  console.log(`Pontos para a cor ${cor}`);
  switch (cor) {
    case 'rgb(255, 255, 255)': // Cor branca
      adicionarPontos(1);
      return 0;
    case 'rgb(255, 255, 0)': // Cor amarela
      adicionarPontos(2);
      return 0;
    case 'rgb(0, 128, 0)': // Cor verde
      adicionarPontos(3);
      return 0;
    case 'rgb(255, 0, 0)': // Cor vermelha
      removerVida(2);
      return 0;
    case 'rgb(0, 0, 255)': // Cor azul
      removerVida(1);
      return 0;
    default:
      return 0; // Retorna 0 pontos para cores desconhecidas
  }
}

function adicionarPontos(quantidade) {
  score += quantidade;

  // Atualizar a exibição de pontos na interface
  const pontuacaoElement = document.getElementById('pontuacao');
  if (pontuacaoElement) {
    pontuacaoElement.textContent = `${score}`;
  }

  // Atualizar o best score se o score atual for maior
  if (score > bestScore) {
    bestScore = score;
    salvarBestScore();
    atualizarBestScoreNaInterface();
  }
  console.log(`Adicionando ${quantidade} pontos. Nova pontuação: ${score}`);
}


// Função para remover vidas
function removerVida(quantidade) {
  vidas -= quantidade;

  // Atualizar a exibição de vidas na interface
  const vidasElement = document.getElementById('vidas'); // Substitua 'vidas' pelo ID correto
  if (vidasElement) {
    vidasElement.textContent = `${vidas}`;
  }

  // Verificar se o jogo acabou
  if (vidas <= 0) {
    atualizarTemporizador(vidas);
  }

  console.log(`Removendo ${quantidade} vidas. Novo total de vidas: ${vidas}`);
}

function gerarEstrela() {
  const celulas = document.querySelectorAll('.celula:not(.inventario)');
  const indiceCelula = Math.floor(Math.random() * celulas.length);
  const celula = celulas[indiceCelula];

  const estrela = document.createElement('div');
  estrela.classList.add('four-pointed-star');

  celula.appendChild(estrela);
}

function gerarQuadrados(posX, posY) {
  // Remover todos os quadrados e estrelas existentes, exceto os do inventário
  const quadradosEstrelasExistents = document.querySelectorAll('.square, .four-pointed-star');
  quadradosEstrelasExistents.forEach(item => {
    const celulaPai = item.closest('.celula');
    if (celulaPai && celulaPai.classList.contains('inventario')) {
      return; 
    }
    item.remove();
  });

  const celulas = document.querySelectorAll('.celula');

  celulas.forEach(celula => {
    const celulaX = parseInt(celula.dataset.x);
    const celulaY = parseInt(celula.dataset.y);

    // Verifique se a célula é a posição da personagem
    if (celulaX === posX && celulaY === posY) {
      // Remova o quadrado existente na célula da personagem
      const quadradoExistente = celula.querySelector('.square');
      if (quadradoExistente) {
        quadradoExistente.remove();
      }

      // Gere um novo quadrado
      const quadrado = document.createElement('div');
      quadrado.classList.add('square');

      const corAleatoria = gerarCorAleatoria();
      quadrado.style.backgroundColor = corAleatoria;

      celula.appendChild(quadrado);
    } else {
      const quadrado = document.createElement('div');
      quadrado.classList.add('square');

      // Adicione uma função para gerar uma cor aleatória
      const corAleatoria = gerarCorAleatoria();
      quadrado.style.backgroundColor = corAleatoria;

      celula.appendChild(quadrado);
    }
  });

  // Substitua aleatoriamente um quadrado por uma estrela
  const indiceCelulaEstrela = Math.floor(Math.random() * celulas.length);
  const celulaEstrela = celulas[indiceCelulaEstrela];

  // Remova o quadrado existente na célula onde a estrela será gerada
  const quadradoExistente = celulaEstrela.querySelector('.square');
  if (quadradoExistente) {
    quadradoExistente.remove();
  }

  // Gerar a estrela na célula
  const estrela = document.createElement('div');
  estrela.classList.add('four-pointed-star');
  celulaEstrela.appendChild(estrela);
}


function gerarCorAleatoria() {
  // Lista de cores permitidas
  const coresPermitidas = ['#FFFFFF', '#FFFF00', '#FF0000', '#0000FF', '#008000'];

  const indiceCor = Math.floor(Math.random() * coresPermitidas.length);

  return coresPermitidas[indiceCor];
}


function atualizarTemporizador(vidas) {
  tempoRestante--; 
  const tempoElement = document.getElementById('tempo');
  const gameOverElement = document.getElementById('game-over');

  if (tempoRestante <= 0 || vidas <= 0) {
    clearInterval(temporizador); // Para o temporizador quando o tempo acaba
    tempoElement.textContent = 'Game Over!'; // Exibe "Game Over"
    gameOverElement.style.display = 'block'; // Exibe o elemento "Game Over"
    
    personagem.style.visibility = 'hidden';
  } else {
    tempoElement.textContent = tempoRestante + ' seconds'; // Atualiza o elemento HTML com o tempo restante
  }
}

let temporizador = null; // Variável para controlar o temporizador, inicializada como null

// Função para iniciar o temporizador
function iniciarTemporizador() {
  if (temporizador) {
    clearInterval(temporizador); // Parar o temporizador anterior
  }
  temporizador = setInterval(atualizarTemporizador, 1000); // Inicie um novo temporizador
}

function iniciarJogo() {
  // Redefenir as variáveis do jogo
  tempoRestante = 60; 
  posicaoX = 0; // Posição X inicial da personagem
  posicaoY = 0; // Posição Y inicial da personagem
  const startButton = document.getElementById('start');
  const pauseButton = document.getElementById('pause');
  const celulaInicial = document.getElementById("celula-0-0");

  // Ocultar o "Game Over"
  const gameOverElement = document.getElementById('game-over');
  gameOverElement.style.display = 'none';

  vidas = 10; 
  score = 0; // Reiniciar o score

  // Atualize a exibição de vidas na interface
  const vidasElement = document.getElementById('vidas');
  if (vidasElement) {
    vidasElement.textContent = `${vidas}`;
  }

  // Reposicione a personagem para a posição inicial
  personagem.style.transition = 'none';
  personagem.style.transform = 'translate(0, 0)'; 
  personagem.style.visibility = 'visible'; 
  startButton.style.display = 'none'; 
  pauseButton.style.marginTop = '64px';

  document.querySelectorAll(".square").forEach((quadrado) => quadrado.remove());

  // Atualizar o temporizador
  const tempoElement = document.getElementById('tempo');
  tempoElement.textContent = tempoRestante + ' seconds';


  iniciarTemporizador();

  pausado = false; 

  // Gere quadrados após reiniciar o jogo
  gerarQuadrados(posicaoX, posicaoY);
}

function reiniciarJogo() {
  const pauseButton = document.getElementById('pause');

  // Redefina as variáveis do jogo e inicie o temporizador novamente
  tempoRestante = 100;
  vidas = 10;
  posicaoX = 0;
  posicaoY = 0;
  score = 0;

  const gameOverElement = document.getElementById('game-over');
  gameOverElement.style.display = 'none';

  // Reposicione a personagem para a posição inicial
  personagem.style.transition = 'none'; // Remova temporariamente a transição
  personagem.style.transform = 'translate(0, 0)';
  personagem.style.visibility = 'visible';
  pauseButton.textContent = 'Pause';

  carregarBestScore();

  // Limpar o inventário
  document.querySelectorAll('.inventario .square, .inventario .four-pointed-star').forEach(item => item.remove());

  // Remover todos os quadrados e estrelas existentes, exceto os do inventário
  const quadradosEstrelasExistents = document.querySelectorAll('.square, .four-pointed-star');
  quadradosEstrelasExistents.forEach(item => {
    const celulaPai = item.closest('.celula');
    if (celulaPai && celulaPai.classList.contains('inventario')) {
      return; // Ignora itens no inventário
    }
    item.remove();
  });

  // Aguardar um curto período e, em seguida, reative a transição
  setTimeout(() => {
    personagem.style.transition = 'transform 0.5s ease';
    gerarQuadrados(posicaoX, posicaoY); // Gere quadrados após reiniciar o jogo
  }, 10);

  // Atualizar a exibição de vidas na interface
  const vidasElement = document.getElementById('vidas');
  if (vidasElement) {
    vidasElement.textContent = `${vidas}`;
  }

  // Atualizar a exibição de pontos na interface
  const pontuacaoElement = document.getElementById('pontuacao');
  if (pontuacaoElement) {
    pontuacaoElement.textContent = `${score}`;
  }

  // Atualizar o temporizador
  const tempoElement = document.getElementById('tempo');
  tempoElement.textContent = tempoRestante + ' seconds';


  posicaoX = 0;
  posicaoY = 0;

  // Inicie o temporizador novamente
  iniciarTemporizador();

  pausado = false; 
  jogoIniciado = true; // Marcar o jogo como iniciado
}

document.getElementById('restart').addEventListener('click', () => {
  console.log('Botão "Restart" clicado');
  iniciarJogo();
});


document.getElementById('start').addEventListener('click', () => {
  iniciarJogo();
  jogoIniciado = true; // Marcar o jogo como iniciado
});

// Função para pausar/resumir o jogo
function pausarJogo() {
  const pauseButton = document.getElementById('pause');

  if (pausado) {
    // Retomar o jogo
    pausado = false;
    pauseButton.textContent = 'Pause'; // Atualizar o texto do botão pause
    personagem.style.pointerEvents = 'auto'; // Ativar a movimentação da personagem
    temporizador = setInterval(atualizarTemporizador, 1000); // Retomar o temporizador
  } else {
    // Pausar o jogo
    pausado = true;
    pauseButton.textContent = 'Resume'; // Atualize o texto do botão
    personagem.style.pointerEvents = 'none'; // Desativar a movimentação da personagem
    clearInterval(temporizador); // Pausar o temporizador
  }
}

// Event listener para o botão "Pause"
document.getElementById('pause').addEventListener('click', pausarJogo);

function salvarBestScore() {
  localStorage.setItem(BEST_SCORE_KEY, bestScore);
}

function carregarBestScore() {
  const savedBestScore = localStorage.getItem(BEST_SCORE_KEY);
  if (savedBestScore !== null) {
    bestScore = parseInt(savedBestScore, 10);
    atualizarBestScoreNaInterface();
  }
}

function atualizarBestScoreNaInterface() {
  const bestScoreElement = document.getElementById('bestscore');
  if (bestScoreElement) {
    bestScoreElement.textContent = `${bestScore}`;
  }
}
// Variável para controlar o estado da skin
let skinAlterada = false;

// Variável para controlar o estado da skin
let estadoSkin = 0; // 0 para a primeira skin, 1 para a segunda, 2 para a terceira

function mudarSkin() {

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

function moverParaInventario(estrela) {

  const estrelaClonada = estrela.cloneNode(true);

  // Adicionar a estrela ao inventário
  const inventarioCelula = document.querySelector('.inventario');
  inventarioCelula.appendChild(estrelaClonada);

  console.log('Estrela movida para o inventário');
}
