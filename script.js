// === VARIÁVEIS DO CARROSSEL ===
let slideAtual = 0;
let carrosselInterval;

// === FUNÇÃO PRINCIPAL DE TROCA DE TELAS ===
function verTela(idTela) {
  // Esconde todas as seções
  const secoes = document.querySelectorAll('.page-section');
  secoes.forEach(secao => {
    secao.classList.add('hidden');
  });

  // Exibe a tela desejada
  const telaAlvo = document.getElementById(idTela);
  if (telaAlvo) {
    telaAlvo.classList.remove('hidden');
  }

  // Controla o carrossel na Home
  if (idTela === 'tela-menu') {
    iniciarCarrosselAuto();
  } else {
    pararCarrosselAuto();
  }

  // Rola para o topo da página
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Compatibilidade para nomes antigos de funções
function mostrarTela(idTela) { verTela(idTela); }
function verMenu(e) { if (e) e.preventDefault(); verTela('tela-menu'); }
function verSantuario(e) { if (e) e.preventDefault(); verTela('tela-personagens'); }
function verPersonagens(e) { if (e) e.preventDefault(); verTela('tela-personagens'); }
function verLoja(e) { if (e) e.preventDefault(); verTela('tela-loja'); }

// === CONTROLE DO CARROSSEL ===
function mostrarSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  if (slides.length === 0) return;

  if (index >= slides.length) slideAtual = 0;
  else if (index < 0) slideAtual = slides.length - 1;
  else slideAtual = index;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === slideAtual);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === slideAtual);
  });
}

function mudarSlide(direcao) {
  mostrarSlide(slideAtual + direcao);
}

function irParaSlide(index) {
  mostrarSlide(index);
}

function iniciarCarrosselAuto() {
  pararCarrosselAuto();
  carrosselInterval = setInterval(() => {
    mudarSlide(1);
  }, 4000);
}

function pararCarrosselAuto() {
  if (carrosselInterval) {
    clearInterval(carrosselInterval);
  }
}

// === CARRINHO ===
function obterCarrinho() {
  try {
    return JSON.parse(localStorage.getItem('opylendas-carrinho') || '[]');
  } catch (erro) {
    return [];
  }
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('opylendas-carrinho', JSON.stringify(carrinho));
}

function adicionarProdutoAoCarrinho(produto) {
  const carrinho = obterCarrinho();
  const itemExistente = carrinho.find(item => item.nome === produto.nome && item.tamanho === produto.tamanho);

  if (itemExistente) {
    itemExistente.quantidade += produto.quantidade;
  } else {
    carrinho.push(produto);
  }

  salvarCarrinho(carrinho);
}

function formatarPreco(preco) {
  const valor = Number(preco);
  return preco !== null && Number.isFinite(valor) ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Preço sob consulta';
}

function renderizarCarrinho() {
  const conteudo = document.getElementById('conteudo-carrinho');
  if (!conteudo) return;

  const carrinho = obterCarrinho();
  if (carrinho.length === 0) {
    conteudo.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio no momento.</p><a href="loja.html" class="btn-yellow" style="text-decoration:none; display:inline-block;">Ir para a Loja</a>';
    return;
  }

  let total = 0;
  const itens = carrinho.map((item, indice) => {
    const subtotal = Number(item.preco) * item.quantidade;
    if (item.preco !== null && Number.isFinite(subtotal)) total += subtotal;
    const detalhes = item.tamanho ? `Tamanho: ${item.tamanho}` : '';
    return `<div class="item-carrinho"><img src="${item.img}" alt="${item.nome}"><div class="item-carrinho-info"><h2>${item.nome}</h2><p>${detalhes}</p><strong>${formatarPreco(item.preco)}</strong><div class="item-carrinho-acoes"><button type="button" onclick="alterarItemCarrinho(${indice}, -1)">-</button><span>${item.quantidade}</span><button type="button" onclick="alterarItemCarrinho(${indice}, 1)">+</button><button type="button" class="remover-item" onclick="removerItemCarrinho(${indice})">Remover</button></div></div></div>`;
  }).join('');

  conteudo.innerHTML = `<div class="lista-carrinho">${itens}</div><div class="resumo-carrinho"><strong>Total: ${total ? formatarPreco(total) : 'Preço sob consulta'}</strong><button type="button" class="btn-yellow" onclick="finalizarCompra()">Finalizar compra</button></div>`;
}

