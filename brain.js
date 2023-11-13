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
let tempoRestante = 100;

let score = 0;
let vidas = 10; // Ou qualquer valor inicial que você desejar

let jogoIniciado = false;
let pausado = false; // Variável para controlar o estado de pausa do jogo

let inventario = [
  { tecla: 1, acao: "Ação 1" },
  { tecla: 2, acao: "Ação 2" },
  { tecla: 3, acao: "Ação 3" }
];

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

  adicionarPontos(1);
  // Lidar com o término da animação
  setTimeout(() => {
    emMovimento = false; // Marcar que o movimento terminou
    gerarQuadrados();
    verificarColisao(); // Verificar colisão após o movimento
  }, velocidadeMovimento);
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

function verificarColisao() {
  const personagemBounds = personagem.getBoundingClientRect();
  const quadrados = document.querySelectorAll('.square');
  const estrelas = document.querySelectorAll('.four-pointed-star');

  quadrados.forEach(quadrado => {
    const quadradoBounds = quadrado.getBoundingClientRect();

    if (
      personagemBounds.left < quadradoBounds.right &&
      personagemBounds.right > quadradoBounds.left &&
      personagemBounds.top < quadradoBounds.bottom &&
      personagemBounds.bottom > quadradoBounds.top
    ) {
      const corQuadrado = quadrado.style.backgroundColor;

      switch (corQuadrado) {
        case 'rgb(255, 255, 255)':
          // Branco: Adiciona 1 ponto ao score
          adicionarPontos(1);
          break;
        case 'rgb(255, 255, 0)':
          // Amarelo: Move o quadrado para dentro do inventário
          moverParaInventario(quadrado);
          break;
        case 'rgb(0, 128, 0)':
          // Verde: Adiciona 5 pontos ao score
          adicionarPontos(5);
          break;
        case 'rgb(0, 0, 255)':
          // Azul: Tira 1 vida
          removerVida(1);
          break;
        case 'rgb(255, 0, 0)':
          // Vermelho: Tira 2 vidas
          removerVida(2);
          break;
      }

      quadrado.remove();
    }
  });

  estrelas.forEach(estrela => {
    const estrelaBounds = estrela.getBoundingClientRect();

    if (
      personagemBounds.left < estrelaBounds.right &&
      personagemBounds.right > estrelaBounds.left &&
      personagemBounds.top < estrelaBounds.bottom &&
      personagemBounds.bottom > estrelaBounds.top
    ) {
      // Colisão com a estrela: Mover a estrela para o inventário
      moverParaInventario(estrela);
      // Adicionar lógica específica da estrela, se necessário
      // Por exemplo, adicionar pontos extras ou realizar outra ação
      estrela.remove();
    }
  });
}


