/**
 * portfolioData.js
 * Comprehensive structured dataset for DIMPLE'S WORLD – The Creative Universe of Dimple.
 */

export const personalInfo = {
  name: 'Dimple',
  brandName: "DIMPLE'S WORLD",
  brandSubtitle: 'THE CREATIVE UNIVERSE OF DIMPLE',
  title: 'Information Technology Undergraduate & Creative Technologist',
  institution: 'Indira Gandhi Delhi Technical University for Women (IGDTUW)',
  graduationYear: '2028',
  location: 'New Delhi, India',
  email: 'bhdimple06@gmail.com',
  github: 'https://github.com/Dimple-11',
  linkedin: 'https://linkedin.com/in/dimple-11',
  codeforces: 'https://codeforces.com',
  leetcode: 'https://leetcode.com',
  tagline: 'Where code meets creativity, and every pixel has a story.',
  rotatingPhrases: [
    'AI/ML Explorer',
    'Full-Stack Developer',
    'Creative Technologist',
    'Problem Solver',
    'Hackathon Sprinter'
  ],
  bio: "Hi, I'm Dimple, an Information Technology undergraduate at IGDTUW. I enjoy building AI-powered applications, full-stack products, and creative digital experiences that solve real-world problems.",
  status: 'Open to SDE & AI/ML Opportunities'
};

export const aboutHighlights = [
  {
    title: 'Education',
    subtitle: 'B.Tech in Information Technology',
    institution: 'IGDTUW (2024 – 2028)',
    desc: 'Deep study of Computer Systems, Data Structures, Algorithms, Machine Learning Foundations, and Distributed Architecture.',
    tag: 'Academic Track',
    badge: 'IGDTUW'
  },
  {
    title: 'Core Focus',
    subtitle: 'AI/ML & Full-Stack Systems',
    institution: 'Applied Intelligence',
    desc: 'Architecting intelligent pipelines with LLMs, RAG, NLP, and high-performance React/Node/Python web ecosystems.',
    tag: 'Engineering',
    badge: 'AI & Web'
  },
  {
    title: 'Development Philosophy',
    subtitle: 'Simplicity, Empathy & Rigor',
    institution: 'Creative Technology',
    desc: 'Crafting software that pairs mathematical precision with playful, responsive user interfaces and tactile motion.',
    tag: 'Mindset',
    badge: 'Craft'
  },
  {
    title: 'Beyond the Code',
    subtitle: 'Media, Content & Communication',
    institution: 'Creative Expression',
    desc: 'Directing creative media, writing technical breakdowns, and building engaged student engineering communities.',
    tag: 'Interdisciplinary',
    badge: 'Storytelling'
  }
];

