import { Song, NewsItem, Album, SiteConfig } from '../types';

export const DEFAULT_CONFIG: SiteConfig = {
  whatsapp: '923591571',
  youtube: 'https://www.youtube.com/@melomusicrecord',
  email: 'melomusicrecord@gmail.com',
  facebook: 'https://facebook.com/melomusicrecord',
  instagram: 'https://instagram.com/melomusicrecord',
  twitter: 'https://x.com/melomusicrecord',
  about:
    'A Melo Music Record é uma gravadora e plataforma de difusão de música sem limites sediada em Luanda, Angola. Liderada pela produção musical de ponta de Melo, focamos nos melhores talentos de Afro House, Drill, Rap/Trap, Kizomba, Zouk e Kuduro. Oferecemos lançamentos exclusivos, streaming de alta qualidade, letras completas e downloads rápidos para ouvintes em todo o mundo.',
  location: 'Luanda, Angola',
  masterPin: '310194',
  twoFactorEnabled: true,
  twoFactorSecret: 'MELO-2FA-SECURE-KEY',
  themePreference: 'dark',
  webhookUrl: 'https://api.melomusicrecord.com/v1/webhooks',
  apiKey: 'mmr_live_8f39c2d1b74e6a05'
};

export const DEFAULT_CATEGORIES = [
  'Afro House',
  'Drill',
  'Rap/Trap',
  'Kizomba',
  'Zouk',
  'Kuduro',
  'Afrobeat',
  'Semba',
  'Amapiano',
  'Hip Hop',
  'Gospel',
  'Instrumentais',
  'Outros'
];

