export interface LectureSection {
  heading: string
  paragraphs: string[]
}

export interface SampleLecture {
  id: string
  title: string
  summary: string
  estimatedMinutes: number
  sections: LectureSection[]
}

export const SAMPLE_LECTURES: SampleLecture[] = [
  {
    id: 'cysts-intro',
    title: 'Odontogenic cysts — classification and clinicopathologic cues',
    summary:
      'Differentiate inflammatory versus developmental cysts, correlate vitality testing with radicular disease, and outline surveillance expectations after treatment.',
    estimatedMinutes: 25,
    sections: [
      {
        heading: 'Foundational concepts',
        paragraphs: [
          'Odontogenic cysts are pathologic cavities lined by epithelium that arises from remnants of odontogenic epithelium associated with tooth formation.',
          'Classification blends developmental mechanisms with secondary inflammatory change; radicular cysts illustrate inflammation-driven expansion at a non-vital apex.',
          'Dentigerous cysts classically surround the crown of an impacted tooth and expand with follicular fluid accumulation rather than strictly pulpal necrosis.',
        ],
      },
      {
        heading: 'Clinical and radiographic anchors',
        paragraphs: [
          'Radicular cysts often accompany deep caries or trauma history with loss of pulp vitality; panoramic imaging may reveal a well-defined periapical radiolucency linked to the offending tooth.',
          'Dentigerous cysts prompt evaluation for spacing symptoms and third-molar impaction patterns; borders may appear corticated around the crown when imaging is ideal.',
          'Keratocystic lesions demand discussion of recurrence dynamics even when initial excision appears complete, motivating structured follow-up intervals.',
        ],
      },
      {
        heading: 'Study checklist',
        paragraphs: [
          'Memorize which cysts tie to non-vital teeth versus impacted crowns before attempting board-style vignettes.',
          'Sketch mental maps linking epithelial lining behavior with recurrence risk to reinforce histology lectures.',
        ],
      },
    ],
  },
  {
    id: 'tumors-epithelial',
    title: 'Odontogenic tumors — epithelial patterns from ameloblastoma to keratocyst',
    summary:
      'Survey benign epithelial odontogenic neoplasms, emphasizing mandibular predilection, imaging silhouettes, and why keratocystic lesions behave unlike routine cysts.',
    estimatedMinutes: 30,
    sections: [
      {
        heading: 'Ameloblastoma essentials',
        paragraphs: [
          'Ameloblastoma remains the archetypal benign but locally invasive odontogenic epithelial tumor and frequently involves the posterior mandible in clinical series.',
          'Multilocular radiolucencies on panoramic films invite differential consideration alongside odontogenic keratocyst and central giant cell lesions depending on patient age.',
          'Surgical planning integrates margin assessment from imaging because peripheral extension may not be clinically obvious on mucosal examination alone.',
        ],
      },
      {
        heading: 'Keratocystic odontogenic tumor considerations',
        paragraphs: [
          'Keratocystic lesions exhibit parakeratinized epithelial lining and biologic behavior that can include aggressive recurrence compared with many dentigerous cysts.',
          'Syndromic associations such as nevoid basal cell carcinoma syndrome elevate the importance of longitudinal surveillance even after apparently successful surgery.',
          'Documentation should emphasize communication between pathology, radiology, and surgery teams when coordinating re-excision versus adjunctive strategies.',
        ],
      },
      {
        heading: 'Learning tactics',
        paragraphs: [
          'Compare ameloblastoma versus OKC using a two-column table covering epithelial origin, recurrence drivers, and typical jaw sites.',
          'Practice explaining imaging findings in patient-friendly language while retaining precise terminology for examinations.',
        ],
      },
    ],
  },
  {
    id: 'mesenchymal-radiology',
    title: 'Mesenchymal odontogenic tumors and imaging correlation',
    summary:
      'Introduce select mesenchymal lesions and reinforce how radiolucent–radiopaque patterns guide differential diagnosis before biopsy confirmation.',
    estimatedMinutes: 22,
    sections: [
      {
        heading: 'Mesenchymal overview',
        paragraphs: [
          'Odontogenic myxoma produces a gelatinous stroma that may infiltrate marrow spaces and challenge conservative surgical boundaries despite benign cytology.',
          'Cemento-ossifying fibroma can appear mixed density depending on mineralization phase, occasionally mimicking fibro-osseous lesions unrelated to tooth germs.',
          'Central odontoma presentations often behave as hamartomatous malformations yet remain valuable teaching examples when contrasting tumor versus hamartoma nomenclature.',
        ],
      },
      {
        heading: 'Imaging integration',
        paragraphs: [
          'Cross-sectional imaging refines buccolingual extension when panoramic films underestimate three-dimensional involvement.',
          'Correlation between cortical thinning, tooth displacement, and lesion attenuation supports realistic pretreatment staging conversations.',
          'Students should rehearse describing lesions systematically: location, borders, density, relationship to adjacent teeth, and soft tissue signals.',
        ],
      },
      {
        heading: 'Board preparation tie-ins',
        paragraphs: [
          'Blend radiology descriptors with histologic keywords so vignettes feel cohesive rather than memorized in isolation.',
          'Use case discussions to rehearse ethical emphasis on biopsy indications rather than purely radiographic diagnosis.',
        ],
      },
    ],
  },
  {
    id: 'syndromes-genetics',
    title: 'Syndromic jaw pathology — genetics and multidisciplinary care',
    summary:
      'Connect nevoid basal cell carcinoma syndrome and related pathways with aggressive jaw cysts, surveillance protocols, and referral coordination.',
    estimatedMinutes: 28,
    sections: [
      {
        heading: 'Syndrome recognition',
        paragraphs: [
          'Nevoid basal cell carcinoma syndrome elevates risk for multiple basal cell carcinomas, jaw keratocysts, and skeletal anomalies that surface across adolescence and adulthood.',
          'Clinical suspicion often begins with unexplained jaw swelling, odontogenic cyst recurrence, or characteristic skin findings rather than single isolated lesions.',
          'Family history intake remains vital because autosomal dominant inheritance patterns influence counseling intensity even when phenotypes vary among relatives.',
        ],
      },
      {
        heading: 'Team-based management',
        paragraphs: [
          'Dermatology, oral surgery, genetics, and psychology contributions form a longitudinal safety net when monitoring hundreds of potential sites over decades.',
          'Radiographic surveillance schedules should align with surgeon preferences yet remain understandable for patients balancing education and employment demands.',
          'Documentation clarity supports transitions between pediatric and adult services without losing mutation-specific risk stratification details.',
        ],
      },
      {
        heading: 'Education pearls',
        paragraphs: [
          'Translate molecular pathway vocabulary into plain-language explanations when obtaining informed consent for surveillance imaging.',
          'Role-play delivering recurrence news empathetically because keratocyst burden often exceeds patient expectations after initial surgery.',
        ],
      },
    ],
  },
  {
    id: 'histopathology-lab',
    title: 'Histopathology essentials — slides, stains, and biopsy correlation',
    summary:
      'Outline specimen handling expectations, epithelial lining cues on hematoxylin–eosin sections, and how clinicopathologic correlation strengthens diagnoses.',
    estimatedMinutes: 26,
    sections: [
      {
        heading: 'Specimen pathway',
        paragraphs: [
          'Orientation markers and concise clinical summaries empower pathologists to distinguish cyst wall fragments from solid tumor segments during gross examination.',
          'Fixation timing influences epithelial artifact patterns; delayed immersion may distort delicate lining layers critical for keratocyst versus dentigerous differentiation.',
          'Frozen-section workflows rarely dominate odontogenic outpatient biopsies yet remain relevant when malignancy enters the differential unexpectedly.',
        ],
      },
      {
        heading: 'Microscopic vocabulary',
        paragraphs: [
          'Palisaded hyperchromatic basal cells with reverse polarization anchor ameloblastoma histology discussions alongside follicular and plexiform architectural variants.',
          'Parakeratin sloughing within cyst lumina triggers differential emphasis on keratocystic lining versus orthokeratinized radicular cyst epithelium.',
          'Inflammatory infiltrates layered near cyst capsules contextualize secondary change versus primary developmental cyst narratives.',
        ],
      },
      {
        heading: 'Study drills',
        paragraphs: [
          'Annotate printed micrographs with arrows labeling epithelial crests, stromal zones, and luminal surfaces before comparing with textbook atlases.',
          'Draft two-sentence clinicopathologic summaries linking radiology impressions with definitive microscopic wording used in multidisciplinary tumor boards.',
        ],
      },
    ],
  },
  {
    id: 'clinical-vignettes',
    title: 'Clinical vignettes — structured differentials for jaw lesions',
    summary:
      'Practice a repeatable framework for history, exam, imaging, and escalation decisions when encountering expansile odontogenic lesions in board-style cases.',
    estimatedMinutes: 24,
    sections: [
      {
        heading: 'History anchors',
        paragraphs: [
          'Onset tempo matters when contrasting slow-growing ameloblastoma expansions versus rapidly symptomatic infections masquerading as cystic radiolucencies.',
          'Prior trauma, orthodontic extractions, or radiation exposure reshuffles differential priorities even before panoramic films load on monitors.',
          'Medication lists occasionally reveal bisphosphonate exposure altering bone healing conversations once biopsy proves inflammatory rather than neoplastic disease.',
        ],
      },
      {
        heading: 'Imaging-first branching',
        paragraphs: [
          'Unilocular versus multilocular descriptors steer learners toward developmental cysts versus aggressive epithelial tumors pending histopathology.',
          'Root resorption patterns versus displacement cues differentiate lesions exerting pressure without pulp necrosis from classic radicular inflammatory sequelae.',
          'Soft tissue windows on cone-beam scans expose subtle cortical perforations not appreciated on two-dimensional projections alone.',
        ],
      },
      {
        heading: 'Escalation checklist',
        paragraphs: [
          'Document informed consent discussions before biopsy while emphasizing multidisciplinary referral triggers such as airway encroachment or pathologic fracture risk.',
          'Summarize each vignette with patient-centered next steps so oral boards assess communication alongside factual recall.',
        ],
      },
    ],
  },
]

export function getSampleLecture(id: string): SampleLecture | undefined {
  return SAMPLE_LECTURES.find((l) => l.id === id)
}