export const skillsData = [
  {
    category: 'Programming Languages',
    description: 'Core languages for algorithmic problem solving and system development',
    skills: [
      { name: 'C++', level: 'Advanced', highlight: true, icon: 'cpp' },
      { name: 'Python', level: 'Advanced', highlight: true, icon: 'python' },
      { name: 'JavaScript', level: 'Proficient', highlight: false, icon: 'js' },
      { name: 'TypeScript', level: 'Proficient', highlight: false, icon: 'ts' }
    ]
  },
  {
    category: 'Frontend Development',
    description: 'Modern reactive interfaces, component design systems, and high-DPI canvas interactions',
    skills: [
      { name: 'React', level: 'Advanced', highlight: true, icon: 'react' },
      { name: 'Vite', level: 'Proficient', highlight: false, icon: 'vite' },
      { name: 'Next.js', level: 'Familiar', highlight: false, icon: 'next' },
      { name: 'Tailwind CSS', level: 'Advanced', highlight: true, icon: 'tailwind' },
      { name: 'HTML5 Canvas', level: 'Proficient', highlight: true, icon: 'canvas' }
    ]
  },
  {
    category: 'Backend & APIs',
    description: 'Scalable service architectures, microservices, and asynchronous workers',
    skills: [
      { name: 'Flask', level: 'Advanced', highlight: true, icon: 'flask' },
      { name: 'FastAPI', level: 'Proficient', highlight: true, icon: 'fastapi' },
      { name: 'Node.js', level: 'Proficient', highlight: false, icon: 'node' },
      { name: 'Express', level: 'Proficient', highlight: false, icon: 'express' },
      { name: 'REST APIs', level: 'Advanced', highlight: false, icon: 'rest' }
    ]
  },
  {
    category: 'Databases & Storage',
    description: 'Document stores and relational schemas for high throughput applications',
    skills: [
      { name: 'MongoDB', level: 'Advanced', highlight: true, icon: 'mongo' },
      { name: 'PostgreSQL', level: 'Proficient', highlight: false, icon: 'postgres' },
      { name: 'Vector DBs', level: 'Familiar', highlight: false, icon: 'vector' }
    ]
  },
  {
    category: 'AI / ML & Data Science',
    description: 'Statistical modeling, deep learning architectures, and LLM engineering',
    skills: [
      { name: 'NumPy & Pandas', level: 'Advanced', highlight: true, icon: 'pandas' },
      { name: 'Scikit-learn', level: 'Advanced', highlight: true, icon: 'sklearn' },
      { name: 'XGBoost', level: 'Proficient', highlight: true, icon: 'xgboost' },
      { name: 'TensorFlow / Keras', level: 'Proficient', highlight: false, icon: 'tf' },
      { name: 'NLP & Tokenization', level: 'Advanced', highlight: true, icon: 'nlp' },
      { name: 'Hugging Face & LLMs', level: 'Proficient', highlight: true, icon: 'hf' },
      { name: 'RAG Architectures', level: 'Proficient', highlight: true, icon: 'rag' }
    ]
  },
  {
    category: 'Tools & DevOps',
    description: 'Development environment, version control, and containerization',
    skills: [
      { name: 'Git & GitHub', level: 'Advanced', highlight: true, icon: 'git' },
      { name: 'VS Code', level: 'Advanced', highlight: false, icon: 'vscode' },
      { name: 'Postman', level: 'Proficient', highlight: false, icon: 'postman' },
      { name: 'Docker', level: 'Familiar', highlight: false, icon: 'docker' },
      { name: 'MongoDB Compass', level: 'Proficient', highlight: false, icon: 'compass' }
    ]
  }
];

