import { Song, NewsItem, SiteConfig } from '../types';

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
      plays: 1420,
      downloads: 870,
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
      plays: 2890,
      downloads: 1640,
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
      plays: 3510,
      downloads: 2190,
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
      plays: 4900,
      downloads: 3200,
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
