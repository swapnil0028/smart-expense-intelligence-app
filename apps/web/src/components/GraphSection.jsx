export default function GraphSection() {
  return (
    <section className="graph-area" aria-label="Graphs">
      <div className="graph-tabs">
        <button type="button">Pie Chart</button>
        <button type="button">Line Chart</button>
      </div>

      <div className="graph-placeholder">Graph Placeholder</div>
    </section>
  )
}
