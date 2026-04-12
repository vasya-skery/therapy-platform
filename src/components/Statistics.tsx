import styles from './Statistics.module.css'

const stats = [
  { number: '50,000+', label: 'Sessions provided' },
  { number: '98%', label: 'Clients report positive changes' },
  { number: '5 min', label: 'Average matching time' },
  { number: '500+', label: 'Licensed specialists' },
]

export default function Statistics() {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.stat}>
            <span className={styles.number}>{stat.number}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
