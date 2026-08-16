(function () {
  "use strict";

  /*
   * SCLab website content source
   * -----------------------------
   * 이 파일만 수정하면 세 디자인 시안의 뉴스, 구성원, 논문, 연락처가 함께 바뀝니다.
   * 새 항목은 같은 형식으로 배열 끝에 추가하세요.
   */
  window.SCLAB_CONTENT = {
    site: {
      shortName: "SCLab",
      name: "Smart Computing Laboratory",
      university: "Konkuk University",
      department: "Department of Computer Science and Engineering",
      location: "건국대학교 신공학관 1216호",
      professorOffice: "공C291-2",
      professorOfficeNote: "건국대학교 공식 교수 소개 기준 · 공개 전 최신 위치 확인 권장",
      email: "ygha@konkuk.ac.kr",
      mapUrl: "https://maps.google.com/?q=%EA%B1%B4%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90+%EC%8B%A0%EA%B3%B5%ED%95%99%EA%B4%80",
      taglineKo: "시간에 따라 변하는 세계를 이해 가능한 지식으로.",
      taglineEn: "From evolving events to decision-ready intelligence.",
      description:
        "SCLab은 연속 시간 동적 그래프, 시간 지식 그래프와 온톨로지를 연구한다. 주요 응용 분야는 지능형 정보 시스템과 국방 상황 인지다."
    },

    professor: {
      nameKo: "하영국",
      nameEn: "Young-Guk Ha",
      role: "Professor · Laboratory Director",
      researchArea: "Intelligent Systems and Big Data",
      headline: "Intelligent Systems and Big Data",
      introduction: "건국대학교 컴퓨터공학부",
      narrative: "지식 기반 지능 시스템 · 빅데이터 · 동적 그래프 · 시공간 상황 인지 · 국방 데이터 분석",
      career: [
        { label: "Education", value: "KAIST · Ph.D. in Computer Science" },
        { label: "Research", value: "ETRI · Senior Researcher" },
        { label: "Current", value: "Konkuk University · Professor" }
      ],
      keywords: [
        "Knowledge-based AI",
        "Big Data",
        "Temporal Intelligence",
        "Situation Awareness",
        "Decision Systems"
      ],
      email: "ygha@konkuk.ac.kr",
      officialProfile: "https://ai.konkuk.ac.kr/ai/11854/subview.do?enc=Zm5jdDF8QEB8JTJGcHJvZkluZm8lMkZhaSUyRjEwNiUyRjIwODIwMDIxJTJGdmlldy5kbyUzRnNyY2hDdGdyJTNEJTI2"
    },

    research: [
      {
        id: "ctdg",
        code: "01 / CTDG",
        titleKo: "연속 시간 동적 그래프",
        titleEn: "Continuous-Time Dynamic Graphs",
        short:
          "불규칙하게 발생하는 상호작용을 연속적인 시간 위에서 학습합니다.",
        description:
          "사건의 발생 시점과 순서를 보존해 링크 예측, 이벤트 강도 추정과 시간 표현 학습을 연구한다.",
      },
      {
        id: "tkg",
        code: "02 / TKG",
        titleKo: "시간 지식 그래프",
        titleEn: "Temporal Knowledge Graphs",
        short:
          "사실과 관계가 언제 유효했는지 표현하고, 변화 이후의 지식을 추론합니다.",
        description:
          "주체·관계·객체에 시간 정보를 더해 사실의 변화를 표현하고 누락된 관계와 미래 사건을 추론한다.",
      },
      {
        id: "ontology",
        code: "03 / ONTOLOGY",
        titleKo: "온톨로지 기반 지능",
        titleEn: "Ontology-driven Intelligence",
        short:
          "서로 다른 데이터에 공통의 의미와 관계를 부여합니다.",
        description:
          "사람, 장비, 장소, 사건과 규칙의 의미와 관계를 정의한다. 온톨로지를 이용해 이질적인 데이터를 통합한다.",
      },
      {
        id: "mission",
        code: "04 / MISSION",
        titleKo: "미션·국방 지능 시스템",
        titleEn: "Mission & Defense Intelligence",
        short:
          "시공간·멀티모달 정보를 융합해 복잡한 상황의 이해와 판단을 돕습니다.",
        description:
          "센서, 보고, 개체와 사건을 시공간 정보로 통합한다. 국방 상황 인지, 협업형 에이전트와 의사결정 지원을 연구한다.",
      }
    ],

    news: [
      {
        date: "2026.07",
        displayDate: "JUL 2026",
        status: "출판 완료",
        title: "유민우 학부연구생, Information Sciences 제1저자 논문 출판",
        summary:
          "그래프마다 달라지는 이벤트 어휘를 분해해 공유 가능한 강도 기반 예측기로 학습하는 CTDG 파운데이션 모델 FLIP을 제안합니다.",
        publicationTitle:
          "FLIP: A foundation model for CTDG link prediction using factorized edge-event intensity",
        venue: "Information Sciences · Volume 757 · Article 123955",
        doi: "10.1016/j.ins.2026.123955",
        url: "https://doi.org/10.1016/j.ins.2026.123955"
      },
      {
        date: "2026.07.30",
        displayDate: "30 JUL 2026",
        status: "Preprint",
        title: "CTDG 링크 예측 평가의 샘플러 의존성 분석 공개",
        summary:
          "샘플링된 음성 후보가 모델 순위와 모듈 효과의 해석을 바꿀 수 있음을 보이고, 고정 카탈로그에서의 all-entity ranking을 제안합니다.",
        publicationTitle:
          "Back to All-Entity Ranking: Sampler-Dependent Evaluation in Continuous-Time Dynamic Graphs",
        venue: "arXiv · cs.AI",
        url: "https://arxiv.org/abs/2607.27861"
      }
    ],

    publications: [
      {
        year: "2026",
        type: "Journal",
        title: "FLIP: A foundation model for CTDG link prediction using factorized edge-event intensity",
        authors: "Minwoo Yu · Young-Guk Ha",
        venue: "Information Sciences 757, 123955",
        doi: "10.1016/j.ins.2026.123955",
        url: "https://doi.org/10.1016/j.ins.2026.123955",
        feature: true
      },
      {
        year: "2026",
        type: "Preprint",
        title: "Back to All-Entity Ranking: Sampler-Dependent Evaluation in Continuous-Time Dynamic Graphs",
        authors: "Minwoo Yu · Young-Guk Ha",
        venue: "arXiv:2607.27861",
        url: "https://arxiv.org/abs/2607.27861"
      },
      {
        year: "2024",
        type: "Conference",
        title: "Battlefield Situation Awareness Using Pretrained Generative LLM",
        authors: "Hyunseok Chung · Sunyoung Hyun · Young-Guk Ha",
        venue: "IEEE BigComp 2024",
        url: "https://doi.org/10.1109/BigComp60711.2024.00087"
      },
      {
        year: "2024",
        type: "Conference",
        title: "Multi-Agent Based Collaborative Agent Architecture for Battlefield Situation Awareness",
        authors: "Changeun Lee et al. · Young-Guk Ha",
        venue: "IEEE BigComp 2024",
        url: "https://pure.konkuk.ac.kr/en/publications/multi-agent-based-collaborative-agent-architecture-for-battlefiel/"
      },
      {
        year: "2022",
        type: "Conference",
        title: "Space-Time Multilayer Model for Battlefields Recognition",
        authors: "Changeun Lee et al. · Young-Guk Ha",
        venue: "IEEE BigComp 2022",
        url: "https://doi.org/10.1109/BigComp54360.2022.00071"
      }
    ],

    members: [
      { name: "장성수", degree: "박사과정", group: "phd", affiliation: "건국대학교" },
      { name: "현선영", degree: "박사과정", group: "phd", affiliation: "건국대학교" },
      { name: "황성연", degree: "박사과정", group: "phd", affiliation: "건국대학교" },
      { name: "공준영", degree: "석사과정", group: "masters", affiliation: "건국대학교" },
      { name: "서한중", degree: "석사과정", group: "masters", affiliation: "건국대학교" },
      { name: "양성모", degree: "석사과정", group: "masters", affiliation: "건국대학교" },
      { name: "궁영우", degree: "학부연구생", group: "undergraduate", affiliation: "건국대학교" },
      { name: "유민우", degree: "학부연구생", group: "undergraduate", affiliation: "건국대학교" },
      { name: "이해웅", degree: "학부연구생", group: "undergraduate", affiliation: "한국공학대학교" }
    ],

    join: {
      eyebrow: "Build intelligence that understands change.",
      title: "SCLab 지원 안내",
      description:
        "CTDG, TKG, 온톨로지와 국방 지능 시스템 연구에 관심 있는 학생은 이메일로 문의할 수 있다.",
      availability: "모집 여부와 세부 절차는 이메일로 사전 문의해 주세요.",
      tracks: [
        { title: "Undergraduate", text: "학부연구생 · 캡스톤 · 연구 인턴 문의" },
        { title: "Graduate", text: "석사·박사과정 연구 주제 및 진학 문의" },
        { title: "Collaboration", text: "산학·학술 공동연구와 데이터 협력 제안" }
      ],
      checklist: ["간단한 자기소개 또는 CV", "관심 있는 연구 질문", "참여 가능 시점과 기간"],
      email: "ygha@konkuk.ac.kr"
    },

    researchSources: [
      {
        label: "Konkuk University faculty profile",
        url: "https://ai.konkuk.ac.kr/ai/11854/subview.do?enc=Zm5jdDF8QEB8JTJGcHJvZkluZm8lMkZhaSUyRjEwNiUyRjIwODIwMDIxJTJGdmlldy5kbyUzRnNyY2hDdGdyJTNEJTI2"
      },
      {
        label: "Konkuk University research portal",
        url: "https://pure.konkuk.ac.kr/"
      },
      {
        label: "FLIP · Information Sciences",
        url: "https://doi.org/10.1016/j.ins.2026.123955"
      }
    ]
  };
})();
