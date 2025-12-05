// Função para inicializar o widget
(function() {
    'use strict';
    
    // Aguardar AmoWidget estar disponível
    function initWidget() {
        if (typeof AmoWidget === 'undefined') {
            // Tentar novamente após um delay
            setTimeout(initWidget, 100);
            return;
        }

        // Inicializar o widget
        AmoWidget.init(async () => {
        // Funções de storage
        async function getStorage(key) {
            try {
                if (AmoWidget && AmoWidget.storage && AmoWidget.storage.get) {
                    return await AmoWidget.storage.get(key);
                }
                return null;
            } catch (e) {
                console.debug('Erro ao ler storage:', e);
                return null;
            }
        }
        
        async function setStorage(key, value) {
            try {
                if (AmoWidget && AmoWidget.storage && AmoWidget.storage.set) {
                    return await AmoWidget.storage.set(key, value);
                }
                return false;
            } catch (e) {
                console.error("Erro ao salvar:", e);
                return false;
            }
        }

        // Bloqueio de menus - versão melhorada
        function blockMenus() {
            let observer = null;
            let interval = null;
            let timeoutId = null;

            function hideMenuItems() {
            try {
                // Múltiplos seletores possíveis para o menu do Kommo
                const selectors = [
                    '.sidebar__menu',
                    '.sidebar-menu',
                    '[class*="sidebar"]',
                    '[class*="menu"]',
                    'nav',
                    'ul[class*="menu"]'
                ];

                let menuFound = false;
                
                for (const selector of selectors) {
                    try {
                        const menus = document.querySelectorAll(selector);
                        
                        menus.forEach(menu => {
                            const items = menu.querySelectorAll('li, a, [class*="menu-item"], [class*="nav-item"]');
                            
                            items.forEach(item => {
                                const text = (item.innerText || item.textContent || '').toLowerCase().trim();
                                const link = item.querySelector('a');
                                const linkText = link ? (link.innerText || link.textContent || '').toLowerCase().trim() : '';
                                const combinedText = text + ' ' + linkText;

                                // Verificar se contém "início" ou "whatsapp"
                                if (combinedText.includes("início") || 
                                    combinedText.includes("inicio") || 
                                    combinedText.includes("home") ||
                                    combinedText.includes("whatsapp") ||
                                    combinedText.includes("whats app")) {
                                    item.style.display = "none";
                                    item.style.visibility = "hidden";
                                    item.style.height = "0";
                                    item.style.overflow = "hidden";
                                    item.style.margin = "0";
                                    item.style.padding = "0";
                                    menuFound = true;
                                }
                            });
                        });
                    } catch (e) {
                        // Ignorar erros de seletores específicos
                        console.debug('Seletor não encontrado:', selector);
                    }
                }

                // Também procurar por links diretos
                try {
                    const allLinks = document.querySelectorAll('a[href*="whatsapp"], a[href*="home"], a[href*="inicio"]');
                    allLinks.forEach(link => {
                        const parent = link.closest('li, div, span');
                        if (parent) {
                            parent.style.display = "none";
                            parent.style.visibility = "hidden";
                        }
                    });
                } catch (e) {
                    // Ignorar erros
                }

                return menuFound;
            } catch (e) {
                console.error('Erro ao ocultar menus:', e);
                return false;
            }
        }

        // Tentar imediatamente
        hideMenuItems();

        // Usar MutationObserver para detectar mudanças no DOM
        if (document.body) {
            observer = new MutationObserver(() => {
                hideMenuItems();
            });

            // Observar mudanças no body
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Também usar interval como fallback
        interval = setInterval(() => {
            hideMenuItems();
        }, 1000);

        // Limpar após 60 segundos (tempo suficiente para carregar)
        timeoutId = setTimeout(() => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            // Manter o observer ativo, mas reduzir frequência
            if (observer) {
                observer.disconnect();
                // Reconectar com configuração mais conservadora
                observer = new MutationObserver(() => {
                    hideMenuItems();
                });
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: false // Mais conservador
                    });
                }
            }
        }, 60000);

            // Retornar função de limpeza (útil para testes)
            return () => {
                if (observer) {
                    observer.disconnect();
                }
                if (interval) {
                    clearInterval(interval);
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }

        // Aplicação de CSS / JS personalizados
        function applyCustomCode(css, js) {
            // CSS
            let cssTag = document.getElementById("alphaCustomCSS");
            if (cssTag) {
                cssTag.remove();
            }
            
            if (css && css.trim()) {
                cssTag = document.createElement("style");
                cssTag.id = "alphaCustomCSS";
                cssTag.innerHTML = css;
                document.head.appendChild(cssTag);
            }

            // JS - Remover script anterior
            let jsTag = document.getElementById("alphaCustomJS");
            if (jsTag) {
                jsTag.remove();
            }

            // JS - Criar e executar novo script
            if (js && js.trim()) {
                jsTag = document.createElement("script");
                jsTag.id = "alphaCustomJS";
                try {
                    // Usar Function para executar o código em um contexto seguro
                    const scriptFunction = new Function(js);
                    scriptFunction();
                } catch (e) {
                    console.error("Erro ao executar JS personalizado:", e);
                    // Fallback: inserir como texto e deixar o navegador executar
                    jsTag.textContent = js;
                    document.body.appendChild(jsTag);
                }
            }
        }

        // Carregar valores salvos e aplicar
        const savedCss = await getStorage("alpha_css");
        const savedJs = await getStorage("alpha_js");

        if (savedCss || savedJs) {
            applyCustomCode(savedCss, savedJs);
        }

        // Bloquear menus (só se não estiver na página de configurações)
        if (!document.getElementById("customCss")) {
            blockMenus();
        }

        // Setup do editor se estiver no painel de configurações
        if (document.getElementById("customCss")) {
            document.getElementById("customCss").value = savedCss || "";
            document.getElementById("customJs").value = savedJs || "";

            document.getElementById("saveBtn").onclick = async () => {
                const css = document.getElementById("customCss").value;
                const js = document.getElementById("customJs").value;
                await setStorage("alpha_css", css);
                await setStorage("alpha_js", js);
                alert("Configurações salvas!");
            };

            document.getElementById("applyBtn").onclick = () => {
                const css = document.getElementById("customCss").value;
                const js = document.getElementById("customJs").value;
                applyCustomCode(css, js);
                alert("Aplicado!");
            };
        }
        });
    }

    // Iniciar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        // DOM já está pronto
        initWidget();
    }

    // Fallback: tentar após window.load
    window.addEventListener('load', function() {
        if (typeof AmoWidget !== 'undefined' && !window.alphaWidgetInitialized) {
            window.alphaWidgetInitialized = true;
            initWidget();
        }
    });
})();
