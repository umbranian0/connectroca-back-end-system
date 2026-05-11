import type { Core } from '@strapi/strapi';

const API_COLLECTIONS = [
  'profile',
  'area',
  'group',
  'group-member',
  'user-area',
  'material',
  'topic',
  'post',
  'comment',
  'like',
] as const;

const PUBLIC_READ_COLLECTIONS = ['area', 'group', 'material', 'topic', 'post', 'comment', 'like'] as const;

const buildActionList = (
  collections: readonly string[],
  actions: Array<'find' | 'findOne' | 'create' | 'update' | 'delete'>,
) =>
  collections.flatMap((collectionName) =>
    actions.map((actionName) => `api::${collectionName}.${collectionName}.${actionName}`),
  );

const PUBLIC_PLUGIN_ACTIONS = [
  'plugin::users-permissions.auth.callback',
  'plugin::users-permissions.auth.connect',
  'plugin::users-permissions.auth.register',
  'plugin::users-permissions.auth.forgotPassword',
  'plugin::users-permissions.auth.resetPassword',
  'plugin::users-permissions.auth.emailConfirmation',
  'plugin::users-permissions.auth.sendEmailConfirmation',
  'plugin::users-permissions.auth.refresh',
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
  'plugin::upload.read',
];

const PUBLIC_ROLE_ACTIONS = [
  ...buildActionList(PUBLIC_READ_COLLECTIONS, ['find', 'findOne']),
  ...PUBLIC_PLUGIN_ACTIONS,
];

const AUTHENTICATED_ROLE_ACTIONS = [
  ...buildActionList(API_COLLECTIONS, ['find', 'findOne', 'create', 'update', 'delete']),
  ...PUBLIC_PLUGIN_ACTIONS,
  'plugin::users-permissions.user.me',
  'plugin::users-permissions.auth.logout',
  'plugin::users-permissions.auth.changePassword',
];

type RoleType = 'public' | 'authenticated';

