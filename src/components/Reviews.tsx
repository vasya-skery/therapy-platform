import styles from './Reviews.module.css'

const reviews = [
  {
    name: 'Sarah M.',
    text: 'I am satisfied. I like that the psychologist immediately starts with practical tasks and explains what he wants to achieve.',
    rating: 5,
  },
  {
    name: 'James K.',
    text: 'I am very pleased with the work with the specialist. I liked the individual approach, responsiveness, and empathy.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    text: 'I came with an abstract request and Jennifer writes everything down and tries to find out how to help me. The manner of communication is relaxing.',
    rating: 5,
  },
  {
    name: 'Michael T.',
    text: 'Kate is a wonderful specialist! Our sessions help me keep my head organized, and I always look forward to the next meeting!',
    rating: 5,
  },
]

export default function Reviews() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Our clients' reviews</h2>
        
        <div className={styles.reviews}>
          {reviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <div className={styles.stars}>
                {'★'.repeat(review.rating)}
              </div>
              <p className={styles.text}>"{review.text}"</p>
              <span className={styles.name}>{review.name}</span>
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
