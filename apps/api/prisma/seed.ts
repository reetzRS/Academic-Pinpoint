import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { hashDedup } from "../src/common/dedup";

const prisma = new PrismaClient();

type SeedOpp = {
  tipo: string;
  titulo: string;
  descricao: string;
  urlOrigem: string;
  fonte: string;
  instituicao?: string;
  prazoInscricao?: string;
  modalidade?: string;
  local?: string;
  valorBolsa?: string;
  requisitos?: string[];
  areas?: string[];
};

// Datas relativas a hoje para o feed nunca nascer vazio/vencido
const hoje = new Date();
const emDias = (n: number) =>
  new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + n)
    .toISOString()
    .slice(0, 10);

const oportunidades: SeedOpp[] = [
  {
    tipo: "bolsa",
    titulo: "Bolsa de Iniciação Científica – CNPq",
    descricao:
      "Oportunidade para estudantes desenvolverem projetos de pesquisa com bolsas do CNPq.",
    urlOrigem: "https://www.gov.br/cnpq/pt-br/acesso-a-informacao/bolsas/ic-2026",
    fonte: "cnpq",
    instituicao: "CNPq",
    prazoInscricao: emDias(20),
    modalidade: "presencial",
    local: "Brasil",
    requisitos: ["Estar matriculado em curso de graduação", "CRA mínimo de 7,0"],
    areas: ["tecnologia", "exatas"],
  },
  {
    tipo: "edital",
    titulo: "Edital PIBIC 2026/2027 – UFSC",
    descricao:
      "Programa de Iniciação Científica da UFSC para alunos de graduação de todas as áreas.",
    urlOrigem: "https://propesq.ufsc.br/pibic-2026-2027",
    fonte: "ufsc",
    instituicao: "UFSC",
    prazoInscricao: emDias(35),
    modalidade: "presencial",
    local: "Florianópolis, SC",
    areas: ["tecnologia", "biologicas", "humanas", "exatas"],
  },
  {
    tipo: "evento",
    titulo: "Seminário de Pesquisas em Educação 2026",
    descricao:
      "Evento nacional com foco na troca de experiências e pesquisa científica na área de educação.",
    urlOrigem: "https://seminarioeducacao2026.org.br/inscricoes",
    fonte: "demo",
    instituicao: "Rede Nacional de Pesquisa em Educação",
    prazoInscricao: emDias(73),
    modalidade: "presencial",
    local: "São Paulo, SP",
    areas: ["humanas"],
  },
  {
    tipo: "edital",
    titulo: "Edital de Apoio à Pesquisa – FAPESP",
    descricao:
      "FAPESP – Fundação de Amparo à Pesquisa do Estado de São Paulo. Apoio financeiro a projetos de pesquisa em universidades e instituições de pesquisa do estado de São Paulo.",
    urlOrigem: "https://fapesp.br/editais/apoio-pesquisa-2026",
    fonte: "fapesp",
    instituicao: "FAPESP",
    prazoInscricao: emDias(92),
    modalidade: "presencial",
    local: "São Paulo, SP",
    areas: ["exatas", "biologicas", "tecnologia"],
  },
  {
    tipo: "estagio",
    titulo: "Estágio em Engenharia – Petrobras",
    descricao:
      "Estágio para estudantes de engenharia com imersão em áreas de exploração e produção. Bolsa e benefícios competitivos.",
    urlOrigem: "https://petrobras.com.br/estagio/engenharia-2026",
    fonte: "demo",
    instituicao: "Petrobras",
    prazoInscricao: emDias(14),
    modalidade: "presencial",
    local: "Rio de Janeiro, RJ",
    areas: ["exatas", "tecnologia"],
  },
  {
    tipo: "bolsa",
    titulo: "Bolsa de Mestrado em Ciência de Dados",
    descricao:
      "A Universidade de Lisboa, por meio da Faculdade de Ciências, oferece uma bolsa integral para o programa de Mestrado em Ciência de Dados, com início em setembro de 2026. Bolsa mensal de €1.200 e seguro de saúde incluídos.",
    urlOrigem: "https://ciencias.ulisboa.pt/bolsas/mestrado-ciencia-dados-2026",
    fonte: "demo",
    instituicao: "Universidade de Lisboa",
    prazoInscricao: emDias(51),
    modalidade: "presencial",
    local: "Lisboa, Portugal",
    valorBolsa: "€ 1.200/mês",
    requisitos: [
      "Diploma de graduação em área quantitativa",
      "Inglês avançado",
      "Carta de motivação",
    ],
    areas: ["tecnologia", "exatas"],
  },
  {
    tipo: "bolsa",
    titulo: "Bolsa de Iniciação Científica – Projeto IA",
    descricao:
      "O projeto tem como objetivo desenvolver soluções inovadoras baseadas em Inteligência Artificial para problemas reais em diversas áreas do conhecimento. O(a) bolsista irá atuar em atividades de pesquisa, desenvolvimento, testes e documentação de algoritmos e modelos de IA.",
    urlOrigem: "https://ufes.br/editais/bolsa-pesquisa-projeto-ia",
    fonte: "ufes",
    instituicao: "Universidade Federal do Espírito Santo (UFES)",
    prazoInscricao: emDias(127),
    modalidade: "remoto",
    valorBolsa: "R$ 700,00/mês",
    requisitos: [
      "Estar regularmente matriculado(a) em curso de graduação",
      "Conhecimentos em Python e bibliotecas de IA/ML",
      "Boa comunicação e trabalho em equipe",
      "Disponibilidade de 20h semanais",
    ],
    areas: ["tecnologia"],
  },
  {
    tipo: "intercambio",
    titulo: "Programa de Mobilidade Acadêmica – CAPES",
    descricao:
      "Programa de intercâmbio para graduandos em universidades parceiras na Europa e América do Norte, com auxílio mensal e passagens.",
    urlOrigem: "https://www.gov.br/capes/mobilidade-2026",
    fonte: "capes",
    instituicao: "CAPES",
    prazoInscricao: emDias(112),
    modalidade: "presencial",
    local: "Exterior",
    areas: ["tecnologia", "humanas", "exatas", "biologicas"],
  },
  {
    tipo: "concurso",
    titulo: "Prêmio Universitário de Empreendedorismo 2026",
    descricao:
      "Concurso nacional de ideias inovadoras para estudantes universitários. Premiação de até R$ 20.000 para os melhores pitches.",
    urlOrigem: "https://premiouniversitario.com.br/2026",
    fonte: "demo",
    instituicao: "Sebrae",
    prazoInscricao: emDias(56),
    modalidade: "hibrido",
    local: "Nacional",
    areas: ["empreendedorismo", "sociais-aplicadas"],
  },
  {
    tipo: "estagio",
    titulo: "Estágio em Marketing – Ambev",
    descricao:
      "Programa de estágio com rotação entre áreas de marketing, trade e inteligência de mercado.",
    urlOrigem: "https://ambev.com.br/carreiras/estagio-marketing-2026",
    fonte: "demo",
    instituicao: "Ambev",
    prazoInscricao: emDias(8),
    modalidade: "hibrido",
    local: "São Paulo, SP",
    areas: ["sociais-aplicadas", "empreendedorismo"],
  },
  {
    tipo: "edital",
    titulo: "Edital FAPES – Bolsas de Pesquisa em Meio Ambiente",
    descricao:
      "Bolsas para projetos de pesquisa aplicada em conservação ambiental e recursos hídricos no Espírito Santo.",
    urlOrigem: "https://fapes.es.gov.br/editais/meio-ambiente-2026",
    fonte: "fapes",
    instituicao: "FAPES",
    prazoInscricao: emDias(42),
    modalidade: "presencial",
    local: "Vitória, ES",
    areas: ["meio-ambiente", "biologicas"],
  },
  {
    tipo: "evento",
    titulo: "Semana Acadêmica de Saúde Coletiva",
    descricao:
      "Palestras, oficinas e apresentação de trabalhos sobre saúde pública e práticas integradas de cuidado.",
    urlOrigem: "https://semanasaude.org/2026",
    fonte: "demo",
    instituicao: "ABRASCO",
    prazoInscricao: emDias(29),
    modalidade: "remoto",
    local: "Online",
    areas: ["saude"],
  },
  {
    // Vencida de propósito: prova que o filtro de expiração funciona
    tipo: "bolsa",
    titulo: "Bolsa de Extensão – Cultura e Arte (ENCERRADA)",
    descricao: "Bolsa de extensão para projetos culturais. Inscrições encerradas.",
    urlOrigem: "https://ufes.br/editais/bolsa-extensao-cultura",
    fonte: "ufes",
    instituicao: "UFES",
    prazoInscricao: emDias(-30),
    modalidade: "presencial",
    local: "Vitória, ES",
    areas: ["artes-design"],
  },
];