type DemoUserInput = {
  key: string;
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

const DEMO_USERS: DemoUserInput[] = [
  {
    key: 'maria_silva',
    username: 'maria_silva',
    email: 'maria.silva@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Maria',
    lastname: 'Silva',
  },
  {
    key: 'ricardo_santos',
    username: 'ricardo_santos',
    email: 'ricardo.santos@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Ricardo',
    lastname: 'Santos',
  },
  {
    key: 'mariana_oliveira',
    username: 'mariana_oliveira',
    email: 'mariana.oliveira@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Mariana',
    lastname: 'Oliveira',
  },
  {
    key: 'pedro_costa',
    username: 'pedro_costa',
    email: 'pedro.costa@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Pedro',
    lastname: 'Costa',
  },
  {
    key: 'ana_pereira',
    username: 'ana_pereira',
    email: 'ana.pereira@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Ana',
    lastname: 'Pereira',
  },
  {
    key: 'carlos_mendes',
    username: 'carlos_mendes',
    email: 'carlos.mendes@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Carlos',
    lastname: 'Mendes',
  },
  {
    key: 'luis_magalhos',
    username: 'luis_magalhos',
    email: 'luis.magalhos@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Luis',
    lastname: 'Magalhos',
  },
  {
    key: 'rafael_dias',
    username: 'rafael_dias',
    email: 'rafael.dias@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Rafael',
    lastname: 'Dias',
  },
  {
    key: 'breno_alves',
    username: 'breno_alves',
    email: 'breno.alves@conectra.local',
    password: 'DemoPass123!',
    firstname: 'Breno',
    lastname: 'Alves',
  },
  {
    key: 'integration_user',
    username: 'integration_user',
    email: 'integration.user@example.com',
    password: 'Integration123!',
    firstname: 'Integration',
    lastname: 'User',
  },
];

const AREA_SEED = [
  { name: 'Informática', description: 'Conteúdos de programação e software', color: '#F27D16', icon: '??' },
  { name: 'Matemática', description: 'Estudo de cálculo e fundamentos matemáticos', color: '#F6B20F', icon: '?' },
  { name: 'Gestão', description: 'Organização, gestão e trabalho em equipa', color: '#18B5A3', icon: '??' },
  { name: 'Design', description: 'UX/UI, criatividade e design visual', color: '#D65AD1', icon: '??' },
  {
    name: 'Interdisciplinar',
    description: 'Projetos que cruzam múltiplas áreas do conhecimento',
    color: '#7B6EF6',
    icon: '??',
  },
  { name: 'História', description: 'Temas de história e cultura geral', color: '#9B7F53', icon: '??' },
  { name: 'Química', description: 'Fundamentos e aplicações de química', color: '#65C688', icon: '??' },
  { name: 'Geografia', description: 'Geografia física e humana', color: '#4BA7D8', icon: '??' },
];

const GROUP_SEED = [
  {
    name: 'Algoritmos e Estruturas',
    description: 'Grupo focado em resolver exercícios e partilhar conhecimento',
    memberLimit: 30,
    location: 'Sala B204',
    schedule: 'Amanhã às 15:00',
    status: 'open',
    areaName: 'Informática',
    creatorKey: 'ricardo_santos',
  },
  {
    name: 'Cálculo II - Exames',
    description: 'Resolução de exercícios para o exame final',
    memberLimit: 25,
    location: 'Biblioteca',
    schedule: 'Sexta às 14:00',
    status: 'open',
    areaName: 'Matemática',
    creatorKey: 'mariana_oliveira',
  },
  {
    name: 'IA - Na Saúde',
    description: 'Projeto interdisciplinar de IA e saúde',
    memberLimit: 15,
    location: 'Online - Teams',
    schedule: 'Segunda às 16:30',
    status: 'open',
    areaName: 'Interdisciplinar',
    creatorKey: 'pedro_costa',
  },
  {
    name: 'Projetos Interdisciplinares',
    description: 'Espaço para colaboração em projetos entre cursos',
    memberLimit: 40,
    location: 'Laboratório A1',
    schedule: 'Quarta às 18:00',
    status: 'open',
    areaName: 'Gestão',
    creatorKey: 'carlos_mendes',
  },
];

const GROUP_MEMBERSHIP_SEED = [
  { groupName: 'Algoritmos e Estruturas', userKey: 'ricardo_santos', role: 'admin' },
  { groupName: 'Algoritmos e Estruturas', userKey: 'maria_silva', role: 'member' },
  { groupName: 'Algoritmos e Estruturas', userKey: 'carlos_mendes', role: 'member' },
  { groupName: 'Algoritmos e Estruturas', userKey: 'rafael_dias', role: 'member' },
  { groupName: 'Cálculo II - Exames', userKey: 'mariana_oliveira', role: 'admin' },
  { groupName: 'Cálculo II - Exames', userKey: 'maria_silva', role: 'member' },
  { groupName: 'Cálculo II - Exames', userKey: 'breno_alves', role: 'member' },
  { groupName: 'IA - Na Saúde', userKey: 'pedro_costa', role: 'admin' },
  { groupName: 'IA - Na Saúde', userKey: 'ana_pereira', role: 'member' },
  { groupName: 'IA - Na Saúde', userKey: 'carlos_mendes', role: 'member' },
  { groupName: 'IA - Na Saúde', userKey: 'maria_silva', role: 'member' },
  { groupName: 'Projetos Interdisciplinares', userKey: 'carlos_mendes', role: 'admin' },
  { groupName: 'Projetos Interdisciplinares', userKey: 'pedro_costa', role: 'member' },
  { groupName: 'Projetos Interdisciplinares', userKey: 'ana_pereira', role: 'member' },
];

const USER_AREA_SEED = [
  { userKey: 'maria_silva', areaName: 'Informática', interest: 'Machine Learning' },
  { userKey: 'maria_silva', areaName: 'História', interest: 'Leitura crítica' },
  { userKey: 'maria_silva', areaName: 'Geografia', interest: 'Estudos sociais' },
  { userKey: 'ricardo_santos', areaName: 'Informática', interest: 'Estruturas de Dados' },
  { userKey: 'mariana_oliveira', areaName: 'Matemática', interest: 'Cálculo avançado' },
  { userKey: 'ana_pereira', areaName: 'Design', interest: 'UX/UI' },
  { userKey: 'pedro_costa', areaName: 'Interdisciplinar', interest: 'Projetos colaborativos' },
];

const PROFILE_SEED = [
  {
    userKey: 'maria_silva',
    displayName: 'Maria Silva',
    course: 'Eng. Informática - 2º Ano',
    year: 2,
    bio: 'Estudante focada em machine learning e colaboração em comunidade.',
    level: 5,
    points: 240,
    registrationDate: '2026-01-15',
    interests: ['Geografia', 'Programação', 'Química', 'História'],
    badges: [
      { title: 'Primeiro Post', subtitle: 'Criou Tópico' },
      { title: 'Partilha Ativa', subtitle: '10 materiais' },
      { title: 'Colaborador', subtitle: '5 grupos' },
      { title: 'Estrela', subtitle: '50 likes' },
      { title: 'Expert', subtitle: 'Nível 5' },
      { title: 'Mentor', subtitle: '20 ajudas' },
    ],
  },
  {
    userKey: 'ricardo_santos',
    displayName: 'Ricardo Santos',
    course: 'Eng. Informática',
    year: 3,
    bio: 'Interesse em algoritmos, dados e mentoring técnico.',
    level: 4,
    points: 186,
    registrationDate: '2025-12-02',
    interests: ['Informática', 'Matemática'],
  },
  {
    userKey: 'mariana_oliveira',
    displayName: 'Mariana Oliveira',
    course: 'Matemática',
    year: 3,
    bio: 'Focada em cálculo e preparação para exames finais.',
    level: 4,
    points: 172,
    registrationDate: '2025-11-22',
    interests: ['Matemática'],
  },
  {
    userKey: 'pedro_costa',
    displayName: 'Pedro Costa',
    course: 'Interdisciplinar',
    year: 2,
    bio: 'Coordenador de projetos interdisciplinares e inovação.',
    level: 4,
    points: 165,
    registrationDate: '2026-01-03',
    interests: ['Interdisciplinar', 'Gestão'],
  },
  {
    userKey: 'ana_pereira',
    displayName: 'Ana Pereira',
    course: 'Design',
    year: 2,
    bio: 'Apaixonada por UX/UI e colaboração em equipas multidisciplinares.',
    level: 3,
    points: 120,
    registrationDate: '2026-01-25',
    interests: ['Design'],
  },
];

const TOPIC_SEED = [
  {
    title: 'Machine Learning em Python',
    description:
      'Projeto de classificação de imagens usando scikit-learn e TensorFlow. Procuro recomendações de fluxo de trabalho e validação.',
    creationDate: '2026-04-21T10:00:00.000Z',
    creatorKey: 'ricardo_santos',
    areaName: 'Informática',
    groupName: 'Algoritmos e Estruturas',
    views: 892,
    isPinned: true,
  },
  {
    title: 'Derivadas Parciais - Cálculo II',
    description: 'Explicação com exemplos práticos sobre derivadas parciais e aplicação em problemas de engenharia.',
    creationDate: '2026-04-22T14:30:00.000Z',
    creatorKey: 'mariana_oliveira',
    areaName: 'Matemática',
    groupName: 'Cálculo II - Exames',
    views: 567,
    isPinned: true,
  },
  {
    title: 'Aplicação de Gestão com IA',
    description: 'Procuro colaboradores de diferentes cursos para um projeto de gestão suportado por IA.',
    creationDate: '2026-04-23T09:10:00.000Z',
    creatorKey: 'pedro_costa',
    areaName: 'Gestão',
    groupName: 'Projetos Interdisciplinares',
    views: 1234,
    isPinned: false,
  },
  {
    title: 'Recursos UX/UI Design',
    description: 'Partilha de referências gratuitas para prototipagem e design de interfaces.',
    creationDate: '2026-04-23T17:55:00.000Z',
    creatorKey: 'ana_pereira',
    areaName: 'Design',
    groupName: 'IA - Na Saúde',
    views: 445,
    isPinned: false,
  },
  {
    title: 'Dúvidas sobre IA',
    description: 'Quais são os passos essenciais entre preparação de dados, escolha do modelo e avaliação?',
    creationDate: '2026-04-24T08:20:00.000Z',
    creatorKey: 'maria_silva',
    areaName: 'Informática',
    groupName: 'IA - Na Saúde',
    views: 431,
    isPinned: false,
  },
];

const MATERIAL_SEED = [
  {
    title: 'Resumo - Estrutura de Dados',
    description: 'Resumo com estruturas lineares e não lineares para revisão de prova.',
    type: 'doc',
    publicationDate: '2026-04-24T09:00:00.000Z',
    views: 532,
    authorKey: 'rafael_dias',
    areaName: 'Informática',
    groupName: 'Algoritmos e Estruturas',
  },
  {
    title: 'Formulários - Derivadas',
    description: 'Compilação de fórmulas e exemplos de derivadas para Cálculo II.',
    type: 'doc',
    publicationDate: '2026-04-22T19:00:00.000Z',
    views: 727,
    authorKey: 'breno_alves',
    areaName: 'Matemática',
    groupName: 'Cálculo II - Exames',
  },
  {
    title: 'Tutorial: Árvores Binárias',
    description: 'Vídeo introdutório sobre operações em árvores binárias.',
    type: 'video',
    publicationDate: '2026-04-25T12:40:00.000Z',
    views: 176,
    authorKey: 'carlos_mendes',
    areaName: 'Informática',
    groupName: 'Algoritmos e Estruturas',
  },
  {
    title: 'Visual Basic',
    description: 'Coleção histórica de materiais de Visual Basic para referência.',
    type: 'video',
    publicationDate: '2022-02-01T10:00:00.000Z',
    views: 10000000,
    authorKey: 'luis_magalhos',
    areaName: 'Informática',
    groupName: 'Algoritmos e Estruturas',
  },
  {
    title: 'Projeto IoT na Saúde',
    description: 'Documento de planeamento para projeto IoT aplicado à saúde.',
    type: 'link',
    publicationDate: '2026-04-23T16:15:00.000Z',
    views: 95,
    externalUrl: 'https://example.org/projeto-iot-saude',
    authorKey: 'pedro_costa',
    areaName: 'Interdisciplinar',
    groupName: 'IA - Na Saúde',
  },
];

const POST_SEED = [
  {
    content:
      'Fala pessoal! Estou começando a estudar Machine Learning em Python e queria tirar dúvidas sobre o fluxo completo do projeto.',
    postDate: '2026-04-24T09:25:00.000Z',
    authorKey: 'maria_silva',
    topicTitle: 'Machine Learning em Python',
  },
  {
    content:
      'Começa pelo básico: define o problema, prepara os dados, separa treino e teste, e só depois escolhe modelos mais complexos.',
    postDate: '2026-04-24T09:37:00.000Z',
    authorKey: 'luis_magalhos',
    topicTitle: 'Machine Learning em Python',
  },
  {
    content:
      'Perfeito. Vou começar com scikit-learn antes de avançar para TensorFlow para reduzir a complexidade inicial.',
    postDate: '2026-04-24T09:43:00.000Z',
    authorKey: 'maria_silva',
    topicTitle: 'Machine Learning em Python',
  },
  {
    content:
      'Partilho aqui uma lista de exercícios resolvidos de Cálculo II para quem está a preparar o exame final.',
    postDate: '2026-04-22T16:00:00.000Z',
    authorKey: 'mariana_oliveira',
    topicTitle: 'Derivadas Parciais - Cálculo II',
  },
  {
    content:
      'O projeto de Gestão com IA precisa de apoio em frontend e análise de requisitos. Interessados? ',
    postDate: '2026-04-23T11:15:00.000Z',
    authorKey: 'pedro_costa',
    topicTitle: 'Aplicação de Gestão com IA',
  },
];

const COMMENT_SEED = [
  {
    content: 'Excelente resumo, ajudou bastante na revisão de listas encadeadas.',
    authorKey: 'maria_silva',
    materialTitle: 'Resumo - Estrutura de Dados',
  },
  {
    content: 'Ótima explicação. Já consegui aplicar as fórmulas nos exercícios de derivadas.',
    authorKey: 'carlos_mendes',
    materialTitle: 'Formulários - Derivadas',
  },
  {
    content: 'Esse passo-a-passo esclareceu o fluxo de avaliação dos modelos. Obrigada!',
    authorKey: 'ana_pereira',
    postContent:
      'Começa pelo básico: define o problema, prepara os dados, separa treino e teste, e só depois escolhe modelos mais complexos.',
  },
];

const LIKE_SEED = [
  {
    targetType: 'post',
    postContent:
      'Começa pelo básico: define o problema, prepara os dados, separa treino e teste, e só depois escolhe modelos mais complexos.',
    userKeys: ['maria_silva', 'ricardo_santos', 'carlos_mendes', 'ana_pereira'],
  },
  {
    targetType: 'post',
    postContent:
      'Partilho aqui uma lista de exercícios resolvidos de Cálculo II para quem está a preparar o exame final.',
    userKeys: ['maria_silva', 'breno_alves', 'pedro_costa'],
  },
  {
    targetType: 'material',
    materialTitle: 'Resumo - Estrutura de Dados',
    userKeys: ['maria_silva', 'ricardo_santos', 'carlos_mendes'],
  },
] as const;

async function grantActionsToRole(strapi: Core.Strapi, roleType: RoleType, actions: string[]) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: roleType },
    populate: ['permissions'],
  });

  if (!role) {
    strapi.log.warn(`[bootstrap] Role "${roleType}" not found. Skipping permission grant.`);
    return;
  }

  const existingActions = new Set((role.permissions ?? []).map((permission: any) => permission.action));
  const missingActions = actions.filter((action) => !existingActions.has(action));

  for (const action of missingActions) {
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: {
        action,
        role: role.id,
      },
    });
  }

  if (missingActions.length > 0) {
    strapi.log.info(
      `[bootstrap] Added ${missingActions.length} permissions to role "${roleType}".`,
    );
  }
}

