import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1>
          Піклуйтесь про своє<br />
          <span className={styles.highlight}>ментальне здоров&apos;я</span> з Clarity
        </h1>
        <p className={styles.subtitle}>
          Знайдіть кваліфікованих терапевтів, які вас розуміють. 
          Ваш ідеальний матч за лічені хвилини.
        </p>
        <div className={styles.buttons}>
          <Link href="/therapists" className="btn-primary">Знайти терапевта</Link>
          <Link href="/auth/register" className="btn-secondary">Приєднатися безкоштовно</Link>
        </div>
      </div>
      <div className={styles.decorative}>
        <div className={styles.circle}></div>
        <div className={styles.circle2}></div>
      </div>
    </section>
  )
}
