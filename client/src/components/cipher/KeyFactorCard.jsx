import { motion } from "framer-motion";

export default function KeyFactorCard({ explain, theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer p-3 bg-realm-bg/50 rounded-lg border border-realm-border hover:bg-realm-bg transition-colors list-none">
          <span className={`font-cinzel text-sm ${theme.textClass}`}>
            Key Factors & Analysis
          </span>
          <span className="text-realm-muted group-open:rotate-180 transition-transform">
            ▼
          </span>
        </summary>

        <div className="mt-3 p-4 bg-realm-bg/30 rounded-lg border border-realm-border max-h-72 overflow-y-auto">
          {explain.summary && explain.summary.length > 0 && (
            <ul className="list-disc list-inside text-sm text-realm-muted mb-4 space-y-1 font-mono">
              {explain.summary.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {explain.facts && (
            <div className="space-y-1">
              {explain.facts.m !== undefined && (
                <FactRow label="m" value={explain.facts.m} theme={theme} />
              )}
              {explain.facts.shift !== undefined && (
                <FactRow
                  label="Shift"
                  value={explain.facts.shift}
                  theme={theme}
                />
              )}
              {explain.facts.key && (
                <FactRow label="Key" value={explain.facts.key} theme={theme} />
              )}
              {explain.facts.keyStream && (
                <FactRow
                  label="Key Stream"
                  value={explain.facts.keyStream}
                  theme={theme}
                />
              )}
              {explain.facts.keyMatrix && (
                <>
                  <FactRow
                    label="Key Matrix"
                    value={explain.facts.keyMatrix}
                    theme={theme}
                  />
                  <FactRow
                    label="det"
                    value={explain.facts.det}
                    theme={theme}
                  />
                  <FactRow
                    label="det mod 26"
                    value={explain.facts.detMod26}
                    theme={theme}
                  />
                  <FactRow
                    label="gcd(det, 26)"
                    value={explain.facts.gcdDet26}
                    theme={theme}
                  />
                  <FactRow
                    label="Invertible"
                    value={explain.facts.gcdDet26 === 1 ? "Yes" : "No"}
                    warning={explain.facts.gcdDet26 !== 1}
                    theme={theme}
                  />
                  {explain.facts.detInvMod26 && (
                    <FactRow
                      label="det⁻¹ mod 26"
                      value={explain.facts.detInvMod26}
                      theme={theme}
                    />
                  )}
                  {explain.facts.inverseMatrix && (
                    <FactRow
                      label="Inverse Matrix"
                      value={explain.facts.inverseMatrix}
                      theme={theme}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {explain.rows && explain.rows.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-realm-border">
                    <th className={`text-left py-2 ${theme.textClass}`}>
                      Char
                    </th>
                    <th className={`text-left py-2 ${theme.textClass}`}>
                      Input
                    </th>
                    {explain.rows[0].keyChar !== undefined && (
                      <th className={`text-left py-2 ${theme.textClass}`}>
                        Key
                      </th>
                    )}
                    {explain.rows[0].block !== undefined && (
                      <th className={`text-left py-2 ${theme.textClass}`}>
                        Block
                      </th>
                    )}
                    <th className={`text-left py-2 ${theme.textClass}`}>
                      Output
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {explain.rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-realm-border/50">
                      <td className="py-1.5 text-realm-text">
                        {row.char || row.pair || "-"}
                      </td>
                      <td className="py-1.5 text-realm-muted">
                        {row.input ||
                          row.inputNum ||
                          row.inputNums?.join(",") ||
                          "-"}
                      </td>
                      {row.keyChar !== undefined && (
                        <td className="py-1.5 text-realm-muted">
                          {row.keyChar}
                        </td>
                      )}
                      {row.block !== undefined && (
                        <td className="py-1.5 text-realm-muted">
                          [{row.inputNums?.join(",")}]
                        </td>
                      )}
                      <td className="py-1.5 text-realm-text">
                        {row.output || row.outputChar || row.outputBlock || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {explain.rows.length > 10 && (
                <p className="text-xs text-realm-muted mt-2">
                  Showing 10 of {explain.rows.length} rows...
                </p>
              )}
            </div>
          )}

          {explain.notes && explain.notes.length > 0 && (
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-800/30 rounded-lg">
              <p className="text-amber-300 text-sm font-mono">
                {explain.notes.join(" ")}
              </p>
            </div>
          )}
        </div>
      </details>
    </motion.div>
  );
}

function FactRow({ label, value, warning = false, theme }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-realm-border/30">
      <span className="text-realm-muted font-mono">{label}</span>
      <span
        className={`font-mono ${warning ? "text-red-400" : "text-realm-text"}`}
      >
        {value}
      </span>
    </div>
  );
}
