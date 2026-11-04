// === VARIÁVEIS DO CARROSSEL ===
let slideAtual = 0;
let carrosselInterval;

const imagensAlternativasPorProduto = {
  'albumdecartascolecionaveisopylendas.png': 'Álbum de Cartas Colecionáves Opylendas_posicaonova.png',
  'brinconaia.png': 'brinconaiaoutraposi.png',
  'camisetacremeopylendas1.png': 'Camiseta Creme Opylendas_posicaonova.png',
  'camisetaverde.png': 'Camiseta Verde Opylendas_posicaonova.png',
  'canecaceramicasaira7cores.png': 'Caneca Cerâmica Saíra-7-cores.png',
  'chapeucuca.png': 'chapeucuca.png',
  'chaveirojaciel.png': 'costaschaveirojaciel.png',
  'chaveironaia.png': 'costaschaveironaia.png',
  'colecaodelivrosopylendas.png': 'Coleção Livro Opylendas_posicaonova.png',
  'diariodacuca.png': 'Diario da Cuca_posicaonova.png',
  'luminariaopylendas.png': 'Luminaria opylendas_posicaonova.png',
  'copotermicocomalcaecanudosaci.png': 'Copo termico com alça e canudo Saci_posicaonova.png',
  'jogodecafeopylendas.png': 'Jogo de Cafe opylendas_posicaonova.png',
  'colherceramicasaira7cores.png': 'Colher Ceramica Saíra-7-cores_posicaonova.png',
  'colarnaia.png': 'Colar Naia_posicaonova.png',
  'brochenaia.png': 'Broche Naia_posicaonova.png',
  'presilhanaia.png': 'Presilha Naia_posicaonova.png'
};

function normalizarNomeImagem(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/_posicaonova$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function obterImagemAlternativa(caminhoImagem) {
  const nomeImagem = decodeURIComponent(caminhoImagem.split('/').pop() || '');
  const nomeNormalizado = normalizarNomeImagem(nomeImagem);
  const nomeAlternativo = imagensAlternativasPorProduto[`${nomeNormalizado}.png`]
    || nomeImagem.replace(/\.[^.]+$/, '_posicaonova$&');
  return caminhoImagem.replace('/produtos/', '/produtos_posicaonova/')
    .replace(nomeImagem, nomeAlternativo);
}

const translations = {
  'pt-BR': {
    'nav.home': 'Início', 'nav.sanctuary': 'Santuário', 'nav.diary': 'OpyDiário', 'nav.store': 'Loja',
    'hero.title': 'Conheça nossos produtos!', 'hero.description': 'O vestuário e colecionáveis que trazem os mitos e lendas do folclore brasileiro direto para o seu estilo.', 'hero.cta': 'Loja',
    'cards.characters': 'Conheça os personagens', 'cards.explore': 'Conhecer', 'cards.opy': 'Conheça o Opy', 'cards.about': 'Sobre', 'cards.secrets': 'Desvende os Segredos', 'cards.curiosities': 'Curiosidades',
    'footer.description': 'Explorando os mitos e lendas do folclore brasileiro através de experiências únicas.', 'footer.explore': 'Explore', 'footer.about': 'Sobre nós', 'footer.support': 'Atendimento', 'footer.contact': 'Fale conosco', 'footer.returns': 'Trocas e devoluções', 'footer.faq': 'Perguntas frequentes', 'footer.services': 'Serviços', 'footer.track': 'Rastrear pedidos', 'footer.size': 'Guia de medidas', 'footer.cart': 'Carrinho', 'footer.newsletter': 'Fique por dentro das lendas', 'footer.email': 'Campo de e-mail', 'footer.copyright': '© Opylendas. Todos os direitos reservados.', 'search.placeholder': 'Buscar no site...'
  },
  es: {
    'nav.home': 'Inicio', 'nav.sanctuary': 'Santuario', 'nav.diary': 'OpyDiario', 'nav.store': 'Tienda',
    'hero.title': '¡Conoce nuestros productos!', 'hero.description': 'Ropa y coleccionables que llevan los mitos y leyendas del folclore brasileño a tu estilo.', 'hero.cta': 'Tienda',
    'cards.characters': 'Conoce a los personajes', 'cards.explore': 'Conocer', 'cards.opy': 'Conoce a Opy', 'cards.about': 'Sobre nosotros', 'cards.secrets': 'Descubre los secretos', 'cards.curiosities': 'Curiosidades',
    'footer.description': 'Explorando los mitos y leyendas del folclore brasileño a través de experiencias únicas.', 'footer.explore': 'Explora', 'footer.about': 'Sobre nosotros', 'footer.support': 'Atención', 'footer.contact': 'Contáctanos', 'footer.returns': 'Cambios y devoluciones', 'footer.faq': 'Preguntas frecuentes', 'footer.services': 'Servicios', 'footer.track': 'Rastrea tu pedido', 'footer.size': 'Guía de tallas', 'footer.cart': 'Carrito', 'footer.newsletter': 'Conoce las leyendas', 'footer.email': 'Correo electrónico', 'footer.copyright': '© Opylendas. Todos los derechos reservados.', 'search.placeholder': 'Buscar en el sitio...'
  },
  en: {
    'nav.home': 'Home', 'nav.sanctuary': 'Sanctuary', 'nav.diary': 'OpyDiary', 'nav.store': 'Store',
    'hero.title': 'Discover our products!', 'hero.description': 'Clothing and collectibles that bring Brazilian folklore myths and legends to your style.', 'hero.cta': 'Store',
    'cards.characters': 'Meet the characters', 'cards.explore': 'Explore', 'cards.opy': 'Meet Opy', 'cards.about': 'About', 'cards.secrets': 'Uncover the secrets', 'cards.curiosities': 'Curiosities',
    'footer.description': 'Exploring Brazilian folklore myths and legends through unique experiences.', 'footer.explore': 'Explore', 'footer.about': 'About us', 'footer.support': 'Support', 'footer.contact': 'Contact us', 'footer.returns': 'Returns and exchanges', 'footer.faq': 'FAQ', 'footer.services': 'Services', 'footer.track': 'Track your order', 'footer.size': 'Size guide', 'footer.cart': 'Cart', 'footer.newsletter': 'Stay inside the legends', 'footer.email': 'Email address', 'footer.copyright': '© Opylendas. All rights reserved.', 'search.placeholder': 'Search the site...'
  }
};

function applyLanguage(language) {
  const dictionary = translations[language] || translations['pt-BR'];
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const text = dictionary[element.dataset.i18n];
    if (text) element.textContent = text;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const text = dictionary[element.dataset.i18nPlaceholder];
    if (text) element.placeholder = text;
  });
  localStorage.setItem('opylendas-language', language);
}