export const projectsData = [
  {
    id: 'insurance-fraud',
    slug: 'insurance-fraud-detection',
    title: 'AI-Powered Insurance Fraud Detection',
    subtitle: 'Ensemble Machine Learning & Document OCR Pipeline',
    category: 'AI / ML',
    shortDesc: 'Automated claim anomaly detection combining Tesseract OCR document parsing, NLP text feature extraction, and an ensemble XGBoost classifier.',
    tags: ['Python', 'XGBoost', 'Flask', 'FastAPI', 'NLP', 'Tesseract OCR'],
    github: 'https://github.com/Dimple-11',
    demo: null,
    metrics: '94% Recall on Anomalies',
    featured: true,
    problem: 'Health and auto insurance providers process tens of thousands of claims monthly. Manual invoice scrutiny is slow, error-prone, and struggles to flag subtle document anomalies across medical billing codes and fraudulent duplicates.',
    solution: 'Designed an automated verification pipeline that parses multi-page PDF bills via OCR, extracts named entities (providers, ICD codes, total billing amounts), and evaluates claims through an XGBoost model trained on historical fraud patterns.',
    architecture: 'Input Document -> Preprocessing & Tesseract OCR -> NLP Feature Vectorizer -> Gradient Boosted Anomaly Scorer -> Alert Generation API.',
    myContribution: 'Engineered the OCR text cleanup pipeline, extracted tabular claim metrics, trained and cross-validated the XGBoost model, and created the REST inference endpoint in FastAPI.',
    challenges: 'Handling noisy scanned bills with skewed rotations and non-standard tabular formats. Solved using adaptive image thresholding and morphological deskewing before OCR.',
    results: 'Substantially reduced manual screening overhead while achieving 94% anomaly recall on benchmark claim evaluation sets.'
  },
  {
    id: 'trend-radar',
    slug: 'trend-radar',
    title: 'Trend Radar Intelligence',
    subtitle: 'Automated Real-Time News & Topic Velocity Engine',
    category: 'Backend',
    shortDesc: 'Continuous news ingestion engine that aggregates unstructured feeds, computes keyword velocity metrics, and clusters emerging tech trends.',
    tags: ['Python', 'MongoDB', 'News APIs', 'RSS Feeds', 'Topic Clustering'],
    github: 'https://github.com/Dimple-11',
    demo: null,
    metrics: 'Real-time Feed Indexing',
    featured: true,
    problem: 'Staying ahead of tech paradigm shifts requires scanning dozens of newsletters, research preprints, and developer blogs, resulting in fragmented information overload.',
    solution: 'Created an automated worker daemon that scrapes tech feeds on a cron schedule, normalizes articles into MongoDB, clusters co-occurring keywords, and scores trend velocity.',
    architecture: 'Feed Scraper Worker -> Article Deduplication -> Keyword Frequency & TF-IDF Extraction -> MongoDB Atlas Aggregations -> Dashboard Visualizer.',
    myContribution: 'Designed the concurrent ingestion loop, built MongoDB aggregation pipelines for temporal keyword tracking, and implemented custom scoring formulas.',
    challenges: 'Rate limits on public news endpoints and article deduplication across syndication channels. Addressed via fuzzy title hashing and exponential backoff retry workers.',
    results: 'Indexed thousands of daily technical releases and accurately surfaced breakout topics 48 hours prior to mainstream developer coverage.'
  },
  {
    id: 'sentiment-analysis',
    slug: 'sentiment-analysis',
    title: 'Neural Sentiment Analysis Engine',
    subtitle: 'Bidirectional LSTM for Nuanced Text Classification',
    category: 'NLP',
    shortDesc: 'Deep learning classification system using Bidirectional LSTM networks and dense word embeddings to capture context, slang, and sentiment polarity.',
    tags: ['Python', 'TensorFlow', 'LSTM', 'NLTK', 'Word2Vec'],
    github: 'https://github.com/Dimple-11',
    demo: null,
    metrics: 'Deep Sequential Context',
    featured: false,
    problem: 'Standard lexical sentiment dictionaries fail on sarcasm, negation (e.g., "not bad at all"), and long-distance syntactic dependencies in human product reviews.',
    solution: 'Built a multi-layer Bidirectional LSTM neural network trained on over 50,000 text reviews, utilizing word embeddings to capture contextual semantics in both directions.',
    architecture: 'Raw Text Input -> Tokenization & Stemming (NLTK) -> Embedding Layer -> Bi-LSTM Layers with Dropout -> Dense Softmax Classifier.',
    myContribution: 'Preprocessed raw text datasets, tuned hyper-parameters (learning rates, dropout rates, sequence lengths) to prevent overfitting, and deployed Flask inference.',
    challenges: 'High variance on colloquial slang and out-of-vocabulary terms. Solved by fine-tuning pre-trained GloVe embeddings and applying subword tokenization.',
    results: 'Outperformed classic Naive Bayes baselines by 14% on complex negation benchmarks.'
  },
  {
    id: 'breast-cancer',
    slug: 'breast-cancer-prediction',
    title: 'Breast Cancer Diagnostic Predictor',
    subtitle: 'Statistical Biometric Feature Modeling',
    category: 'Data Science',
    shortDesc: 'Supervised classification model analyzing Fine Needle Aspirate (FNA) digitized cell characteristics to support early cancer diagnosis.',
    tags: ['Python', 'Scikit-learn', 'Machine Learning', 'Flask', 'Pandas'],
    github: 'https://github.com/Dimple-11',
    demo: null,
    metrics: 'High Sensitivity Support',
    featured: false,
    problem: 'Early clinical intervention for breast tumors relies on accurately separating benign cysts from malignant neoplasms based on cellular morphology without unnecessary biopsies.',
    solution: 'Applied statistical data science techniques—feature correlation heatmaps, PCA, and comparative evaluations between SVM, Logistic Regression, and Random Forest models.',
    architecture: 'FNA Cell Features -> Missing Value Imputation -> MinMax Normalization -> SVM/Random Forest Evaluation -> Diagnostic Probability Score.',
    myContribution: 'Performed thorough Exploratory Data Analysis, addressed severe feature multicollinearity, tuned regularization parameters, and built a clean Flask diagnostic web tool.',
    challenges: 'High correlation between perimeter, radius, and area metrics. Addressed via Principal Component Analysis (PCA) and selective feature pruning.',
    results: 'Demonstrated high diagnostic sensitivity, prioritizing zero false negatives in malignant classification.'
  },
  {
    id: 'saathi-sewa',
    slug: 'saathi-sewa',
    title: 'Saathi Sewa: Voice-First Citizen Assistant',
    subtitle: 'Multilingual Speech & RAG Information Portal',
    category: 'Full Stack',
    shortDesc: 'Voice-based conversational AI system breaking literacy and linguistic barriers for rural citizens seeking public scheme benefits.',
    tags: ['Speech-to-Text', 'LLMs', 'RAG', 'Text-to-Speech', 'FastAPI'],
    github: 'https://github.com/Dimple-11',
    demo: null,
    metrics: 'Voice-First Multilingual',
    featured: true,
    problem: 'Complex government scheme portals and bureaucratic paperwork are virtually inaccessible to millions of rural citizens lacking digital literacy or English proficiency.',
    solution: 'Engineered an accessible voice-in, voice-out conversational bot that translates regional voice queries, runs semantic RAG retrieval over official scheme docs, and speaks back in plain language.',
    architecture: 'Voice Audio -> Speech-to-Text -> Scheme Vector Database (RAG) -> LLM Synthesis -> Text-to-Speech Audio Playback.',
    myContribution: 'Implemented semantic search over structured welfare guidelines, engineered constrained system prompts to prevent hallucinations, and connected voice streaming endpoints.',
    challenges: 'Latency in chained STT -> RAG -> LLM -> TTS pipelines. Reduced turnaround time by streaming audio chunks and caching frequent scheme definitions.',
    results: 'Enabled seamless voice interaction for non-English speakers, translating complex eligibility criteria into simple 3-step action points.'
  },
  {
    id: 'paytm-smart-payment',
    slug: 'smart-payment-system',
    title: 'Paytm Token-Based Smart Payment',
    subtitle: 'Cryptographic Tokenization & Resilient Transacting',
    category: 'Backend',
    shortDesc: 'Cryptographic offline-first transaction system ensuring zero card data exposure and robust double-spend prevention.',
    tags: ['Node.js', 'Express', 'MongoDB', 'HMAC Tokens', 'Security'],
    github: 'https://github.com/Dimple-11',
    demo: null,
    metrics: 'Zero Card Leakage',
    featured: false,
    problem: 'Intermittent mobile connectivity causes checkout dropouts, while storing raw card credentials introduces critical compliance risks in point-of-sale systems.',
    solution: 'Constructed an HMAC tokenization protocol where short-lived cryptographic tokens are generated for authorization, verified atomically against MongoDB state.',
    architecture: 'Client App -> HMAC Token Generation -> Signature Verification Gateway -> Atomic MongoDB Balance Deduction -> Idempotent Receipt.',
    myContribution: 'Authored secure Node.js middleware, enforced nonce tracking for replay-attack defense, and implemented ACID transaction semantics in MongoDB.',
    challenges: 'Preventing double-spend concurrency race conditions during network recovery. Solved using atomic document versioning and conditional balance updates.',
    results: 'Guaranteed cryptographic idempotency and transaction integrity across simulated unstable network conditions.'
  }
];

