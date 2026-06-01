import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const courses = [
  {
    id: 'course-expo',
    title: 'Expo (React Native)',
    description: 'Aprenda a criar apps mobile com Expo e React Native',
    tracks: [
      {
        id: 'expo-track-1',
        title: 'Fundamentos Mobile',
        modules: [
          {
            id: 'expo-mod-1',
            title: 'Fundamentos do Expo',
            order: 1,
            lessons: [
              ['expo-l1-1', 'O que é Expo?'],
              ['expo-l1-2', 'Criando seu primeiro projeto'],
              ['expo-l1-3', 'Estrutura de pastas'],
            ],
          },
          {
            id: 'expo-mod-2',
            title: 'Componentes',
            order: 2,
            lessons: [
              ['expo-l2-1', 'View e Text'],
              ['expo-l2-2', 'Image e ScrollView'],
              ['expo-l2-3', 'TouchableOpacity e Pressable'],
            ],
          },
          {
            id: 'expo-mod-3',
            title: 'Navegação',
            order: 3,
            lessons: [
              ['expo-l3-1', 'Expo Router básico'],
              ['expo-l3-2', 'Parâmetros e rotas dinâmicas'],
            ],
          },
          {
            id: 'expo-mod-4',
            title: 'APIs e Armazenamento',
            order: 4,
            lessons: [
              ['expo-l4-1', 'Fetch e Axios'],
              ['expo-l4-2', 'Armazenamento local'],
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'course-aws',
    title: 'AWS Nuvem',
    description: 'Domine os serviços essenciais da AWS',
    tracks: [
      {
        id: 'aws-track-1',
        title: 'Fundamentos Cloud',
        modules: [
          {
            id: 'aws-mod-1',
            title: 'Conceitos de Cloud',
            order: 1,
            lessons: [
              ['aws-l1-1', 'O que é Cloud Computing?'],
              ['aws-l1-2', 'IaaS, PaaS, SaaS'],
              ['aws-l1-3', 'Regiões e Zonas'],
            ],
          },
          {
            id: 'aws-mod-2',
            title: 'IAM',
            order: 2,
            lessons: [
              ['aws-l2-1', 'Usuários e Grupos'],
              ['aws-l2-2', 'Políticas e Roles'],
            ],
          },
          {
            id: 'aws-mod-3',
            title: 'S3',
            order: 3,
            lessons: [
              ['aws-l3-1', 'Buckets e Objects'],
              ['aws-l3-2', 'Permissões e URLs'],
            ],
          },
          {
            id: 'aws-mod-4',
            title: 'Lambda & API Gateway',
            order: 4,
            lessons: [
              ['aws-l4-1', 'Funções Lambda'],
              ['aws-l4-2', 'API Gateway'],
            ],
          },
        ],
      },
    ],
  },
];

type SeedExercise = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

const lessonExercises: Record<string, SeedExercise[]> = {
  'expo-l1-1': [
    {
      question: 'O que é Expo no ecossistema React Native?',
      options: ['Um framework e conjunto de ferramentas para apps mobile', 'Um banco SQL embarcado', 'Uma linguagem de programação', 'Um provedor de DNS'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual app ajuda a testar um projeto Expo rapidamente no celular?',
      options: ['Expo Go', 'Android Studio Profiler', 'Prisma Studio', 'AWS Console'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Uma vantagem do Expo é:',
      options: ['Evitar JavaScript', 'Acelerar configuração, build e testes', 'Substituir o React', 'Rodar somente em iOS'],
      correctAnswerIndex: 1,
    },
  ],
  'expo-l1-2': [
    {
      question: 'Qual comando cria um novo projeto Expo?',
      options: ['npx create-expo-app', 'npm create native', 'expo make project', 'react-native init-expo'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual comando inicia o servidor de desenvolvimento?',
      options: ['npx expo start', 'expo deploy', 'npm run prisma', 'node app.json'],
      correctAnswerIndex: 0,
    },
    {
      question: 'O QR Code exibido pelo Expo serve para:',
      options: ['Publicar na loja automaticamente', 'Abrir o app no Expo Go ou em um build de desenvolvimento', 'Criar um banco local', 'Gerar certificados SSL'],
      correctAnswerIndex: 1,
    },
  ],
  'expo-l1-3': [
    {
      question: 'No Expo Router, a pasta app geralmente contém:',
      options: ['Rotas e layouts da aplicação', 'Somente imagens', 'Configurações do Prisma', 'Scripts de Docker'],
      correctAnswerIndex: 0,
    },
    {
      question: 'A pasta assets costuma guardar:',
      options: ['Imagens, ícones e fontes', 'Controllers NestJS', 'Migrações SQL', 'Tokens JWT'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um arquivo _layout.tsx é usado para:',
      options: ['Definir estrutura de navegação compartilhada', 'Compactar imagens', 'Criar tabelas no banco', 'Substituir package.json'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l2-1': [
    {
      question: 'O componente View é usado principalmente para:',
      options: ['Agrupar e posicionar elementos', 'Executar queries SQL', 'Enviar push notification', 'Criar rotas HTTP'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Texto visível em React Native deve ficar dentro de:',
      options: ['Text', 'View', 'Image', 'Stack'],
      correctAnswerIndex: 0,
    },
    {
      question: 'A prop style aceita:',
      options: ['Objetos ou arrays de estilo', 'Arquivos CSS obrigatórios', 'Apenas strings', 'Somente classes Bootstrap'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l2-2': [
    {
      question: 'Para renderizar uma imagem local, usamos Image com:',
      options: ['source={require(...)}', 'href="./foto.png"', 'file="foto.png"', 'assetId="foto.png"'],
      correctAnswerIndex: 0,
    },
    {
      question: 'ScrollView é indicado quando:',
      options: ['O conteúdo pode ultrapassar a altura da tela', 'Precisamos criptografar dados', 'Queremos compilar TypeScript', 'Vamos criar um endpoint'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para listas muito grandes, geralmente é melhor usar:',
      options: ['FlatList', 'Text', 'ImageBackground', 'SafeAreaProvider'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l2-3': [
    {
      question: 'Pressable permite:',
      options: ['Responder a toque e estados de pressão', 'Criar tabelas SQL', 'Converter JSON em imagem', 'Publicar builds'],
      correctAnswerIndex: 0,
    },
    {
      question: 'A função chamada ao tocar em um Pressable fica em:',
      options: ['onPress', 'onQuery', 'onBuild', 'onRoute'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um bom botão mobile deve ter:',
      options: ['Área de toque clara e feedback visual', 'Texto microscópico', 'Sem estado desabilitado', 'Apenas cor invisível'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l3-1': [
    {
      question: 'No Expo Router, um arquivo app/profile.tsx normalmente vira:',
      options: ['A rota /profile', 'Um componente privado sem rota', 'Uma migration', 'Um arquivo de ambiente'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Tabs e Stack são configurados com frequência em:',
      options: ['Arquivos _layout.tsx', 'README.md', 'assets/icon.png', 'tsconfig.build.json'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Grupos de rota entre parênteses, como (tabs), servem para:',
      options: ['Organizar rotas sem entrar no caminho da URL', 'Criar variáveis globais', 'Minificar imagens', 'Bloquear o TypeScript'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l3-2': [
    {
      question: 'Uma rota dinâmica usa qual formato de arquivo?',
      options: ['[id].tsx', '{id}.tsx', 'id.dynamic.tsx', ':id.tsx'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para ler parâmetros no Expo Router, usamos:',
      options: ['useLocalSearchParams', 'useDatabaseParams', 'useDockerArgs', 'useAuthHeaders'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para navegar por código, uma opção comum é:',
      options: ['router.push("/course/1")', 'axios.navigate("/course/1")', 'style.push("/course/1")', 'prisma.route("/course/1")'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l4-1': [
    {
      question: 'Fetch e Axios são usados para:',
      options: ['Fazer requisições HTTP', 'Criar ícones', 'Controlar brilho da tela', 'Substituir JSX'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Uma vantagem prática do Axios é:',
      options: ['Interceptors para requests e responses', 'Dispensar servidor', 'Criar componentes nativos', 'Rodar sem internet sempre'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um token Bearer normalmente vai em qual header?',
      options: ['Authorization', 'Content-Length', 'Accept-Language', 'User-Agent'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l4-2': [
    {
      question: 'Armazenamento local é útil para:',
      options: ['Guardar tokens, preferências e pequenos estados', 'Hospedar APIs públicas', 'Treinar modelos grandes', 'Trocar o sistema operacional'],
      correctAnswerIndex: 0,
    },
    {
      question: 'MMKV é conhecido por:',
      options: ['Armazenamento chave-valor rápido', 'Renderizar mapas 3D', 'Gerenciar containers', 'Enviar emails'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Dados sensíveis devem ser tratados com:',
      options: ['Cuidado, expiração e estratégia de segurança', 'Prints no console', 'Texto puro público', 'Nomes fáceis de adivinhar'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l1-1': [
    {
      question: 'Cloud computing é:',
      options: ['Entrega de recursos de computação pela internet', 'Um tipo de cabo de rede', 'Um editor de código', 'Um padrão de CSS'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um benefício comum da nuvem é:',
      options: ['Escalar recursos sob demanda', 'Comprar servidores antes de testar', 'Eliminar backups', 'Impedir automação'],
      correctAnswerIndex: 0,
    },
    {
      question: 'AWS significa:',
      options: ['Amazon Web Services', 'Advanced Web Syntax', 'Automated Window Server', 'Applied Web Security'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l1-2': [
    {
      question: 'EC2 se encaixa principalmente em qual modelo?',
      options: ['IaaS', 'SaaS', 'DaaS', 'BaaS'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um exemplo de SaaS é:',
      options: ['Gmail', 'Uma instância EC2 vazia', 'Um volume EBS sem sistema', 'Uma VPC isolada'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Em PaaS, o provedor geralmente gerencia:',
      options: ['Mais infraestrutura para você focar na aplicação', 'Seu código de negócio inteiro', 'A senha dos usuários finais', 'Todos os testes de produto'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l1-3': [
    {
      question: 'Uma Região AWS é:',
      options: ['Uma área geográfica com data centers', 'Um único rack', 'Um plano de suporte', 'Uma credencial IAM'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Availability Zones são projetadas para:',
      options: ['Isolamento e alta disponibilidade dentro de uma região', 'Cobrança por cartão', 'Criar usuários', 'Editar código Lambda'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Escolher uma região próxima dos usuários pode melhorar:',
      options: ['Latência', 'Tamanho do logo', 'Nome do bucket', 'Sintaxe do JavaScript'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l2-1': [
    {
      question: 'IAM significa:',
      options: ['Identity and Access Management', 'Internal App Monitor', 'Internet Asset Manager', 'Instance Auto Mode'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Grupos IAM ajudam a:',
      options: ['Aplicar permissões a vários usuários', 'Guardar arquivos S3', 'Criar zonas DNS', 'Hospedar bancos relacionais'],
      correctAnswerIndex: 0,
    },
    {
      question: 'A boa prática para contas humanas é:',
      options: ['Permissões mínimas necessárias', 'Acesso admin para todos', 'Compartilhar senhas', 'Desativar MFA'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l2-2': [
    {
      question: 'Uma policy IAM define:',
      options: ['Permissões permitidas ou negadas', 'Preço de instâncias', 'Local do data center', 'Tema do console'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Roles são úteis para:',
      options: ['Delegar acesso temporário a serviços ou usuários', 'Criar imagens PNG', 'Alterar fuso horário', 'Comprar domínios'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Policies IAM normalmente são escritas em:',
      options: ['JSON', 'Markdown', 'CSV', 'CSS'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l3-1': [
    {
      question: 'Amazon S3 é um serviço de:',
      options: ['Armazenamento de objetos', 'Máquinas virtuais', 'Fila de mensagens apenas', 'Autenticação social'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um bucket S3 contém:',
      options: ['Objetos e suas chaves', 'Usuários IAM diretamente', 'Regiões AWS', 'Funções Lambda em execução'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Nomes de buckets S3 precisam ser:',
      options: ['Globalmente únicos', 'Sempre iguais ao email', 'Com espaços obrigatórios', 'Limitados a três letras'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l3-2': [
    {
      question: 'Uma URL pré-assinada permite:',
      options: ['Acesso temporário a um objeto privado', 'Criar uma conta root', 'Desligar a região', 'Ignorar criptografia sempre'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Bucket Policy é usada para:',
      options: ['Controlar acesso a recursos do bucket', 'Compilar TypeScript', 'Criar usuários locais', 'Renderizar imagens'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para dados acessados raramente, uma classe possível é:',
      options: ['S3 Standard-IA', 'S3 Always Hot', 'S3 React Native', 'S3 Console Only'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l4-1': [
    {
      question: 'AWS Lambda executa código:',
      options: ['Sob demanda, sem gerenciar servidores', 'Apenas em notebooks locais', 'Somente uma vez por mês', 'Dentro de buckets S3'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Um evento que pode acionar Lambda é:',
      options: ['Uma requisição via API Gateway', 'Uma mudança de cor no CSS', 'Um commit local sem push', 'A abertura do editor'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Lambda cobra principalmente por:',
      options: ['Execuções e duração/recursos usados', 'Número de arquivos no projeto local', 'Quantidade de comentários no código', 'Tamanho da tela'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l4-2': [
    {
      question: 'API Gateway serve para:',
      options: ['Criar, publicar e gerenciar APIs', 'Armazenar objetos', 'Editar imagens', 'Criar usuários no celular'],
      correctAnswerIndex: 0,
    },
    {
      question: 'API Gateway com Lambda costuma formar uma arquitetura:',
      options: ['Serverless', 'Monolítica desktop', 'Sem HTTP', 'Somente offline'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para criar um recurso via REST, o método comum é:',
      options: ['POST', 'GET', 'HEAD', 'OPTIONS apenas'],
      correctAnswerIndex: 0,
    },
  ],
};

const extraLessonExercises: Record<string, SeedExercise[]> = {
  'expo-l1-1': [
    {
      question: 'Quando vale a pena escolher Expo em um app React Native novo?',
      options: ['Quando você quer começar rápido com ferramentas prontas', 'Quando você quer remover o React', 'Quando o app não terá interface', 'Quando só existe backend'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual parte do Expo facilita acessar câmera, notificações e sensores?',
      options: ['As APIs e SDKs mantidos pelo Expo', 'O arquivo README', 'O cache do npm', 'A pasta dist'],
      correctAnswerIndex: 0,
    },
    {
      question: 'O que diferencia Expo Go de um build final publicado?',
      options: ['Expo Go é para testar projetos durante o desenvolvimento', 'Expo Go substitui a loja de apps', 'Expo Go só roda backend NestJS', 'Expo Go compila Prisma'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l1-2': [
    {
      question: 'Depois de criar o projeto, qual arquivo costuma guardar nome, ícones e splash?',
      options: ['app.json', 'schema.prisma', 'Dockerfile', 'README.lock'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual opção do Expo abre o app no navegador durante desenvolvimento web?',
      options: ['Pressionar w no terminal do Expo', 'Rodar prisma migrate', 'Editar package-lock manualmente', 'Apagar node_modules sempre'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para instalar uma biblioteca compatível com Expo, é comum usar:',
      options: ['npx expo install pacote', 'expo sql pacote', 'npm delete pacote', 'node package.json pacote'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l1-3': [
    {
      question: 'Por que separar src/modules por domínio ajuda o projeto?',
      options: ['Mantém telas, hooks e serviços próximos do mesmo assunto', 'Duplica todo componente', 'Impede testes', 'Remove tipagem'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual pasta normalmente concentra componentes reutilizáveis da aplicação?',
      options: ['src/shared/components', 'node_modules/.bin', 'prisma/migrations', 'android/gradle/cache'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Arquivos entre colchetes, como [id].tsx, indicam:',
      options: ['Um segmento dinâmico de rota', 'Um arquivo proibido', 'Um componente sem props', 'Um asset remoto'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l2-1': [
    {
      question: 'Qual componente deve envolver qualquer texto literal mostrado na tela?',
      options: ['Text', 'View', 'Pressable sem filho', 'SafeAreaProvider'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para alinhar filhos em linha no React Native, usamos:',
      options: ['flexDirection: "row"', 'display: "table"', 'float: "left"', 'gridTemplateAreas'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual estilo deixa um bloco com espaçamento interno?',
      options: ['padding', 'marginRoute', 'fontSource', 'screenName'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l2-2': [
    {
      question: 'Qual propriedade ajuda a controlar como a imagem preenche seu espaço?',
      options: ['resizeMode', 'queryKey', 'routeName', 'jwtSecret'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Por que não usar ScrollView para milhares de itens?',
      options: ['Porque ela renderiza muito conteúdo de uma vez', 'Porque não aceita texto', 'Porque só funciona offline', 'Porque remove imagens'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Para uma lista vertical performática de dados, a escolha natural é:',
      options: ['FlatList', 'TextInput', 'StatusBar', 'Image'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l2-3': [
    {
      question: 'Qual recurso do Pressable permite mudar estilo ao pressionar?',
      options: ['Receber pressed na função de style', 'Editar app.json sozinho', 'Usar schema.prisma', 'Trocar o bundle por SQL'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Quando um botão está indisponível, qual prop comunica isso?',
      options: ['disabled', 'blockedByDocker', 'unroute', 'silent'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual cuidado melhora acessibilidade em elementos tocáveis?',
      options: ['Área de toque confortável e rótulo claro', 'Texto sem contraste', 'Botão de 4 pixels', 'Remover feedback visual'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l3-1': [
    {
      question: 'Qual benefício do roteamento por arquivos aparece em projetos maiores?',
      options: ['A estrutura de pastas revela a navegação', 'Todas as telas viram uma só', 'O banco é criado automaticamente', 'Não existe mais estado'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Em uma tela com tabs, onde normalmente configuramos as abas?',
      options: ['No _layout.tsx do grupo de tabs', 'No seed do Prisma', 'No favicon', 'No arquivo .env.example'],
      correctAnswerIndex: 0,
    },
    {
      question: 'O componente Redirect do Expo Router é usado para:',
      options: ['Enviar o usuário para outra rota', 'Converter imagem em SVG', 'Criar senha hash', 'Executar migrations'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l3-2': [
    {
      question: 'Em /course/[id], qual valor costuma identificar o curso aberto?',
      options: ['id', 'password', 'borderRadius', 'packageName'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual método substitui a rota atual sem deixar a anterior no histórico?',
      options: ['router.replace', 'router.paint', 'axios.replaceScreen', 'prisma.push'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Quando usar router.back?',
      options: ['Para voltar para a tela anterior no histórico', 'Para apagar o usuário do banco', 'Para reiniciar o servidor', 'Para baixar dependências'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l4-1': [
    {
      question: 'O que um interceptor de request pode fazer antes da chamada HTTP?',
      options: ['Adicionar o token Authorization', 'Alterar o ícone do app', 'Criar uma tabela', 'Renderizar uma lista'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Por que tratar erro 401 no cliente é importante?',
      options: ['Permite tentar renovar token ou deslogar com segurança', 'Aumenta o brilho da tela', 'Cria um curso novo', 'Remove a necessidade de senha'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual formato de dados é mais comum em APIs REST modernas?',
      options: ['JSON', 'PSD', 'MP3', 'ZIP obrigatório'],
      correctAnswerIndex: 0,
    },
  ],
  'expo-l4-2': [
    {
      question: 'Qual dado não deve ficar salvo sem critério no dispositivo?',
      options: ['Token sensível de autenticação', 'Tema claro ou escuro', 'Última tela aberta', 'Idioma escolhido'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Quando o usuário faz logout, o app deve:',
      options: ['Remover tokens e dados locais de sessão', 'Manter o token para sempre', 'Publicar o app', 'Criar outro curso'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual padrão ajuda a trocar mock por API sem mudar as telas?',
      options: ['Repository', 'Singleton de CSS global obrigatório', 'Bucket público', 'Arquivo binário manual'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l1-1': [
    {
      question: 'Qual característica da nuvem reduz compra antecipada de hardware?',
      options: ['Pagamento conforme uso', 'Servidor físico obrigatório', 'Escala fixa anual', 'Backup manual em pendrive'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Elasticidade em cloud significa:',
      options: ['Aumentar ou reduzir recursos conforme demanda', 'Trocar senha a cada minuto', 'Usar apenas uma região', 'Desligar monitoramento'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual responsabilidade costuma ficar com o provedor de nuvem?',
      options: ['Infraestrutura física dos data centers', 'Escrever todo código do cliente', 'Escolher regra de negócio', 'Responder exercícios do usuário'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l1-2': [
    {
      question: 'No modelo IaaS, o cliente gerencia mais diretamente:',
      options: ['Sistema operacional e configuração da instância', 'Toda a energia elétrica do data center', 'O prédio da região', 'O hardware físico'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Em SaaS, o usuário normalmente consome:',
      options: ['Uma aplicação pronta via navegador ou app', 'Um rack vazio', 'Um kernel sem interface', 'Um cabo dedicado'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual alternativa combina melhor com PaaS?',
      options: ['Plataforma gerenciada para publicar aplicações', 'Compra de servidores físicos', 'Planilha local sem internet', 'Controle manual de refrigeração'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l1-3': [
    {
      question: 'Por que usar múltiplas Availability Zones?',
      options: ['Aumentar resiliência contra falhas locais', 'Duplicar senhas', 'Evitar logs', 'Remover balanceadores'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual fator pesa na escolha de uma região AWS?',
      options: ['Proximidade, custo e requisitos legais', 'Cor do console', 'Nome do arquivo package.json', 'Quantidade de comentários'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Serviços regionais ficam associados a:',
      options: ['Uma região específica', 'Um único botão do console', 'Uma fonte do app', 'Um componente Text'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l2-1': [
    {
      question: 'Por que evitar usar a conta root no dia a dia?',
      options: ['Ela tem permissões amplas demais para tarefas comuns', 'Ela não acessa AWS', 'Ela só abre S3', 'Ela impede MFA'],
      correctAnswerIndex: 0,
    },
    {
      question: 'MFA no IAM adiciona:',
      options: ['Uma segunda etapa de verificação', 'Mais memória EC2', 'Um bucket automático', 'Uma rota do Expo'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Permissões por grupo são úteis porque:',
      options: ['Facilitam manter políticas consistentes para equipes', 'Criam instâncias automaticamente', 'Desativam auditoria', 'Substituem senhas fortes'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l2-2': [
    {
      question: 'O princípio de menor privilégio recomenda:',
      options: ['Dar apenas as permissões necessárias', 'Permitir tudo por padrão', 'Remover logs', 'Usar senha compartilhada'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Uma role anexada a uma função Lambda pode permitir:',
      options: ['Ler um objeto específico no S3', 'Alterar a tela do usuário', 'Instalar Expo Go', 'Editar package-lock'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Em uma policy, Action descreve:',
      options: ['Quais operações são permitidas ou negadas', 'O preço mensal', 'O idioma do console', 'O tamanho da tela'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l3-1': [
    {
      question: 'No S3, a chave de um objeto representa:',
      options: ['O caminho/nome usado para localizar o arquivo', 'A senha da conta root', 'A região inteira', 'Um tipo de instância'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Versionamento de bucket ajuda a:',
      options: ['Preservar versões anteriores de objetos', 'Reduzir o nome do arquivo', 'Criar usuários IAM', 'Executar código serverless'],
      correctAnswerIndex: 0,
    },
    {
      question: 'S3 é muito usado para armazenar:',
      options: ['Imagens, backups, logs e arquivos estáticos', 'Somente CPUs', 'Rotas de frontend', 'Senhas em texto puro'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l3-2': [
    {
      question: 'Bloquear acesso público no S3 ajuda a:',
      options: ['Evitar exposição acidental de dados', 'Aumentar tamanho do bucket', 'Compilar Lambda', 'Criar zonas de disponibilidade'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual uso combina com URL pré-assinada de upload?',
      options: ['Permitir envio temporário sem abrir o bucket inteiro', 'Dar admin permanente a todos', 'Excluir logs da conta', 'Criar uma VPC'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Criptografia no S3 protege:',
      options: ['Dados armazenados nos objetos', 'A cor do console', 'O nome do curso', 'O QR Code do Expo'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l4-1': [
    {
      question: 'Qual limite é importante considerar em funções Lambda?',
      options: ['Tempo máximo de execução', 'Número de tabs do app', 'Tamanho do avatar', 'Quantidade de módulos Expo'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Cold start em Lambda se refere a:',
      options: ['Tempo extra para iniciar um ambiente de execução', 'Erro de senha', 'Bucket sem policy', 'Região sem internet'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Variáveis de ambiente no Lambda servem para:',
      options: ['Configurar valores sem hardcode no código', 'Renderizar componentes nativos', 'Trocar o nome da rota', 'Criar um celular virtual'],
      correctAnswerIndex: 0,
    },
  ],
  'aws-l4-2': [
    {
      question: 'Qual recurso do API Gateway ajuda a controlar acesso?',
      options: ['Authorizers', 'Image resize mode', 'Pressable state', 'Package lock'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Em APIs REST, status 201 normalmente indica:',
      options: ['Recurso criado com sucesso', 'Senha inválida sempre', 'Servidor desligado', 'Arquivo inexistente no app'],
      correctAnswerIndex: 0,
    },
    {
      question: 'Qual preocupação é comum ao expor uma API pública?',
      options: ['Autenticação, limites de taxa e validação de entrada', 'Trocar fonte do botão', 'Aumentar splash icon', 'Remover todos os logs'],
      correctAnswerIndex: 0,
    },
  ],
};

const fallbackExercises: SeedExercise[] = [
  {
    question: 'Qual alternativa melhor descreve esta lição?',
    options: ['Conceito central do tema', 'Configuração de banco', 'Deploy automático', 'Controle financeiro'],
    correctAnswerIndex: 0,
  },
  {
    question: 'Qual prática ajuda a evoluir no curso?',
    options: ['Pular todas as lições', 'Completar exercícios em ordem', 'Apagar o progresso', 'Ignorar feedback'],
    correctAnswerIndex: 1,
  },
  {
    question: 'O que libera o próximo conteúdo?',
    options: ['Tema escuro', 'Conclusão da lição anterior', 'Nome do usuário', 'Tamanho da tela'],
    correctAnswerIndex: 1,
  },
];

function getExercisesForLesson(lessonId: string) {
  return [...(lessonExercises[lessonId] ?? fallbackExercises), ...(extraLessonExercises[lessonId] ?? [])];
}

function assertUniqueQuestions() {
  const seen = new Map<string, string>();
  const lessonIds = courses.flatMap((course) =>
    course.tracks.flatMap((track) =>
      track.modules.flatMap((module) => module.lessons.map(([lessonId]) => lessonId)),
    ),
  );

  for (const lessonId of lessonIds) {
    const exercises = getExercisesForLesson(lessonId);
    if (exercises.length < 6) {
      throw new Error(`A lição ${lessonId} precisa ter pelo menos 6 perguntas.`);
    }

    for (const exercise of exercises) {
      const normalizedQuestion = exercise.question.trim().toLowerCase();
      const previousLessonId = seen.get(normalizedQuestion);
      if (previousLessonId) {
        throw new Error(
          `Pergunta repetida em ${previousLessonId} e ${lessonId}: "${exercise.question}"`,
        );
      }
      seen.set(normalizedQuestion, lessonId);
    }
  }
}

async function main() {
  assertUniqueQuestions();
  await prisma.$connect();

  const passwordHash = await bcrypt.hash('Password123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@duolingo.local' },
    update: {},
    create: {
      name: 'Usuario Demo',
      email: 'demo@duolingo.local',
      password: passwordHash,
      role: Role.USER,
    },
  });

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { id: courseData.id },
      update: {
        title: courseData.title,
        description: courseData.description,
      },
      create: {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
      },
    });

    for (const trackData of courseData.tracks) {
      const track = await prisma.track.upsert({
        where: { id: trackData.id },
        update: {
          title: trackData.title,
        },
        create: {
          id: trackData.id,
          courseId: course.id,
          title: trackData.title,
        },
      });

      for (const moduleData of trackData.modules) {
        const module = await prisma.module.upsert({
          where: { id: moduleData.id },
          update: {
            title: moduleData.title,
            order: moduleData.order,
          },
          create: {
            id: moduleData.id,
            trackId: track.id,
            title: moduleData.title,
            order: moduleData.order,
          },
        });

        for (const [index, lessonData] of moduleData.lessons.entries()) {
          const [lessonId, title] = lessonData;
          const lesson = await prisma.lesson.upsert({
            where: { id: lessonId },
            update: {
              title,
              order: index + 1,
              content: `Microlição sobre ${title}.`,
            },
            create: {
              id: lessonId,
              moduleId: module.id,
              title,
              content: `Microlição sobre ${title}.`,
              order: index + 1,
            },
          });

          const exercises = getExercisesForLesson(lesson.id);
          const exerciseIds: string[] = [];

          for (const [exerciseIndex, template] of exercises.entries()) {
            const exerciseId = `${lesson.id}-ex-${exerciseIndex + 1}`;
            exerciseIds.push(exerciseId);
            await prisma.exercise.upsert({
              where: { id: exerciseId },
              update: {
                question: template.question,
                options: template.options,
                correctAnswerIndex: template.correctAnswerIndex,
                order: exerciseIndex + 1,
              },
              create: {
                id: exerciseId,
                lessonId: lesson.id,
                question: template.question,
                options: template.options,
                correctAnswerIndex: template.correctAnswerIndex,
                order: exerciseIndex + 1,
              },
            });
          }

          await prisma.exercise.deleteMany({
            where: {
              lessonId: lesson.id,
              id: { notIn: exerciseIds },
            },
          });
        }
      }

      await prisma.courseProgress.upsert({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        update: { currentTrackId: track.id },
        create: {
          userId: user.id,
          courseId: course.id,
          currentTrackId: track.id,
        },
      });

      await prisma.userTrack.upsert({
        where: { userId_trackId: { userId: user.id, trackId: track.id } },
        update: {},
        create: {
          userId: user.id,
          trackId: track.id,
        },
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seed concluído com sucesso.');
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
