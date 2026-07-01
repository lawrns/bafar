// Server Component — rendered server-side; no "use client" required.
// Reads search params for ?error and ?next; renders a branded password gate.

export const dynamic = "force-dynamic";

export const metadata = {
  title: "BAFAR OS · Acceso",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const hasError = params?.error === "1";
  const next = params?.next || "/os";
  // Sanitise next to own-origin paths only.
  const safeNext = typeof next === "string" && next.startsWith("/") ? next : "/os";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Wordmark */}
        <div style={styles.brand}>
          <span style={styles.brandText}>BAFAR</span>
          <span style={styles.brandOS}>OS</span>
        </div>

        <p style={styles.subtitle}>
          Torre de Control Operativa
        </p>

        <div style={styles.divider} />

        <p style={styles.prompt}>
          Ingresa la contraseña de acceso para continuar.
        </p>

        <form method="POST" action="/api/os-auth" style={styles.form}>
          {/* Pass the post-login destination through */}
          <input type="hidden" name="next" value={safeNext} />

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              placeholder="••••••••"
              required
              style={{
                ...styles.input,
                ...(hasError ? styles.inputError : {}),
              }}
            />
          </div>

          {hasError && (
            <p style={styles.errorMsg} role="alert">
              Contraseña incorrecta. Inténtalo de nuevo.
            </p>
          )}

          <button type="submit" style={styles.button}>
            Acceder al sistema
          </button>
        </form>

        <p style={styles.footer}>
          Acceso restringido — Grupo BAFAR
        </p>
      </div>
    </div>
  );
}

// Inline styles keep the login page self-contained with zero extra CSS
// file dependencies, matching the app's light theme and font stack.
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
    fontFamily: "var(--font-ibm-plex-sans), system-ui, sans-serif",
    padding: "24px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  brand: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
    marginBottom: "6px",
  },
  brandText: {
    fontFamily: "var(--font-archivo), sans-serif",
    fontWeight: 900,
    fontSize: "22px",
    letterSpacing: "-0.5px",
    color: "#0f172a",
  },
  brandOS: {
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    fontWeight: 600,
    fontSize: "13px",
    color: "#e11d48",
    padding: "2px 6px",
    border: "1px solid rgba(225, 29, 72, 0.3)",
    borderRadius: "5px",
    background: "rgba(225, 29, 72, 0.06)",
  },
  subtitle: {
    fontSize: "12px",
    color: "#3f4e61",
    margin: "0 0 20px",
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    letterSpacing: "0.02em",
  },
  divider: {
    height: "1px",
    background: "#d1d5db",
    margin: "0 0 20px",
  },
  prompt: {
    fontSize: "13.5px",
    color: "#3f4e61",
    margin: "0 0 20px",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#f4f6f8",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  inputError: {
    borderColor: "#e11d48",
  },
  errorMsg: {
    fontSize: "12.5px",
    color: "#e11d48",
    margin: 0,
    padding: "8px 12px",
    background: "rgba(225, 29, 72, 0.06)",
    border: "1px solid rgba(225, 29, 72, 0.2)",
    borderRadius: "6px",
  },
  button: {
    padding: "11px 16px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#ffffff",
    background: "#e11d48",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "4px",
    letterSpacing: "0.01em",
  },
  footer: {
    marginTop: "24px",
    fontSize: "11.5px",
    color: "#9ca3af",
    textAlign: "center",
    fontFamily: "var(--font-ibm-plex-mono), monospace",
  },
};