export function getDemoSongs(): Song[] {
  const now = Date.now();
  return [
    {
      id: 'song-1',
      title: 'Amanhecer_Lascreve_prod bay melo mausic',
      artist: 'Tarciso John',
      category: 'Drill',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=trap-future-bass-113576.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=trap-future-bass-113576.mp3',
      date: now - 1000 * 60 * 35, // 35 minutes ago (today)
      plays: 12420,
      downloads: 8870,
      lyrics: `[Intro - Tarciso John & Melo Producer Tag]
Melo no beat! (Melo Music Record)
Directo de Luanda pro mundo...
Lascreve na caneta, Tarciso na voz.
Let's go!

[Verso 1]
Amanhecer traz a luz que me guia
Nas ruas da cidade a minha melodia
O beat do Melo faz o povo vibrar
É o som que nos faz sonhar
Passo a passo na batalha sem recuar
Carrego o peso da bandeira a caminhar
Eles falaram que o sonho era distante
Mas olha agora o meu brilho de diamante

[Refrão]
Amanhecer, sempre a subir
Com o Melo Music no ar até cair
Quem tem visão não teme a escuridão
A batida bate forte no teu coração!
(Bis)

[Verso 2]
No asfalto quente da capital
A poesia é pura, o flow é letal
Cada barra que eu solto tem sentimento
O drill de Angola a rasgar o vento!
Melo Music Record é a casa do som
Honra à família, o talento é o dom.

[Outro]
Melo Music Record!
Música sem limites.
Tarciso John, Lascreve.
Luanda tá no mapa!`
    },
    {
      id: 'song-2',
      title: 'Tarciso John_Fc Saber Andar',
      artist: 'Tarciso John',
      category: 'Kizomba',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
      date: now - 1000 * 60 * 60 * 2.5, // 2.5 hours ago (today)
      plays: 9890,
      downloads: 6640,
      lyrics: `[Intro]
Yeah, Melo Music Record...
Saber andar na vida é uma arte.
Escuta só...

[Verso 1]
Aprendi com as quedas a ficar de pé
Não perco a esperança, cultivo a minha fé
No compasso suave dessa kizomba boa
O amor sincero é o que nos abençoa.

[Refrão]
Saber andar, saber amar
Contigo eu quero caminhar
Saber viver, saber sorrir
Com Melo Music até o fim!`
    },
    {
      id: 'song-3',
      title: 'Noite de Luanda (Afro Beat Sunset)',
      artist: 'Melo & Convidados',
      category: 'Afro House',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      date: now - 1000 * 60 * 60 * 4, // 4 hours ago (today)
      plays: 8510,
      downloads: 5190,
      lyrics: `[Instrumental Afro House Drum Pattern & Chants]
Tambores da terra que tocam na alma
Luanda acende as luzes na calma
Na Ilha ou no Cazenga a batida ecoa
Melo Music Record é quem manda e soa!`
    },
    {
      id: 'song-4',
      title: 'Kuduro da Banda (Versão Turbo)',
      artist: 'Dj Maluco & Melo',
      category: 'Kuduro',
      cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=action-rock-124424.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=action-rock-124424.mp3',
      date: now - 1000 * 60 * 60 * 28, // Yesterday
      plays: 7900,
      downloads: 4200,
      lyrics: `[Batida acelerada de Kuduro]
Mexe o ombro, vai no chão!
Essa é a dança da nossa nação!
Melo Music Record no comando!`
    },
    {
      id: 'song-5',
      title: 'Instrumental Pro Drill 2026 (Free Beat)',
      artist: 'Prod. Melo',
      category: 'Instrumentais',
      cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tuesday-glitch-beat-110593.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tuesday-glitch-beat-110593.mp3',
      date: now - 1000 * 60 * 60 * 48,
      plays: 6150,
      downloads: 4890,
      lyrics: `(Instrumental exclusivo produzido por Melo. Disponível para gravação livre e download com crédito a Melo Music Record).`
    },
    {
      id: 'song-inst-2',
      title: 'Beat Afro House Cazenga (Instrumental)',
      artist: 'Prod. Melo',
      category: 'Instrumentais',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      date: now - 1000 * 60 * 60 * 12,
      plays: 7200,
      downloads: 5310,
      lyrics: `(Instrumental Afro House produzido nos estúdios da Melo Music Record em Luanda. Ritmo quente com percussão angolana).`
    },
    {
      id: 'song-6',
      title: 'Vibração da Noite',
      artist: 'Kelson Star feat. Melo',
      category: 'Afrobeat',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=trap-future-bass-113576.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=trap-future-bass-113576.mp3',
      date: now - 1000 * 60 * 60 * 72,
      plays: 5400,
      downloads: 3820,
      lyrics: `[Refrão]\nVibração da noite que não vai parar\nCom Melo Music nós vamos dançar!`
    },
    {
      id: 'song-7',
      title: 'Coração de Luanda',
      artist: 'Ary Sol & Tarciso John',
      category: 'Semba',
      cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
      date: now - 1000 * 60 * 60 * 96,
      plays: 4980,
      downloads: 3100,
      lyrics: `Semba tradicional gravado ao vivo nos estúdios da Melo Music Record.`
    },
    {
      id: 'song-8',
      title: 'Trap Sem Fronteiras',
      artist: 'Young Trap Angola',
      category: 'Rap/Trap',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      date: now - 1000 * 60 * 60 * 120,
      plays: 4520,
      downloads: 2950,
      lyrics: `Flow afiado, batida pesada. Melo Music no comando.`
    },
    {
      id: 'song-9',
      title: 'Doce Paixão Zouk',
      artist: 'Vanessa Diva',
      category: 'Zouk',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=action-rock-124424.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=action-rock-124424.mp3',
      date: now - 1000 * 60 * 60 * 144,
      plays: 4120,
      downloads: 2600,
      lyrics: `Zouk romântico produzido com masterização analógica em Luanda.`
    },
    {
      id: 'song-10',
      title: 'Amapiano na Baía',
      artist: 'Dj Melo Star',
      category: 'Amapiano',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      link: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tuesday-glitch-beat-110593.mp3',
      streamUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tuesday-glitch-beat-110593.mp3',
      date: now - 1000 * 60 * 60 * 168,
      plays: 3890,
      downloads: 2310,
      lyrics: `Batida envolvente de Amapiano com percussão angolana.`
    }
  ];
}

