import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>
          Take care of your<br />
          <span className={styles.highlight}>mental health</span> with Clarity
        </h1>
        <p className={styles.subtitle}>
          Connect with licensed therapists who understand you. 
          Find your perfect match in minutes.
        </p>
        <div className={styles.buttons}>
          <button className="btn-primary">Find a therapist</button>
          <a href="/therapists" className="btn-secondary">See all therapists</a>
        </div>
      </div>
      <div className={styles.decorative}>
        <div className={styles.circle}></div>
        <div className={styles.circle2}></div>
      </div>
    </section>
  )
}