export const experienceData = [
  {
    role: 'AI / ML Engineering Intern',
    organization: 'ProdigalAI',
    period: 'Internship',
    type: 'Engineering',
    location: 'Remote',
    description: 'Engineered machine learning pipelines, trained predictive models, and evaluated feature engineering optimizations on enterprise datasets.',
    highlights: [
      'Developed data preprocessing workflows with Pandas and Scikit-learn to handle real-world missing and skewed inputs',
      'Experimented with gradient boosting algorithms and neural loss convergence parameters',
      'Assisted in integrating machine learning inference endpoints for production testing'
    ]
  },
  {
    role: 'Media & Technology Development',
    organization: 'Aevona Solutions',
    period: 'Ongoing',
    type: 'Technology & Media',
    location: 'New Delhi',
    description: 'Leading website and technology development, digital platform presence, and technical media assets for brand identity.',
    highlights: [
      'Developed and maintained web architecture and responsive digital interfaces with modern frontend tooling',
      'Coordinated technical media assets and digital communication materials for cross-platform presence',
      'Supported technology adoption and cross-functional brand presentation'
    ]
  },
  {
    role: 'Head of Content Team',
    organization: 'TechNeeds',
    period: 'Leadership',
    type: 'Content & Strategy',
    location: 'New Delhi',
    description: 'Spearheaded editorial direction, team management, and technical communication initiatives.',
    highlights: [
      'Led a team of content creators delivering accessible tech breakdowns on emerging engineering topics',
      'Devised content strategies that expanded reader engagement and community retention',
      'Fostered collaborative workflows and editorial guidelines across student writers'
    ]
  },
  {
    role: 'Campus Ambassador',
    organization: 'Unstop',
    period: 'Community',
    type: 'Outreach & Growth',
    location: 'Campus',
    description: 'Drove student engagement, hackathon participation, and technical competitive culture across university campus.',
    highlights: [
      'Mobilized student teams for national-level hackathons and engineering challenges',
      'Organized outreach sessions highlighting career, coding, and internship opportunities',
      'Recognized for exceptional campus community leadership and student participation growth'
    ]
  }
];