async function main() {
  for (const o of oportunidades) {
    const hash = hashDedup(o.urlOrigem);
    await prisma.opportunity.upsert({
      where: { hashDedup: hash },
      create: {
        tipo: o.tipo,
        titulo: o.titulo,
        descricao: o.descricao,
        urlOrigem: o.urlOrigem,
        hashDedup: hash,
        fonte: o.fonte,
        instituicao: o.instituicao,
        prazoInscricao: o.prazoInscricao ? new Date(o.prazoInscricao) : null,
        modalidade: o.modalidade,
        local: o.local,
        valorBolsa: o.valorBolsa,
        requisitos: JSON.stringify(o.requisitos ?? []),
        areas: JSON.stringify(o.areas ?? []),
      },
      update: {},
    });
  }

  await prisma.user.upsert({
    where: { email: "aluno@ufes.br" },
    create: {
      nome: "Mariana Silva",
      email: "aluno@ufes.br",
      senhaHash: bcrypt.hashSync("senha123", 10),
      curso: "Engenharia",
      areas: JSON.stringify(["tecnologia", "exatas"]),
      tipos: JSON.stringify(["bolsa", "estagio"]),
      onboardingDone: true,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: "admin@ufes.br" },
    create: {
      nome: "Admin Pinpoint",
      email: "admin@ufes.br",
      senhaHash: bcrypt.hashSync("admin123", 10),
      role: "admin",
      onboardingDone: true,
    },
    update: {},
  });

  console.log(
    `Seed ok: ${oportunidades.length} oportunidades, 2 usuários (aluno@ufes.br / senha123, admin@ufes.br / admin123)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
