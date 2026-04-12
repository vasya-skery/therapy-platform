import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.cta}>
          <h2>More than 500 therapists are ready to help you now</h2>
          <button className="btn-primary">Find a therapist</button>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h4>OpenYourMind</h4>
            <a href="/about">About</a>
            <a href="/approaches">Approaches</a>
            <a href="/for-therapists">For Therapists</a>
            <a href="/faq">FAQ</a>
          </div>
          <div className={styles.column}>
            <h4>Legal</h4>
            <a href="/terms">Terms of Use</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
          <div className={styles.column}>
            <h4>Contact</h4>
            <a href="mailto:hello@openyourmind.app">hello@openyourmind.app</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2024-2025 OpenYourMind</p>
        </div>
      </div>
    </footer>
  )
}