//cria a função para adicionar pontos mas não uses a que estava ai
function adicionarPontos(quantidade) {
  score += quantidade;

  // Atualizar a exibição de pontos na interface
  const pontuacaoElement = document.getElementById('pontuacao'); // Substitua 'pontuacao' pelo ID correto
  if (pontuacaoElement) {
    pontuacaoElement.textContent = `${score}`;
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

  // Verificar se o jogo acabou (quando não há mais vidas)
  if (vidas <= 0) {
    atualizarTemporizador(vidas);
  }

  console.log(`Removendo ${quantidade} vidas. Novo total de vidas: ${vidas}`);
}

function gerarEstrela() {
  const celulas = document.querySelectorAll('.celula');
  const indiceCelula = Math.floor(Math.random() * celulas.length);
  const celula = celulas[indiceCelula];

  const estrela = document.createElement('div');
  estrela.classList.add('four-pointed-star');

  celula.appendChild(estrela);
}

function gerarQuadrados(posX, posY) {
  // Remova todos os quadrados e estrelas existentes, exceto os do inventário
  const quadradosEstrelasExistents = document.querySelectorAll('.square, .four-pointed-star');
  quadradosEstrelasExistents.forEach(item => {
    const celulaPai = item.closest('.celula');
    if (celulaPai && celulaPai.classList.contains('inventario')) {
      return; // Ignora itens no inventário
    }
    item.remove();
  });

  // Gere três quadrados aleatórios em locais aleatórios do tabuleiro
  const celulas = document.querySelectorAll('.celula');

  for (let i = 0; i < 3; i++) {
    const indiceCelula = Math.floor(Math.random() * celulas.length);
    const celula = celulas[indiceCelula];
    const celulaX = parseInt(celula.dataset.x);
    const celulaY = parseInt(celula.dataset.y);

    // Verifique se a célula é a posição da personagem ou já contém um quadrado ou estrela
    if ((celulaX === posX && celulaY === posY) || celula.querySelector('.square') || celula.querySelector('.four-pointed-star') || celula.classList.contains('inventario')) {
      i--; // Se a célula escolhida já contém um quadrado, estrela, está no inventário ou é a posição da personagem, gere outra
      continue;
    }

    if (score > 0 && score % 7 === 0 && i === 0) {
      // Se for um múltiplo de 7, gere a estrela
      const estrela = document.createElement('div');
      estrela.classList.add('four-pointed-star');
      celula.appendChild(estrela);
    } else {
      // Caso contrário, gere um quadrado
      const quadrado = document.createElement('div');
      quadrado.classList.add('square');

      // Adicione uma função para gerar uma cor aleatória
      const corAleatoria = gerarCorAleatoria();
      quadrado.style.backgroundColor = corAleatoria;

      celula.appendChild(quadrado);
    }
  }
}

function gerarCorAleatoria() {
  // Lista de cores permitidas
  const coresPermitidas = ['#FFFFFF', '#FFFF00', '#FF0000', '#0000FF', '#008000'];

  // Escolha aleatoriamente uma cor da lista de cores permitidas
  const indiceCor = Math.floor(Math.random() * coresPermitidas.length);

  return coresPermitidas[indiceCor];
}


function atualizarTemporizador(vidas) {
  tempoRestante--; // Reduz o tempo restante em 1 segundo
  const tempoElement = document.getElementById('tempo');
  const gameOverElement = document.getElementById('game-over');

  if (tempoRestante <= 0 || vidas <= 0) {
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
  tempoRestante = 100; // Defina o tempo inicial novamente (ou o valor que desejar)
  posicaoX = 0; // Posição X inicial da personagem
  posicaoY = 0; // Posição Y inicial da personagem
  const startButton = document.getElementById('start');
  const pauseButton = document.getElementById('pause');

  // Oculte o "Game Over"
  const gameOverElement = document.getElementById('game-over');
  gameOverElement.style.display = 'none';

  vidas = 10; 
  // Atualize a exibição de vidas na interface
  const vidasElement = document.getElementById('vidas'); // Substitua 'vidas' pelo ID correto
  if (vidasElement) {
    vidasElement.textContent = `${vidas}`; 
  }
  score=0;

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


document.addEventListener("keydown", (event) => {
  // ... (seu código existente)

  switch (event.key) {
    case "1":
      executarAcaoInventario(1);
      break;
    case "2":
      executarAcaoInventario(2);
      break;
    case "3":
      executarAcaoInventario(3);
      break;
    // ... (seu código existente)
  }
});

function executarAcaoInventario(tecla) {
  const itemInventario = inventario.find(item => item.tecla === tecla);

  if (itemInventario) {
    console.log(`Executando ação do inventário: ${itemInventario.acao}`);
    // Adicione aqui a lógica específica para cada ação do inventário
  }
}

function moverParaInventario(item) {
  const inventarioCelula = document.querySelector('.inventario td:first-child');

  if (inventarioCelula) {
    const corItem = item.style.backgroundColor;
    const novoItem = document.createElement('div');
    
    // Verifica se é um quadrado ou uma estrela e adiciona a classe apropriada
    if (item.classList.contains('square')) {
      novoItem.classList.add('square');
    } else if (item.classList.contains('four-pointed-star')) {
      novoItem.classList.add('four-pointed-star');
    }

    novoItem.style.backgroundColor = corItem;

    inventarioCelula.appendChild(novoItem);
  }
}
