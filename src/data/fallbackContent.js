/**
 * fallbackContent.js
 * Sample blog + gallery content used by the public site when the API or
 * database is unavailable. Kept in src/ so no server module is bundled
 * into the client build.
 */

export const initialBlogs = [
  {
    _id: 'blog-1',
    title: 'Building Insurance Claim Anomaly Detection: Inside InnoVortex 2024',
    slug: 'inside-innovortex-insurance-anomaly-detection',
    subtitle: 'Combining OCR, XGBoost, and FastAPI to Detect Fraudulent Claims in Real-Time',
    excerpt: 'How my team engineered an end-to-end multimodal pipeline to flag irregular insurance paperwork, achieving a Top 10 finalist position at InnoVortex.',
    category: 'AI & Machine Learning',
    tags: ['Machine Learning', 'FastAPI', 'XGBoost', 'OCR', 'Hackathons'],
    status: 'published',
    readTime: '6 min read',
    author: 'Dimple',
    publishedAt: new Date('2024-11-15'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Inside InnoVortex: Building Insurance Claim Anomaly Detection',
    seoDescription: 'A technical walkthrough of our multimodal fraud detection pipeline built during InnoVortex hackathon.',
    content: `## The Problem: Unstructured Paperwork and Claim Anomalies

Insurance claim verification is historically bottlenecked by manual scrutiny. When thousands of medical invoices, repair estimates, and claims flood an adjuster's desk, anomalous patterns—such as duplicate billing, inflated diagnostic charges, or manipulated doctor signatures—slip through undetected.

At the **InnoVortex Hackathon**, our goal was simple yet ambitious: **build a pipeline that ingests raw scanned PDFs, performs OCR cleanup, derives tabular behavioral features, and scores fraud likelihood in under 1.5 seconds.**

### 1. Document Extraction & OCR Normalization

We leveraged Tesseract along with specialized computer vision pre-processing filters (Gaussian adaptive thresholding and deskewing):

\`\`\`python
def preprocess_claim_scan(image_path: str):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    # Adaptive thresholding to remove hospital stamp noise
    thresh = cv2.adaptiveThreshold(
        image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 11, 2
    )
    return thresh
\`\`\`

Once text strings were isolated, regular expressions extracted structured metadata:
- Hospital registration numbers
- Invoice itemization line totals
- Patient admission and discharge timestamps
- Doctor license IDs

### 2. Tabular Feature Engineering & XGBoost Classification

From the raw tokens, we synthesized 34 distinct tabular features, including ratio of diagnostic costs to hospital tier, claim frequency per policyholder ID, and variance from historical average length of stay.

We trained an **XGBoost Classifier** combined with SMOTE (Synthetic Minority Over-sampling Technique) to account for severe class imbalance (fraud typically accounts for less than 3% of real-world claims).

> **Key Metric:** Our final ensemble achieved a **94% recall rate** on anomalous test sets with an inference latency of under **450 milliseconds** per document package.

### 3. Deploying the FastAPI Inference Service

We packaged the model into a containerized FastAPI service with async endpoint workers, enabling batch ingestion for claims handlers.

Building this under time constraints taught me the invaluable importance of data quality over hyperparameter tuning. When you feed clean, engineered domain features into tree ensembles, the accuracy gains far outstrip brute-force model swapping.`
  },
  {
    _id: 'blog-2',
    title: 'The Art of Responsive Canvas Sprite Sheets: 145 Frames at 60 FPS',
    slug: 'responsive-canvas-sprite-sheets-animation',
    subtitle: 'Behind the Scenes of Dimple\'s World Interactive Character Architecture',
    excerpt: 'How we split high-resolution anime video frames into paginated WebP texture atlases, avoided texture memory limits, and achieved buttery LERP mouse tracking.',
    category: 'Engineering',
    tags: ['Canvas', 'Performance', 'Animation', 'React', 'Frontend'],
    status: 'published',
    readTime: '5 min read',
    author: 'Dimple',
    publishedAt: new Date('2024-12-02'),
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-02'),
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Responsive Canvas Sprite Sheets: 145 Frames at 60 FPS',
    seoDescription: 'How we built the high-performance sprite atlas engine behind Dimple\'s World hero section.',
    content: `## Why Not Just Use Video?

When designing the hero section for **Dimple's World**, I wanted an anime character that turns her gaze smoothly toward your cursor.

Video elements have fundamental limitations for high-frequency cursor tracking:
- \`HTMLVideoElement.currentTime\` updates are throttled by browser rendering engines to keyframes or 100ms intervals.
- Scrubbing backward causes noticeable audio/video decoder stalls.
- High memory usage on mobile devices when keeping decoders awake.

Instead, we built a **custom HTML5 Canvas texture engine** that renders pre-rasterized frames via Linear Interpolation (LERP).

### The Texture Size Dilemma

The source video has **145 frames** at **1280 × 720 px**. If placed into a single horizontal strip:
$$145 \\times 1280 = 185,600\\text{ pixels wide}$$

Most GPUs and mobile browsers reject textures wider than **4096** or **8192** pixels. 

### The Solution: Paginated 3×3 WebP Atlases

We wrote an automated FFmpeg & Python pipeline that chops the 145 frames into **17 compact 3×3 grid atlases**:
- Each atlas page is at most **3840 × 2160 px**.
- Saved in modern **WebP** format at quality 88.
- Overall asset payload dropped from 85MB raw down to under **14MB total**.

\`\`\`javascript
// Smooth LERP calculation on animation frame
const targetFrame = Math.round(normX * (totalFrames - 1));
currentFrameRef.current += (targetFrame - currentFrameRef.current) * 0.14;
\`\`\`

The result is instant 60 FPS physical responsiveness that feels tactile, alive, and effortless.`
  },
  {
    _id: 'blog-3',
    title: 'From Hackathons to Systems: Reflections on My Journey at IGDTUW',
    slug: 'reflections-on-my-journey-at-igdtuw',
    subtitle: 'Lessons Learned in Information Technology, Competitive Coding, and Community',
    excerpt: 'Reflecting on my first two years at Indira Gandhi Delhi Technical University for Women—the sprints, the bugs, and the collaborative joy of engineering.',
    category: 'Personal Journal',
    tags: ['IGDTUW', 'College', 'Engineering', 'Mentorship', 'Life Updates'],
    status: 'published',
    readTime: '4 min read',
    author: 'Dimple',
    publishedAt: new Date('2025-01-20'),
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    seoTitle: 'Reflections on My Journey at IGDTUW | Dimple\'s World',
    seoDescription: 'Thoughts and learnings from my time as an Information Technology student at IGDTUW.',
    content: `## Stepping into IGDTUW

Entering **Indira Gandhi Delhi Technical University for Women (IGDTUW)** was both thrilling and humbling. Surrounded by brilliant peers who build apps overnight and solve algorithmic problems with elegance, I quickly realized that college is not about competing against others—it's about expanding your threshold for what you can create.

### Key Takeaways from the Trenches:

1. **Ship early, refine with feedback:** Your first version will be imperfect. Whether it's an AI model or a web interface, getting it into the hands of real users yields insights no amount of theoretical contemplation can provide.
2. **Community multiplies momentum:** Brainstorming late into the night during hackathon sprints taught me that team chemistry and empathy produce superior software.
3. **Blend art with logic:** When logic meets artistic intuition, software stops being a utility and starts becoming an experience.`
  }
];

export const initialGallery = [
  {
    _id: 'gal-1',
    title: 'InnoVortex 2024 Finalist Moment',
    description: 'Pitching our AI fraud anomaly detection platform to the jury and securing a Top 10 finish.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    category: 'Hackathons',
    albumId: 'hackathons',
    altText: 'Hackathon team presentation',
    isFeatured: true,
    displayOrder: 1,
    dateTaken: 'Nov 2024',
    createdAt: new Date('2024-11-16')
  },
  {
    _id: 'gal-2',
    title: 'Late Night Code & Sakura Dreams',
    description: 'Working on Dimpuru animation frames and sprite shaders until 3:00 AM.',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    category: 'Tech & Setups',
    albumId: 'workspace',
    altText: 'Development workspace with glowing monitors',
    isFeatured: true,
    displayOrder: 2,
    dateTaken: 'Dec 2024',
    createdAt: new Date('2024-12-05')
  },
  {
    _id: 'gal-3',
    title: 'IGDTUW Campus in Spring Bloom',
    description: 'Walking between technical sessions under the pink blooming trees.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    category: 'Campus Life',
    albumId: 'igdtuw',
    altText: 'University campus grounds',
    isFeatured: true,
    displayOrder: 3,
    dateTaken: 'Jan 2025',
    createdAt: new Date('2025-01-15')
  },
  {
    _id: 'gal-4',
    title: 'Mochi Character Sketch & Color Board',
    description: 'First digital watercolor studies for Mochi the AI cat companion.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    category: 'Creative Artwork',
    albumId: 'art',
    altText: 'Digital artwork conceptual board',
    isFeatured: true,
    displayOrder: 4,
    dateTaken: 'Feb 2025',
    createdAt: new Date('2025-02-10')
  },
  {
    _id: 'gal-5',
    title: 'MOVES 2026 Innovation Challenge',
    description: 'Selected among Top 200 participants across India in algorithmic problem solving.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
    category: 'Hackathons',
    albumId: 'hackathons',
    altText: 'Team collaboration around laptops',
    isFeatured: false,
    displayOrder: 5,
    dateTaken: 'Feb 2025',
    createdAt: new Date('2025-02-22')
  },
  {
    _id: 'gal-6',
    title: 'Minimalist Tokyo Dreamscape',
    description: 'Aesthetic photo inspiration for the Midnight Sakura dark theme gradient tokens.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
    category: 'Aesthetic',
    albumId: 'aesthetic',
    altText: 'Tokyo street illuminated by neon pink and purple',
    isFeatured: true,
    displayOrder: 6,
    dateTaken: 'Jan 2025',
    createdAt: new Date('2025-01-25')
  }
];