async function ensureUsersPermissionsAdvancedSettings(strapi: Core.Strapi) {
  const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const currentAdvanced = ((await pluginStore.get({ key: 'advanced' })) ?? {}) as Record<string, unknown>;

  await pluginStore.set({
    key: 'advanced',
    value: {
      ...currentAdvanced,
      allow_register: true,
      default_role:
        typeof currentAdvanced.default_role === 'string' && currentAdvanced.default_role
          ? currentAdvanced.default_role
          : 'authenticated',
    },
  });
}

async function configureRolePermissions(strapi: Core.Strapi) {
  await ensureUsersPermissionsAdvancedSettings(strapi);

  const usersPermissionsService = strapi.plugin('users-permissions').service('users-permissions');
  await usersPermissionsService.syncPermissions();

  await grantActionsToRole(strapi, 'public', PUBLIC_ROLE_ACTIONS);
  await grantActionsToRole(strapi, 'authenticated', AUTHENTICATED_ROLE_ACTIONS);
}

async function ensureDemoUsers(strapi: Core.Strapi) {
  const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'authenticated' },
  });

  if (!authenticatedRole) {
    throw new Error('Authenticated role not found. Cannot seed users.');
  }

  const userService = strapi.plugin('users-permissions').service('user');
  const usersByKey = new Map<string, any>();

  for (const userInput of DEMO_USERS) {
    let user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email: userInput.email },
      populate: ['role'],
    });

    if (!user) {
      user = await userService.add({
        username: userInput.username,
        email: userInput.email,
        password: userInput.password,
        firstname: userInput.firstname,
        lastname: userInput.lastname,
        provider: 'local',
        confirmed: true,
        blocked: false,
        role: authenticatedRole.id,
      });

      strapi.log.info(`[bootstrap] Created demo user: ${userInput.email}`);
    }

    usersByKey.set(userInput.key, user);
  }

  return usersByKey;
}