export const achievementsData = [
  {
    id: 'innovortex',
    title: 'Top 10 Finalist',
    event: 'InnoVortex 2.0 Hackathon',
    year: '2024 – 2025',
    category: 'Hackathon Finalist',
    description: 'Selected among the top 10 finalists out of hundreds of participating engineering teams nationwide for prototyping an innovative software solution under strict judging criteria.'
  },
  {
    id: 'moves',
    title: 'Top 200 Teams Nationwide',
    event: 'MOVES 2026 by Axis Bank',
    year: '2026',
    category: 'National Competition',
    description: 'Ranked in the top 200 teams out of 43,110+ total registrations across premier universities across India in Axis Bank’s flagship national innovation competition.'
  },
  {
    id: 'cp',
    title: 'Algorithmic Problem Solving',
    event: 'Codeforces & LeetCode',
    year: 'Active',
    category: 'Competitive Programming',
    description: 'Regularly solving algorithmic problems spanning Dynamic Programming, Graph Traversals, Binary Search, and Advanced Data Structures with focus on time and space complexity.'
  },
  {
    id: 'hackathons',
    title: 'National Hackathon Participant',
    event: 'Inter-College Tech Hackathons',
    year: '2024 – 2026',
    category: 'Innovation Sprints',
    description: 'Participated in intense 24-48 hour hackathon sprints, delivering fully working full-stack and AI prototypes from scratch under strict deadlines.'
  }
];

export const certificationsData = [
  {
    id: 'hf-llm',
    name: 'Hugging Face LLM Fundamentals',
    issuer: 'Hugging Face',
    category: 'AI / LLMs',
    date: 'Verified',
    credentialUrl: 'https://huggingface.co',
    desc: 'Deep dive into transformer architectures, tokenization, fine-tuning techniques, and practical open-source LLM deployments.'
  },
  {
    id: 'ml-specialization',
    name: 'Machine Learning & Python Specialization',
    issuer: 'Technical Certification',
    category: 'Data Science',
    date: 'Verified',
    credentialUrl: '#',
    desc: 'Covering supervised learning, unsupervised clustering, statistical inference, and gradient boosted tree architectures.'
  },
  {
    id: 'hackathon-honors',
    name: 'Hackathon National Honors & Citations',
    issuer: 'Organizing Committees',
    category: 'Competitions',
    date: 'Recognized',
    credentialUrl: '#',
    desc: 'Official citations and certificates of merit for podium and finalist finishes across collegiate hackathons.'
  }
];

