import { useMemo, useState } from 'react'

export default function AIPanel() {
  const [query, setQuery] = useState('')
  const [responses, setResponses] = useState([
    'You spent 35% on Food this month.',
    'Travel spending is 18% above last month.',
  ])

  const recentResponses = useMemo(
    () => responses.slice(0, 3),
    [responses],
  )

  const handleSend = (event) => {
    event.preventDefault()

    if (!query.trim()) {
      return
    }

    setResponses((current) => [
      `Mock suggestion: ${query.trim()}`,
      ...current,
    ])
    setQuery('')
  }

  return (
    <aside className="ai-panel">
      <div className="ai-panel-header">
        <h2>AI Panel</h2>
        <p>Get quick spending suggestions and trends.</p>
      </div>

      <form className="ai-panel-form" onSubmit={handleSend}>
        <label htmlFor="ai-query">Ask AI about your expenses</label>
        <div className="ai-panel-input-row">
          <input
            id="ai-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask AI..."
            type="text"
          />
          <button type="submit">Send</button>
        </div>
      </form>

      <div className="ai-panel-suggestions">
        <h3>Suggestions</h3>
        <ul>
          {recentResponses.map((response, index) => (
            <li key={`${response}-${index}`}>{response}</li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