async function seedDemoData(strapi: Core.Strapi) {
  const usersByKey = await ensureDemoUsers(strapi);

  const existingAreas = await strapi.db.query('api::area.area').findMany();
  const areasByName = new Map<string, any>(existingAreas.map((area: any) => [area.name, area]));

  for (const areaInput of AREA_SEED) {
    if (areasByName.has(areaInput.name)) {
      continue;
    }

    const area = await strapi.db.query('api::area.area').create({
      data: areaInput,
    });

    areasByName.set(area.name, area);
  }

  const existingGroups = await strapi.db.query('api::group.group').findMany();
  const groupsByName = new Map<string, any>(existingGroups.map((group: any) => [group.name, group]));

  for (const groupInput of GROUP_SEED) {
    if (groupsByName.has(groupInput.name)) {
      continue;
    }

    const area = areasByName.get(groupInput.areaName);
    const creator = usersByKey.get(groupInput.creatorKey);

    const group = await strapi.db.query('api::group.group').create({
      data: {
        name: groupInput.name,
        description: groupInput.description,
        memberLimit: groupInput.memberLimit,
        location: groupInput.location,
        schedule: groupInput.schedule,
        status: groupInput.status,
        area: area?.id,
        creator: creator?.id,
      },
    });

    groupsByName.set(group.name, group);
  }

  const existingMemberships = await strapi.db
    .query('api::group-member.group-member')
    .findMany({ populate: ['group', 'user'] });

  const membershipKeys = new Set<string>(
    existingMemberships.map((membership: any) => `${membership.group?.id}:${membership.user?.id}`),
  );

  for (const membershipInput of GROUP_MEMBERSHIP_SEED) {
    const group = groupsByName.get(membershipInput.groupName);
    const user = usersByKey.get(membershipInput.userKey);

    if (!group?.id || !user?.id) {
      continue;
    }

    const key = `${group.id}:${user.id}`;

    if (membershipKeys.has(key)) {
      continue;
    }

    await strapi.db.query('api::group-member.group-member').create({
      data: {
        group: group.id,
        user: user.id,
        role: membershipInput.role,
        joinDate: new Date().toISOString(),
      },
    });

    membershipKeys.add(key);
  }

  const existingUserAreas = await strapi.db
    .query('api::user-area.user-area')
    .findMany({ populate: ['area', 'user'] });

  const userAreaKeys = new Set<string>(
    existingUserAreas.map((userArea: any) => `${userArea.user?.id}:${userArea.area?.id}`),
  );

  for (const userAreaInput of USER_AREA_SEED) {
    const user = usersByKey.get(userAreaInput.userKey);
    const area = areasByName.get(userAreaInput.areaName);

    if (!area?.id || !user?.id) {
      continue;
    }

    const key = `${user.id}:${area.id}`;

    if (userAreaKeys.has(key)) {
      continue;
    }

    await strapi.db.query('api::user-area.user-area').create({
      data: {
        user: user.id,
        area: area.id,
        interest: userAreaInput.interest,
        joinDate: new Date().toISOString(),
      },
    });

    userAreaKeys.add(key);
  }

  const existingProfiles = await strapi.db
    .query('api::profile.profile')
    .findMany({ populate: ['user'] });

  const profileUserIds = new Set<number>(
    existingProfiles.map((profile: any) => profile.user?.id).filter(Boolean),
  );

  for (const profileInput of PROFILE_SEED) {
    const user = usersByKey.get(profileInput.userKey);

    if (!user?.id || profileUserIds.has(user.id)) {
      continue;
    }

    await strapi.db.query('api::profile.profile').create({
      data: {
        displayName: profileInput.displayName,
        course: profileInput.course,
        year: profileInput.year,
        bio: profileInput.bio,
        level: profileInput.level,
        points: profileInput.points,
        registrationDate: profileInput.registrationDate,
        badges: profileInput.badges,
        interests: profileInput.interests,
        user: user.id,
      },
    });

    profileUserIds.add(user.id);
  }

  const existingTopics = await strapi.db.query('api::topic.topic').findMany();
  const topicsByTitle = new Map<string, any>(existingTopics.map((topic: any) => [topic.title, topic]));

  for (const topicInput of TOPIC_SEED) {
    if (topicsByTitle.has(topicInput.title)) {
      continue;
    }

    const creator = usersByKey.get(topicInput.creatorKey);
    const area = areasByName.get(topicInput.areaName);
    const group = groupsByName.get(topicInput.groupName);

    const topic = await strapi.db.query('api::topic.topic').create({
      data: {
        title: topicInput.title,
        description: topicInput.description,
        creationDate: topicInput.creationDate,
        isPinned: topicInput.isPinned,
        views: topicInput.views,
        creator: creator?.id,
        area: area?.id,
        group: group?.id,
      },
    });

    topicsByTitle.set(topic.title, topic);
  }

  const existingPosts = await strapi.db.query('api::post.post').findMany();
  const postsByContent = new Map<string, any>(existingPosts.map((post: any) => [post.content, post]));

  for (const postInput of POST_SEED) {
    if (postsByContent.has(postInput.content)) {
      continue;
    }

    const topic = topicsByTitle.get(postInput.topicTitle);
    const author = usersByKey.get(postInput.authorKey);

    const post = await strapi.db.query('api::post.post').create({
      data: {
        content: postInput.content,
        postDate: postInput.postDate,
        author: author?.id,
        topic: topic?.id,
      },
    });

    postsByContent.set(post.content, post);
  }

  const existingMaterials = await strapi.db.query('api::material.material').findMany();
  const materialsByTitle = new Map<string, any>(
    existingMaterials.map((material: any) => [material.title, material]),
  );

  for (const materialInput of MATERIAL_SEED) {
    if (materialsByTitle.has(materialInput.title)) {
      continue;
    }

    const author = usersByKey.get(materialInput.authorKey);
    const area = areasByName.get(materialInput.areaName);
    const group = groupsByName.get(materialInput.groupName);

    const material = await strapi.db.query('api::material.material').create({
      data: {
        title: materialInput.title,
        description: materialInput.description,
        type: materialInput.type,
        publicationDate: materialInput.publicationDate,
        views: materialInput.views,
        externalUrl: materialInput.externalUrl,
        author: author?.id,
        area: area?.id,
        group: group?.id,
      },
    });

    materialsByTitle.set(material.title, material);
  }

  const existingComments = await strapi.db.query('api::comment.comment').findMany();
  const commentsByContent = new Map<string, any>(
    existingComments.map((comment: any) => [comment.content, comment]),
  );

  for (const commentInput of COMMENT_SEED) {
    if (commentsByContent.has(commentInput.content)) {
      continue;
    }

    const author = usersByKey.get(commentInput.authorKey);
    const material = commentInput.materialTitle
      ? materialsByTitle.get(commentInput.materialTitle)
      : undefined;
    const post = commentInput.postContent ? postsByContent.get(commentInput.postContent) : undefined;

    const comment = await strapi.db.query('api::comment.comment').create({
      data: {
        content: commentInput.content,
        date: new Date().toISOString(),
        author: author?.id,
        material: material?.id,
        post: post?.id,
      },
    });

    commentsByContent.set(comment.content, comment);
  }

  const existingLikes = await strapi.db
    .query('api::like.like')
    .findMany({ populate: ['user', 'post', 'material', 'comment'] });

  const likeKeys = new Set<string>();

  for (const like of existingLikes) {
    if (like.post?.id && like.user?.id) {
      likeKeys.add(`post:${like.user.id}:${like.post.id}`);
    }

    if (like.material?.id && like.user?.id) {
      likeKeys.add(`material:${like.user.id}:${like.material.id}`);
    }

    if (like.comment?.id && like.user?.id) {
      likeKeys.add(`comment:${like.user.id}:${like.comment.id}`);
    }
  }

  for (const likeInput of LIKE_SEED) {
    for (const userKey of likeInput.userKeys) {
      const user = usersByKey.get(userKey);

      if (!user?.id) {
        continue;
      }

      let likeKey = '';
      let relationData: Record<string, unknown> = {};

      if (likeInput.targetType === 'post' && likeInput.postContent) {
        const post = postsByContent.get(likeInput.postContent);

        if (!post?.id) {
          continue;
        }

        likeKey = `post:${user.id}:${post.id}`;
        relationData = { post: post.id };
      }

      if (likeInput.targetType === 'material' && likeInput.materialTitle) {
        const material = materialsByTitle.get(likeInput.materialTitle);

        if (!material?.id) {
          continue;
        }

        likeKey = `material:${user.id}:${material.id}`;
        relationData = { material: material.id };
      }

      if (!likeKey || likeKeys.has(likeKey)) {
        continue;
      }

      await strapi.db.query('api::like.like').create({
        data: {
          reaction: 'like',
          user: user.id,
          ...relationData,
        },
      });

      likeKeys.add(likeKey);
    }
  }

  const summary = {
    areas: await strapi.db.query('api::area.area').count(),
    groups: await strapi.db.query('api::group.group').count(),
    topics: await strapi.db.query('api::topic.topic').count(),
    materials: await strapi.db.query('api::material.material').count(),
    posts: await strapi.db.query('api::post.post').count(),
    comments: await strapi.db.query('api::comment.comment').count(),
    likes: await strapi.db.query('api::like.like').count(),
    profiles: await strapi.db.query('api::profile.profile').count(),
  };

  strapi.log.info(`[bootstrap] Seed summary: ${JSON.stringify(summary)}`);
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    const userContentType = strapi.contentType('plugin::users-permissions.user') as any;

    if (!userContentType?.attributes) {
      return;
    }

    userContentType.attributes = {
      ...userContentType.attributes,
      profile: {
        type: 'relation',
        relation: 'oneToOne',
        target: 'api::profile.profile',
        mappedBy: 'user',
      },
      createdGroups: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::group.group',
        mappedBy: 'creator',
      },
      groupMemberships: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::group-member.group-member',
        mappedBy: 'user',
      },
      areaMemberships: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::user-area.user-area',
        mappedBy: 'user',
      },
      authoredMaterials: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::material.material',
        mappedBy: 'author',
      },
      createdTopics: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::topic.topic',
        mappedBy: 'creator',
      },
      authoredPosts: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::post.post',
        mappedBy: 'author',
      },
      authoredComments: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::comment.comment',
        mappedBy: 'author',
      },
      likes: {
        type: 'relation',
        relation: 'oneToMany',
        target: 'api::like.like',
        mappedBy: 'user',
      },
    };
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await configureRolePermissions(strapi);
      await seedDemoData(strapi);
      strapi.log.info('ConnectTroca local API is ready. Permissions and demo seed are configured.');
    } catch (error) {
      strapi.log.error(`[bootstrap] Startup automation failed: ${error}`);
    }
  },
};



