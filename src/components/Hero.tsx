import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>
          Free online therapy<br />
          <span className={styles.highlight}>that opens your mind</span>
        </h1>
        <p className={styles.subtitle}>
          Find licensed therapists who understand you.
          Your perfect match in minutes. 100% free.
        </p>
        <div className={styles.buttons}>
          <Link href="/therapists" className="btn-primary">Find a Therapist</Link>
          <Link href="/auth/register" className="btn-secondary">Get Started Free</Link>
        </div>
      </div>
      <div className={styles.decorative}>
        <div className={styles.circle}></div>
        <div className={styles.circle2}></div>
      </div>
    </section>
  )
}
