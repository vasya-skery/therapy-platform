import styles from './HowItWorks.module.css'

const steps = [
  {
    title: 'Find the therapist',
    description: 'After a short questionnaire, you will receive a personalized selection of therapists for achieving your goals.',
    icon: '🔍',
  },
  {
    title: 'Start your therapy',
    description: 'Connect with your therapist in chat. Ask questions and book a convenient time slot from the calendar.',
    icon: '💬',
  },
  {
    title: 'Book sessions regularly',
    description: 'Easily book available sessions and have therapy at any convenient time that works for you.',
    icon: '📅',
  },
]

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How Clarity works</h2>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{step.icon}</span>
                <span className={styles.stepNumber}>{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
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