const languageSelect = document.getElementById('language-select');
if (languageSelect) {
  const savedLanguage = localStorage.getItem('opylendas-language') || 'pt-BR';
  languageSelect.value = savedLanguage;
  applyLanguage(savedLanguage);
  languageSelect.addEventListener('change', event => applyLanguage(event.target.value));
}

const searchToggle = document.getElementById('site-search-toggle');
const searchForm = document.getElementById('site-search-form');
if (searchToggle && searchForm) {
  const closeSearch = () => {
    searchForm.hidden = true;
    searchToggle.setAttribute('aria-expanded', 'false');
    const results = document.getElementById('site-search-results');
    if (results) results.hidden = true;
  };

  searchToggle.addEventListener('click', () => {
    const isOpen = !searchForm.hidden;
    if (isOpen) {
      closeSearch();
      return;
    }

    searchForm.hidden = false;
    searchToggle.setAttribute('aria-expanded', 'true');
    document.getElementById('site-search-input').focus();
  });

  document.addEventListener('click', event => {
    const results = document.getElementById('site-search-results');
    const target = event.target;
    if (
      !searchForm.hidden &&
      !searchForm.contains(target) &&
      !searchToggle.contains(target)
    ) {
      closeSearch();
    }
  });

  searchForm.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSearch();
  });

  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('site-search-input');
    const query = input.value.trim().toLocaleLowerCase('pt-BR');
    if (!query) {
      input.focus();
      return;
    }

    const pages = [
      ['Início', 'index.html', 'produtos, personagens, segredos'],
      ['Santuário', 'telas/santuario.html', 'lendas, guardiões, Saci, Mapinguari e Cuca'],
      ['OpyDiário', 'telas/diario.html', 'bastidores, fanarts, cosplays e eventos'],
      ['Loja', 'telas/loja.html', 'produtos, roupas e colecionáveis'],
      ['Personagens', 'telas/personagens.html', 'Jaciel, Naiá, Saíra, Saci, Cuca e Mapinguari'],
      ['Curiosidades', 'telas/curiosidades.html', 'universo e segredos OpyLendas'],
      ['Dia do Saci', 'telas/dia-do-saci.html', 'festa, presentes e desafios do Saci']
    ];
    const matches = pages.filter(([, , description]) => description.toLocaleLowerCase('pt-BR').includes(query))
      .concat(pages.filter(([title]) => title.toLocaleLowerCase('pt-BR').includes(query)));
    const uniqueMatches = matches.filter((page, index, list) => list.findIndex(item => item[1] === page[1]) === index);
    let results = document.getElementById('site-search-results');
    if (!results) {
      results = document.createElement('div');
      results.id = 'site-search-results';
      results.className = 'site-search-results';
      searchForm.insertAdjacentElement('afterend', results);
    }
    const pathPrefix = window.location.pathname.includes('/telas/') ? '../' : '';
    results.innerHTML = uniqueMatches.length
      ? `<strong>Resultados para “${query}”</strong>${uniqueMatches.map(([title, href, description]) => `<a href="${pathPrefix}${href}"><span>${title}</span><small>${description}</small></a>`).join('')}`
      : `<strong>Nenhum resultado encontrado</strong><small>Tente buscar por Saci, loja, lendas ou personagens.</small>`;
    results.hidden = false;
  });
}

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    const feedback = document.getElementById('newsletter-feedback');
    if (feedback) feedback.textContent = 'E-mail cadastrado com sucesso!';
    newsletterForm.reset();
  });
}

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

const formContato = document.getElementById('form-contato');
if (formContato) {
  formContato.addEventListener('submit', event => {
    event.preventDefault();
    const feedback = document.getElementById('contato-feedback');
    if (!feedback) return;

    feedback.textContent = 'Mensagem preparada com sucesso! Em breve entraremos em contato.';
    feedback.classList.add('form-feedback-sucesso');
    formContato.reset();
  });
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