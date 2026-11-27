import { Language } from '../types/school';

export const UI_STRINGS: Record<Language, {
  nav: {
    home: string;
    heritage: string;
    academics: string;
    staff: string;
    formerPrincipals: string;
    examResults: string;
    notices: string;
    achievements: string;
    gallery: string;
    contact: string;
  };
  homeGallery: {
    kicker: string;
    heading: string;
    subtitle: string;
    viewAllGallery: string;
  };
  header: {
    searchPlaceholder: string;
    searchTitle: string;
    searchEmpty: string;
    tickerLabel: string;
    toggleTheme: string;
    openMenu: string;
  };
  hero: {
    exploreAcademics: string;
    contactLocation: string;
    mottoLabel: string;
    classification: string;
  };
  stats: {
    students: string;
    academicStaff: string;
    nonAcademicStaff: string;
    prefects: string;
    studentsSub: string;
    academicStaffSub: string;
    nonAcademicStaffSub: string;
    prefectsSub: string;
    boys: string;
    girls: string;
    total: string;
    viewBreakdown: string;
    hideBreakdown: string;
    breakdownTitle: string;
    breakdownSubtitle: string;
    classCol: string;
    classTotalCol: string;
    allClassesTotal: string;
  };
  principal: {
    kicker: string;
    heading: string;
    readMore: string;
    showLess: string;
  };
  heritage: {
    kicker: string;
    heading: string;
    subtitle: string;
    tabs: {
      history: string;
      visionMission: string;
      motto: string;
      anthem: string;
    };
    foundedLabel: string;
    founderLabel: string;
    visionLabel: string;
    missionLabel: string;
    playAnthem: string;
    pauseAnthem: string;
    resetAnthem: string;
    stanzaPrefix: string;
  };
  academics: {
    kicker: string;
    heading: string;
    subtitle: string;
    filters: {
      all: string;
      primary: string;
      junior: string;
      al: string;
    };
    subjectsHeading: string;
    pathwaysHeading: string;
  };
  staff: {
    kicker: string;
    heading: string;
    subtitle: string;
    principalRoleLabel: string;
    teachersHeading: string;
    filters: {
      All: string;
      Primary: string;
      Secondary: string;
    };
    emptyState: string;
  };
  formerPrincipals: {
    kicker: string;
    heading: string;
    subtitle: string;
    tenureLabel: string;
    emptyState: string;
  };
  examResults: {
    kicker: string;
    heading: string;
    subtitle: string;
    categories: {
      All: string;
      Scholarship: string;
      'O/L': string;
      'A/L': string;
    };
    passRateLabel: string;
    topPerformersHeading: string;
    photosHeading: string;
    emptyState: string;
  };
  smartSystems: {
    kicker: string;
    heading: string;
    subtitle: string;
    launchButton: string;
    comingSoon: string;
  };
  notices: {
    kicker: string;
    heading: string;
    subtitle: string;
    searchPlaceholder: string;
    categories: {
      All: string;
      Exams: string;
      Circulars: string;
      Events: string;
    };
    pinnedLabel: string;
    readFull: string;
    closeDrawer: string;
    emptyState: string;
    referenceLabel: string;
    viewAttachment: string;
    downloadAttachment: string;
    attachmentLabel: string;
  };
  achievements: {
    kicker: string;
    heading: string;
    subtitle: string;
    categories: {
      All: string;
      Academic: string;
      Sports: string;
      'Co-Curricular': string;
    };
  };
  gallery: {
    kicker: string;
    heading: string;
    subtitle: string;
    categories: {
      All: string;
      Campus: string;
      Academics: string;
      Sports: string;
      Cultural: string;
    };
    photoCount: string;
    photosBadge: string;
    previous: string;
    next: string;
    close: string;
  };
  contact: {
    kicker: string;
    heading: string;
    subtitle: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    formTitle: string;
    nameLabel: string;
    emailFieldLabel: string;
    phoneFieldLabel: string;
    subjectLabel: string;
    messageLabel: string;
    submitButton: string;
    submitting: string;
    successToast: string;
    validationError: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    schoolInfo: string;
    adminPortal: string;
    copyright: string;
  };
}> = {
  en: {
    nav: {
      home: 'Home',
      heritage: 'Heritage',
      academics: 'Academics',
      staff: 'Staff',
      formerPrincipals: 'Former Principals',
      examResults: 'Exam Results',
      notices: 'Notices',
      achievements: 'Honours',
      gallery: 'Gallery',
      contact: 'Contact',
    },
    homeGallery: {
      kicker: 'School Surroundings',
      heading: 'Glimpses of Our School',
      subtitle: 'Surroundings of J/Manipay Memorial English School',
      viewAllGallery: 'Explore Event Gallery',
    },
    header: {
      searchPlaceholder: 'Search notices, A/L streams, subjects, or school heritage...',
      searchTitle: 'Quick Academic Search',
      searchEmpty: 'No matching notices, academic streams, or records found.',
      tickerLabel: 'Bulletins',
      toggleTheme: 'Toggle color theme',
      openMenu: 'Toggle navigation menu',
    },
    hero: {
      exploreAcademics: 'Explore Academics',
      contactLocation: 'Contact & Location',
      mottoLabel: 'School Motto',
      classification: '1C Provincial School · Mixed · Medium of Instruction: Tamil',
    },
    stats: {
      students: 'Active Students',
      academicStaff: 'Academic Staff',
      nonAcademicStaff: 'Non-Academic Staff',
      prefects: 'Student Prefects',
      studentsSub: 'Grades 1 to 13 across 1C streams',
      academicStaffSub: 'Graduate & trained specialist educators',
      nonAcademicStaffSub: 'Administrative & school support',
      prefectsSub: 'Senior & junior student leadership',
      boys: 'Boys',
      girls: 'Girls',
      total: 'Total',
      viewBreakdown: 'View Class Breakdown',
      hideBreakdown: 'Hide Class Breakdown',
      breakdownTitle: 'Class-wise Student Strength',
      breakdownSubtitle: 'Enrollment distribution across Primary, Secondary, and GCE A/L classes',
      classCol: 'Class / Grade',
      classTotalCol: 'Class Total',
      allClassesTotal: 'Total Active Students',
    },
    principal: {
      kicker: 'Leadership & Stewardship',
      heading: "From the Principal's Desk",
      readMore: 'Read Full Address',
      showLess: 'Show Summary',
    },
    heritage: {
      kicker: 'Identity & Legacy',
      heading: 'Heritage, Vision & School Spirit',
      subtitle: 'Rooted in Manipay’s enduring tradition of disciplined scholarship, character formation, and civic service.',
      tabs: {
        history: 'History & Founder',
        visionMission: 'Vision & Mission',
        motto: 'School Motto',
        anthem: 'School Anthem',
      },
      foundedLabel: 'Established',
      founderLabel: 'Founded By',
      visionLabel: 'Our Vision',
      missionLabel: 'Our Mission',
      playAnthem: 'Play School Anthem',
      pauseAnthem: 'Pause Anthem',
      resetAnthem: 'Restart',
      stanzaPrefix: 'Stanza',
    },
    academics: {
      kicker: '1C Provincial Curriculum · Tamil Medium',
      heading: 'Academic Pathways & Streams',
      subtitle: 'Structured progression from foundational primary literacy to GCE Advanced Level specialization in Arts, Commerce, and Technology.',
      filters: {
        all: 'All Levels',
        primary: 'Primary (1–5)',
        junior: 'Junior Secondary (6–11)',
        al: 'GCE A/L Streams',
      },
      subjectsHeading: 'Core & Elective Subjects',
      pathwaysHeading: 'Progression & Outcomes',
    },
    staff: {
      kicker: 'Leadership & Faculty',
      heading: 'Principal & Academic Staff',
      subtitle: 'Meet the dedicated educators guiding Primary and Secondary scholars at J/Manipay Memorial English School.',
      principalRoleLabel: 'School Leadership · Principal',
      teachersHeading: 'Academic Faculty Directory',
      filters: {
        All: 'All Faculty',
        Primary: 'Primary',
        Secondary: 'Secondary',
      },
      emptyState: 'No staff profiles found in this section.',
    },
    formerPrincipals: {
      kicker: 'Stewards of Our Legacy',
      heading: 'Former Principals',
      subtitle: 'Honouring the dedicated principals whose leadership, scholarship, and service guided J/Manipay Memorial English School across generations.',
      tenureLabel: 'Service Period',
      emptyState: 'No former principal records have been added yet.',
    },
    examResults: {
      kicker: 'Academic Outcomes',
      heading: 'National Examination Results',
      subtitle: 'Year-wise pass percentages, high achievers, and memorable highlights across Grade 5 Scholarship, G.C.E. O/L, and G.C.E. A/L examinations.',
      categories: {
        All: 'All Exams',
        Scholarship: 'Grade 5 Scholarship',
        'O/L': 'G.C.E. O/L',
        'A/L': 'G.C.E. A/L',
      },
      passRateLabel: 'Pass Rate',
      topPerformersHeading: 'Top Performers & High Achievers',
      photosHeading: 'Result Highlights & Celebrations',
      emptyState: 'No examination results found for the selected category.',
    },
    smartSystems: {
      kicker: 'Digital School Infrastructure',
      heading: 'Our Smart Systems',
      subtitle: 'Integrated in-house digital platforms powering daily administration, attendance tracking, examinations, and timetabling at J/Manipay Memorial English School.',
      launchButton: 'Open System',
      comingSoon: 'Portal Link Pending',
    },
    notices: {
      kicker: 'Official Communications',
      heading: 'School Notice Board',
      subtitle: 'Examination timetables, ministerial circulars, and upcoming school calendars.',
      searchPlaceholder: 'Filter notices by keyword or reference...',
      categories: {
        All: 'All Notices',
        Exams: 'Exams',
        Circulars: 'Circulars',
        Events: 'Events',
      },
      pinnedLabel: 'Pinned Notice',
      readFull: 'Read Full Notice',
      closeDrawer: 'Close',
      emptyState: 'No notices match your current filter or keyword.',
      referenceLabel: 'Ref',
      viewAttachment: 'View / Download Attachment',
      downloadAttachment: 'Download File',
      attachmentLabel: 'Attached Document',
    },
    achievements: {
      kicker: 'Distinction & Merit',
      heading: 'Academic, Sports & Cultural Honours',
      subtitle: 'Celebrating provincial, zonal, and national recognitions earned by our students and teams.',
      categories: {
        All: 'All Honours',
        Academic: 'Academic',
        Sports: 'Sports',
        'Co-Curricular': 'Co-Curricular',
      },
    },
    gallery: {
      kicker: 'School Chronicles',
      heading: 'Life at Memorial Lane',
      subtitle: 'Moments from laboratories, inter-house sports meets, cultural assemblies, and annual prize-giving ceremonies.',
      categories: {
        All: 'All Photos',
        Campus: 'School Grounds',
        Academics: 'Academics',
        Sports: 'Sports',
        Cultural: 'Cultural',
      },
      photoCount: 'Archive Photographs',
      photosBadge: 'photos',
      previous: 'Previous photo',
      next: 'Next photo',
      close: 'Close lightbox',
    },
    contact: {
      kicker: 'Visit & Connect',
      heading: 'Contact & School Location',
      subtitle: 'Reach the school office at Memorial Lane, Manipay for admissions, alumni inquiries, and official correspondence.',
      addressLabel: 'School Address',
      phoneLabel: 'Office Telephone',
      emailLabel: 'Official Email',
      hoursLabel: 'Office Hours',
      formTitle: 'Send an Inquiry',
      nameLabel: 'Full Name',
      emailFieldLabel: 'Email Address',
      phoneFieldLabel: 'Phone Number',
      subjectLabel: 'Subject',
      messageLabel: 'Message',
      submitButton: 'Send Inquiry',
      submitting: 'Sending...',
      successToast: 'Your inquiry has been recorded. The school office will respond shortly.',
      validationError: 'Please fill in your name, email address, and message.',
    },
    footer: {
      description: 'A 1C provincial school (Medium of Instruction: Tamil) nurturing scholarship, ethical leadership, and community service in Manipay, Jaffna.',
      quickLinks: 'Navigation',
      schoolInfo: 'School Details',
      adminPortal: 'Admin Portal',
      copyright: 'J/Manipay Memorial English School. All rights reserved.',
    },
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      heritage: 'பாரம்பரியம்',
      academics: 'கல்வி',
      staff: 'ஆசிரியர் குழாம்',
      formerPrincipals: 'முன்னாள் அதிபர்கள்',
      examResults: 'தேர்வு பெறுபேறுகள்',
      notices: 'அறிவிப்புகள்',
      achievements: 'சாதனைகள்',
      gallery: 'படத்தொகுப்பு',
      contact: 'தொடர்பு',
    },
    homeGallery: {
      kicker: 'பாடசாலைச் சூழல்',
      heading: 'எமது பாடசாலையின் எழில்மிகு காட்சிகள்',
      subtitle: 'யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலையின் சுற்றுச்சூழல்',
      viewAllGallery: 'நிகழ்வுப் படத்தொகுப்பைக் காண்க',
    },
    header: {
      searchPlaceholder: 'அறிவிப்புகள், உயர்தரப் பிரிவுகள், பாடங்கள் அல்லது தகவல்களைத் தேடுங்கள்...',
      searchTitle: 'விரைவுக் கல்வித் தேடல்',
      searchEmpty: 'பொருத்தமான அறிவிப்புகள் அல்லது கல்விப் பிரிவுகள் எதுவும் கிடைக்கவில்லை.',
      tickerLabel: 'முக்கிய செய்திகள்',
      toggleTheme: 'ஒளி / இருள் தோற்றத்தை மாற்றவும்',
      openMenu: 'வழிசெலுத்தல் பட்டியைத் திறக்கவும்',
    },
    hero: {
      exploreAcademics: 'கல்விப் பிரிவுகளைப் பார்க்க',
      contactLocation: 'தொடர்பு மற்றும் அமைவிடம்',
      mottoLabel: 'பாடசாலை மகுட வாசகம்',
      classification: '1C மாகாணப் பாடசாலை · இருபாலர் · மொழி மூலம்: தமிழ்',
    },
    stats: {
      students: 'மாணவர்கள்',
      academicStaff: 'கல்விசார் ஊழியர்கள்',
      nonAcademicStaff: 'கல்விசாரா ஊழியர்கள்',
      prefects: 'மாணவத் தலைவர்கள்',
      studentsSub: 'தரம் 1 முதல் 13 வரை 1C பிரிவுகளில்',
      academicStaffSub: 'பட்டதாரி மற்றும் பயிற்றுவிக்கப்பட்ட ஆசிரியர்கள்',
      nonAcademicStaffSub: 'நிர்வாக மற்றும் பாடசாலை உதவிப் பணியாளர்கள்',
      prefectsSub: 'சிரேஷ்ட மற்றும் கனிஷ்ட மாணவத் தலைமைத்துவம்',
      boys: 'ஆண்கள்',
      girls: 'பெண்கள்',
      total: 'மொத்தம்',
      viewBreakdown: 'வகுப்பு விபரம் காண்க',
      hideBreakdown: 'வகுப்பு விபரத்தை மறை',
      breakdownTitle: 'வகுப்பு வாரியான மாணவர் எண்ணிக்கை',
      breakdownSubtitle: 'ஆரம்பப் பிரிவு, இடைநிலை மற்றும் க.பொ.த. உயர்தர வகுப்புகளின் மாணவர் விபரம்',
      classCol: 'வகுப்பு / தரம்',
      classTotalCol: 'வகுப்பு மொத்தம்',
      allClassesTotal: 'மொத்த மாணவர்கள்',
    },
    principal: {
      kicker: 'தலைமைத்துவமும் வழிகாட்டலும்',
      heading: 'அதிபரின் செய்தி',
      readMore: 'முழுச் செய்தியை வாசிக்க',
      showLess: 'சுருக்கமாகக் காண்க',
    },
    heritage: {
      kicker: 'அடையாளமும் மரபும்',
      heading: 'வரலாறு, நோக்கு மற்றும் பாடசாலைப் பண்பு',
      subtitle: 'மானிப்பாயின் நீண்டகால கல்விப் பாரம்பரியம், ஒழுக்க மேம்பாடு மற்றும் சமூக சேவையில் வேரூன்றியது.',
      tabs: {
        history: 'வரலாறும் நிறுவனரும்',
        visionMission: 'நோக்கும் பணியும்',
        motto: 'மகுட வாசகம்',
        anthem: 'பாடசாலைப் பண்',
      },
      foundedLabel: 'நிறுவப்பட்ட ஆண்டு',
      founderLabel: 'நிறுவனர்',
      visionLabel: 'எமது நோக்கு',
      missionLabel: 'எமது பணி',
      playAnthem: 'பாடசாலைப் பண்ணை இயக்குக',
      pauseAnthem: 'நிறுத்துக',
      resetAnthem: 'மீண்டும் தொடங்குக',
      stanzaPrefix: 'சரணம்',
    },
    academics: {
      kicker: '1C மாகாணக் கலைத்திட்டம் · தமிழ் மொழி மூலம்',
      heading: 'கல்விப் பாதைகளும் பிரிவுகளும்',
      subtitle: 'ஆரம்பக் கல்வி முதல் க.பொ.த. உயர்தர கலை, வணிகம் மற்றும் தொழில்நுட்பப் பிரிவுகள் வரையிலான திட்டமிட்ட கல்வி.',
      filters: {
        all: 'அனைத்து நிலைகளும்',
        primary: 'ஆரம்பப் பிரிவு (1–5)',
        junior: 'கனிஷ்ட இடைநிலை (6–11)',
        al: 'க.பொ.த. உயர்தரம் (A/L)',
      },
      subjectsHeading: 'முதன்மை மற்றும் விருப்பப் பாடங்கள்',
      pathwaysHeading: 'உயர்கல்வி மற்றும் எதிர்காலப் பாதைகள்',
    },
    staff: {
      kicker: 'தலைமைத்துவமும் ஆசிரியர் குழாமும்',
      heading: 'அதிபர் மற்றும் கல்விசார் ஆசிரியர்கள்',
      subtitle: 'யா/மானிப்பாய் மெமோறியல் ஆங்கிலப் பாடசாலையின் ஆரம்ப மற்றும் இடைநிலை மாணவர்களை வழிநடத்தும் அர்ப்பணிப்புள்ள ஆசிரியர் குழாம்.',
      principalRoleLabel: 'பாடசாலைத் தலைமைத்துவம் · அதிபர்',
      teachersHeading: 'கல்விசார் ஆசிரியர் விபரம்',
      filters: {
        All: 'அனைவரும்',
        Primary: 'ஆரம்பப் பிரிவு',
        Secondary: 'இடைநிலை',
      },
      emptyState: 'இப்பிரிவில் ஆசிரியர் விபரங்கள் எதுவும் இல்லை.',
    },
    formerPrincipals: {
      kicker: 'பாரம்பரியத்தின் வழிகாட்டிகள்',
      heading: 'முன்னாள் அதிபர்கள்',
      subtitle: 'தலைமுறைகளாக யா/மானிப்பாய் மெமோறியல் ஆங்கிலப் பாடசாலையை வழிநடத்தி உயர்த்திய முன்னாள் அதிபர்களுக்கான நன்றிப் பதிவு.',
      tenureLabel: 'பணிக்காலம்',
      emptyState: 'முன்னாள் அதிபர் விபரங்கள் இன்னும் சேர்க்கப்படவில்லை.',
    },
    examResults: {
      kicker: 'கல்வி அடைவுகள்',
      heading: 'தேசியப் பரீட்சைப் பெறுபேறுகள்',
      subtitle: 'தரம் 5 புலமைப்பரிசில், க.பொ.த சாதாரண தரம் மற்றும் க.பொ.த உயர்தரப் பரீட்சைகளின் வருடாந்த சித்தி வீதம் மற்றும் சிறந்த மாணவர்கள்.',
      categories: {
        All: 'அனைத்துப் பரீட்சைகளும்',
        Scholarship: 'புலமைப்பரிசில்',
        'O/L': 'க.பொ.த சாதாரண தரம்',
        'A/L': 'க.பொ.த உயர்தரம்',
      },
      passRateLabel: 'சித்தி வீதம்',
      topPerformersHeading: 'சிறப்புச் சித்தி பெற்ற மாணவர்கள்',
      photosHeading: 'வெற்றித் தருணப் படங்கள்',
      emptyState: 'தெரிவு செய்யப்பட்ட பிரிவில் பரீட்சைப் பெறுபேறுகள் எதுவும் இல்லை.',
    },
    smartSystems: {
      kicker: 'எண்ணிமப் பாடசாலைக் கட்டமைப்பு',
      heading: 'எமது ஸ்மார்ட் அமைப்புகள்',
      subtitle: 'யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலையின் அன்றாட நிர்வாகம், வரவுப் பதிவு, பரீட்சை அறிக்கை மற்றும் நேர ஒழுங்கமைப்பை வழிநடத்தும் எண்ணிமத் தளங்கள்.',
      launchButton: 'தளத்தைத் திறக்க',
      comingSoon: 'இணைப்பு விரைவில்',
    },
    notices: {
      kicker: 'உத்தியோகபூர்வ தகவல்கள்',
      heading: 'பாடசாலை அறிவிப்புப் பலகை',
      subtitle: 'பரீட்சை நேர அட்டவணைகள், சுற்றறிக்கைகள் மற்றும் எதிர்வரும் பாடசாலை நிகழ்வுகள்.',
      searchPlaceholder: 'முக்கிய சொல் அல்லது இலக்கத்தால் தேடுங்கள்...',
      categories: {
        All: 'அனைத்தும்',
        Exams: 'பரீட்சைகள்',
        Circulars: 'சுற்றறிக்கைகள்',
        Events: 'நிகழ்வுகள்',
      },
      pinnedLabel: 'முதன்மை அறிவிப்பு',
      readFull: 'முழு அறிவிப்பை வாசிக்க',
      closeDrawer: 'மூடு',
      emptyState: 'உங்கள் தேடலுக்குப் பொருத்தமான அறிவிப்புகள் இல்லை.',
      referenceLabel: 'குறிப்பு',
      viewAttachment: 'இணைப்பைக் காண்க / பதிவிறக்குக',
      downloadAttachment: 'கோப்பைப் பதிவிறக்குக',
      attachmentLabel: 'இணைக்கப்பட்ட ஆவணம்',
    },
    achievements: {
      kicker: 'சிறப்பும் பெருமையும்',
      heading: 'கல்வி, விளையாட்டு மற்றும் கலைச் சாதனைகள்',
      subtitle: 'வலய, மாகாண மற்றும் தேசிய மட்டங்களில் எமது மாணவர்கள் ஈட்டிய வெற்றிகள்.',
      categories: {
        All: 'அனைத்து சாதனைகளும்',
        Academic: 'கல்வி',
        Sports: 'விளையாட்டு',
        'Co-Curricular': 'இணைப்பாடவிதானம்',
      },
    },
    gallery: {
      kicker: 'பாடசாலை நினைவுகள்',
      heading: 'நினைவுச் சுவடுகள்',
      subtitle: 'ஆய்வுகூடப் பயிற்சிகள், இல்ல விளையாட்டுப் போட்டிகள், கலாச்சார விழாக்கள் மற்றும் வருடாந்த பரிசளிப்பு நிகழ்வுகள்.',
      categories: {
        All: 'அனைத்துப் படங்களும்',
        Campus: 'பாடசாலைச் சூழல்',
        Academics: 'கல்வி',
        Sports: 'விளையாட்டு',
        Cultural: 'கலாச்சாரம்',
      },
      photoCount: 'ஆவணப் புகைப்படங்கள்',
      photosBadge: 'படங்கள்',
      previous: 'முந்தைய படம்',
      next: 'அடுத்த படம்',
      close: 'மூடுக',
    },
    contact: {
      kicker: 'வருகை மற்றும் தொடர்பு',
      heading: 'தொடர்புகள் மற்றும் பாடசாலை அமைவிடம்',
      subtitle: 'மாணவர் அனுமதி, பழைய மாணவர் தொடர்புகள் மற்றும் அலுவலகத் தகவல்களுக்கு மானிப்பாய் மெமோறியல் லேன் பாடசாலையைத் தொடர்பு கொள்ளவும்.',
      addressLabel: 'பாடசாலை முகவரி',
      phoneLabel: 'அலுவலகத் தொலைபேசி',
      emailLabel: 'மின்னஞ்சல்',
      hoursLabel: 'அலுவலக நேரம்',
      formTitle: 'விசாரணைப் படிவம்',
      nameLabel: 'முழுப் பெயர்',
      emailFieldLabel: 'மின்னஞ்சல் முகவரி',
      phoneFieldLabel: 'தொலைபேசி இலக்கம்',
      subjectLabel: 'பொருள்',
      messageLabel: 'செய்தி',
      submitButton: 'செய்தியை அனுப்புக',
      submitting: 'அனுப்பப்படுகிறது...',
      successToast: 'உங்கள் தகவல் பதிவு செய்யப்பட்டது. பாடசாலை அலுவலகம் விரைவில் தொடர்பு கொள்ளும்.',
      validationError: 'தயவுசெய்து உங்கள் பெயர், மின்னஞ்சல் மற்றும் செய்தியை உள்ளிடவும்.',
    },
    footer: {
      description: 'யாழ்ப்பாணம் மானிப்பாயில் தமிழ் மொழி மூலக் கல்வி, ஒழுக்க தலைமைத்துவம் மற்றும் சமூக சேவையை வளர்க்கும் 1C மாகாணப் பாடசாலை.',
      quickLinks: 'பிரிவுகள்',
      schoolInfo: 'பாடசாலைத் தகவல்கள்',
      adminPortal: 'நிர்வாகப் பக்கம்',
      copyright: 'யா/மானிப்பாய் மெமோரியல் ஆங்கிலப் பாடசாலை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    },
  },
};
