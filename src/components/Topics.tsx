import styles from './Topics.module.css'

const topics = [
  'Depression',
  'Anxiety',
  'Self-esteem',
  'Fatigue',
  'Irritability',
  'Loneliness',
  'Self-determination',
  'OCD',
]

export default function Topics() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Topics we help with</h2>
        
        <div className={styles.topics}>
          {topics.map((topic, index) => (
            <span key={index} className={styles.topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