export const creativePillars = [
  {
    tag: 'Creative Direction',
    title: 'Digital Media & Visual Experiences',
    desc: 'Merging design sensibilities with code. Crafting cohesive visual identities, responsive branding, and aesthetic digital media at Aevona Solutions.',
    accent: 'Media & Tech'
  },
  {
    tag: 'Content & Editorial',
    title: 'Technical Storytelling',
    desc: 'Leading content initiatives at TechNeeds. Demystifying complex machine learning and engineering concepts into engaging, accessible narratives for builders.',
    accent: 'Leadership'
  },
  {
    tag: 'Community Growth',
    title: 'Campus Leadership & Mentorship',
    desc: 'Inspiring peers as an Unstop Campus Ambassador. Organizing hackathon briefings, connecting students to opportunities, and cultivating engineering curiosity.',
    accent: 'Community'
  }
];

export const currentlyExploring = [
  { title: 'Generative AI & LLMs', desc: 'RAG pipelines, prompt distillation, and local model inference' },
  { title: 'Multi-Agent Architectures', desc: 'Autonomous collaborative agents executing tool calls' },
  { title: 'Distributed Systems', desc: 'High-availability microservices and asynchronous message queues' },
  { title: 'AI Automation', desc: 'Autonomous developer workflows and automated data intelligence' },
  { title: 'Scalable Backends', desc: 'FastAPI, asynchronous workers, and low-latency database queries' }
];

// Knowledge base for Mochi AI Assistant
export const mochiKnowledgeBase = [
  {
    keywords: ['who', 'about', 'dimple', 'intro', 'background', 'student'],
    answer: "Dimple is an Information Technology undergraduate at Indira Gandhi Delhi Technical University for Women (IGDTUW), graduating in 2028. She loves building AI-powered applications, full-stack products, and creative digital experiences!"
  },
  {
    keywords: ['projects', 'work', 'creations', 'fraud', 'radar', 'saathi', 'sentiment'],
    answer: "Dimple has built real-world projects including: (1) AI-Powered Insurance Fraud Detection with XGBoost & OCR, (2) Trend Radar Intelligence for tech news velocity, (3) Saathi Sewa multilingual voice assistant, (4) Neural Sentiment Analysis with Bi-LSTM, and (5) Paytm Token-Based Smart Payment System. Check the /projects page to explore all of them!"
  },
  {
    keywords: ['skills', 'tech', 'stack', 'languages', 'python', 'cpp', 'react'],
    answer: "Her core languages are C++, Python, JavaScript, and TypeScript. For web, she uses React, Vite, Next.js, Flask, FastAPI, Node.js, and MongoDB. In AI/ML, she works with NumPy, Pandas, Scikit-learn, XGBoost, TensorFlow, NLP, and LLM/RAG pipelines!"
  },
  {
    keywords: ['experience', 'internship', 'prodigalai', 'aevona', 'techneeds', 'unstop'],
    answer: "Dimple has interned as an AI/ML Engineering Intern at ProdigalAI, leads Media & Technology Development at Aevona Solutions, served as Head of Content at TechNeeds, and was a Campus Ambassador for Unstop!"
  },
  {
    keywords: ['achievements', 'hackathons', 'awards', 'innovortex', 'moves', 'codeforces'],
    answer: "She is a Top 10 Finalist in InnoVortex 2.0 Hackathon, placed in the Top 200 teams nationwide in MOVES 2026 by Axis Bank (among 43,110+ participants), and actively trains on Codeforces & LeetCode!"
  },
  {
    keywords: ['exploring', 'learning', 'future', 'interests'],
    answer: "Right now, she is diving deep into Multi-Agent LLM Orchestration, Low-Latency RAG Retrieval Pipelines, Autonomous AI Tool Use, and Canvas/WebGL Shaders!"
  },
  {
    keywords: ['contact', 'email', 'hire', 'reach', 'github', 'linkedin'],
    answer: "You can reach Dimple directly at bhdimple06@gmail.com, connect on LinkedIn (linkedin.com/in/dimple-11), or check her GitHub (github.com/Dimple-11). You can also use the /contact page!"
  }
];
