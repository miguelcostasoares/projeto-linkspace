/* ============================================================
   LINKSPACE — lang.js
   Sistema de tradução PT-PT (principal) · EN-GB · ES-ES
   ------------------------------------------------------------
   • Não altera o HTML: traduz o DOM por nós de texto,
     preservando ícones (<i>), imagens, SVG e estrutura.
   • Traduz conteúdo dinâmico (dropdowns, cidades, equipa…)
     através de um MutationObserver — sem mexer nos outros JS.
   • Deteta a língua do dispositivo e memoriza a escolha.
   ============================================================ */
(function () {
    'use strict';

    /* Silencia o callback do Google Translate (script legado),
       caso ainda exista no HTML, para não gerar erro na consola. */
    if (typeof window.googleTranslateElementInit !== 'function') {
        window.googleTranslateElementInit = function () {};
    }

    var DEFAULT = 'pt';
    var SUPPORTED = ['pt', 'es', 'en'];
    var STORAGE_KEY = 'linkspace_lang';

    var FLAGS = {
        pt: 'https://flagcdn.com/pt.svg',
        es: 'https://flagcdn.com/es.svg',
        en: 'https://flagcdn.com/gb.svg'
    };
    var HTMLLANG = { pt: 'pt-PT', es: 'es-ES', en: 'en-GB' };

    /* ────────────────────────────────────────────────────────
       DICIONÁRIO  —  chave = texto PT (espaços normalizados)
       valor = { en: "...", es: "..." }
    ──────────────────────────────────────────────────────── */
    var DICT = {
        /* ── Navbar ── */
        'Imóveis': { en: 'Properties', es: 'Inmuebles' },
        'Pesquisa avançada': { en: 'Advanced search', es: 'Búsqueda avanzada' },
        'Simulador de IMT': { en: 'IMT simulator', es: 'Simulador de IMT' },
        'Oferta de imóvel': { en: 'List a property', es: 'Ofrecer inmueble' },
        'Procuro imóvel': { en: 'Looking for a property', es: 'Busco inmueble' },
        'Empreendimentos': { en: 'Developments', es: 'Promociones' },
        'Análise de mercado': { en: 'Market analysis', es: 'Análisis de mercado' },
        'Notícias': { en: 'News', es: 'Noticias' },
        'Empresa': { en: 'Company', es: 'Empresa' },
        'Quem Somos': { en: 'About Us', es: 'Quiénes Somos' },
        'Recrutamento': { en: 'Careers', es: 'Empleo' },
        'Contactos': { en: 'Contact', es: 'Contacto' },
        'Navegação principal': { en: 'Main navigation', es: 'Navegación principal' },
        'Idioma': { en: 'Language', es: 'Idioma' },

        /* ── Hero (fragmentos) ── */
        'Facilitamos a procura': { en: 'We make finding', es: 'Facilitamos la búsqueda' },
        'pelo': { en: '', es: 'del' },
        'imóvel ideal': { en: 'your ideal property', es: 'inmueble ideal' },
        'para si.': { en: 'easy.', es: 'para usted.' },

        /* ── Barra de pesquisa ── */
        'Venda': { en: 'Sale', es: 'Venta' },
        'Código': { en: 'Code', es: 'Código' },
        'Tipo de imóvel': { en: 'Property type', es: 'Tipo de inmueble' },
        'Escolher': { en: 'Choose', es: 'Elegir' },
        'Tipologia': { en: 'Layout', es: 'Tipología' },
        'Localização': { en: 'Location', es: 'Ubicación' },
        'Filtros': { en: 'Filters', es: 'Filtros' },
        'Buscar Propriedade': { en: 'Search Property', es: 'Buscar Propiedad' },
        'Digite o código do imóvel': { en: 'Enter the property code', es: 'Introduzca el código del inmueble' },
        'selecionados': { en: 'selected', es: 'seleccionados' },
        'Aplicar': { en: 'Apply', es: 'Aplicar' },

        /* ── Painel de filtros ── */
        'Limpar tudo': { en: 'Clear all', es: 'Limpiar todo' },
        'Preço': { en: 'Price', es: 'Precio' },
        'Mínimo': { en: 'Minimum', es: 'Mínimo' },
        'Máximo': { en: 'Maximum', es: 'Máximo' },
        'Área (m²)': { en: 'Area (m²)', es: 'Superficie (m²)' },
        'Quartos': { en: 'Bedrooms', es: 'Habitaciones' },
        'Estúdio': { en: 'Studio', es: 'Estudio' },
        'Casas de banho': { en: 'Bathrooms', es: 'Baños' },
        'Garagens': { en: 'Garages', es: 'Garajes' },
        'Estado': { en: 'Status', es: 'Estado' },
        'Disponível': { en: 'Available', es: 'Disponible' },
        'Em construção': { en: 'Under construction', es: 'En construcción' },
        'Em projecto': { en: 'In planning', es: 'En proyecto' },
        'Não aplicável': { en: 'Not applicable', es: 'No aplicable' },
        'Novo': { en: 'New', es: 'Nuevo' },
        'Para demolir': { en: 'For demolition', es: 'Para demoler' },
        'Por recuperar': { en: 'To renovate', es: 'Para reformar' },
        'Recuperado': { en: 'Renovated', es: 'Reformado' },
        'Usado': { en: 'Used', es: 'Usado' },
        'Aplicar filtros': { en: 'Apply filters', es: 'Aplicar filtros' },

        /* ── Barra de estatísticas ── */
        'Imóveis disponíveis': { en: 'Available properties', es: 'Inmuebles disponibles' },
        'Anos de experiência': { en: 'Years of experience', es: 'Años de experiencia' },
        'Clientes satisfeitos': { en: 'Satisfied clients', es: 'Clientes satisfechos' },
        'Negócios concluídos': { en: 'Completed deals', es: 'Operaciones cerradas' },

        /* ── Secção Imóveis em destaque ── */
        'Destaques': { en: 'Featured', es: 'Destacados' },
        'IMÓVEIS EM DESTAQUE': { en: 'FEATURED PROPERTIES', es: 'INMUEBLES DESTACADOS' },
        'Encontre oportunidades únicas em localizações privilegiadas.': {
            en: 'Find unique opportunities in prime locations.',
            es: 'Encuentre oportunidades únicas en ubicaciones privilegiadas.'
        },
        'Apartamento': { en: 'Apartment', es: 'Apartamento' },
        'Cobertura': { en: 'Penthouse', es: 'Ático' },
        'Moradia': { en: 'House', es: 'Casa' },
        'Explorar': { en: 'Explore', es: 'Explorar' },
        'Adicionar aos favoritos': { en: 'Add to favourites', es: 'Añadir a favoritos' },
        'OLEA VILLAGE 76 — Onde a sua nova vida começa': {
            en: 'OLEA VILLAGE 76 — Where your new life begins',
            es: 'OLEA VILLAGE 76 — Donde empieza su nueva vida'
        },
        'Cobertura T4 nova com 257m² de área total': {
            en: 'New T4 penthouse with 257m² total area',
            es: 'Ático T4 nuevo con 257 m² de superficie total'
        },
        'Moradia T2 com amplo terreno e vista deslumbrante': {
            en: 'T2 house with large plot and stunning view',
            es: 'Casa T2 con amplia parcela y vistas impresionantes'
        },
        'Apartamento T2 em Armação da Pêra': {
            en: 'T2 apartment in Armação da Pêra',
            es: 'Apartamento T2 en Armação da Pêra'
        },
        'Cobertura T4 nova': { en: 'New T4 penthouse', es: 'Ático T4 nuevo' },
        'Moradia T4 com piscina em Sabariz': {
            en: 'T4 house with pool in Sabariz',
            es: 'Casa T4 con piscina en Sabariz'
        },
        'Consultor': { en: 'Consultant', es: 'Asesor' },
        'Consultor Sênior': { en: 'Senior Consultant', es: 'Asesor Sénior' },
        'Director Executivo': { en: 'Executive Director', es: 'Director Ejecutivo' },
        'Sênior': { en: 'Senior', es: 'Sénior' },
        'Ver todos os imóveis': { en: 'View all properties', es: 'Ver todos los inmuebles' },

        /* ── Secção Tipos de imóvel ── */
        'Portfólio': { en: 'Portfolio', es: 'Portafolio' },
        'Imóveis que temos': { en: 'Properties we have', es: 'Inmuebles que tenemos' },
        'para': { en: 'for', es: 'para' },
        'si': { en: 'you', es: 'usted' },
        'Explore a nossa oferta imobiliária e garanta as melhores oportunidades do mercado.': {
            en: 'Explore our property offering and secure the best opportunities on the market.',
            es: 'Explore nuestra oferta inmobiliaria y consiga las mejores oportunidades del mercado.'
        },
        'Apartamentos': { en: 'Apartments', es: 'Apartamentos' },
        'Apartamentos modernos com excelente localização e vista privilegiada em Lisboa e Faro.': {
            en: 'Modern apartments with excellent location and privileged views in Lisbon and Faro.',
            es: 'Apartamentos modernos con excelente ubicación y vistas privilegiadas en Lisboa y Faro.'
        },
        'Tipologias disponíveis': { en: 'Available layouts', es: 'Tipologías disponibles' },
        'Com piscina': { en: 'With pool', es: 'Con piscina' },
        'Duplex': { en: 'Duplex', es: 'Dúplex' },
        'imóveis': { en: 'properties', es: 'inmuebles' },
        'Ver todos': { en: 'View all', es: 'Ver todos' },
        'Ver todas': { en: 'View all', es: 'Ver todas' },
        'Moradias': { en: 'Houses', es: 'Casas' },
        'Moradias espaçosas com jardim e piscina nas melhores zonas residenciais do norte.': {
            en: 'Spacious houses with garden and pool in the best residential areas of the north.',
            es: 'Casas espaciosas con jardín y piscina en las mejores zonas residenciales del norte.'
        },
        'Terrenos': { en: 'Land', es: 'Terrenos' },
        'Terrenos urbanos, rústicos e industriais com licenciamento facilitado em todo o país.': {
            en: 'Urban, rural and industrial land with streamlined licensing across the country.',
            es: 'Terrenos urbanos, rústicos e industriales con licencia simplificada en todo el país.'
        },
        'Categorias': { en: 'Categories', es: 'Categorías' },
        'Urbano': { en: 'Urban', es: 'Urbano' },
        'Rústico': { en: 'Rural', es: 'Rústico' },
        'Industrial': { en: 'Industrial', es: 'Industrial' },
        'Agrícola': { en: 'Agricultural', es: 'Agrícola' },
        'Prédios': { en: 'Buildings', es: 'Edificios' },
        'Edifícios inteiros para investimento, reabilitação urbana ou rendimento imediato nas capitais.': {
            en: 'Entire buildings for investment, urban regeneration or immediate income in the capitals.',
            es: 'Edificios completos para inversión, rehabilitación urbana o renta inmediata en las capitales.'
        },
        'Perfis de investimento': { en: 'Investment profiles', es: 'Perfiles de inversión' },
        'Residencial': { en: 'Residential', es: 'Residencial' },
        'Misto': { en: 'Mixed-use', es: 'Mixto' },
        'Rendimento': { en: 'Income', es: 'Renta' },
        'Reabilitação': { en: 'Refurbishment', es: 'Rehabilitación' },
        'Quintas & Herdades': { en: 'Farms & Estates', es: 'Fincas y Haciendas' },
        'Quintas e Herdades': { en: 'Farms and Estates', es: 'Fincas y Haciendas' },
        'Propriedades rurais únicas para turismo, agricultura ou retiro privado em plena natureza.': {
            en: 'Unique rural properties for tourism, agriculture or a private retreat in the heart of nature.',
            es: 'Propiedades rurales únicas para turismo, agricultura o un retiro privado en plena naturaleza.'
        },
        'Utilizações': { en: 'Uses', es: 'Usos' },
        'Turismo rural': { en: 'Rural tourism', es: 'Turismo rural' },
        'Habitação': { en: 'Residential', es: 'Vivienda' },
        'Ver quintas': { en: 'View farms', es: 'Ver fincas' },
        'Espaços Comerciais': { en: 'Commercial Spaces', es: 'Espacios Comerciales' },
        'Lojas, escritórios e armazéns estrategicamente localizados nos principais centros urbanos.': {
            en: 'Shops, offices and warehouses strategically located in the main urban centres.',
            es: 'Locales, oficinas y almacenes estratégicamente ubicados en los principales centros urbanos.'
        },
        'Loja': { en: 'Shop', es: 'Local' },
        'Lojas': { en: 'Shops', es: 'Locales' },
        'Escritório': { en: 'Office', es: 'Oficina' },
        'Armazém': { en: 'Warehouse', es: 'Almacén' },
        'Clínica': { en: 'Clinic', es: 'Clínica' },
        'Ver espaços': { en: 'View spaces', es: 'Ver espacios' },
        'Imóveis c/ negócio': { en: 'Properties with business', es: 'Inmuebles con negocio' },
        'Penthouse': { en: 'Penthouse', es: 'Ático' },
        'T6 ou mais': { en: 'T6 or more', es: 'T6 o más' },

        /* ── Secção Sobre nós ── */
        'EMPRESA': { en: 'COMPANY', es: 'EMPRESA' },
        'Mais do que uma imobiliária,': { en: 'More than a real estate agency,', es: 'Más que una inmobiliaria,' },
        'somos o seu': { en: 'we are your', es: 'somos su' },
        'parceiro de confiança.': { en: 'trusted partner.', es: 'socio de confianza.' },
        'A LinkSpace nasceu com um propósito claro: tornar a procura e compra de imóvel uma experiência simples, transparente e humana. Com mais de uma década no mercado, construímos pontes entre sonhos e realidade.': {
            en: 'LinkSpace was born with a clear purpose: to make searching for and buying a property a simple, transparent and human experience. With over a decade in the market, we build bridges between dreams and reality.',
            es: 'LinkSpace nació con un propósito claro: hacer de la búsqueda y compra de un inmueble una experiencia sencilla, transparente y humana. Con más de una década en el mercado, construimos puentes entre los sueños y la realidad.'
        },
        'Transparência total': { en: 'Full transparency', es: 'Transparencia total' },
        'Sem letras miúdas. Toda a informação clara e acessível desde o primeiro contacto.': {
            en: 'No fine print. All information clear and accessible from the very first contact.',
            es: 'Sin letra pequeña. Toda la información clara y accesible desde el primer contacto.'
        },
        'Cobertura nacional': { en: 'Nationwide coverage', es: 'Cobertura nacional' },
        'Presença em Lisboa, Porto, Braga, Algarve e mais de 15 concelhos em todo o país.': {
            en: 'Present in Lisbon, Porto, Braga, the Algarve and more than 15 municipalities across the country.',
            es: 'Presencia en Lisboa, Oporto, Braga, el Algarve y más de 15 municipios en todo el país.'
        },
        'Reconhecimento do setor': { en: 'Industry recognition', es: 'Reconocimiento del sector' },
        'Premiados consecutivamente como uma das melhores mediações imobiliárias de Portugal.': {
            en: 'Consecutively awarded as one of the best real estate agencies in Portugal.',
            es: 'Premiados consecutivamente como una de las mejores agencias inmobiliarias de Portugal.'
        },
        'Conhecer a equipa': { en: 'Meet the team', es: 'Conocer al equipo' },
        'Escritório': { en: 'Office', es: 'Oficina' },
        'Equipa': { en: 'Team', es: 'Equipo' },
        'Empreendimento': { en: 'Development', es: 'Promoción' },
        'Projeto': { en: 'Project', es: 'Proyecto' },
        'Sede LinkSpace — Braga': { en: 'LinkSpace Headquarters — Braga', es: 'Sede de LinkSpace — Braga' },
        'Consultores LinkSpace': { en: 'LinkSpace Consultants', es: 'Asesores LinkSpace' },
        'Olea Village — Lisboa': { en: 'Olea Village — Lisbon', es: 'Olea Village — Lisboa' },
        'Moradia T4 com piscina — Vila Verde': { en: 'T4 House with pool — Vila Verde', es: 'Casa T4 con piscina — Vila Verde' },
        'Reunião anual — Braga': { en: 'Annual meeting — Braga', es: 'Reunión anual — Braga' },
        'Cidades cobertas': { en: 'Cities covered', es: 'Ciudades cubiertas' },
        'A nossa equipa': { en: 'Our team', es: 'Nuestro equipo' },
        'Ver equipa': { en: 'View team', es: 'Ver equipo' },
        'Anterior': { en: 'Previous', es: 'Anterior' },
        'Seguinte': { en: 'Next', es: 'Siguiente' },
        'Consultor anterior': { en: 'Previous consultant', es: 'Asesor anterior' },
        'Próximo consultor': { en: 'Next consultant', es: 'Siguiente asesor' },

        /* ── Secção Destinos ── */
        'Destinos': { en: 'Destinations', es: 'Destinos' },
        'Onde fica a casa dos seus': { en: 'Where is the home of your', es: '¿Dónde está la casa de sus' },
        'sonhos?': { en: 'dreams?', es: 'sueños?' },
        'Escolha a sua cidade e descubra os imóveis que combinam com o seu próximo capítulo.': {
            en: 'Choose your city and discover the properties that match your next chapter.',
            es: 'Elija su ciudad y descubra los inmuebles que encajan con su próximo capítulo.'
        },
        'Destino': { en: 'Destination', es: 'Destino' },
        'Cidade': { en: 'City', es: 'Ciudad' },
        'Região': { en: 'Region', es: 'Región' },
        'A partir de': { en: 'From', es: 'Desde' },
        'Ver imóveis': { en: 'View properties', es: 'Ver inmuebles' },
        'Pausar apresentação': { en: 'Pause slideshow', es: 'Pausar presentación' },
        'Retomar apresentação': { en: 'Resume slideshow', es: 'Reanudar presentación' },
        'Foto anterior': { en: 'Previous photo', es: 'Foto anterior' },
        'Foto seguinte': { en: 'Next photo', es: 'Foto siguiente' },
        'Ver cidades anteriores': { en: 'View previous cities', es: 'Ver ciudades anteriores' },
        'Ver mais cidades': { en: 'View more cities', es: 'Ver más ciudades' },

        /* ── Cidades (tags + regiões dinâmicas) ── */
        'Campo & tradição': { en: 'Countryside & tradition', es: 'Campo y tradición' },
        'Barroca & viva': { en: 'Baroque & lively', es: 'Barroca y viva' },
        'Berço da nação': { en: 'Birthplace of the nation', es: 'Cuna de la nación' },
        'Mar & Santa Luzia': { en: 'Sea & Santa Luzia', es: 'Mar y Santa Luzia' },
        'Ribeira & ferro': { en: 'Riverside & iron', es: 'Ribera y hierro' },
        'Vinho do Porto': { en: 'Port wine', es: 'Vino de Oporto' },
        'Saber & Mondego': { en: 'Knowledge & Mondego', es: 'Saber y Mondego' },
        'Luz & elétrico 28': { en: 'Light & tram 28', es: 'Luz y tranvía 28' },
        'Falésias & sol': { en: 'Cliffs & sun', es: 'Acantilados y sol' },
        'Centro': { en: 'Centre', es: 'Centro' },
        'Sul': { en: 'South', es: 'Sur' },
        'Grande Porto': { en: 'Greater Porto', es: 'Gran Oporto' },
        'Grande Lisboa': { en: 'Greater Lisbon', es: 'Gran Lisboa' },

        /* ── Dropdown tipos (dropdown.js) ── */
        'T0 — Studio': { en: 'T0 — Studio', es: 'T0 — Estudio' },

        /* ── Rodapé ── */
        'Facilitamos a procura pelo imóvel ideal para si.': {
            en: 'We make finding your ideal property easy.',
            es: 'Facilitamos la búsqueda de su inmueble ideal.'
        },
        'Política de Privacidade': { en: 'Privacy Policy', es: 'Política de Privacidad' },
        'Política de Cookies': { en: 'Cookie Policy', es: 'Política de Cookies' },
        'Canal de Denúncias': { en: 'Whistleblowing Channel', es: 'Canal de Denuncias' },
        'Livro de Reclamações Online': { en: 'Online Complaints Book', es: 'Libro de Reclamaciones Online' },
        'Gerir Dados': { en: 'Manage Data', es: 'Gestionar Datos' },
        'LinkSpace. Todos os direitos reservados.': {
            en: 'LinkSpace. All rights reserved.',
            es: 'LinkSpace. Todos los derechos reservados.'
        },
        'Criado por': { en: 'Created by', es: 'Creado por' },

        /* ── Contas: widget da navbar ── */
        'Conta': { en: 'Account', es: 'Cuenta' },
        'Entrar': { en: 'Log in', es: 'Iniciar sesión' },
        'Criar conta': { en: 'Create account', es: 'Crear cuenta' },
        'Imóveis guardados': { en: 'Saved properties', es: 'Inmuebles guardados' },
        'Histórico de imóveis vistos': { en: 'Viewing history', es: 'Historial de inmuebles vistos' },
        'O meu perfil': { en: 'My profile', es: 'Mi perfil' },
        'Terminar sessão': { en: 'Log out', es: 'Cerrar sesión' },
        'Histórico': { en: 'History', es: 'Historial' },

        /* ── Newsletter ── */
        'Newsletter': { en: 'Newsletter', es: 'Boletín' },
        'Receba os novos imóveis e novidades no seu e-mail.': {
            en: 'Get new properties and news straight to your inbox.',
            es: 'Reciba los nuevos inmuebles y novedades en su correo.'
        },
        'O seu e-mail': { en: 'Your email', es: 'Su correo electrónico' },
        'Subscrição feita. Obrigado!': { en: 'You\u2019re subscribed. Thank you!', es: '¡Suscripción hecha. Gracias!' },
        'Não foi possível subscrever.': { en: 'Could not subscribe.', es: 'No se pudo suscribir.' },
        'Indique um e-mail válido.': { en: 'Enter a valid email.', es: 'Indique un correo válido.' },

        /* ── Toast ── */
        'Inicie sessão para guardar imóveis.': {
            en: 'Log in to save properties.',
            es: 'Inicie sesión para guardar inmuebles.'
        },

        /* ── Página de login / registo ── */
        'A sua conta LinkSpace': { en: 'Your LinkSpace account', es: 'Su cuenta LinkSpace' },
        'Bem-vindo a': { en: 'Welcome', es: 'Bienvenido a' },
        'casa': { en: 'home', es: 'casa' },
        'Guarde os imóveis que mais gosta, acompanhe os que já viu e receba em primeira mão os novos anúncios.': {
            en: 'Save the properties you love, keep track of the ones you\u2019ve seen and be the first to know about new listings.',
            es: 'Guarde los inmuebles que más le gustan, siga los que ya ha visto y reciba antes que nadie los nuevos anuncios.'
        },
        'Voltar ao site': { en: 'Back to site', es: 'Volver al sitio' },
        'Aceda à sua conta para continuar.': { en: 'Sign in to your account to continue.', es: 'Acceda a su cuenta para continuar.' },
        'E-mail': { en: 'Email', es: 'Correo electrónico' },
        'Palavra-passe': { en: 'Password', es: 'Contraseña' },
        'Esqueci-me da palavra-passe': { en: 'Forgot your password?', es: 'Olvidé mi contraseña' },
        'Ainda não tem conta?': { en: 'Don\u2019t have an account yet?', es: '¿Aún no tiene cuenta?' },
        'É rápido e gratuito.': { en: 'It\u2019s quick and free.', es: 'Es rápido y gratuito.' },
        'Nome': { en: 'Name', es: 'Nombre' },
        'Telefone': { en: 'Phone', es: 'Teléfono' },
        '(opcional)': { en: '(optional)', es: '(opcional)' },
        'Quero receber novidades e novos imóveis por e-mail.': {
            en: 'I want to receive news and new properties by email.',
            es: 'Quiero recibir novedades y nuevos inmuebles por correo.'
        },
        'Já tem conta?': { en: 'Already have an account?', es: '¿Ya tiene cuenta?' },
        'Recuperar palavra-passe': { en: 'Reset password', es: 'Recuperar contraseña' },
        'Em produção, isto envia um link de recuperação por e-mail. Nesta demonstração, defina já uma nova palavra-passe.': {
            en: 'In production this sends a recovery link by email. In this demo, set a new password right away.',
            es: 'En producción, esto envía un enlace de recuperación por correo. En esta demostración, defina ya una nueva contraseña.'
        },
        'Nova palavra-passe': { en: 'New password', es: 'Nueva contraseña' },
        'Definir nova palavra-passe': { en: 'Set new password', es: 'Definir nueva contraseña' },
        'Voltar ao início de sessão': { en: 'Back to sign in', es: 'Volver al inicio de sesión' },
        'Mínimo 6 caracteres': { en: 'At least 6 characters', es: 'Mínimo 6 caracteres' },
        'O seu nome': { en: 'Your name', es: 'Su nombre' },
        'Mostrar palavra-passe': { en: 'Show password', es: 'Mostrar contraseña' },
        'Palavra-passe atualizada. Já pode iniciar sessão.': {
            en: 'Password updated. You can now sign in.',
            es: 'Contraseña actualizada. Ya puede iniciar sesión.'
        },

        /* ── Página de perfil ── */
        'A minha conta': { en: 'My account', es: 'Mi cuenta' },
        'Olá,': { en: 'Hi,', es: 'Hola,' },
        'Gere o seu perfil, imóveis guardados e histórico de visitas.': {
            en: 'Manage your profile, saved properties and viewing history.',
            es: 'Gestione su perfil, inmuebles guardados e historial de visitas.'
        },
        'Os seus dados de conta.': { en: 'Your account details.', es: 'Los datos de su cuenta.' },
        'Guardar alterações': { en: 'Save changes', es: 'Guardar cambios' },
        'Alterar palavra-passe': { en: 'Change password', es: 'Cambiar contraseña' },
        'Palavra-passe atual': { en: 'Current password', es: 'Contraseña actual' },
        'Atualizar palavra-passe': { en: 'Update password', es: 'Actualizar contraseña' },
        'Os imóveis que marcou com coração.': {
            en: 'The properties you\u2019ve hearted.',
            es: 'Los inmuebles que marcó con corazón.'
        },
        'Os últimos imóveis que explorou.': {
            en: 'The latest properties you\u2019ve explored.',
            es: 'Los últimos inmuebles que ha explorado.'
        },
        'Limpar histórico': { en: 'Clear history', es: 'Borrar historial' },
        'Ainda não guardou nenhum imóvel.': { en: 'You haven\u2019t saved any properties yet.', es: 'Aún no ha guardado ningún inmueble.' },
        'Toque no coração de um imóvel para o guardar aqui.': {
            en: 'Tap the heart on a property to save it here.',
            es: 'Toque el corazón de un inmueble para guardarlo aquí.'
        },
        'O seu histórico está vazio.': { en: 'Your history is empty.', es: 'Su historial está vacío.' },
        'Os imóveis que explorar aparecem aqui.': {
            en: 'Properties you explore appear here.',
            es: 'Los inmuebles que explore aparecen aquí.'
        },
        'Ver imóveis': { en: 'View properties', es: 'Ver inmuebles' },
        'Dados atualizados com sucesso.': { en: 'Details updated successfully.', es: 'Datos actualizados correctamente.' },
        'Palavra-passe atualizada.': { en: 'Password updated.', es: 'Contraseña actualizada.' },
        'Não foi possível guardar.': { en: 'Could not save.', es: 'No se pudo guardar.' },
        'Não foi possível atualizar.': { en: 'Could not update.', es: 'No se pudo actualizar.' },

        /* ── Mensagens de erro (auth.js) ── */
        'Indique o seu nome.': { en: 'Enter your name.', es: 'Indique su nombre.' },
        'A palavra-passe precisa de pelo menos 6 caracteres.': {
            en: 'Password must be at least 6 characters.',
            es: 'La contraseña necesita al menos 6 caracteres.'
        },
        'Já existe uma conta com este e-mail.': { en: 'An account with this email already exists.', es: 'Ya existe una cuenta con este correo.' },
        'Não encontrámos nenhuma conta com este e-mail.': {
            en: 'We couldn\u2019t find an account with this email.',
            es: 'No encontramos ninguna cuenta con este correo.'
        },
        'Palavra-passe incorreta.': { en: 'Incorrect password.', es: 'Contraseña incorrecta.' },
        'Sessão terminada. Inicie sessão novamente.': { en: 'Session ended. Please sign in again.', es: 'Sesión finalizada. Inicie sesión de nuevo.' },
        'Sessão terminada.': { en: 'Session ended.', es: 'Sesión finalizada.' },
        'Conta não encontrada.': { en: 'Account not found.', es: 'Cuenta no encontrada.' },
        'O nome não pode ficar vazio.': { en: 'Name cannot be empty.', es: 'El nombre no puede quedar vacío.' },
        'A nova palavra-passe precisa de pelo menos 6 caracteres.': {
            en: 'The new password must be at least 6 characters.',
            es: 'La nueva contraseña necesita al menos 6 caracteres.'
        },
        'A palavra-passe atual está incorreta.': { en: 'The current password is incorrect.', es: 'La contraseña actual es incorrecta.' },
        'Não existe nenhuma conta com este e-mail.': { en: 'There is no account with this email.', es: 'No existe ninguna cuenta con este correo.' },
        'Ocorreu um erro. Tente novamente.': { en: 'Something went wrong. Please try again.', es: 'Ocurrió un error. Inténtelo de nuevo.' }
    };

    /* ────────────────────────────────────────────────────────
       REGRAS DINÂMICAS (texto com partes variáveis)
    ──────────────────────────────────────────────────────── */
    var RULES = [
        { re: /^(\d+)\s+imóveis$/i,           en: '$1 properties',       es: '$1 inmuebles' },
        { re: /^Ver imóveis em (.+)$/i,        en: 'View properties in $1', es: 'Ver inmuebles en $1' },
        { re: /^(\d+)\s+selecionados$/i,       en: '$1 selected',         es: '$1 seleccionados' },
        { re: /^Moradia (T\d\+?)$/i,           en: 'House $1',            es: 'Casa $1' },
        { re: /^Cobertura (T\d)$/i,            en: 'Penthouse $1',        es: 'Ático $1' },
        { re: /^Duplex (T\d)$/i,               en: 'Duplex $1',           es: 'Dúplex $1' },
        { re: /^Foto (\d+)$/i,                 en: 'Photo $1',            es: 'Foto $1' },
        { re: /^Slide (\d+)$/i,                en: 'Slide $1',            es: 'Slide $1' }
    ];

    function translate(key, lang) {
        if (lang === 'pt') return key;
        var entry = DICT[key];
        if (entry && entry[lang] != null) return entry[lang];
        for (var i = 0; i < RULES.length; i++) {
            var r = RULES[i];
            if (r.re.test(key)) return key.replace(r.re, r[lang]);
        }
        return key; /* sem tradução → mantém original */
    }

    function isTranslatable(key) {
        return translate(key, 'en') !== key || translate(key, 'es') !== key;
    }

    /* ────────────────────────────────────────────────────────
       REGISTOS  (nós de texto + atributos a traduzir)
    ──────────────────────────────────────────────────────── */
    var textRegistry = [];          /* { node, prefix, suffix, key } */
    var attrRegistry = [];          /* { el, attr, key } */
    var seenNodes = new WeakSet();
    var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
    var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
    var currentLang = DEFAULT;

    function collapse(s) { return s.replace(/\s+/g, ' '); }

    function localizeTextNode(node) {
        if (seenNodes.has(node)) return;
        var raw = node.nodeValue;
        if (!raw) return;
        var trimmed = raw.replace(/^\s+|\s+$/g, '');
        if (!trimmed) return;
        var key = collapse(trimmed);
        if (!isTranslatable(key)) { seenNodes.add(node); return; }

        var prefix = (raw.match(/^\s*/) || [''])[0];
        var suffix = (raw.match(/\s*$/) || [''])[0];
        textRegistry.push({ node: node, prefix: prefix, suffix: suffix, key: key });
        seenNodes.add(node);

        /* aplica já a língua corrente */
        node.nodeValue = prefix + translate(key, currentLang) + suffix;
    }

    function localizeAttrs(el) {
        for (var i = 0; i < ATTRS.length; i++) {
            var a = ATTRS[i];
            if (!el.hasAttribute || !el.hasAttribute(a)) continue;
            var marker = '__i18n_' + a;
            if (el[marker]) continue;
            el[marker] = true;

            var raw = el.getAttribute(a) || '';
            var key = collapse(raw.replace(/^\s+|\s+$/g, ''));
            if (!key || !isTranslatable(key)) continue;

            attrRegistry.push({ el: el, attr: a, key: key });
            el.setAttribute(a, translate(key, currentLang));
        }
    }

    function localizeSubtree(root) {
        if (!root) return;
        var type = root.nodeType;

        if (type === 3) { localizeTextNode(root); return; }
        if (type !== 1) return;

        var tag = root.nodeName;
        if (SKIP_TAGS[tag]) return;
        if (tag === 'svg' || tag === 'SVG') return;       /* não toca em SVG */
        if (root.id === 'locationPlaceholder') return;     /* placeholder rotativo (tratado à parte) */

        localizeAttrs(root);

        var child = root.firstChild;
        while (child) {
            localizeSubtree(child);
            child = child.nextSibling;
        }
    }

    /* remove registos cujos nós já não estão na página */
    function pruneStale() {
        textRegistry = textRegistry.filter(function (t) {
            return t.node.isConnected !== false;
        });
        attrRegistry = attrRegistry.filter(function (a) {
            return a.el.isConnected !== false;
        });
    }

    /* aplica uma língua a TODOS os registos */
    function applyLang(lang) {
        pruneStale();

        /* desliga o observer enquanto reescrevemos os nós, para não
           reagir às próprias alterações (evita loop/travamento) */
        observer.disconnect();

        for (var i = 0; i < textRegistry.length; i++) {
            var t = textRegistry[i];
            t.node.nodeValue = t.prefix + translate(t.key, lang) + t.suffix;
        }
        for (var j = 0; j < attrRegistry.length; j++) {
            var a = attrRegistry[j];
            a.el.setAttribute(a.attr, translate(a.key, lang));
        }
        document.documentElement.lang = HTMLLANG[lang] || lang;

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    /* ────────────────────────────────────────────────────────
       OBSERVER  —  apanha conteúdo injetado dinamicamente
    ──────────────────────────────────────────────────────── */
    var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];

            if (m.type === 'childList') {
                for (var j = 0; j < m.addedNodes.length; j++) {
                    localizeSubtree(m.addedNodes[j]);
                }
            } else if (m.type === 'characterData') {
                var tgt = m.target;
                /* ignora a animação do placeholder rotativo */
                if (tgt.parentNode && tgt.parentNode.id === 'locationPlaceholder') continue;
                /* o texto mudou: descarta registo antigo e reavalia */
                for (var k = textRegistry.length - 1; k >= 0; k--) {
                    if (textRegistry[k].node === tgt) textRegistry.splice(k, 1);
                }
                seenNodes.delete(tgt);
                localizeTextNode(tgt);
            }
        }
    });

    /* ────────────────────────────────────────────────────────
       PLACEHOLDERS ROTATIVOS (usados por location-search.js)
    ──────────────────────────────────────────────────────── */
    var LS_PLACEHOLDERS = {
        pt: ['Digite a freguesia...', 'Digite o concelho...', 'Digite o distrito...', 'Digite a cidade...', 'Ex: Braga, Porto, Lisboa...'],
        en: ['Enter the parish...', 'Enter the municipality...', 'Enter the district...', 'Enter the city...', 'E.g. Braga, Porto, Lisbon...'],
        es: ['Escriba la parroquia...', 'Escriba el municipio...', 'Escriba el distrito...', 'Escriba la ciudad...', 'Ej: Braga, Oporto, Lisboa...']
    };

    /* ────────────────────────────────────────────────────────
       UI: bandeira ativa, opção ativa, dropdown
    ──────────────────────────────────────────────────────── */
    function updateFlag(lang) {
        var flag = document.getElementById('lang-flag-active');
        if (flag && FLAGS[lang]) flag.src = FLAGS[lang];
    }

    function updateActiveOption(lang) {
        document.querySelectorAll('.lang-option[data-lang]').forEach(function (b) {
            b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
        });
    }

    function setLang(lang, persist) {
        if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
        currentLang = lang;
        applyLang(lang);
        updateFlag(lang);
        updateActiveOption(lang);
        window.__lsPlaceholders = LS_PLACEHOLDERS[lang] || LS_PLACEHOLDERS.pt;
        if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
    }

    function detectLang() {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;

        var primary = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (primary.indexOf('pt') === 0) return 'pt';
        if (primary.indexOf('es') === 0) return 'es';
        return 'en'; /* não fala PT nem ES → Inglês */
    }

    /* ────────────────────────────────────────────────────────
       LIGAÇÃO DOS BOTÕES + dropdown (com suporte a telemóvel)
    ──────────────────────────────────────────────────────── */
    function wireControls() {
        var langDropdown = document.querySelector('.dropdown--lang');

        document.querySelectorAll('.lang-option[data-lang]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                setLang(btn.getAttribute('data-lang'), true);
                if (langDropdown) langDropdown.classList.remove('open');
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            });
        });

        /* abre/fecha por clique (essencial no telemóvel, onde não há hover) */
        var trigger = document.querySelector('.dropdown--lang .lang-trigger');
        if (trigger && langDropdown) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                langDropdown.classList.toggle('open');
                var open = langDropdown.classList.contains('open');
                trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            document.addEventListener('click', function (e) {
                if (!langDropdown.contains(e.target)) langDropdown.classList.remove('open');
            });
        }
    }

    /* ────────────────────────────────────────────────────────
       ARRANQUE
    ──────────────────────────────────────────────────────── */
    function init() {
        currentLang = detectLang();
        window.__lsPlaceholders = LS_PLACEHOLDERS[currentLang] || LS_PLACEHOLDERS.pt;

        localizeSubtree(document.body);   /* regista + traduz tudo o que já existe */
        setLang(currentLang, false);      /* garante bandeira/opção/atributos */

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        wireControls();

        /* API pública opcional */
        window.LinkSpaceI18n = {
            set: function (l) { setLang(l, true); },
            get: function () { return currentLang; }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();