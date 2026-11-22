import { SchoolData } from '../types/school';

export const DEFAULT_SCHOOL_DATA: SchoolData = {
  schoolName: {
    en: 'J/Manipay Memorial English School',
    ta: 'யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலை',
  },
  shortName: {
    en: 'J/Manipay Memorial',
    ta: 'யா/மானிப்பாய் மெமோரியல்',
  },
  schoolLogoUrl: '/src/assets/images/school_crest_logo_1794895909249.jpg',
  tickerAnnouncements: [
    {
      en: '2026 Grade 1 & Grade 6 Admissions: Application verification at the Main Office through Friday 2:00 PM',
      ta: '2026 தரம் 1 மற்றும் தரம் 6 மாணவர் அனுமதி: விண்ணப்பப் பரிசீலனை வெள்ளிக்கிழமை பிற்பகல் 2.00 மணி வரை நடைபெறும்',
    },
    {
      en: 'GCE A/L 2026 Technology, Commerce & Arts Practical Seminars commence next Monday at 8:30 AM',
      ta: 'க.பொ.த. உயர்தர 2026 தொழில்நுட்பம், வணிகம் மற்றும் கலைப் பிரிவு செய்முறைக் கருத்தரங்குகள் எதிர்வரும் திங்கட்கிழமை காலை 8.30 மணிக்கு ஆரம்பம்',
    },
    {
      en: 'Annual Inter-House Athletics Meet — Congratulations to Palmyra House on lifting the 2026 Championship Shield',
      ta: 'வருடாந்த இல்ல விளையாட்டுப் போட்டி 2026 — சம்பியன் கேடயத்தை வென்ற பனை இல்லத்திற்கு வாழ்த்துக்கள்',
    },
  ],
  hero: {
    eyebrow: {
      en: 'Memorial Lane, Manipay, Jaffna · Est. 1924',
      ta: 'மெமோரியல் லேன், மானிப்பாய், யாழ்ப்பாணம் · ஸ்தாபிக்கப்பட்டது 1924',
    },
    title: {
      en: 'Rooted in Heritage, Advancing in Knowledge',
      ta: 'பாரம்பரியத்தில் வேரூன்றி, அறிவில் முன்னேறும் கல்விக்கூடம்',
    },
    subtitle: {
      en: 'A 1AC provincial school dedicated to academic distinction, bilingual fluency, and compassionate civic leadership across Primary, O/L, and GCE A/L Arts, Commerce, and Technology streams.',
      ta: 'ஆரம்பக் கல்வி முதல் க.பொ.த. சாதாரண தரம் மற்றும் உயர்தர கலை, வணிகம், தொழில்நுட்பப் பிரிவுகள் வரை அறிவு, ஒழுக்கம் மற்றும் இருமொழித் திறனை வளர்க்கும் 1AC மாகாணப் பாடசாலை.',
    },
    bannerUrl: '/src/assets/images/hero_school_campus_1794888811093.jpg',
  },
  stats: {
    students: 1248,
    academicStaff: 64,
    nonAcademicStaff: 16,
    prefects: 48,
  },
  studentStrength: [
    { id: 'cls-01', grade: { en: 'Grade 1', ta: 'தரம் 1' }, boys: 44, girls: 42 },
    { id: 'cls-02', grade: { en: 'Grade 2', ta: 'தரம் 2' }, boys: 46, girls: 44 },
    { id: 'cls-03', grade: { en: 'Grade 3', ta: 'தரம் 3' }, boys: 45, girls: 43 },
    { id: 'cls-04', grade: { en: 'Grade 4', ta: 'தரம் 4' }, boys: 48, girls: 46 },
    { id: 'cls-05', grade: { en: 'Grade 5', ta: 'தரம் 5' }, boys: 50, girls: 48 },
    { id: 'cls-06', grade: { en: 'Grade 6', ta: 'தரம் 6' }, boys: 54, girls: 52 },
    { id: 'cls-07', grade: { en: 'Grade 7', ta: 'தரம் 7' }, boys: 52, girls: 50 },
    { id: 'cls-08', grade: { en: 'Grade 8', ta: 'தரம் 8' }, boys: 51, girls: 49 },
    { id: 'cls-09', grade: { en: 'Grade 9', ta: 'தரம் 9' }, boys: 50, girls: 48 },
    { id: 'cls-10', grade: { en: 'Grade 10', ta: 'தரம் 10' }, boys: 49, girls: 47 },
    { id: 'cls-11', grade: { en: 'Grade 11 (GCE O/L)', ta: 'தரம் 11 (க.பொ.த. சா/த)' }, boys: 48, girls: 46 },
    { id: 'cls-12', grade: { en: 'Grade 12 (GCE A/L Streams)', ta: 'தரம் 12 (க.பொ.த. உ/த)' }, boys: 52, girls: 50 },
    { id: 'cls-13', grade: { en: 'Grade 13 (GCE A/L Streams)', ta: 'தரம் 13 (க.பொ.த. உ/த)' }, boys: 47, girls: 47 },
  ],
  principal: {
    name: {
      en: 'Mr. T. Gnanamani',
      ta: 'திரு. த. ஞானமணி',
    },
    credentials: {
      en: 'B.Sc. (Hons), PGDE, SLPS Class I · Principal',
      ta: 'B.Sc. (Hons), PGDE, இலங்கை கல்வி நிருவாக சேவை I · அதிபர்',
    },
    tenure: {
      en: 'Serving J/Manipay Memorial English School since 2021',
      ta: '2021 முதல் யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலையின் அதிபர்',
    },
    photoUrl: '/src/assets/images/principal_portrait_1794888812538.jpg',
    summaryMessage: {
      en: 'At J/Manipay Memorial English School, every child walks into a living tradition of inquiry, discipline, and mutual respect. Our mission is to pair timeless Jaffna educational values with modern scientific, commercial, and technological readiness.',
      ta: 'யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலையில் ஒவ்வொரு மாணவரும் தேடல், ஒழுக்கம் மற்றும் பரஸ்பர மரியாதை நிறைந்த கல்விப் பாரம்பரியத்திற்குள் அடியெடுத்து வைக்கின்றனர். யாழ்ப்பாணத்தின் உயரிய கல்வி விழுமியங்களை நவீன விஞ்ஞான, வணிக மற்றும் தொழில்நுட்பத் திறன்களுடன் இணைப்பதே எமது இலக்காகும்.',
    },
    fullMessage: {
      en: 'As a 1AC provincial institution at the heart of Manipay, we take pride in nurturing confident bilingual learners from Grade 1 through GCE Advanced Level.\n\nWhether in our newly upgraded Engineering & Bio-Systems Technology laboratories, our Commerce analytics seminars, or our Humanities debating societies, our dedicated academic staff walks closely beside each student. Together with parents, alumni, and the wider Manipay community, we remain steadfast in shaping graduates who excel in national examinations and serve society with integrity.',
      ta: 'மானிப்பாயின் இதயப்பகுதியில் அமைந்துள்ள 1AC மாகாணப் பாடசாலை என்ற வகையில், தரம் 1 முதல் க.பொ.த. உயர்தரம் வரை தன்னம்பிக்கையுள்ள இருமொழி மாணவர்களை உருவாக்குவதில் நாம் பெருமிதம் கொள்கிறோம்.\n\nநவீனமயப்படுத்தப்பட்ட பொறியியல் மற்றும் உயிர்முறைமைத் தொழில்நுட்ப ஆய்வுகூடங்கள், வணிகக் கருத்தரங்குகள், கலை இலக்கிய மன்றங்கள் என அனைத்திலும் எமது அர்ப்பணிப்புள்ள ஆசிரியர்கள் மாணவர்களை வழிநடத்துகின்றனர். பெற்றோர், பழைய மாணவர்கள் மற்றும் மானிப்பாய் சமூகத்தின் ஒத்துழைப்புடன், தேசியப் பரீட்சைகளில் சிறந்து விளங்கி நேர்மையுடன் சமூகத்திற்கு சேவையாற்றும் தலைமுறையை உருவாக்குவதில் நாம் உறுதியாக உள்ளோம்.',
    },
  },
  heritage: {
    foundedYear: '1924',
    foundedBy: {
      en: 'Manipay Educational Society & Community Elders',
      ta: 'மானிப்பாய் கல்விச் சங்கம் மற்றும் ஊர்ப் பெரியார்கள்',
    },
    history: {
      en: 'Established in 1924 along Memorial Lane in Manipay, J/Manipay Memorial English School was founded by visionary local educators and community benefactors to offer rigorous English-medium and bilingual education rooted in Northern Sri Lankan heritage. Over a century of growth, the school expanded from a modest limestone pavilion into a recognized 1AC provincial institution serving generations of scholars, engineers, educators, and public servants across Jaffna and beyond.',
      ta: '1924 ஆம் ஆண்டில் மானிப்பாய் மெமோரியல் லேன் வீதியில் ஊரின் தொலைநோக்குள்ள கல்வியியலாளர்களாலும் நலன்விரும்பிகளாலும் யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலை ஸ்தாபிக்கப்பட்டது. ஒரு சிறிய சுண்ணாம்புக் கட்டடத்தில் ஆரம்பமான இப்பாடசாலை, ஒரு நூற்றாண்டு கால வளர்ச்சியில் யாழ்ப்பாணத்திற்கும் நாட்டிற்கும் பல அறிஞர்கள், பொறியியலாளர்கள், ஆசிரியர்கள் மற்றும் சமூகத் தலைவர்களை வழங்கிய 1AC மாகாணப் பாடசாலையாக உயர்ந்துள்ளது.',
    },
    vision: {
      en: 'To be a beacon of holistic, bilingual 1AC education in the Jaffna Peninsula—empowering ethical, intellectually curious, and future-ready citizens.',
      ta: 'யாழ்ப்பாணக் குடாநாட்டில் ஒழுக்கமும் அறிவுத் தேடலும் எதிர்காலத் தயார்நிலையும் கொண்ட இருமொழி மாணவர்களை உருவாக்கும் முன்மாதிரி 1AC கல்வி நிறுவனமாகத் திகழ்தல்.',
    },
    mission: {
      en: 'To deliver inclusive, learner-centered instruction across Primary, Secondary, and GCE A/L Arts, Commerce, and Technology streams while cultivating character, sportsmanship, cultural pride, and community service.',
      ta: 'ஆரம்பப் பிரிவு முதல் க.பொ.த. உயர்தர கலை, வணிகம் மற்றும் தொழில்நுட்பப் பிரிவுகள் வரை தரமான கல்வியை வழங்கி, ஒழுக்கம், விளையாட்டுத் திறன், பண்பாட்டுப் பெருமை மற்றும் சமூக சேவை மனப்பான்மையை வளர்த்தல்.',
    },
    motto: {
      en: 'Knowledge · Virtue · Service',
      ta: 'அறிவு · ஒழுக்கம் · சேவை',
    },
    mottoExplanation: {
      en: 'Knowledge sharpens the intellect to question and create; Virtue anchors every action in truth and humility; Service dedicates our talents to uplifting our families, Manipay, and the nation.',
      ta: 'அறிவு சிந்திக்கும் ஆற்றலையும் படைப்பாற்றலையும் கூர்மைப்படுத்துகிறது; ஒழுக்கம் ஒவ்வொரு செயலையும் உண்மையிலும் பணிவிலும் நிலைநிறுத்துகிறது; சேவை எமது திறமைகளை குடும்பத்திற்கும் மானிப்பாய்க்கும் நாட்டிற்கும் அர்ப்பணிக்கிறது.',
    },
    anthemTitle: {
      en: 'Hail Memorial, Beacon of Manipay',
      ta: 'வாழ்க மெமோரியல் மானிப்பாய் விளக்கே',
    },
    anthemVerses: {
      en: [
        'Beneath the palms of Manipay, where morning breezes blow,\nOur halls of learning stand serene in golden sunlight’s glow.\nWith hearts united, clear and strong, we pledge our youth today,\nTo seek the light of wisdom’s path and honour Memorial’s way.',
        'Through science, arts, and noble toil, our minds aspire high,\nIn truth and virtue steadfastly beneath the northern sky.\nNo challenge dims the flame we bear, no distance breaks our band,\nWith Knowledge, Virtue, Service carved across our native land.',
        'Bless every teacher guiding us with patience and with grace,\nBless alumni near and far who built this cherished place.\nLong live our Alma Mater dear, in glory let her shine,\nJ/Manipay Memorial, forever yours and mine.',
      ],
      ta: [
        'பனை நிழல் சூழ்ந்த மானிப்பாய் மண்ணில்\nகாலைக் கதிர் ஒளி வீசிடும் பொன்னில்\nஅறிவின் திருக்கோயில் அமைந்திடக் கண்டோம்\nஅன்புடன் இங்கே பண்புடன் நின்றோம்.',
        'கலைகளும் வணிகமும் தொழில்நுட்பம் தழைக்க\nஉண்மையும் நேர்மையும் உள்ளத்தில் நிலைக்க\nஅறிவு, ஒழுக்கம், சேவையே தாரகம்\nஆற்றலால் உயர்வோம் நாட்டிற்கே ஆதாரம்.',
        'வழிகாட்டும் ஆசான் வாழ்க நீடூழி\nவளர்வித்த சான்றோர் புகழ் என்றும் வாழி\nவாழ்க எங்கள் மெமோரியல் தாயே\nவையகம் போற்றும் கல்வி கலங்கரையே.',
      ],
    },
  },
  academicsConfig: {
    kicker: {
      en: '1AC Provincial Curriculum',
      ta: '1AC மாகாணக் கலைத்திட்டம்',
    },
    heading: {
      en: 'Academic Pathways & Streams',
      ta: 'கல்விப் பாதைகளும் பிரிவுகளும்',
    },
    subtitle: {
      en: 'Structured progression from foundational primary literacy to GCE Advanced Level specialization in Arts, Commerce, and Technology.',
      ta: 'ஆரம்பக் கல்வி முதல் க.பொ.த. உயர்தர கலை, வணிகம் மற்றும் தொழில்நுட்பப் பிரிவுகள் வரையிலான திட்டமிட்ட கல்வி.',
    },
    subjectsHeading: {
      en: 'Core & Elective Subjects',
      ta: 'முதன்மை மற்றும் விருப்பப் பாடங்கள்',
    },
    filters: [
      {
        id: 'All',
        label: {
          en: 'All Levels',
          ta: 'அனைத்து நிலைகளும்',
        },
        isAll: true,
      },
      {
        id: 'Primary',
        label: {
          en: 'Primary (1–5)',
          ta: 'ஆரம்பப் பிரிவு (1–5)',
        },
      },
      {
        id: 'Junior Secondary',
        label: {
          en: 'Junior Secondary (6–11)',
          ta: 'கனிஷ்ட இடைநிலை (6–11)',
        },
      },
      {
        id: 'GCE A/L',
        label: {
          en: 'GCE A/L Streams',
          ta: 'க.பொ.த. உயர்தரம் (A/L)',
        },
      },
    ],
  },
  academics: [
    {
      id: 'prog-primary',
      stage: 'Primary',
      streamCode: 'GR 01–05',
      iconKey: 'book',
      iconImageUrl: '',
      title: {
        en: 'Primary Foundation Wing',
        ta: 'ஆரம்பக் கல்விப் பிரிவு',
      },
      grades: {
        en: 'Grades 1 to 5 · Scholarship Preparation',
        ta: 'தரம் 1 முதல் 5 வரை · புலமைப்பரிசில் வழிகாட்டல்',
      },
      overview: {
        en: 'Activity-based bilingual foundation focusing on Tamil and English literacy, foundational numeracy, environmental exploration, and Grade 5 Scholarship readiness.',
        ta: 'தமிழ் மற்றும் ஆங்கில மொழித் தேர்ச்சி, அடிப்படைக் கணிதம், சுற்றாடல் கல்வி மற்றும் தரம் 5 புலமைப்பரிசில் பரீட்சைக்கான செயற்பாட்டு வழி அடித்தளம்.',
      },
      subjects: {
        en: ['First Language (Tamil)', 'English Language', 'Mathematics', 'Environmental Studies (ERA)', 'Religion & Values', 'Creative Arts & Rhythm'],
        ta: ['தமிழ் மொழி', 'ஆங்கிலம்', 'கணிதம்', 'சுற்றாடல் சார்ந்த செயற்பாடுகள்', 'சமயம் மற்றும் விழுமியம்', 'ஆக்கக் கலைகள்'],
      },
      pathways: {
        en: 'Smooth transition into Junior Secondary with strong bilingual reading fluency and analytical habits.',
        ta: 'இருமொழி வாசிப்புத் திறன் மற்றும் பகுப்பாய்வுப் பழக்கத்துடன் கனிஷ்ட இடைநிலைப் பிரிவிற்குள் சிறந்த பிரவேசம்.',
      },
    },
    {
      id: 'prog-junior',
      stage: 'Junior Secondary',
      streamCode: 'GR 06–11',
      iconKey: 'graduation',
      iconImageUrl: '',
      title: {
        en: 'Junior & Senior Secondary (GCE O/L)',
        ta: 'இடைநிலைப் பிரிவு (க.பொ.த. சாதாரண தரம்)',
      },
      grades: {
        en: 'Grades 6 to 11 · National GCE O/L Curriculum',
        ta: 'தரம் 6 முதல் 11 வரை · தேசிய க.பொ.த. சாதாரண தரப் பாடத்திட்டம்',
      },
      overview: {
        en: 'Comprehensive secondary education preparing students for the GCE Ordinary Level Examination with hands-on science laboratories, ICT coding workshops, and aesthetic appreciation.',
        ta: 'விஞ்ஞான ஆய்வுகூடப் பயிற்சிகள், தகவல் தொழில்நுட்பம் மற்றும் அழகியல் பாடங்களுடன் க.பொ.த. சாதாரண தரப் பரீட்சைக்கு மாணவர்களைத் தயார்படுத்தும் முழுமையான இடைநிலைக் கல்வி.',
      },
      subjects: {
        en: ['Tamil & English Languages', 'Mathematics & Science', 'History & Civic Education', 'Information & Communication Technology (ICT)', 'Commerce & Accounting Basics', 'Carnatic Music / Bharatanatyam / Art'],
        ta: ['தமிழ் மற்றும் ஆங்கில மொழிகள்', 'கணிதம் மற்றும் விஞ்ஞானம்', 'வரலாறு மற்றும் குடியியல் கல்வி', 'தகவல் தொடர்பாடல் தொழில்நுட்பம் (ICT)', 'வணிகம் மற்றும் கணக்கியல் அடிப்படைகள்', 'சங்கீதம் / நடனம் / சித்திரம்'],
      },
      pathways: {
        en: 'Qualifies graduates to enter our 1AC GCE Advanced Level Arts, Commerce, or Technology streams.',
        ta: 'எமது 1AC க.பொ.த. உயர்தர கலை, வணிகம் அல்லது தொழில்நுட்பப் பிரிவுகளில் இணைவதற்கான தகுதியை வழங்குகிறது.',
      },
    },
    {
      id: 'prog-al-arts',
      stage: 'GCE A/L',
      streamCode: 'A/L ARTS',
      iconKey: 'compass',
      iconImageUrl: '',
      title: {
        en: 'GCE A/L Arts & Humanities Stream',
        ta: 'க.பொ.த. உயர்தர கலைப் பிரிவு',
      },
      grades: {
        en: 'Grades 12 to 13 · Humanities, Law & Media',
        ta: 'தரம் 12 முதல் 13 வரை · மானிடவியல், சட்டம் மற்றும் ஊடகம்',
      },
      overview: {
        en: 'Cultivates critical inquiry, linguistic mastery, and socio-political literacy through structured seminars, debate forums, and university entrance mentorship.',
        ta: 'ஆய்வு மனப்பான்மை, மொழி ஆளுமை மற்றும் சமூக-அரசியல் விழிப்புணர்வைக் கருத்தரங்குகள் மற்றும் விவாத மன்றங்கள் ஊடாக வளர்க்கும் பிரிவு.',
      },
      subjects: {
        en: ['Tamil Literature / Hindu Civilization', 'Political Science', 'Economics', 'Geography', 'History', 'Logic & Scientific Method'],
        ta: ['தமிழ் இலக்கியம் / இந்து நாகரிகம்', 'அரசியல் விஞ்ஞானம்', 'பொருளியல்', 'புவியியல்', 'வரலாறு', 'அளவையியலும் விஞ்ஞான முறையும்'],
      },
      pathways: {
        en: 'University admission to Law, Arts, Education, Mass Communication, and Public Administration faculties.',
        ta: 'சட்டம், கலை, கல்வி, வெகுஜனத் தொடர்பாடல் மற்றும் பொது நிர்வாகப் பீடங்களுக்கான பல்கலைக்கழக அனுமதி.',
      },
    },
    {
      id: 'prog-al-commerce',
      stage: 'GCE A/L',
      streamCode: 'A/L COMM',
      iconKey: 'chart',
      iconImageUrl: '',
      title: {
        en: 'GCE A/L Commerce & Management Stream',
        ta: 'க.பொ.த. உயர்தர வணிகப் பிரிவு',
      },
      grades: {
        en: 'Grades 12 to 13 · Finance, Enterprise & Economics',
        ta: 'தரம் 12 முதல் 13 வரை · நிதி, முகாமைத்துவம் மற்றும் பொருளியல்',
      },
      overview: {
        en: 'Prepares analytical future accountants, entrepreneurs, and economists with case-study workshops, business simulations, and quantitative rigor.',
        ta: 'எதிர்காலக் கணக்காளர்கள், தொழில்முனைவோர் மற்றும் பொருளியலாளர்களை ஆய்வுப் பயிற்சிகள் மற்றும் எண்ணிமப் பகுப்பாய்வு மூலம் உருவாக்கும் பிரிவு.',
      },
      subjects: {
        en: ['Accounting', 'Business Studies', 'Economics', 'Business Statistics', 'Information & Communication Technology (ICT)', 'General English'],
        ta: ['கணக்கியல்', 'வணிகக் கல்வி', 'பொருளியல்', 'வணிகப் புள்ளிவிபரவியல்', 'தகவல் தொடர்பாடல் தொழில்நுட்பம் (ICT)', 'பொது ஆங்கிலம்'],
      },
      pathways: {
        en: 'Pathway to University Management/Commerce Faculties, CA Sri Lanka, CIMA, and Banking careers.',
        ta: 'பல்கலைக்கழக முகாமைத்துவ/வணிகப் பீடங்கள், பட்டயக் கணக்காளர் (CA), CIMA மற்றும் வங்கித் துறைகளுக்கான பாதை.',
      },
    },
    {
      id: 'prog-al-tech',
      stage: 'GCE A/L',
      streamCode: 'A/L TECH',
      iconKey: 'cpu',
      iconImageUrl: '',
      title: {
        en: 'GCE A/L Technology Stream',
        ta: 'க.பொ.த. உயர்தர தொழில்நுட்பப் பிரிவு',
      },
      grades: {
        en: 'Grades 12 to 13 · Engineering & Bio-Systems Tech',
        ta: 'தரம் 12 முதல் 13 வரை · பொறியியல் மற்றும் உயிர்முறைமைத் தொழில்நுட்பம்',
      },
      overview: {
        en: 'A flagship 1AC practical stream combining Science for Technology with dedicated Engineering Technology and Bio-Systems Technology workshop labs.',
        ta: 'தொழில்நுட்பத்திற்கான விஞ்ஞானத்துடன் பொறியியல் தொழில்நுட்பம் மற்றும் உயிர்முறைமைத் தொழில்நுட்ப செய்முறை ஆய்வுகூடங்களை இணைத்த முதன்மை 1AC பிரிவு.',
      },
      subjects: {
        en: ['Engineering Technology (ET)', 'Bio-Systems Technology (BST)', 'Science for Technology (SFT)', 'Information & Communication Technology (ICT)', 'Agro-Technology Workshop', 'General English'],
        ta: ['பொறியியல் தொழில்நுட்பம் (ET)', 'உயிர்முறைமைத் தொழில்நுட்பம் (BST)', 'தொழில்நுட்பத்திற்கான விஞ்ஞானம் (SFT)', 'தகவல் தொடர்பாடல் தொழில்நுட்பம் (ICT)', 'விவசாயத் தொழில்நுட்ப செய்முறை', 'பொது ஆங்கிலம்'],
      },
      pathways: {
        en: 'Direct gateway to Bachelor of Engineering Technology (BET), Bachelor of Bio-Systems Technology (BBST), and NDT diplomas.',
        ta: 'பொறியியல் தொழில்நுட்ப இளமானி (BET), உயிர்முறைமைத் தொழில்நுட்ப இளமானி (BBST) மற்றும் தேசிய தொழில்நுட்ப டிப்ளோமா (NDT) கற்கைகளுக்கான நேரடிப் பாதை.',
      },
    },
  ],
  notices: [
    {
      id: 'not-01',
      title: {
        en: '2026 Third Term Examination Timetable & Hall Allocation',
        ta: '2026 மூன்றாம் தவணைப் பரீட்சை நேர அட்டவணை மற்றும் மண்டப ஒதுக்கீடு',
      },
      summary: {
        en: 'Term examination schedule for Grades 6 through 13 along with seating arrangements and laboratory assessment dates.',
        ta: 'தரம் 6 முதல் 13 வரையான மாணவர்களுக்கான தவணைப் பரீட்சை அட்டவணை மற்றும் செய்முறைப் பரீட்சைத் திகதிகள் வெளியிடப்பட்டுள்ளன.',
      },
      content: {
        en: 'The Third Term Examinations for Grades 6–11 and Grade 12–13 (Arts, Commerce & Technology) will be held from November 24 to December 8, 2026.\n\nStudents must report to their assigned examination halls by 7:45 AM in full school uniform with their student identity card. Practical assessments for GCE A/L Engineering Technology and Bio-Systems Technology will take place in the Technology Wing following written papers. Detailed subject-by-subject timetables are displayed at the Main Notice Pavilion and distributed via class teachers.',
        ta: 'தரம் 6–11 மற்றும் தரம் 12–13 (கலை, வணிகம் மற்றும் தொழில்நுட்பம்) ஆகிய பிரிவுகளுக்கான மூன்றாம் தவணைப் பரீட்சைகள் 2026 நவம்பர் 24 முதல் டிசம்பர் 8 வரை நடைபெறும்.\n\nமாணவர்கள் அனைவரும் காலை 7.45 மணிக்குள் முழுப் பாடசாலை சீருடையுடனும் மாணவர் அடையாள அட்டையுடனும் ஒதுக்கப்பட்ட பரீட்சை மண்டபங்களுக்குச் சமூகமளிக்க வேண்டும். க.பொ.த. உயர்தர பொறியியல் மற்றும் உயிர்முறைமைத் தொழில்நுட்ப செய்முறை மதிப்பீடுகள் எழுத்துப் பரீட்சைகளைத் தொடர்ந்து தொழில்நுட்பப் பிரிவில் நடைபெறும்.',
      },
      category: 'Exams',
      date: '2026-11-12',
      pinned: true,
      referenceCode: 'JMMES/EXM/2026-11',
    },
    {
      id: 'not-02',
      title: {
        en: 'Northern Provincial Education Circular: 2027 Grade 1 Admission Guidelines',
        ta: 'வட மாகாணக் கல்விச் சுற்றறிக்கை: 2027 தரம் 1 மாணவர் அனுமதி வழிகாட்டல்கள்',
      },
      summary: {
        en: 'Official documentation checklist, residency verification dates, and interview schedule for prospective 2027 entrants.',
        ta: '2027 ஆம் ஆண்டிற்கான தரம் 1 மாணவர் அனுமதி விண்ணப்பங்களுக்கான ஆவணப் பட்டியல் மற்றும் நேர்முகத் தேர்வுத் திகதிகள்.',
      },
      content: {
        en: 'Parents residing within the Manipay feeder area are informed that applications for 2027 Grade 1 entry are currently under review in accordance with Ministry of Education Circular No. 2026/04.\n\nShortlisted applicants are kindly requested to bring original Birth Certificates, Grama Niladhari residency confirmations, and immunization records to the Principal’s Secretariat on their designated morning slot between 9:00 AM and 12:30 PM.',
        ta: 'மானிப்பாய் பாடசாலை வலயத்திற்குள் வசிக்கும் பெற்றோர்கள் கவனத்திற்கு: 2027 ஆம் ஆண்டு தரம் 1 மாணவர் அனுமதிக்கான விண்ணப்பங்கள் கல்வி அமைச்சின் 2026/04 ஆம் இலக்கச் சுற்றறிக்கைக்கு அமைவாகப் பரிசீலிக்கப்படுகின்றன.\n\nஅழைப்பு விடுக்கப்பட்ட பெற்றோர்கள் மூலப் பிறப்புச் சான்றிதழ், கிராம சேவகர் வதிவிட உறுதிப்படுத்தல் மற்றும் தடுப்பூசிப் பதிவு அட்டைகளுடன் காலை 9.00 மணி முதல் நண்பகல் 12.30 மணி வரை அதிபர் செயலகத்திற்குச் சமூகமளிக்கவும்.',
      },
      category: 'Circulars',
      date: '2026-11-08',
      pinned: true,
      referenceCode: 'JMMES/CIR/2026-29',
    },
    {
      id: 'not-03',
      title: {
        en: 'Annual Prize-Giving Ceremony & Founder’s Day Commemoration',
        ta: 'வருடாந்த பரிசளிப்பு விழா மற்றும் ஸ்தாபகர் தின நினைவேந்தல்',
      },
      summary: {
        en: 'Invitation to parents, past pupils, and well-wishers for the 102nd Founder’s Day Assembly and Honours Awards.',
        ta: '102 ஆவது ஸ்தாபகர் தின ஒன்றுகூடல் மற்றும் வருடாந்த பரிசளிப்பு விழாவிற்கான அழைப்பு.',
      },
      content: {
        en: 'J/Manipay Memorial English School warmly invites parents, alumni, and members of the community to the Annual Prize-Giving Ceremony and Founder’s Day Assembly in the Main Auditorium on Friday, December 11, 2026 at 9:00 AM.\n\nDistinguished academic prizes, GCE O/L and A/L merit shields, and Best All-Round Student Colours will be conferred. Prize winners are required to attend the full rehearsal on December 9 at 1:30 PM.',
        ta: '2026 டிசம்பர் 11 வெள்ளிக்கிழமை காலை 9.00 மணிக்குப் பாடசாலைப் பிரதான மண்டபத்தில் நடைபெறவுள்ள வருடாந்த பரிசளிப்பு விழா மற்றும் 102 ஆவது ஸ்தாபகர் தின நிகழ்விற்கு பெற்றோர்கள், பழைய மாணவர்கள் மற்றும் நலன்விரும்பிகள் அனைவரையும் அன்புடன் அழைக்கின்றோம்.\n\nபரிசு பெறும் மாணவர்கள் அனைவரும் டிசம்பர் 9 பிற்பகல் 1.30 மணிக்கு நடைபெறும் முழு ஒத்திகையில் தவறாது கலந்துகொள்ள வேண்டும்.',
      },
      category: 'Events',
      date: '2026-11-03',
      pinned: false,
      referenceCode: 'JMMES/EVT/2026-18',
    },
    {
      id: 'not-04',
      title: {
        en: 'GCE A/L 2026 Engineering & Bio-Systems Technology Project Viva',
        ta: 'க.பொ.த. உயர்தர 2026 பொறியியல் மற்றும் உயிர்முறைமைத் தொழில்நுட்ப செயற்றிட்ட மதிப்பீடு',
      },
      summary: {
        en: 'Submission deadline and external panel viva schedule for Grade 13 Technology Stream capstone portfolios.',
        ta: 'தரம் 13 தொழில்நுட்பப் பிரிவு மாணவர்களின் செயற்றிட்டக் கோவை சமர்ப்பிப்பு மற்றும் வாய்மொழி மதிப்பீட்டு அட்டவணை.',
      },
      content: {
        en: 'All Grade 13 Technology Stream candidates must submit their bound project reports and prototype logs to the Technology Lab Coordinator by November 20, 2026.\n\nThe Zonal External Moderation Panel will conduct viva evaluations on November 23 starting at 8:30 AM.',
        ta: 'தரம் 13 தொழில்நுட்பப் பிரிவு மாணவர்கள் அனைவரும் தமது கட்டுப்படுத்தப்பட்ட செயற்றிட்ட அறிக்கைகளை 2026 நவம்பர் 20 ஆம் திகதிக்குள் தொழில்நுட்ப ஆய்வுகூடப் பொறுப்பாசிரியரிடம் சமர்ப்பிக்க வேண்டும். வலய மதிப்பீட்டுக் குழுவின் நேர்முகப் பரீட்சை நவம்பர் 23 காலை 8.30 மணிக்கு ஆரம்பமாகும்.',
      },
      category: 'Exams',
      date: '2026-10-29',
      pinned: false,
      referenceCode: 'JMMES/TEC/2026-07',
    },
  ],
  achievements: [
    {
      id: 'ach-01',
      title: {
        en: '1st Place — Northern Province Technology Innovation Fair',
        ta: 'முதலிடம் — வட மாகாணத் தொழில்நுட்பப் புத்தாக்கக் கண்காட்சி',
      },
      recipient: {
        en: 'Grade 13 Engineering & Bio-Systems Tech Team',
        ta: 'தரம் 13 பொறியியல் மற்றும் உயிர்முறைமைத் தொழில்நுட்ப அணி',
      },
      description: {
        en: 'Awarded First Place in Jaffna Zone and Northern Province for designing a solar-powered smart drip-irrigation controller tailored for Jaffna peninsula farmers.',
        ta: 'யாழ்ப்பாணக் குடாநாட்டு விவசாயிகளுக்காக சூரிய சக்தியில் இயங்கும் தானியங்கி சொட்டு நீர்ப்பாசனக் கட்டுப்பாட்டுக் கருவியை உருவாக்கியமைக்காக மாகாண மட்டத்தில் முதலிடம்.',
      },
      category: 'Academic',
      year: '2026',
      distinction: {
        en: 'Provincial Gold Medal',
        ta: 'மாகாணத் தங்கப் பதக்கம்',
      },
    },
    {
      id: 'ach-02',
      title: {
        en: '96.4% GCE O/L Pass Rate & 14 Nine-A Distinctions',
        ta: 'க.பொ.த. சாதாரண தரப் பரீட்சையில் 96.4% சித்தி மற்றும் 14 மாணவர்கள் 9A சித்தி',
      },
      recipient: {
        en: 'Class of 2025/2026 GCE O/L Cohort',
        ta: '2025/2026 க.பொ.த. சாதாரண தர மாணவர் தொகுதி',
      },
      description: {
        en: 'Achieved the highest mathematics and English pass percentages in the Valikamam West educational division with 14 students earning 9A passes.',
        ta: 'வலிகாமம் மேற்கு கல்விப் பிரிவில் கணிதம் மற்றும் ஆங்கிலப் பாடங்களில் மிக உயர்ந்த சித்தி வீதத்துடன் 14 மாணவர்கள் 9A சித்திகளைப் பெற்றனர்.',
      },
      category: 'Academic',
      year: '2026',
      distinction: {
        en: 'Zonal Academic Excellence',
        ta: 'வலயக் கல்விச் சிறப்பு விருது',
      },
    },
    {
      id: 'ach-03',
      title: {
        en: 'Under-19 Zonal Athletics & Relay Champions',
        ta: '19 வயதுக்குட்பட்ட வலய மெய்வல்லுநர் மற்றும் அஞ்சலோட்ட சம்பியன்கள்',
      },
      recipient: {
        en: 'JMMES Senior Track & Field Squad',
        ta: 'பாடசாலை சிரேஷ்ட மெய்வல்லுநர் அணி',
      },
      description: {
        en: 'Captured 4 gold medals in the 4x100m relay, 400m sprint, and long jump events at the Jaffna Zonal Inter-School Athletics Championship.',
        ta: 'யாழ்ப்பாண வலயப் பாடசாலைகளுக்கு இடையிலான மெய்வல்லுநர் போட்டியில் 4x100m அஞ்சலோட்டம், 400m மற்றும் நீளம் பாய்தல் போட்டிகளில் 4 தங்கப் பதக்கங்கள்.',
      },
      category: 'Sports',
      year: '2026',
      distinction: {
        en: 'Zonal Champions',
        ta: 'வலய சம்பியன்கள்',
      },
    },
    {
      id: 'ach-04',
      title: {
        en: 'All-Island Tamil Day Classical Dance & Oratory Honours',
        ta: 'அகில இலங்கை தமிழ் மொழித் தின பரதநாட்டியம் மற்றும் பேச்சுப் போட்டி விருதுகள்',
      },
      recipient: {
        en: 'Cultural & Tamil Literary Association',
        ta: 'கலாச்சார மற்றும் தமிழ் இலக்கிய மன்றம்',
      },
      description: {
        en: 'Secured National Second Place in Bharatanatyam Ensemble and First Place at Provincial level in English-Tamil Bilingual Debating.',
        ta: 'அகில இலங்கை பரதநாட்டியக் குழுப் போட்டியில் இரண்டாமிடமும், மாகாண இருமொழி விவாதப் போட்டியில் முதலிடமும் பெற்றுப் பெருமை சேர்த்தனர்.',
      },
      category: 'Co-Curricular',
      year: '2025',
      distinction: {
        en: 'National Finalist & Provincial 1st',
        ta: 'தேசிய இரண்டாமிடம் மற்றும் மாகாண முதலிடம்',
      },
    },
  ],
  gallery: [
    {
      id: 'gal-01',
      url: '/src/assets/images/hero_school_campus_1794888811093.jpg',
      caption: {
        en: 'Morning assembly walk beneath the heritage colonnades and palmyra courtyard at Memorial Lane.',
        ta: 'மெமோரியல் லேன் வளாகத்தின் பாரம்பரியத் தூண்களும் பனை மர முற்றமும்.',
      },
      category: 'Campus',
      date: '2026-09-14',
    },
    {
      id: 'gal-02',
      url: '/src/assets/images/gallery_science_lab_1794888812305.jpg',
      caption: {
        en: 'Secondary & A/L students conducting microscopy and titration experiments in the Science Wing.',
        ta: 'விஞ்ஞான ஆய்வுகூடத்தில் நுணுக்குக்காட்டி மற்றும் இரசாயனப் பரிசோதனைகளில் ஈடுபடும் மாணவர்கள்.',
      },
      category: 'Academics',
      date: '2026-10-05',
    },
    {
      id: 'gal-03',
      url: '/src/assets/images/gallery_sports_meet_1794888813731.jpg',
      caption: {
        en: 'Annual Inter-House Sports Meet 2026 track finals cheered on by house pavilions.',
        ta: '2026 வருடாந்த இல்ல விளையாட்டுப் போட்டியின் இறுதி ஓட்டப் பந்தயம்.',
      },
      category: 'Sports',
      date: '2026-07-22',
    },
    {
      id: 'gal-04',
      url: '/src/assets/images/gallery_cultural_day_1794888813690.jpg',
      caption: {
        en: 'Tamil Cultural & Heritage Day — classical Bharatanatyam and traditional percussion ensemble.',
        ta: 'கலாச்சார விழாவில் மாணவிகளின் பாரம்பரிய பரதநாட்டியம் மற்றும் மங்கள இசை நிகழ்வு.',
      },
      category: 'Cultural',
      date: '2026-08-19',
    },
    {
      id: 'gal-05',
      url: '/src/assets/images/gallery_prize_giving_1794888814045.jpg',
      caption: {
        en: 'Annual Academic Prize-Giving honours recognizing top GCE O/L and A/L scholars.',
        ta: 'வருடாந்த பரிசளிப்பு விழாவில் சிறந்த மாணவர்களுக்குப் பரிசுகள் வழங்கப்படும் தருணம்.',
      },
      category: 'Academics',
      date: '2026-06-11',
    },
  ],
  schoolGlimpses: [
    {
      id: 'glmp-01',
      url: '/src/assets/images/glimpse_campus_pathway_1794893322451.jpg',
      caption: {
        en: 'Sunlit neem and palmyra-lined stone pathway beside our historic whitewashed colonnade wing.',
        ta: 'வேப்ப மற்றும் பனை மர நிழலில் அமைந்த பாடசாலையின் பாரம்பரியக் கல் நடைபாதையும் தூண் வரிசையும்.',
      },
      date: '2026-10-18',
    },
    {
      id: 'glmp-02',
      url: '/src/assets/images/glimpse_tech_wing_1794893322804.jpg',
      caption: {
        en: 'Our two-story Academic & Technology Wing overlooking the manicured eastern lawn.',
        ta: 'பசுமையான கிழக்குப் புல்வெளியை நோக்கியவாறு அமைந்த இரு மாடி கல்வி மற்றும் தொழில்நுட்பக் கட்டடம்.',
      },
      date: '2026-10-12',
    },
    {
      id: 'glmp-03',
      url: '/src/assets/images/glimpse_school_gate_1794893323233.jpg',
      caption: {
        en: 'The limestone-pillared main entrance archway along Memorial Lane, Manipay.',
        ta: 'மானிப்பாய் மெமோரியல் லேன் வீதியில் அமைந்துள்ள பாரம்பரியச் சுண்ணாம்புத் தூண் நுழைவாயில்.',
      },
      date: '2026-09-28',
    },
    {
      id: 'glmp-04',
      url: '/src/assets/images/hero_school_campus_1794888811093.jpg',
      caption: {
        en: 'The serene central courtyard shaded by Jaffna palmyra palms between morning lessons.',
        ta: 'காலை வகுப்புகளுக்கு இடையில் அமைதியான பனை மர நிழல் சூழ்ந்த பாடசாலை மத்திய முற்றம்.',
      },
      date: '2026-09-14',
    },
  ],
  staffMembers: [
    {
      id: 'stf-01',
      name: {
        en: 'Mrs. K. Sivapathasundaram',
        ta: 'திருமதி க. சிவபாதசுந்தரம்',
      },
      role: {
        en: 'Head of GCE A/L Technology & Engineering Tech',
        ta: 'க.பொ.த. உயர்தர தொழில்நுட்பப் பிரிவுத் தலைவர் · பொறியியல் தொழில்நுட்பம்',
      },
      qualifications: {
        en: 'B.Tech (Hons), PGDE · Senior Graduate Teacher',
        ta: 'B.Tech (Hons), PGDE · சிரேஷ்ட பட்டதாரி ஆசிரியர்',
      },
      category: 'GCE A/L',
      photoUrl: '/src/assets/images/teacher_portrait_female_1794893323895.jpg',
    },
    {
      id: 'stf-02',
      name: {
        en: 'Mr. R. Nithiyananthan',
        ta: 'திரு. இ. நித்தியானந்தன்',
      },
      role: {
        en: 'GCE A/L Science for Technology & Physics',
        ta: 'க.பொ.த. உயர்தர தொழில்நுட்பத்திற்கான விஞ்ஞானம் மற்றும் பௌதிகவியல்',
      },
      qualifications: {
        en: 'B.Sc. (Jaffna), M.Ed. · SLTS Class I',
        ta: 'B.Sc. (யாழ்ப்பாணம்), M.Ed. · இலங்கை ஆசிரியர் சேவை I',
      },
      category: 'GCE A/L',
      photoUrl: '/src/assets/images/teacher_portrait_male_1794893324665.jpg',
    },
    {
      id: 'stf-03',
      name: {
        en: 'Mrs. V. Thirugnanasampanthar',
        ta: 'திருமதி வ. திருஞானசம்பந்தர்',
      },
      role: {
        en: 'GCE A/L Accounting & Commerce Coordinator',
        ta: 'க.பொ.த. உயர்தர கணக்கியல் மற்றும் வணிகப் பிரிவு ஒருங்கிணைப்பாளர்',
      },
      qualifications: {
        en: 'B.B.A. (Hons), ACMA, PGDE',
        ta: 'B.B.A. (Hons), ACMA, PGDE',
      },
      category: 'GCE A/L',
      photoUrl: '',
    },
    {
      id: 'stf-04',
      name: {
        en: 'Mr. S. Kugathasan',
        ta: 'திரு. சி. குகதாசன்',
      },
      role: {
        en: 'Secondary Mathematics & ICT Instructor',
        ta: 'இடைநிலைப் பிரிவு கணிதம் மற்றும் தகவல் தொழில்நுட்ப ஆசிரியர்',
      },
      qualifications: {
        en: 'B.Sc. (Hons), Dip. in ICT Education',
        ta: 'B.Sc. (Hons), தகவல் தொழில்நுட்பக் கல்வி டிப்ளோமா',
      },
      category: 'Secondary',
      photoUrl: '',
    },
    {
      id: 'stf-05',
      name: {
        en: 'Ms. P. Balasubramaniam',
        ta: 'செல்வி ப. பாலசுப்பிரமணியம்',
      },
      role: {
        en: 'Secondary English Language & Literature',
        ta: 'இடைநிலைப் பிரிவு ஆங்கில மொழி மற்றும் இலக்கியம்',
      },
      qualifications: {
        en: 'B.A. (English), NCoE Trained Specialist',
        ta: 'B.A. (ஆங்கிலம்), தேசிய கல்வியியற் கல்லூரி டிப்ளோமா',
      },
      category: 'Secondary',
      photoUrl: '',
    },
    {
      id: 'stf-06',
      name: {
        en: 'Mrs. M. Maheswaran',
        ta: 'திருமதி ம. மகேஸ்வரன்',
      },
      role: {
        en: 'Primary Wing Lead & Grade 5 Scholarship Mentor',
        ta: 'ஆரம்பப் பிரிவுப் பொறுப்பாசிரியர் · தரம் 5 புலமைப்பரிசில் வழிகாட்டி',
      },
      qualifications: {
        en: 'NCoE Primary Education · 18 Years Service',
        ta: 'தேசிய கல்வியியற் கல்லூரி ஆரம்பக் கல்வி · 18 வருட சேவை',
      },
      category: 'Primary',
      photoUrl: '',
    },
  ],
  formerPrincipals: [
    {
      id: 'fp-01',
      name: {
        en: 'Mr. S. Kandiah',
        ta: 'திரு. சு. கந்தையா',
      },
      tenure: {
        en: '1958 – 1974',
        ta: '1958 – 1974',
      },
      note: {
        en: 'B.A. (London), Trained Teacher · Oversaw the expansion of the secondary bilingual wing and science library.',
        ta: 'B.A. (இலண்டன்), பயிற்றுவிக்கப்பட்ட ஆசிரியர் · இடைநிலைப் பிரிவு மற்றும் விஞ்ஞான நூலக விரிவாக்கத்திற்கு வழிகாட்டியவர்.',
      },
      photoUrl: '',
    },
    {
      id: 'fp-02',
      name: {
        en: 'Mrs. P. Vythialingam',
        ta: 'திருமதி ப. வைத்திலிங்கம்',
      },
      tenure: {
        en: '1974 – 1989',
        ta: '1974 – 1989',
      },
      note: {
        en: 'B.Sc., Dip. in Ed. · Strengthened GCE O/L mathematics outcomes and established inter-house sports traditions.',
        ta: 'B.Sc., கல்வி டிப்ளோமா · க.பொ.த. சாதாரண தர கணிதத் தேர்ச்சியையும் இல்ல விளையாட்டுப் பாரம்பரியத்தையும் வலுப்படுத்தியவர்.',
      },
      photoUrl: '',
    },
    {
      id: 'fp-03',
      name: {
        en: 'Mr. V. Balasundaram',
        ta: 'திரு. வி. பாலசுந்தரம்',
      },
      tenure: {
        en: '1989 – 2004',
        ta: '1989 – 2004',
      },
      note: {
        en: 'SLPS Class I · Guided the school through the introduction of GCE Advanced Level Arts and Commerce streams.',
        ta: 'இலங்கை அதிபர் சேவை I · க.பொ.த. உயர்தர கலை மற்றும் வணிகப் பிரிவுகள் ஆரம்பிக்கப்பட வழிநடத்தியவர்.',
      },
      photoUrl: '',
    },
    {
      id: 'fp-04',
      name: {
        en: 'Mrs. R. Sivasubramaniam',
        ta: 'திருமதி இ. சிவசுப்பிரமணியம்',
      },
      tenure: {
        en: '2004 – 2021',
        ta: '2004 – 2021',
      },
      note: {
        en: 'B.Sc. (Hons), M.Ed., SLPS Class I · Pioneered the 1AC Technology Wing and digital learning facilities.',
        ta: 'B.Sc. (Hons), M.Ed., இலங்கை அதிபர் சேவை I · 1AC தொழில்நுட்பப் பிரிவையும் எண்ணிமக் கற்றல் வசதிகளையும் உருவாக்கியவர்.',
      },
      photoUrl: '',
    },
  ],
  examResults: [
    {
      id: 'exr-2025-al',
      category: 'A/L',
      year: '2025',
      passPercentage: '94.5%',
      summary: {
        en: 'Strong university-qualifying performance across GCE A/L Engineering Technology, Bio-Systems Technology, Commerce, and Arts streams in the Jaffna Education Zone.',
        ta: 'யாழ்ப்பாண கல்வி வலயத்தில் க.பொ.த. உயர்தர பொறியியல் தொழில்நுட்பம், உயிர்முறைமைத் தொழில்நுட்பம், வணிகம் மற்றும் கலைப் பிரிவுகளில் பல்கலைக்கழகத் தகுதி பெற்ற சிறப்பான பெறுபேறுகள்.',
      },
      topPerformers: [
        {
          id: 'tp-al-1',
          name: {
            en: 'K. Tharmalingam',
            ta: 'க. தர்மலிங்கம்',
          },
          achievement: {
            en: '3As · Engineering Technology (Z-Score 2.18)',
            ta: '3A · பொறியியல் தொழில்நுட்பம் (Z-புள்ளி 2.18)',
          },
          photoUrl: '',
        },
        {
          id: 'tp-al-2',
          name: {
            en: 'S. Piriyantha',
            ta: 'ச. பிரியந்தா',
          },
          achievement: {
            en: '3As · Commerce Stream (Z-Score 2.04)',
            ta: '3A · வணிகப் பிரிவு (Z-புள்ளி 2.04)',
          },
          photoUrl: '',
        },
        {
          id: 'tp-al-3',
          name: {
            en: 'M. Kajanthan',
            ta: 'ம. கஜந்தன்',
          },
          achievement: {
            en: '2As 1B · Bio-Systems Technology (District Rank 6)',
            ta: '2A 1B · உயிர்முறைமைத் தொழில்நுட்பம் (மாவட்ட நிலை 6)',
          },
          photoUrl: '',
        },
      ],
      photos: [],
    },
    {
      id: 'exr-2025-ol',
      category: 'O/L',
      year: '2025',
      passPercentage: '96.4%',
      summary: {
        en: '14 candidates earned 9A distinctions and 98% qualified for GCE Advanced Level admission with full passes in Mathematics and English.',
        ta: '14 மாணவர்கள் 9A சித்திகளைப் பெற்றதுடன் கணிதம் மற்றும் ஆங்கிலப் பாடங்களில் முழுமையான சித்தியுடன் 98% மாணவர்கள் உயர்தரத்திற்குத் தகுதி பெற்றனர்.',
      },
      topPerformers: [
        {
          id: 'tp-ol-1',
          name: {
            en: 'N. Abirami',
            ta: 'ந. அபிராமி',
          },
          achievement: {
            en: '9As · All Subjects Distinction',
            ta: '9A · அனைத்துப் பாடங்களிலும் விசேட சித்தி',
          },
          photoUrl: '',
        },
        {
          id: 'tp-ol-2',
          name: {
            en: 'T. Sankeethan',
            ta: 'த. சங்கீதன்',
          },
          achievement: {
            en: '9As · Mathematics & ICT Excellence',
            ta: '9A · கணிதம் மற்றும் தகவல் தொழில்நுட்பச் சிறப்பு',
          },
          photoUrl: '',
        },
        {
          id: 'tp-ol-3',
          name: {
            en: 'P. Mathushalini',
            ta: 'ப. மதுஷாலினி',
          },
          achievement: {
            en: '9As · Languages & Science Honours',
            ta: '9A · மொழி மற்றும் விஞ்ஞானப் பாடச் சிறப்பு',
          },
          photoUrl: '',
        },
      ],
      photos: [],
    },
    {
      id: 'exr-2025-schol',
      category: 'Scholarship',
      year: '2025',
      passPercentage: '88.2%',
      summary: {
        en: '34 Grade 5 candidates surpassed the Jaffna District cut-off mark, marking one of our strongest Primary Wing scholarship cohorts.',
        ta: 'யாழ்ப்பாண மாவட்ட வெட்டுப்புள்ளிக்கு மேல் 34 தரம் 5 மாணவர்கள் சித்தி பெற்று ஆரம்பப் பிரிவின் சிறந்த சாதனையைப் பதிவு செய்தனர்.',
      },
      topPerformers: [
        {
          id: 'tp-sc-1',
          name: {
            en: 'A. Harishanth',
            ta: 'அ. ஹரிஷாந்த்',
          },
          achievement: {
            en: '184 / 200 Marks · Zonal Top Scorer',
            ta: '184 / 200 புள்ளிகள் · வலய முதன்மைப் புள்ளி',
          },
          photoUrl: '',
        },
        {
          id: 'tp-sc-2',
          name: {
            en: 'R. Keerthana',
            ta: 'இ. கீர்த்தனா',
          },
          achievement: {
            en: '179 / 200 Marks · Distinction Pass',
            ta: '179 / 200 புள்ளிகள் · விசேட சித்தி',
          },
          photoUrl: '',
        },
      ],
      photos: [],
    },
  ],
  smartSystems: [
    {
      id: 'sys-relief',
      iconKey: 'relief',
      title: {
        en: 'ReliefMS — Smart Teacher Relief Management System',
        ta: 'ReliefMS — திறன்மிகு ஆசிரியர் பதிலீட்டு முகாமைத்துவம்',
      },
      description: {
        en: 'Automated period allocation and real-time relief timetable coordination for absent academic staff.',
        ta: 'ஆசிரியர் விடுமுறை நாட்களில் வகுப்புப் பதிலீட்டு நேர அட்டவணையைத் தானாக ஒழுங்குபடுத்தும் கட்டமைப்பு.',
      },
      url: 'https://reliefms.manipaymemorial.sch.lk',
      enabled: true,
    },
    {
      id: 'sys-attendance',
      iconKey: 'attendance',
      title: {
        en: 'Smart School Attendance Management System',
        ta: 'திறன்மிகு பாடசாலை வரவு முகாமைத்துவ அமைப்பு',
      },
      description: {
        en: 'Digital daily roll-call tracking, class-wise attendance summaries, and instant parent alerts.',
        ta: 'மாணவர்களின் தினசரி வரவுப் பதிவு, வகுப்பு வாரியான அறிக்கைகள் மற்றும் பெற்றோர் அறிவிப்பு அமைப்பு.',
      },
      url: 'https://attendance.manipaymemorial.sch.lk',
      enabled: true,
    },
    {
      id: 'sys-marks',
      iconKey: 'marks',
      title: {
        en: 'School Marks & Report System',
        ta: 'பாடசாலைப் புள்ளிகள் மற்றும் அறிக்கை அமைப்பு',
      },
      description: {
        en: 'Term examination mark entry, grade analytics, class rank calculation, and printable report cards.',
        ta: 'தவணைப் பரீட்சைப் புள்ளிகள் பதிவு, தரப் பகுப்பாய்வு மற்றும் மாணவர் முன்னேற்ற அறிக்கை அச்சிடல்.',
      },
      url: 'https://reports.manipaymemorial.sch.lk',
      enabled: true,
    },
    {
      id: 'sys-bell',
      iconKey: 'bell',
      title: {
        en: 'Automated Digital Bell System',
        ta: 'தானியங்கி எண்ணிமப் பாடசாலை மணி அமைப்பு',
      },
      description: {
        en: 'Synchronized school bell scheduling for morning assembly, intervals, examination bells, and dismissal.',
        ta: 'காலை ஒன்றுகூடல், இடைவேளை, பரீட்சை நேரங்கள் மற்றும் பாடசாலை நிறைவிற்கான தானியங்கி மணி ஒலிப்பான்.',
      },
      url: 'https://bell.manipaymemorial.sch.lk',
      enabled: true,
    },
  ],
  contact: {
    address: {
      en: 'Memorial Lane, Manipay, Jaffna 40000, Sri Lanka',
      ta: 'மெமோரியல் லேன், மானிப்பாய், யாழ்ப்பாணம் 40000, இலங்கை',
    },
    phone: '+94 21 225 5412',
    email: 'office@manipaymemorial.sch.lk',
    officeHours: {
      en: 'Monday – Friday · 7:30 AM – 2:30 PM',
      ta: 'திங்கள் – வெள்ளி · காலை 7.30 – பிற்பகல் 2.30',
    },
    schoolType: {
      en: '1AC Provincial School · Mixed · Bilingual (Tamil & English)',
      ta: '1AC மாகாணப் பாடசாலை · இருபாலர் · தமிழ் மற்றும் ஆங்கில மொழி',
    },
    mapEmbedUrl:
      'https://maps.google.com/maps?q=Manipay,+Jaffna,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  brandTheme: {
    primaryColor: '#6B1D2F',
    accentColor: '#B47B2B',
    presetName: 'Heritage Crimson & Gold',
  },
  updatedAt: '2026-11-16T08:00:00.000Z',
};