export function getDemoAlbums(): Album[] {
  const now = Date.now();
  return [
    {
      id: 'album-1',
      title: 'Origens de Luanda',
      artist: 'Melo & Convidados',
      type: 'Álbum',
      category: 'Afro House',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      downloadUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=lofi-study-112191.mp3',
      date: now - 1000 * 60 * 60 * 5, // Today
      tracksCount: 12,
      description: 'O álbum definitivo que une a essência do Afro House de Luanda à sonoridade moderna de estúdio.',
      tracklist: [
        '01. Intro Luanda (01:45)',
        '02. Noite de Luanda feat. Tarciso John (03:32)',
        '03. Tambores do Cazenga (04:10)',
        '04. Pôr do Sol na Baía (03:55)',
        '05. Raízes da Terra (04:22)',
        '06. Batida Ancestral (03:48)',
        '07. Sons da Capital (03:30)',
        '08. Vento da Ilha (04:05)',
        '09. Ritmo sem Limites (03:50)',
        '10. Luzes da Cidade (03:40)',
        '11. Festa no Bairro (04:15)',
        '12. Outro - Melo Music (02:10)'
      ],
      downloads: 3840
    },
    {
      id: 'album-2',
      title: 'Drill do Cazenga EP',
      artist: 'Tarciso John & Lascreve',
      type: 'EP',
      category: 'Drill',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      downloadUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=trap-future-bass-113576.mp3',
      date: now - 1000 * 60 * 60 * 26,
      tracksCount: 6,
      description: 'EP explosivo de Drill gravado nos estúdios da Melo Music Record, com produções exclusivas de Melo.',
      tracklist: [
        '01. Amanhecer (Prod. Melo) (03:15)',
        '02. Sem Recuar (02:50)',
        '03. Cazenga em Chamas (03:20)',
        '04. Diamante no Asfalto (03:05)',
        '05. A Visão (03:12)',
        '06. Luanda tá no Mapa (02:45)'
      ],
      downloads: 4920
    },
    {
      id: 'album-3',
      title: 'Kizomba & Zouk Sessions Vol. 1',
      artist: 'Vários Artistas (Prod. Melo)',
      type: 'Mixtape',
      category: 'Kizomba',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      downloadUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
      date: now - 1000 * 60 * 60 * 70,
      tracksCount: 8,
      description: 'Seleção das melhores kizombas e zouks românticos com arranjos modernos e letras apaixonantes.',
      tracklist: [
        '01. Saber Andar (Tarciso John) (03:40)',
        '02. Doce Paixão (Vanessa Diva) (03:25)',
        '03. Abraço Teu (03:50)',
        '04. Dança a Dois (03:30)',
        '05. Olhar Sincero (04:00)',
        '06. Kizomba Luanda (03:45)',
        '07. Sentimento Puro (03:35)',
        '08. Até Amanhecer (03:55)'
      ],
      downloads: 2790
    }
  ];
}

export function getDemoNews(): NewsItem[] {
  const now = Date.now();
  return [
    {
      id: 'news-1',
      title: 'Melo Music Record estreia nova linha de produção para Afro House e Drill',
      type: 'today',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
      content:
        'A produtora independente Melo Music Record reforça o seu estúdio em Luanda com novos equipamentos de monitorização e síntese sonora para elevar a fasquia do Drill angolano e do Afro House. O produtor Melo confirmou que vários artistas da nova vaga já estão em estúdio a preparar EPs que serão disponibilizados gratuitamente para download aqui no portal oficial.',
      date: now - 1000 * 60 * 50,
      views: 1840
    },
    {
      id: 'news-2',
      title: 'Tarciso John atinge marca histórica de downloads com novo single',
      type: 'news',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      content:
        'O artista Tarciso John celebrou esta manhã o sucesso dos seus mais recentes temas gravados na Melo Music Record. As faixas "Amanhecer" e "Saber Andar" alcançaram milhares de acessos em poucas horas através de partilhas massivas no WhatsApp e no YouTube. Não te esqueças de acompanhar os bastidores no nosso canal oficial.',
      date: now - 1000 * 60 * 60 * 3,
      views: 3120
    },
    {
      id: 'news-3',
      title: 'Inscrições abertas para novos talentos e beats exclusivos para download',
      type: 'news',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      content:
        'A Melo Music Record abriu formalmente o canal de contacto direto via WhatsApp para produtores e MCs que pretendem masterizar ou divulgar os seus trabalhos. Subcreve também a nossa newsletter VIP para receberes packs de instrumentais e notícias de lançamentos em primeira mão.',
      date: now - 1000 * 60 * 60 * 20,
      views: 2450
    }
  ];
}