function alterarItemCarrinho(indice, variacao) {
  const carrinho = obterCarrinho();
  if (!carrinho[indice]) return;
  carrinho[indice].quantidade += variacao;
  if (carrinho[indice].quantidade <= 0) carrinho.splice(indice, 1);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function removerItemCarrinho(indice) {
  const carrinho = obterCarrinho();
  carrinho.splice(indice, 1);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function finalizarCompra() {
  alert('Compra pronta para finalizar!');
}

// === DETALHES DO PRODUTO E CARRINHO ===
function verDetalhes(nome, preco, img) {
  document.getElementById('detalhe-nome').textContent = nome;
  document.getElementById('detalhe-preco').textContent = preco;
  verTela('tela-detalhes');
}

function adicionarAoCarrinho() {
  const conteudo = document.getElementById('conteudo-carrinho');
  const nome = document.getElementById('detalhe-nome').textContent;
  const preco = document.getElementById('detalhe-preco').textContent;
  
  if (conteudo) {
    conteudo.innerHTML = `<p><strong>Item Adicionado:</strong> ${nome} - ${preco}</p>`;
  }
  verTela('tela-carrinho');
}

// === GAMIFICAÇÃO / EASTER EGGS ===
let konamiAtivado = false;

function ativarSaci() {
  const conquista = document.getElementById('misterio-conquista');
  if (!conquista) return;

  const jaAberto = !conquista.classList.contains('hidden');
  if (jaAberto) {
    conquista.classList.add('hidden');
    return;
  }

  conquista.classList.remove('hidden');

  const imagem = document.getElementById('misterio-mapinguari');
  const cupom = document.getElementById('misterio-cupom');

  revelarConquistaKonami(konamiAtivado);
}

document.addEventListener('click', (event) => {
  const popup = document.getElementById('misterio-conquista');
  if (!popup || popup.classList.contains('hidden')) return;

  if (event.target === popup) {
    popup.classList.add('hidden');
  }
});

let itensCucaColetados = 0;
function coletarItemCuca(nomeItem) {
  itensCucaColetados++;
  const status = document.getElementById('cuca-status');
  if (status) {
    if (itensCucaColetados >= 3) {
      status.innerHTML = "✨ <strong>Feitiço Completo!</strong> Use o cupom <strong>CUCA20</strong> na loja!";
    } else {
      status.textContent = `Itens coletados: ${itensCucaColetados} / 3 (${nomeItem})`;
    }
  }
}

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

function getKonamiImagePath(filename) {
  const emTelas = window.location.pathname.includes('/telas/');
  return emTelas ? `../assets/Chibis/${filename}` : `assets/Chibis/${filename}`;
}

function revelarConquistaKonami(ativado = true) {
  const container = document.getElementById('misterio-conquista');
  const imagem = document.getElementById('misterio-mapinguari');
  const cupom = document.getElementById('misterio-cupom');
  if (!container || !imagem) return;

  konamiAtivado = ativado;
  const arquivo = ativado ? 'Mapinguari 2 Konami Code.png' : 'MapinguariKonami Code.png';
  imagem.src = getKonamiImagePath(arquivo);
  imagem.alt = ativado ? 'Mapinguari 2 Konami' : 'Mapinguari Konami';

  if (cupom) {
    cupom.textContent = 'Cupom: MAPINGUARI15';
    cupom.classList.toggle('hidden', !ativado);
    cupom.classList.toggle('ativo', ativado);
  }
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const requiredKey = konamiCode[konamiPosition];

  if (key.toLowerCase() === requiredKey.toLowerCase()) {
    konamiPosition++;
    if (konamiPosition === konamiCode.length) {
      ativarCodigoKonami();
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
});

function ativarCodigoKonami() {
  document.body.classList.add('modo-noturno');
  revelarConquistaKonami(true);
  alert("🎮 Código Konami ativado! Você ganhou o cupom MAPINGUARI15 para usar na loja.");
}

function abrirSaciCuriosidades() {
  const popup = document.getElementById('saci-conquista');
  const saci = document.querySelector('.saci-segredo');
  if (saci) saci.classList.add('saci-segredo-parado', 'saci-segredo-oculto');
  if (popup) popup.classList.remove('hidden');
}

function fecharSaciCuriosidades(event) {
  const popup = document.getElementById('saci-conquista');
  if (!popup) return;
  if (!event || event.target === popup) popup.classList.add('hidden');
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

function aplicarCupom() {
  const input = document.getElementById('cupom-input');
  const status = document.getElementById('cupom-status');
  const valorAtual = document.getElementById('prod-preco');
  const valorOriginal = document.getElementById('prod-antigo');

  if (!input || !status || !valorAtual || !valorOriginal) return;

  const codigo = (input.value || '').trim().toUpperCase();
  const nomeProduto = document.getElementById('prod-nome')?.textContent || '';
  const produtoSaci = /saci/i.test(nomeProduto) || nomeProduto === 'Combo Box de Café';
  const valido = codigo === 'MAPINGUARI15' || (codigo === 'TOUCADOSACI' && produtoSaci);

  if (!valido) {
    status.textContent = codigo === 'TOUCADOSACI'
      ? 'Este cupom é válido apenas para produtos do Saci.'
      : 'Cupom inválido. Tente novamente.';
    status.style.color = '#f6b7b7';
    return;
  }

  const precoAtual = Number.parseFloat((valorAtual.textContent || '0').replace('R$', '').replace('.', '').replace(',', '.').trim());
  const valorComDesconto = precoAtual * (codigo === 'TOUCADOSACI' ? 0.9 : 0.85);

  valorAtual.textContent = formatarMoeda(valorComDesconto);
  valorOriginal.textContent = formatarMoeda(precoAtual);
  status.textContent = `Cupom aplicado com sucesso! ${codigo === 'TOUCADOSACI' ? '10' : '15'}% de desconto.`;
  status.style.color = '#9be8ba';
  input.value = codigo;
  sessionStorage.setItem('opylendas-cupom', codigo);
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  verTela('tela-menu');
  renderizarCarrinho();
  iniciarColetaSecreta();
});

function caminhoAssetChibi(nome) {
  return window.location.pathname.includes('/telas/') ? `../assets/Chibis/${nome}` : `assets/Chibis/${nome}`;
}

function iniciarColetaSecreta() {
  const pagina = window.location.pathname.toLowerCase();
  const itemPorPagina = pagina.endsWith('/index.html') || pagina.endsWith('/')
    ? '1'
    : pagina.includes('santuario')
      ? '2'
      : pagina.includes('diario')
        ? '3'
        : null;
  if (!itemPorPagina) return;

  const itensEncontrados = new Set(JSON.parse(localStorage.getItem('opylendas-itens-festa') || '[]'));
  if (itensEncontrados.has(itemPorPagina)) return;

  const hotspot = document.createElement('button');
  hotspot.type = 'button';
  hotspot.className = `item-secreto item-secreto-${itemPorPagina}`;
  hotspot.dataset.item = itemPorPagina;
  hotspot.setAttribute('aria-label', `Encontrar item secreto ${itemPorPagina}`);
  hotspot.innerHTML = `<img src="${caminhoAssetChibi(`pop up_item${itemPorPagina}.png`)}" alt="">`;
  document.body.append(hotspot);

  hotspot.addEventListener('click', () => {
    itensEncontrados.add(itemPorPagina);
    localStorage.setItem('opylendas-itens-festa', JSON.stringify([...itensEncontrados]));
    hotspot.remove();

    const aviso = document.createElement('div');
    aviso.className = 'item-secreto-aviso';
    aviso.innerHTML = `<strong>Item secreto encontrado!</strong><span>${itensEncontrados.size} de 3 itens da festa</span>`;
    document.body.append(aviso);
    window.setTimeout(() => aviso.remove(), 3500);
  });
}
function verDetalhes(nome, preco, img, descricao) {
  const url = `telas/detalhes.html?nome=${encodeURIComponent(nome)}&preco=${encodeURIComponent(preco)}&img=${encodeURIComponent(img)}&desc=${encodeURIComponent(descricao || '')}`;
  
  // Ajusta o caminho caso o clique ocorra de dentro da própria pasta telas
  if (window.location.pathname.includes('/telas/')) {
    window.location.href = `detalhes.html?nome=${encodeURIComponent(nome)}&preco=${encodeURIComponent(preco)}&img=${encodeURIComponent(img)}&desc=${encodeURIComponent(descricao || '')}`;
  } else {
    window.location.href = url;
  }
}