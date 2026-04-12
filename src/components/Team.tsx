import styles from './Team.module.css'

const features = [
  {
    title: 'Licensed providers',
    description: 'All our psychologists and psychotherapists have certificates and pass documents verification process.',
  },
  {
    title: 'Range expertise',
    description: 'Our therapists work with 30+ different specializations and treatment methods.',
  },
  {
    title: 'Your perfect match',
    description: 'Go through our questionnaire and get the best match from more than 500 therapists with our algorithm.',
  },
]

export default function Team() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our team of therapists</h2>
        
        <div className={styles.avatars}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className={styles.avatar}></div>
          ))}
        </div>

        <div className={styles.features}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <button className="btn-primary">Find a therapist</button>
        </div>
      </div>
    </section>
  )
}
