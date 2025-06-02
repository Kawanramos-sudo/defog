
document.querySelectorAll('.processo-cabecalho').forEach(cabecalho => {
    cabecalho.addEventListener('click', () => {
        const item = cabecalho.closest('.processo-item');
        item.classList.toggle('ativo');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');  
    const header = document.querySelector('header');
    
hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    nav.classList.toggle('expanded');
    header.classList.toggle('menu-expanded');

    if (nav.classList.contains('expanded')) {
        document.querySelectorAll('nav a').forEach(link => {
            link.style.animation = 'none';
            link.offsetHeight; // força reflow
            link.style.animation = '';
        });
    }
});

 })

document.addEventListener('DOMContentLoaded', function() {
    const carrossel      = document.querySelector('.carrossel');
    const setaEsquerda   = document.querySelector('.carrossel-seta-esquerda');
    const setaDireita    = document.querySelector('.carrossel-seta-direita');
    const containerIndic = document.querySelector('.carrossel-indicadores');
    const projetos       = document.querySelectorAll('.projeto');

    // Função que retorna quantos itens por "página" com base na largura
    function getItemsPerPage() {
        return (window.innerWidth <= 768) ? 1 : 4;
    }

    // Calcula quantas páginas existem (ceil de total de projetos dividido por itensPorPágina)
    function getTotalPages(itemsPerPage) {
        return Math.ceil(projetos.length / itemsPerPage);
    }

    // Cria os botões-indicadores de acordo com o total de páginas
    function createIndicators() {
        const itemsPerPage = getItemsPerPage();
        const totalPages   = getTotalPages(itemsPerPage);

        containerIndic.innerHTML = ''; 
        for (let i = 0; i < totalPages; i++) {
            const btn = document.createElement('button');
            btn.classList.add('carrossel-indicador');
            if (i === 0) btn.classList.add('ativo');
            btn.dataset.page = i;
            btn.addEventListener('click', () => goToPage(i));
            containerIndic.appendChild(btn);
        }
    }

    // Atualiza a classe CSS do indicador ativo
    function updateIndicators(page) {
        document.querySelectorAll('.carrossel-indicador').forEach((ind, idx) => {
            ind.classList.toggle('ativo', idx === page);
        });
    }

    // Pega a largura real de cada item + gap (em px)
    function getItemScrollWidth() {
        if (projetos.length === 0) return 0;
        const primeiro = projetos[0];
        const rect      = primeiro.getBoundingClientRect().width;
        // O gap entre projetos está fixo em 20px no CSS:
        const gap       = 20;
        return rect + gap;
    }

    // Variável de controle da página atual
    let currentPage = 0;

    // Função que faz o scroll até uma página específica
    function goToPage(page) {
        // Re-obtém itemsPerPage e totalPages, pois pode ter mudado se o usuário girou/ redimensionou a tela
        const itemsPerPage = getItemsPerPage();
        const totalPages   = getTotalPages(itemsPerPage);

        // Limita 'page' para [0, totalPages - 1]
        currentPage = Math.max(0, Math.min(page, totalPages - 1));

        const itemScrollWidth = getItemScrollWidth();
        const scrollPosition  = currentPage * itemsPerPage * itemScrollWidth;

        carrossel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        updateIndicators(currentPage);
    }

    // Ao clicar na seta esquerda/direita
    setaEsquerda.addEventListener('click', () => goToPage(currentPage - 1));
    setaDireita.addEventListener('click', () => goToPage(currentPage + 1));

    // Permite navegar com as teclas ← e → no teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  goToPage(currentPage - 1);
        if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    });

    // Se o usuário redimensionar a tela (por exemplo, girar o celular),
    // precisamos recriar os indicadores e “corrigir” a página atual, pois o totalPages mudou.
    window.addEventListener('resize', function() {
        // Recria indicadores corretamente para o novo itemsPerPage
        createIndicators();
        // Garante que não pule fora do limite atual
        goToPage(currentPage);
    });

    // Inicialização: cria indicadores e posiciona na página 0
    createIndicators();
    goToPage(0);
});
