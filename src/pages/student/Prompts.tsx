export function Prompts() {
  const blocks = [
    {
      title: 'Summarize & teach-back',
      body:
        'Summarize the lecture subsection on odontogenic cysts in five bullet points, then generate two exam-style questions with answers.',
    },
    {
      title: 'Compare & contrast',
      body:
        'Create a comparison table between radicular cyst, dentigerous cyst, and odontogenic keratocyst covering etiology, typical location, radiology hints, and recurrence risk.',
    },
    {
      title: 'Clinical vignette',
      body:
        'Write a short clinical vignette for a mandibular multilocular lesion in a 35-year-old, then list a differential diagnosis with justification for each entry.',
    },
    {
      title: 'Context engineering reminder',
      body:
        'Paste your notes first, then instruct the model to answer only using that context. Ask it to cite which paragraph supported each claim.',
    },
  ]

  return (
    <div className="page">
      <h2>Prompt engineering for study</h2>
      <p className="muted">
        Copy these into Google AI Studio or any chat model. They align with the assignment emphasis on
        prompt and context engineering.
      </p>
      <div className="stack">
        {blocks.map((b) => (
          <section key={b.title} className="card prose">
            <h3>{b.title}</h3>
            <pre className="prompt-box">{b.body}</pre>
          </section>
        ))}
      </div>
    </div>
  )
}
